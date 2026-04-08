import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import {
    APP_SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/session';

type AuthMode = 'password' | 'passwordless';

interface CreateAppSessionBody {
    idToken?: string;
    phone?: string;
    authMode?: AuthMode;
}

const getCookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
});

const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreateAppSessionBody;
        const idToken = body.idToken;

        if (!idToken) {
            return NextResponse.json({ error: 'Token de autenticação ausente.' }, { status: 400 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const rawPhone = body.phone ?? '';
        const phone = normalizePhone(rawPhone);
        const authMode: AuthMode = body.authMode === 'password' ? 'password' : 'passwordless';

        const userRef = adminDb.collection('users').doc(decodedToken.uid);
        const userSnap = await userRef.get();

        await userRef.set(
            {
                uid: decodedToken.uid,
                email: decodedToken.email ?? null,
                phone: phone || userSnap.data()?.phone || null,
                role: userSnap.data()?.role ?? 'customer',
                appAuthMode: authMode,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: userSnap.exists
                    ? (userSnap.data()?.createdAt ?? admin.firestore.FieldValue.serverTimestamp())
                    : admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        const expiresIn = SESSION_MAX_AGE_SECONDS * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const response = NextResponse.json({
            ok: true,
            user: {
                uid: decodedToken.uid,
                phone,
                authMode,
            },
        });

        response.cookies.set(
            APP_SESSION_COOKIE_NAME,
            sessionCookie,
            getCookieOptions(SESSION_MAX_AGE_SECONDS)
        );

        return response;
    } catch (error) {
        console.error('Erro ao criar sessão do app:', error);
        return NextResponse.json({ error: 'Falha ao autenticar usuário do app.' }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(APP_SESSION_COOKIE_NAME, '', getCookieOptions(0));
    return response;
}
