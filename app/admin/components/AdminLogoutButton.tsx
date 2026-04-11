'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            try {
                await fetch('/api/auth/admin/session', {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error('Falha ao encerrar sessão admin no servidor:', error);
            }

            if (auth) {
                try {
                    await signOut(auth);
                } catch (error) {
                    console.error('Falha ao encerrar sessão admin no cliente:', error);
                }
            }

            localStorage.removeItem('hasVisitedAdmin');
            router.replace('/admin-login');
            router.refresh();
        });
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isPending
                    ? 'cursor-not-allowed opacity-60 text-on-primary-container/40'
                    : 'text-on-primary-container/60 hover:bg-on-primary-container/8 hover:text-on-primary-container'
            }`}
        >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>{isPending ? 'Saindo...' : 'Sair da conta'}</span>
        </button>
    );
}
