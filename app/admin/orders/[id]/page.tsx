"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Clock, Star, MapPin,
    ShieldCheck, Phone, CreditCard,
    CheckCircle, XCircle
} from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CartItemType } from "@/app/state/cartAtoms";

interface OrderType {
    id: string;
    userId: string;
    status: string;
    customer: {
        uid: string;
        email: string;
        name: string;
        phone: string;
    };
    deliveryAddress: {
        street: string;
        neighborhood: string;
    };
    paymentMethod: string;
    items: CartItemType[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    createdAt: any;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const orderId = unwrappedParams.id;

    const [order, setOrder] = useState<OrderType | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!db) throw new Error("Firestore not initialized");
                const docRef = doc(db, "orders", orderId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() } as OrderType);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const updateOrderStatus = async (newStatus: string) => {
        if (!db || !order) return;
        setUpdating(true);
        try {
            const docRef = doc(db, "orders", order.id);
            await updateDoc(docRef, { status: newStatus });
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Erro ao atualizar o pedido.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <main className="lg:ml-64 pt-24 px-8 pb-12 min-h-screen bg-surface flex items-center justify-center">
                <div className="text-primary font-bold animate-pulse text-xl">Carregando pedido...</div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="lg:ml-64 pt-24 px-8 pb-12 min-h-screen bg-surface flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Pedido não encontrado.</h1>
                <Link href="/admin" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Voltar para Pedidos
                </Link>
            </main>
        );
    }

    const statusMap: Record<string, { label: string, color: string }> = {
        pending: { label: "Aguardando Confirmação", color: "bg-amber-100 text-amber-800" },
        preparing: { label: "Em Preparo", color: "bg-blue-100 text-blue-800" },
        out_for_delivery: { label: "Saiu para Entrega", color: "bg-purple-100 text-purple-800" },
        delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-800" },
        canceled: { label: "Cancelado", color: "bg-red-100 text-red-800" }
    };

    const currentStatus = statusMap[order.status] || { label: order.status, color: "bg-surface-variant text-on-surface-variant" };

    return (
        <main className="lg:ml-64 pt-24 px-8 pb-12 min-h-screen bg-surface">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <Link href="/admin" className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors mb-2 w-fit">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium uppercase tracking-wider">Voltar para Pedidos</span>
                        </Link>
                        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">
                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </h1>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-sm ${currentStatus.color}`}>
                        <Clock className="w-5 h-5 mr-2" />
                        {currentStatus.label}
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Item Detail Card */}
                        <section className="bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm border border-outline-variant/10">
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-xl font-bold font-headline text-on-surface">Itens do Pedido</h2>
                                <span className="text-on-surface-variant font-medium">{order.items?.length || 0} Itens totais</span>
                            </div>

                            <div className="space-y-6">
                                {(order.items || []).map((item, idx) => (
                                    <div key={item.id || idx} className="flex flex-col sm:flex-row gap-6 group border-b border-outline-variant/10 pb-6 last:border-0 last:pb-0">
                                        <div className="w-full sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                                            {item.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    src={item.image}
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-outline uppercase">Sem Imagem</span>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-on-surface">{item.name} {item.size ? `- ${item.size}` : ''}</h3>
                                                    <p className="text-on-surface-variant font-medium text-sm">Quantidade: {item.quantity || 1}</p>
                                                </div>
                                                <p className="text-lg font-bold text-primary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                            </div>

                                            {/* Customization Tags */}
                                            {item.selections && (
                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {(item.selections.creams?.length ?? 0) > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Cremes</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.selections.creams.map((cream, cIdx) => (
                                                                    <span key={cIdx} className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">{cream}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(item.selections.fruits?.length ?? 0) > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Frutas</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.selections.fruits.map((fruit, fIdx) => (
                                                                    <span key={fIdx} className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">{fruit}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(item.selections.toppings?.length ?? 0) > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Coberturas</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.selections.toppings.map((topping, tIdx) => (
                                                                    <span key={tIdx} className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">{topping}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(item.selections.mix?.length ?? 0) > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Mix</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.selections.mix.map((m, mIdx) => (
                                                                    <span key={mIdx} className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">{m}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Boosts Section */}
                                            {item.selections?.boosts && Object.keys(item.selections.boosts).length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-outline-variant/20">
                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Premium Boosts</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {Object.entries(item.selections.boosts).map(([boostId, qty]) => (
                                                            qty > 0 && (
                                                                <div key={boostId} className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl border border-primary/20">
                                                                    <Star className="text-primary w-4 h-4 fill-primary" />
                                                                    <span className="text-xs font-bold text-primary">{boostId} (x{qty})</span>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Observations */}
                                            {item.selections?.observations && (
                                                <div className="mt-4 bg-surface-variant/50 p-3 rounded-xl border border-dashed border-outline-variant">
                                                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Observações</p>
                                                    <p className="text-xs text-on-surface-variant italic">"{item.selections.observations}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Delivery Map Mockup / Location */}
                        <section className="bg-surface-container-low rounded-[1.5rem] overflow-hidden h-48 relative border border-outline-variant/10">
                            <div className="absolute inset-0 bg-surface-container-high opacity-40">
                                {/* Map Placeholder Style */}
                                <div
                                    className="w-full h-full bg-cover bg-center opacity-50"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')" }}
                                ></div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Endereço de Entrega</p>
                                        <p className="text-sm font-bold text-on-surface">
                                            {order.deliveryAddress?.street || 'N/A'}, {order.deliveryAddress?.neighborhood || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-primary text-xs font-bold hover:underline hidden sm:block">ABRIR NO MAPA</button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Customer & Summary */}
                    <div className="space-y-6">

                        {/* Customer Card */}
                        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
                            <h2 className="text-lg font-bold font-headline mb-6 text-on-surface">Cliente</h2>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                    {order.customer?.name?.slice(0, 2).toUpperCase() || 'NA'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface text-lg">{order.customer?.name || 'Não Informado'}</h3>
                                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-600">Autenticado</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low">
                                    <Phone className="text-primary w-5 h-5" />
                                    <span className="text-sm font-bold text-on-surface">{order.customer?.phone || 'Não Informado'}</span>
                                    {order.customer?.phone && (
                                        <a
                                            href={`https://wa.me/55${order.customer.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="ml-auto w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                                        >
                                            <Phone className="w-4 h-4 fill-current" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Financial Summary Card */}
                        <section className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-primary/20 bg-gradient-to-br from-surface-container-lowest to-primary/5">
                            <h2 className="text-lg font-bold font-headline mb-6 text-on-surface">Resumo Financeiro</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-on-surface-variant">
                                    <span className="text-sm font-medium">Subtotal</span>
                                    <span className="text-sm font-bold text-on-surface">R$ {order.subtotal?.toFixed(2).replace('.', ',') || '0,00'}</span>
                                </div>
                                <div className="flex justify-between text-on-surface-variant">
                                    <span className="text-sm font-medium">Taxa de Entrega</span>
                                    <span className="text-sm font-bold text-on-surface">R$ {order.deliveryFee?.toFixed(2).replace('.', ',') || '0,00'}</span>
                                </div>

                                <div className="pt-4 mt-2 border-t border-outline-variant/20 flex justify-between items-end">
                                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-primary font-headline">R$ {order.total?.toFixed(2).replace('.', ',') || '0,00'}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-on-surface-variant w-5 h-5" />
                                    <span className="text-sm font-bold text-on-surface capitalize">{order.paymentMethod || 'Não Informado'}</span>
                                </div>
                                <span className="text-[10px] font-black text-amber-700 px-2.5 py-1 bg-amber-100 rounded-lg tracking-widest uppercase">
                                    Pendente
                                </span>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            {order.status === 'pending' && (
                                <button
                                    onClick={() => updateOrderStatus('preparing')}
                                    disabled={updating}
                                    className="bg-primary hover:bg-primary/90 text-on-primary py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Confirmar Pedido
                                </button>
                            )}
                            {order.status === 'preparing' && (
                                <button
                                    onClick={() => updateOrderStatus('out_for_delivery')}
                                    disabled={updating}
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all disabled:opacity-70"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Saiu para Entrega
                                </button>
                            )}
                            {order.status === 'out_for_delivery' && (
                                <button
                                    onClick={() => updateOrderStatus('delivered')}
                                    disabled={updating}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Marcar como Entregue
                                </button>
                            )}
                            {order.status !== 'canceled' && order.status !== 'delivered' && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
                                            updateOrderStatus('canceled');
                                        }
                                    }}
                                    disabled={updating}
                                    className="bg-surface text-error border-2 border-error/20 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-error/5 transition-colors disabled:opacity-70"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
