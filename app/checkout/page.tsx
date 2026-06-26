'use client';

import LayoutHeader from '@/app/components/shared/LayoutHeader';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'sonner';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import {
  cartItemsAtom,
  cartSubtotalAtom,
  clearCartAtom,
} from '@/app/state/cartAtoms';
import { PhoneLogin, PhoneLoginResult } from '@/app/components/auth/PhoneLogin';

const DELIVERY_FEE = 7;

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix', icon: 'qr_code_2' },
  { id: 'cartao', label: 'Cartão', icon: 'credit_card' },
  { id: 'debito', label: 'Débito', icon: 'account_balance_wallet' },
  { id: 'dinheiro', label: 'Dinheiro', icon: 'payments' },
];

const formatBRL = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const formatPhone = (value: string) => {
  const v = value.replace(/\D/g, "");
  if (!v) return "";
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useAtomValue(cartItemsAtom);
  const subtotal = useAtomValue(cartSubtotalAtom);
  const clearCart = useSetAtom(clearCartAtom);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(auth?.currentUser ?? null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(auth));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!auth) {
      setIsCheckingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (user?.email?.includes('@acai.local')) {
        const extractedPhone = user.email.split('@')[0];
        setPhone(formatPhone(extractedPhone));
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const total = useMemo(() => {
    return Number((subtotal + DELIVERY_FEE).toFixed(2));
  }, [subtotal]);

  const handleConfirmOrder = async () => {
    // Only allow checkout logic after Mount
    if (!mounted) return;

    if (!authUser) {
      toast.error('Entre com seu número para finalizar o pedido.');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Seu carrinho está vazio. Adicione um item para continuar.');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !street.trim() || !neighborhood) {
      toast.error('Preencha nome, telefone, endereço e bairro para finalizar.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (!db) {
        throw new Error('Firestore instance not initialized');
      }

      await addDoc(collection(db, 'orders'), {
        userId: authUser.uid,
        status: 'pending',
        customer: {
          uid: authUser.uid,
          email: authUser.email,
          name: customerName.trim(),
          phone: phone.replace(/\D/g, ""),
        },
        deliveryAddress: {
          street: street.trim(),
          neighborhood,
        },
        paymentMethod,
        items: cartItems,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        createdAt: serverTimestamp(),
      });

      clearCart();
      toast.success('Pedido criado com sucesso!');
      router.push('/meus-pedidos');
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível criar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneLogin = ({ phone: loggedPhone }: PhoneLoginResult) => {
    setPhone((prev) => prev || formatPhone(loggedPhone));
  };

  const handleAppLogout = async () => {
    if (!auth) {
      return;
    }

    try {
      await fetch('/api/auth/app/session', { method: 'DELETE' });
    } catch (error) {
      console.error('Erro ao limpar sessão do app no servidor:', error);
    }

    await signOut(auth);
  };

  if (!mounted) return null;

  return (
    <>
      <LayoutHeader />
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-12 pb-32">
        {/* Header Text */}
        <section className="space-y-2">
          <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-tertiary-container">Quase lá!</h2>
          <p className="text-on-surface-variant font-medium">Preencha os detalhes para receber sua energia da Amazônia.</p>
        </section>

        {isCheckingAuth ? (
          <section className="rounded-3xl border border-outline-variant/20 bg-surface p-6 text-center">
            <p className="font-semibold text-on-surface-variant">Verificando sua sessão...</p>
          </section>
        ) : authUser ? (
          <section className="rounded-3xl border border-outline-variant/20 bg-surface p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-inverse-primary">Conta do app conectada</p>
              <p className="text-on-surface-variant text-sm">Você já pode finalizar seu pedido.</p>
            </div>
            <button
              type="button"
              onClick={handleAppLogout}
              className="rounded-full border border-outline-variant/30 px-5 py-2 text-sm font-bold text-on-surface hover:bg-surface-container"
            >
              Trocar número
            </button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-headline text-2xl font-bold tracking-tight">Entrar para finalizar</h3>
              <p className="text-on-surface-variant text-sm">
                Digite apenas seu número. No primeiro pedido você escolhe criar senha ou continuar sem senha.
              </p>
            </div>
            <PhoneLogin onLogin={handlePhoneLogin} />
          </section>
        )}

        {/* Seus Dados Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-inverse-primary">person</span>
            <h3 className="font-headline text-xl font-bold tracking-tight">Seus Dados</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Como te chamam?</label>
              <input
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50 outline-none text-on-surface"
                placeholder="Nome Completo"
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </div>
            {authUser && phone && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Telefone para contato</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-inverse-primary">phone</span>
                  <input
                    className="w-full bg-surface-container-high/50 border-none rounded-xl pl-12 pr-4 py-4 text-on-surface-variant cursor-not-allowed outline-none"
                    type="tel"
                    value={phone}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Endereço Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-inverse-primary">location_on</span>
            <h3 className="font-headline text-xl font-bold tracking-tight">Endereço de Entrega</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Onde entregamos?</label>
              <input
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="Endereço e Número"
                type="text"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Bairro</label>
              <div className="relative">
                <select
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all appearance-none text-on-surface-variant"
                >
                  <option disabled value="">Selecione seu bairro</option>
                  <option value="centro">Centro</option>
                  <option value="jardins">Jardins</option>
                  <option value="vila_mariana">Vila Mariana</option>
                  <option value="pinheiros">Pinheiros</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pagamento Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-inverse-primary">payments</span>
            <h3 className="font-headline text-xl font-bold tracking-tight">Pagamento</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest shadow-sm border-2 transition-all group ${isSelected ? 'border-inverse-primary' : 'border-transparent hover:border-inverse-primary'}`}
                >
                  <span className={`material-symbols-outlined text-2xl mb-2 ${isSelected ? 'text-inverse-primary' : 'text-on-surface-variant group-hover:text-inverse-primary'}`}>{method.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{method.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-tertiary-container text-white p-8 rounded-[32px] space-y-6 relative overflow-hidden">
          {/* Decorative Splash */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFB800] opacity-10 rounded-full blur-3xl"></div>
          <h3 className="text-xl font-bold font-headline">Resumo do Pedido</h3>
          <div className="space-y-4 font-body">
            <div className="flex justify-between items-center opacity-80">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Taxa de Entrega</span>
              <span>{formatBRL(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Itens no carrinho</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-inverse-primary">{formatBRL(total)}</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="pt-4">
          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting || cartItems.length === 0 || !authUser}
            className={`w-full bg-inverse-primary text-on-primary-fixed py-6 rounded-full font-headline font-extrabold text-xl shadow-[0_12px_48px_rgba(255,184,0,0.3)] transition-all flex items-center justify-center gap-3 group ${(isSubmitting || cartItems.length === 0 || !authUser) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
          >
            {isSubmitting ? 'Enviando pedido...' : authUser ? 'Confirmar Pedido' : 'Entre para confirmar o pedido'}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </main>
    </>
  );
}
