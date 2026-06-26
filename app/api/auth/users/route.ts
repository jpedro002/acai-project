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

// GET — List all clients (non-admin users)
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const userId = searchParams.get('userId');

    // Single user detail with orders
    if (userId) {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      const ordersSnapshot = await adminDb
        .collection('orders')
        .where('customer.uid', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        user: { id: userDoc.id, ...userDoc.data() },
        orders,
      });
    }

    // List all non-admin users
    const snapshot = await adminDb.collection('users').get();

    let users = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((u: Record<string, unknown>) => u.role !== 'admin');

    // Simple search filter
    if (search) {
      users = users.filter((u: Record<string, unknown>) => {
        const name = (u.name as string || '').toLowerCase();
        const phone = (u.phone as string || '').toLowerCase();
        const email = (u.email as string || '').toLowerCase();
        return name.includes(search) || phone.includes(search) || email.includes(search);
      });
    }

    return NextResponse.json({ users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
