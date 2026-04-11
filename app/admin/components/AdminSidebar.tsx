'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  Users,
  ShieldCheck,
  Package,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

const NAV_ITEMS = [
  {
    label: 'Pedidos',
    href: '/admin',
    icon: ClipboardList,
    exact: true,
  },
  {
    label: 'Clientes',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Administradores',
    href: '/admin/admins',
    icon: ShieldCheck,
  },
  {
    label: 'Catálogo',
    href: '/admin/catalog',
    icon: Package,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[272px] bg-primary-container flex flex-col shrink-0 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Logo / Brand */}
      <div className="relative z-10 px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-on-primary-container/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-on-primary-container" />
          </div>
          <div>
            <h2 className="text-base font-bold font-headline text-on-primary-container leading-tight">
              Point dos Amigos
            </h2>
            <p className="text-[11px] text-on-primary-container/60 font-medium">
              Painel Administrativo
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-3 flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-primary-container/40 px-3 mb-2">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 relative
                ${
                  active
                    ? 'bg-on-primary-container text-primary-container shadow-lg shadow-on-primary-container/20'
                    : 'text-on-primary-container/70 hover:bg-on-primary-container/8 hover:text-on-primary-container'
                }
              `}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 ${
                  active ? '' : 'group-hover:scale-110'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="w-4 h-4 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="relative z-10 p-3 mt-auto">
        <div className="border-t border-on-primary-container/10 pt-3">
          <AdminLogoutButton />
        </div>
      </div>
    </aside>
  );
}
