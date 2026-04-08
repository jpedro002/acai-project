import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import {
    ADMIN_SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/session';

interface CreateSessionBody {
    idToken?: string;
}

const getAllowedAdminEmails = () => {
    const rawValue = process.env.ADMIN_ALLOWED_EMAILS ?? 'admin@acai.com';
    return rawValue
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
};

const getCookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
});

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreateSessionBody;
        const idToken = body.idToken;

        if (!idToken) {
            return NextResponse.json({ error: 'Token de autenticação ausente.' }, { status: 400 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        const userRole = userDoc.data()?.role;
        const normalizedEmail = decodedToken.email?.toLowerCase() ?? '';
        const isAllowedEmail = normalizedEmail
            ? getAllowedAdminEmails().includes(normalizedEmail)
            : false;
        const isAdmin = decodedToken.admin === true || userRole === 'admin' || isAllowedEmail;

        if (!isAdmin) {
            return NextResponse.json({ error: 'Acesso negado para usuário sem perfil admin.' }, { status: 403 });
        }

        if (isAllowedEmail && userRole !== 'admin') {
            await adminDb.collection('users').doc(decodedToken.uid).set(
                {
                    uid: decodedToken.uid,
                    email: decodedToken.email ?? null,
                    role: 'admin',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdAt: userDoc.exists
                        ? (userDoc.data()?.createdAt ?? admin.firestore.FieldValue.serverTimestamp())
                        : admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );
        }

        const expiresIn = SESSION_MAX_AGE_SECONDS * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const response = NextResponse.json({ ok: true });
        response.cookies.set(
            ADMIN_SESSION_COOKIE_NAME,
            sessionCookie,
            getCookieOptions(SESSION_MAX_AGE_SECONDS)
        );

        return response;
    } catch (error) {
        console.error('Erro ao criar sessão admin:', error);
        return NextResponse.json({ error: 'Falha ao autenticar admin.' }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', getCookieOptions(0));
    return response;
}
