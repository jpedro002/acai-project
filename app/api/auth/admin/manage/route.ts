import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE_NAME } from '@/lib/auth/session';

// Helper to verify the caller is an admin
async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Unauthorized');

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
  const role = userDoc.data()?.role;
  if (role !== 'admin' && decoded.admin !== true) {
    throw new Error('Unauthorized');
  }
  return decoded;
}

// GET — List all admins
export async function GET() {
  try {
    await verifyAdmin();

    const snapshot = await adminDb
      .collection('users')
      .where('role', '==', 'admin')
      .get();

    const admins = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ admins });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — Create a new admin
export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Set role in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    // Set custom claim
    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

    return NextResponse.json({
      admin: {
        id: userRecord.uid,
        name,
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — Update an admin
export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const { id, name, email } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    const authUpdates: Record<string, string> = {};

    if (name) {
      updates.name = name;
      authUpdates.displayName = name;
    }
    if (email) {
      updates.email = email;
      authUpdates.email = email;
    }

    if (Object.keys(authUpdates).length > 0) {
      await adminAuth.updateUser(id, authUpdates);
    }
    if (Object.keys(updates).length > 0) {
      await adminDb.collection('users').doc(id).update(updates);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — Remove an admin
export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    // Delete from Firebase Auth
    await adminAuth.deleteUser(id);

    // Delete from Firestore
    await adminDb.collection('users').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
