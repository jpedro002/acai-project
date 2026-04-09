import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { ADMIN_SESSION_COOKIE_NAME } from '@/lib/auth/session';
import AdminLogoutButton from './components/AdminLogoutButton';
import { Toaster } from "@/components/ui/sonner";

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
    <div className="flex h-screen bg-surface-container-low font-body text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface shadow-md flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold font-headline text-primary">Point dos amigos Admin</h2>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2">
          <Link href="/admin" className="p-3 hover:bg-surface-variant text-on-surface rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/users" className="p-3 hover:bg-surface-variant text-on-surface rounded-lg transition-colors">
            Usuários
          </Link>
          <Link href="/admin/admins" className="p-3 hover:bg-surface-variant text-on-surface rounded-lg transition-colors">
            Administradores
          </Link>
          <button type="button" className="p-3 text-left hover:bg-surface-variant rounded-lg transition-colors" disabled>
            Pedidos
          </button>
          <Link href="/admin/catalog" className="p-3 hover:bg-surface-variant text-on-surface rounded-lg transition-colors">
            Produtos
          </Link>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
