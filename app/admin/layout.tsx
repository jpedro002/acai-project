'use client';

import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    localStorage.setItem('hasVisitedAdmin', 'true');
  }, []);

  return (
    <div className="flex h-screen bg-surface-container-low font-body text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface shadow-md flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold font-headline text-primary">Point dos amigos Admin</h2>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2">
          <a href="/admin" className="p-3 bg-primary-container text-on-primary-container rounded-lg font-bold">
            Dashboard
          </a>
          <a href="#" className="p-3 hover:bg-surface-variant rounded-lg transition-colors">
            Pedidos
          </a>
          <a href="#" className="p-3 hover:bg-surface-variant rounded-lg transition-colors">
            Produtos
          </a>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <a href="/" className="p-3 w-full text-center block text-error font-bold hover:bg-error-container rounded-lg">
            Sair
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
