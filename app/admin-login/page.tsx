'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

interface SessionResponse {
    error?: string;
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!auth) {
            setError('Firebase não está configurado no ambiente atual.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const idToken = await credential.user.getIdToken(true);

            const response = await fetch('/api/auth/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                const result = (await response.json()) as SessionResponse;
                throw new Error(result.error ?? 'Não foi possível abrir sessão de admin.');
            }

            localStorage.setItem('hasVisitedAdmin', 'true');
            router.replace('/admin');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Falha no login de admin.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background px-6 py-20 text-on-surface">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-surface p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <h1 className="font-headline text-3xl font-black text-tertiary">Acesso Admin</h1>
                <p className="mt-2 text-sm text-on-surface-variant">
                    Entre com e-mail e senha para acessar o painel.
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant" htmlFor="admin-email">
                            E-mail
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@acai.com"
                            className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 outline-none focus:border-inverse-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant" htmlFor="admin-password">
                            Senha
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Sua senha"
                            className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 outline-none focus:border-inverse-primary"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-error-container px-3 py-2 text-sm font-medium text-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-full bg-inverse-primary px-6 py-4 font-headline text-lg font-black text-on-primary-fixed transition ${loading ? 'cursor-not-allowed opacity-60' : 'hover:scale-[1.01]'}`}
                    >
                        {loading ? 'Entrando...' : 'Entrar no Admin'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm font-semibold text-tertiary hover:underline">
                        Voltar para o app
                    </Link>
                </div>
            </div>
        </main>
    );
}
