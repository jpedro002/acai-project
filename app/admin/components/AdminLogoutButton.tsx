'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

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
            className={`w-full rounded-lg p-3 text-center font-bold text-error transition-colors ${
                isPending ? 'cursor-not-allowed opacity-60' : 'hover:bg-error-container'
            }`}
        >
            {isPending ? 'Saindo...' : 'Sair'}
        </button>
    );
}
