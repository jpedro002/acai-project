'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { CartItemType } from '@/app/state/cartAtoms';
import LayoutHeader from '@/app/components/shared/LayoutHeader';
import { PhoneLogin } from '@/app/components/auth/PhoneLogin';

interface CustomerOrder {
  id: string;
  status: string;
  paymentMethod?: string;
  items: CartItemType[];
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | null;
}

// Ordered flow used to render the progress stepper. `cancelled` is handled apart.
const FLOW = ['pending', 'preparing', 'out_for_delivery', 'delivered'] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pedido recebido',
  preparing: 'Em preparo',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (createdAt: CustomerOrder['createdAt']) => {
  if (!createdAt || typeof createdAt !== 'object' || !('seconds' in createdAt)) return '';
  try {
    return format(new Date(createdAt.seconds * 1000), "dd 'de' MMM 'às' HH:mm", { locale: ptBR });
  } catch {
    return '';
  }
};

export default function MeusPedidosPage() {
  const [authUser, setAuthUser] = useState<User | null>(auth?.currentUser ?? null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(auth));
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!auth) {
      setCheckingAuth(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !authUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders([]);
      return;
    }
    setLoadingOrders(true);
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', authUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as CustomerOrder[];
        setOrders(data);
        setLoadingOrders(false);
      },
      (error) => {
        console.error('Erro ao carregar pedidos:', error);
        setLoadingOrders(false);
      }
    );
    return () => unsubscribe();
  }, [authUser]);

  if (!mounted) return null;

  return (
    <>
      <LayoutHeader />
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32 space-y-8">
        <section className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-tertiary-container">
            Meus Pedidos
          </h1>
          <p className="text-on-surface-variant font-medium">
            Acompanhe o status dos seus pedidos em tempo real.
          </p>
        </section>

        {checkingAuth ? (
          <p className="font-semibold text-on-surface-variant">Verificando sua sessão...</p>
        ) : !authUser ? (
          <section className="space-y-4">
            <p className="text-on-surface-variant text-sm">
              Entre com seu número para ver seus pedidos.
            </p>
            <PhoneLogin />
          </section>
        ) : loadingOrders ? (
          <p className="font-semibold text-on-surface-variant animate-pulse">Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <section className="rounded-3xl border border-outline-variant/20 bg-surface p-8 text-center space-y-4">
            <p className="font-headline text-xl font-bold">Nenhum pedido ainda</p>
            <p className="text-on-surface-variant text-sm">Que tal montar seu primeiro açaí?</p>
            <Link
              href="/builder"
              className="inline-block bg-inverse-primary text-on-primary-fixed px-6 py-3 rounded-full font-bold"
            >
              Montar Açaí
            </Link>
          </section>
        ) : (
          <section className="space-y-5">
            {orders.map((order) => {
              const isCancelled = order.status === 'cancelled';
              const currentIndex = FLOW.indexOf(order.status as (typeof FLOW)[number]);
              return (
                <article
                  key={order.id}
                  className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-on-surface-variant">{formatDate(order.createdAt)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        STATUS_CLASSES[order.status] ?? 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>

                  {/* Progress stepper */}
                  {!isCancelled && (
                    <div className="flex items-center gap-1.5">
                      {FLOW.map((step, idx) => (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            idx <= currentIndex ? 'bg-tertiary-container' : 'bg-surface-variant'
                          }`}
                          title={STATUS_LABELS[step]}
                        />
                      ))}
                    </div>
                  )}

                  {/* Items */}
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={item.id ?? idx} className="text-sm text-on-surface-variant">
                        <span className="font-medium text-on-surface">
                          {item.quantity ?? 1}x {item.name}
                        </span>
                        {item.flavor ? ` • ${item.flavor}` : ''}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant capitalize">
                      {order.paymentMethod ?? '—'}
                    </span>
                    <span className="text-lg font-black text-primary">{formatBRL(order.total)}</span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
