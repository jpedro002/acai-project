'use client';

import { useState } from 'react';

// Interfaces mockadas (em uma aplicação real, vindo do Firestore)
interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([
        { id: '1', name: 'João Silva', email: 'admin@acai.com', role: 'Super Admin', createdAt: '2026-04-01' },
        { id: '2', name: 'Maria Souza', email: 'maria@acai.com', role: 'Admin', createdAt: '2026-04-05' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-surface p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary">Administradores</h1>
                    <p className="text-on-surface-variant mt-1">Gerencie os acessos de administrador do sistema.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow hover:scale-105 transition-all"
                >
                    + Novo Administrador
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-wider border-b border-outline-variant">
                            <th className="p-4 font-semibold">Nome</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Função</th>
                            <th className="p-4 font-semibold">Criado em</th>
                            <th className="p-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-surface-container-lowest transition-colors">
                                <td className="p-4 font-medium text-on-surface">{admin.name}</td>
                                <td className="p-4 text-on-surface-variant">{admin.email}</td>
                                <td className="p-4">
                                    <span className="bg-tertiary-container text-on-tertiary-container text-xs px-3 py-1 rounded-full font-semibold">
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="p-4 text-on-surface-variant">{new Date(admin.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 flex gap-2 justify-end">
                                    <button className="text-primary hover:bg-primary-container p-2 rounded-lg transition-colors text-sm font-medium">Editar</button>
                                    <button className="text-error hover:bg-error-container p-2 rounded-lg transition-colors text-sm font-medium">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admins.length === 0 && (
                    <div className="p-8 text-center text-on-surface-variant">
                        Nenhum administrador encontrado.
                    </div>
                )}
            </div>

            {/* Modal simples de criação */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface p-8 w-full max-w-md rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-bold font-headline text-primary mb-6">Novo Admin</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">Nome</label>
                                <input type="text" className="w-full border border-outline rounded-lg p-3 bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Nome Completo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                                <input type="email" className="w-full border border-outline rounded-lg p-3 bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="admin@exemplo.com" />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-full font-bold text-on-surface hover:bg-surface-variant transition-colors">Cancelar</button>
                                <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold hover:scale-105 transition-all shadow">Criar Acesso</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}