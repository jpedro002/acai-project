'use client';

import { useState } from 'react';

// Interfaces mockadas para visualização
interface Order {
    id: string;
    status: 'Pendente' | 'Preparando' | 'Entregue' | 'Cancelado';
    total: number;
    date: string;
    itemsInfo: string;
}

interface User {
    id: string;
    name: string;
    phone: string;
    ordersCount: number;
    orders: Order[];
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([
        {
            id: '101',
            name: 'Carlos Almeida',
            phone: '(11) 98765-4321',
            ordersCount: 3,
            orders: [
                { id: 'PED-001', status: 'Entregue', total: 45.90, date: '2026-04-05', itemsInfo: '1x Açaí 500ml, 1x Água' },
                { id: 'PED-008', status: 'Pendente', total: 32.50, date: '2026-04-09', itemsInfo: '1x Gelato Pistache' }
            ]
        },
        {
            id: '102',
            name: 'Ana Beatriz',
            phone: '(21) 99999-1111',
            ordersCount: 1,
            orders: [
                { id: 'PED-005', status: 'Preparando', total: 28.00, date: '2026-04-09', itemsInfo: '1x Açaí 300ml (Morango, Leite Condensado)' }
            ]
        }
    ]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Entregue': return 'bg-green-100 text-green-800';
            case 'Preparando': return 'bg-yellow-100 text-yellow-800';
            case 'Pendente': return 'bg-blue-100 text-blue-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-full gap-6 max-h-[calc(100vh-4rem)]">
            {/* Lista de Usuários */}
            <div className={`flex flex-col gap-6 transition-all duration-300 ${selectedUser ? 'w-1/2' : 'w-full'}`}>
                <div className="bg-surface p-6 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-headline font-bold text-primary">Clientes</h1>
                    <p className="text-on-surface-variant mt-1">Acompanhe a base de clientes e o histórico de pedidos.</p>
                </div>

                <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead className="sticky top-0 bg-surface z-10">
                            <tr className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-wider border-b border-outline-variant">
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Telefone</th>
                                <th className="p-4 font-semibold">Total de Pedidos</th>
                                <th className="p-4 font-semibold text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className={`hover:bg-surface-container-lowest transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary-container/20' : ''}`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <td className="p-4 font-medium text-on-surface">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-on-surface-variant">{user.phone}</td>
                                    <td className="p-4 text-on-surface-variant font-bold">{user.ordersCount}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:bg-primary-container px-3 py-2 rounded-full transition-colors text-sm font-semibold">
                                            Ver Pedidos
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Painel Lateral: Histórico de Pedidos do Usuário Selecionado */}
            {selectedUser && (
                <div className="w-1/2 bg-surface rounded-2xl shadow-xl flex flex-col border border-outline-variant overflow-hidden animate-in slide-in-from-right-8 duration-300">
                    <div className="p-6 bg-surface-container-low border-b border-outline-variant flex justify-between items-center sticky top-0">
                        <div>
                            <h2 className="text-xl font-bold font-headline text-on-surface">Pedidos de {selectedUser.name}</h2>
                            <p className="text-sm text-on-surface-variant">{selectedUser.phone}</p>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {selectedUser.orders.length === 0 ? (
                            <p className="text-center text-on-surface-variant py-8">Nenhum pedido encontrado para este cliente.</p>
                        ) : (
                            selectedUser.orders.map(order => (
                                <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-sm font-bold text-on-surface-variant">{order.id}</span>
                                            <span className="text-xs text-on-surface-variant ml-2">
                                                {new Date(order.date).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-on-surface mb-4 border-l-2 border-primary pl-3 bg-surface-container-low/50 py-2">
                                        {order.itemsInfo}
                                    </p>

                                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant/50">
                                        <span className="text-sm text-on-surface-variant">Valor Total</span>
                                        <span className="font-bold text-primary font-headline">
                                            R$ {order.total.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}