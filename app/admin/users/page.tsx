'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Loader2,
  Phone,
  Mail,
  ShoppingBag,
  X,
  Clock,
  CreditCard,
  Truck,
  MapPin,
  CalendarDays,
  TrendingUp,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UserData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface OrderData {
  id: string;
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  payment?: { method: string; status: string; subtotal: number; total: number };
  items?: { name: string; quantity: number; price: number; flavorSummary?: string }[];
  delivery?: { method: string; fee: number; address?: { street: string; number: string; neighborhood: string } };
  [key: string]: unknown;
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Pendente', classes: 'bg-amber-100 text-amber-700' },
  preparing: { label: 'Em Preparo', classes: 'bg-blue-100 text-blue-700' },
  out_for_delivery: { label: 'Em Entrega', classes: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Finalizado', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-700' },
};

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  dinheiro: 'Dinheiro',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Detail panel
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await fetch(`/api/auth/users?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao buscar clientes');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error('Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/auth/users?userId=${userId}`);
      if (!res.ok) throw new Error('Erro ao buscar pedidos');
      const data = await res.json();
      setUserOrders(data.orders || []);
    } catch {
      toast.error('Não foi possível carregar os pedidos');
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    fetchUserOrders(user.id);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return '—';
    try {
      const d = new Date(seconds * 1000);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      }) + ' ' + d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const formatPrice = (price?: number) => {
    if (price == null) return 'R$ 0,00';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalRevenue = userOrders.reduce(
    (acc, o) => acc + (o.payment?.total || 0),
    0
  );

  return (
    <div className="flex h-full gap-6">
      {/* Main Panel */}
      <div
        className={`flex flex-col gap-6 transition-all duration-300 ${
          selectedUser ? 'w-3/5' : 'w-full'
        }`}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-surface p-6 rounded-2xl shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-bold text-on-surface">
                Clientes
              </h1>
              <p className="text-sm text-on-surface-variant">
                Acompanhe a base de clientes e histórico de pedidos
              </p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
          <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-headline font-black text-on-surface">
                {loading ? '—' : users.length}
              </p>
              <p className="text-xs text-on-surface-variant font-medium">Total de clientes</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-headline font-black text-on-surface">
                {loading
                  ? '—'
                  : users.filter((u) => {
                      if (!u.createdAt) return false;
                      const d = new Date(u.createdAt);
                      const now = new Date();
                      return (
                        d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear()
                      );
                    }).length}
              </p>
              <p className="text-xs text-on-surface-variant font-medium">Novos este mês</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface truncate">
                {loading || users.length === 0
                  ? '—'
                  : users.sort(
                      (a, b) =>
                        new Date(b.createdAt || '').getTime() -
                        new Date(a.createdAt || '').getTime()
                    )[0]?.name || '—'}
              </p>
              <p className="text-xs text-on-surface-variant font-medium">Último cadastro</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Buscar por nome, telefone, email..."
          />
        </div>

        {/* Table */}
        <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-3 text-on-surface-variant font-medium">Carregando...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-outline-variant/10 hover:bg-transparent">
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider pl-6">
                    Cliente
                  </TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                    Contato
                  </TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                    Cadastro
                  </TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider text-right pr-6">
                    Ação
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-16 text-on-surface-variant"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-10 h-10 text-outline" />
                        <p className="text-base font-medium">
                          {search
                            ? 'Nenhum resultado encontrado'
                            : 'Nenhum cliente cadastrado'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`border-outline-variant/10 cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? 'bg-primary/5'
                          : 'hover:bg-surface-container-low/60'
                      }`}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0">
                            {(user.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-on-surface text-sm">
                            {user.name || 'Cliente'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {user.phone && (
                            <span className="text-sm text-on-surface-variant flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-outline" />
                              {user.phone}
                            </span>
                          )}
                          {user.email && (
                            <span className="text-xs text-outline flex items-center gap-1.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-on-surface-variant">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10 rounded-xl gap-1 text-xs font-bold"
                        >
                          Ver Pedidos
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedUser && (
        <div className="w-2/5 bg-surface rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300 shrink-0">
          {/* Panel Header */}
          <div className="px-6 py-5 bg-surface border-b border-outline-variant/10 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl">
                {(selectedUser.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  {selectedUser.name || 'Cliente'}
                </h2>
                <div className="flex items-center gap-3 mt-0.5">
                  {selectedUser.phone && (
                    <a
                      href={`https://wa.me/${selectedUser.phone?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-emerald-500 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      {selectedUser.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats mini */}
          <div className="px-6 py-4 flex gap-4 border-b border-outline-variant/10 shrink-0">
            <div className="flex-1 bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-lg font-black font-headline text-on-surface">
                {loadingOrders ? '—' : userOrders.length}
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Pedidos
              </p>
            </div>
            <div className="flex-1 bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-lg font-black font-headline text-primary">
                {loadingOrders ? '—' : formatPrice(totalRevenue)}
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Total Gasto
              </p>
            </div>
          </div>

          {/* Orders list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Histórico de Pedidos
            </h3>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <ShoppingBag className="w-8 h-8 text-outline mx-auto mb-2" />
                <p className="text-sm font-medium">
                  Nenhum pedido encontrado
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => {
                  const statusInfo =
                    STATUS_MAP[order.status || 'pending'] || STATUS_MAP.pending;
                  return (
                    <div
                      key={order.id}
                      className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Order header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">
                            #{order.id.slice(-4).toUpperCase()}
                          </span>
                          <span className="text-xs text-on-surface-variant flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(order.createdAt?.seconds)}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusInfo.classes}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {order.items.map((item, idx) => (
                            <p
                              key={idx}
                              className="text-xs text-on-surface-variant leading-relaxed"
                            >
                              <span className="font-medium text-on-surface">
                                {item.quantity}x {item.name}
                              </span>
                              {item.flavorSummary
                                ? ` • ${item.flavorSummary}`
                                : ''}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-outline" />
                            {PAYMENT_LABELS[order.payment?.method || ''] ||
                              order.payment?.method ||
                              '—'}
                          </span>
                          <span className="flex items-center gap-1">
                            {order.delivery?.method === 'delivery' ? (
                              <Truck className="w-3 h-3 text-outline" />
                            ) : (
                              <MapPin className="w-3 h-3 text-outline" />
                            )}
                            {order.delivery?.method === 'delivery'
                              ? 'Delivery'
                              : 'Retirada'}
                          </span>
                        </div>
                        <span className="text-sm font-black text-primary">
                          {formatPrice(order.payment?.total)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}