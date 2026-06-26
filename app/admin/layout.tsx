import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { ADMIN_SESSION_COOKIE_NAME } from '@/lib/auth/session';
import AdminSidebar from './components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin — Point dos Amigos',
  other: {
    // This signals the CSS to apply admin-specific styles
  },
};

const getAllowedAdminEmails = () => {
  const rawValue = process.env.ADMIN_ALLOWED_EMAILS ?? 'admin@acai.com';
  return rawValue
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect('/admin-login');
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    const role = userDoc.data()?.role;
    const normalizedEmail = decoded.email?.toLowerCase() ?? '';
    const isAllowedEmail = normalizedEmail
      ? getAllowedAdminEmails().includes(normalizedEmail)
      : false;
    const isAdmin = decoded.admin === true || role === 'admin' || isAllowedEmail;

    if (!isAdmin) {
      redirect('/admin-login');
    }
  } catch (error) {
    console.error('Falha ao validar sessão admin:', error);
    redirect('/admin-login');
  }

  return (
    <div
      className="admin-layout flex h-dvh bg-surface-container-low font-body text-on-surface overflow-hidden"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
    >
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="flex flex-col min-h-full p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
