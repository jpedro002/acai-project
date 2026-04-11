"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  Search, Bell, HelpCircle, MapPin,
  ListChecks, MoreHorizontal,
  Phone, MessageCircle, Receipt, CreditCard,
  IceCream, ShoppingBag, Check, X, Clock, ChefHat, Truck, CheckCircle, ExternalLink,
  Calendar as CalendarIcon, LayoutGrid, List
} from "lucide-react";
import {
  KanbanProvider,
  KanbanBoard,
  KanbanCards,
  KanbanCard,
  KanbanItemProps,
} from "@/components/ui/kanban";
import { DragEndEvent } from "@dnd-kit/core";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// --- Tipagens ---
type OrderItem = {
  id: string;
  name: string;
  kind: string;
  quantity: number;
  price: number;
  selections?: {
    creams?: string[];
    fruits?: string[];
    toppings?: string[];
    mix?: string[];
    boosts?: Record<string, number>;
  };
  flavorSummary: string;
};

type Order = KanbanItemProps & {
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
  customer: { uid: string; name: string; phone: string };
  delivery: { method: string; fee: number; address: { street: string; number: string; neighborhood: string; complement?: string } };
  payment: { method: string; status: string; subtotal: number; total: number };
  items: OrderItem[];
};

// --- Mock Data ---
const INITIAL_ORDERS: Order[] = [
  {
    id: "LNVAvq8YscFCUy3wFY56",
    column: "pending",
    name: "João Pedro", // Obrigatório pro KanbanCard
    status: "pending",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 600, nanoseconds: 192000000 },
    customer: { uid: "4BXZ48ngEIcvNx4ka8Jk73WBYLJ3", name: "João Pedro", phone: "85986222725" },
    delivery: { method: "delivery", fee: 7.00, address: { street: "Tv Dom Luiz", number: "71", neighborhood: "Centro" } },
    payment: { method: "cartao", status: "pending", subtotal: 18.00, total: 25.00 },
    items: [
      {
        id: "9feeb26c-19cf-4174-9ffb-81af43f8fd09",
        name: "Gelato P",
        kind: "gelato",
        quantity: 1,
        price: 18.00,
        selections: {
          creams: ["TAPIOCA CREMOSA"],
          fruits: ["Manga"],
          toppings: ["COB. MORANGO"],
          mix: ["MIX MM", "MIX GRANULADO CHOCOLATE"],
          boosts: { "oreo": 1, "extra-nutella": 2 }
        },
        flavorSummary: "Tapioca, Manga, Morango, MM, Granulado"
      }
    ]
  },
  {
    id: "ORD-2845",
    column: "preparing",
    name: "Mariana Lima",
    status: "preparing",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800, nanoseconds: 0 },
    customer: { uid: "CUST-2", name: "Mariana Lima", phone: "11987654321" },
    delivery: { method: "delivery", fee: 5.00, address: { street: "Rua das Flores", number: "123", neighborhood: "Jardim Paulista" } },
    payment: { method: "pix", status: "paid", subtotal: 40.90, total: 45.90 },
    items: [
      {
        id: "item-2", name: "Super Açaí (750ml)", kind: "acai", quantity: 1, price: 40.90,
        selections: { boosts: { "Whey Protein": 1 } },
        flavorSummary: "Leite Condensado, Paçoca, Morango"
      }
    ]
  },
  {
    id: "ORD-2840",
    column: "out_for_delivery",
    name: "Roberto Rocha",
    status: "out_for_delivery",
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 },
    customer: { uid: "CUST-3", name: "Roberto Rocha", phone: "21988887777" },
    delivery: { method: "delivery", fee: 0, address: { street: "Av Paulista", number: "1000", neighborhood: "Bela Vista" } },
    payment: { method: "dinheiro", status: "pending", subtotal: 89.00, total: 89.00 },
    items: [
      { id: "item-3", name: "Combo Familiar 1kg Açaí", kind: "acai", quantity: 1, price: 89.00, flavorSummary: "2x Granola, 2x Leite Ninho" }
    ]
  }
];

const COLUMNS = [
  { id: "pending", name: "Pendente", bgBadge: "bg-amber-100 text-amber-700", border: "border-amber-400", icon: Clock },
  { id: "preparing", name: "Em Preparo", bgBadge: "bg-blue-100 text-blue-700", border: "border-blue-400", icon: ChefHat },
  { id: "out_for_delivery", name: "Em Entrega", bgBadge: "bg-purple-100 text-purple-700", border: "border-purple-400", icon: Truck },
  { id: "delivered", name: "Finalizado", bgBadge: "bg-green-100 text-green-700", border: "border-green-500", icon: CheckCircle },
];

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending:          { label: "Pendente",   classes: "bg-amber-100 text-amber-700 border-amber-200" },
  preparing:        { label: "Em Preparo", classes: "bg-blue-100 text-blue-700 border-blue-200" },
  out_for_delivery: { label: "Em Entrega", classes: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered:        { label: "Finalizado", classes: "bg-green-100 text-green-700 border-green-200" },
  cancelled:        { label: "Cancelado",  classes: "bg-red-100 text-red-700 border-red-200" },
};

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

type ViewMode = "kanban" | "table";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  useEffect(() => {
    if (!db) return;

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        ordersData.push({
          id: docSnap.id,
          column: data.status || "pending",
          name: data.customer?.name || data.customerName || "Cliente", // p/ KanbanCard
          status: data.status || "pending",
          createdAt: data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
          customer: data.customer || { uid: "", name: data.customerName || "Cliente", phone: "" },
          delivery: data.delivery || { method: "takeaway", fee: 0, address: { street: "", number: "", neighborhood: "" } },
          payment: data.payment || { method: "-", status: "pending", subtotal: data.total || 0, total: data.total || 0 },
          items: Array.isArray(data.items) ? data.items : [],
        });
      });

      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const formatTimestamp = (seconds: number) => {
    try {
      const date = new Date(seconds * 1000);
      return format(date, "HH:mm", { locale: ptBR });
    } catch {
      return "--:--";
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!db) return;
    try {
      const orderRef = doc(db!, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setSelectedOrder(null);
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  };

  const handleKanbanChange = (newData: KanbanItemProps[]) => {
    // Atualiza apenas a UI em tempo real enquanto arrasta, sem enviar pro Firebase
    setOrders(newData as Order[]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!db) return;
    // Quando o usuário finalmente SOLTAR o card, nós checamos se o status mudou
    const { active } = event;
    const order = orders.find(o => String(o.id) === String(active.id));

    if (order && order.column !== order.status) {
      try {
        // Trava repetições antes de o onSnapshot receber a atualização
        order.status = order.column;
        const orderRef = doc(db!, "orders", String(order.id));
        await updateDoc(orderRef, { status: order.column });
      } catch (error) {
        console.error("Failed to sync drag-n-drop status", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Dashboard Simplificado */}
      <header className="flex justify-between items-center bg-surface p-6 rounded-2xl shadow-sm shrink-0">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary">Gestão de Pedidos</h1>
          <p className="text-on-surface-variant flex items-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Atendimento Ativo (Point dos Amigos)
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex bg-surface-container-low rounded-full p-1 gap-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2.5 rounded-full transition-all ${
                viewMode === "kanban"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
              }`}
              title="Visualização Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-full transition-all ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
              }`}
              title="Visualização Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Popover>
            <PopoverTrigger
              className="bg-surface-container-low border-none rounded-full px-4 h-11 justify-start text-left font-medium flex items-center gap-2 hover:bg-surface-variant transition text-on-surface"
            >
              <CalendarIcon className="w-4 h-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="bg-surface-container-lowest text-on-surface"
              />
            </PopoverContent>
          </Popover>

          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Buscar pedidos, clientes..."
              type="text"
            />
          </div>
          <button className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-container-highest hover:bg-surface-variant transition text-on-surface shrink-0">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Kanban Board Layout */}
      {viewMode === "kanban" && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <KanbanProvider
            columns={COLUMNS}
            data={orders}
            onDataChange={handleKanbanChange}
            onDragEnd={handleDragEnd}
            className="flex h-full gap-6 min-w-max"
          >
            {column => {
              const ColumnIcon = column.icon;
              const columnOrders = orders.filter(o => o.column === column.id);

              return (
                <KanbanBoard id={column.id} key={column.id} className="w-[340px] bg-surface-container-low/50 rounded-2xl flex flex-col h-full shrink-0 border-none shadow-none ring-0">
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2">
                      <ColumnIcon className={`w-5 h-5 ${column.bgBadge.split(' ')[1]}`} />
                      <h3 className="font-headline font-bold text-on-surface">{column.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${column.bgBadge}`}>
                        {columnOrders.length}
                      </span>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-outline cursor-pointer" />
                  </div>

                  <KanbanCards id={column.id} className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                    {item => (
                      <KanbanCard
                        key={item.id}
                        {...item}
                        className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border-l-[5px] hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${column.border}`}
                      >
                        <div onClick={() => setSelectedOrder(item as Order)} className="w-full text-left">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">#{item.id.slice(-4).toUpperCase()}</span>
                            <span className="text-xs font-medium text-outline flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {(item as Order).createdAt ? formatTimestamp((item as Order).createdAt.seconds) : '--:--'}
                            </span>
                          </div>
                          <h4 className="font-headline font-bold text-on-surface text-base mb-1 truncate">
                            {(item as Order).customer.name}
                          </h4>

                          {/* Display Resumo dos itens */}
                          <div className="space-y-1 mb-4">
                            {(item as Order).items.map((i, idx) => (
                              <p key={idx} className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                                <span className="font-medium text-on-surface">{i.quantity}x {i.name}</span>
                                {i.flavorSummary ? ` • ${i.flavorSummary}` : ''}
                              </p>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                            <div className="flex items-center gap-1.5 bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg">
                              {(item as Order).items[0]?.kind === 'gelato' ? <IceCream className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                              <span className="text-[11px] font-bold">{(item as Order).items.length} {(item as Order).items.length > 1 ? 'itens' : 'item'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[15px] font-black text-primary">
                                {formatPrice((item as Order).payment.total)}
                              </span>
                              <button
                                type="button"
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin/orders/${item.id}`);
                                }}
                                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer relative z-10"
                                title="Abrir Página do Pedido"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              );
            }}
          </KanbanProvider>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="flex-1 overflow-auto pb-4">
          <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
            {/* Summary bar */}
            <div className="flex items-center gap-6 px-6 py-4 border-b border-outline-variant/10">
              {COLUMNS.map(col => {
                const count = orders.filter(o => o.column === col.id).length;
                const ColIcon = col.icon;
                return (
                  <div key={col.id} className="flex items-center gap-2">
                    <ColIcon className={`w-4 h-4 ${col.bgBadge.split(' ')[1]}`} />
                    <span className="text-sm font-medium text-on-surface-variant">{col.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.bgBadge}`}>{count}</span>
                  </div>
                );
              })}
              <div className="ml-auto text-sm font-bold text-on-surface-variant">
                {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-outline-variant/10 hover:bg-transparent">
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider pl-6">Pedido</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Horário</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Cliente</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Itens</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Entrega</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Pagamento</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider text-right pr-6">Total</TableHead>
                  <TableHead className="w-10 pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-16 text-on-surface-variant">
                      <div className="flex flex-col items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-outline" />
                        <p className="text-base font-medium">Nenhum pedido neste dia</p>
                        <p className="text-sm text-outline">Selecione outra data no calendário</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {orders.map(order => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
                  return (
                    <TableRow
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-outline-variant/10 cursor-pointer hover:bg-surface-container-low/60 transition-colors"
                    >
                      <TableCell className="pl-6 font-mono font-bold text-xs text-outline-variant">
                        #{order.id.slice(-4).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-on-surface font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-outline" />
                          {formatTimestamp(order.createdAt.seconds)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {order.customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-on-surface truncate max-w-[140px]">{order.customer.name}</p>
                            <p className="text-xs text-outline">{order.customer.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-on-surface-variant truncate max-w-[200px]" title={itemsSummary}>
                          {itemsSummary}
                        </p>
                        <p className="text-xs text-outline">{order.items.length} {order.items.length > 1 ? 'itens' : 'item'}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-on-surface-variant capitalize flex items-center gap-1.5">
                          {order.delivery.method === 'delivery' ? <Truck className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                          {order.delivery.method === 'delivery' ? 'Delivery' : 'Retirada'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-on-surface-variant flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-outline" />
                          {PAYMENT_LABELS[order.payment.method] || order.payment.method}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.classes}`}>
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-2">
                        <span className="text-sm font-black text-primary">
                          {formatPrice(order.payment.total)}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/orders/${order.id}`);
                          }}
                          className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center"
                          title="Abrir Página do Pedido"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Table footer with totals */}
            {orders.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low/30">
                <span className="text-sm text-on-surface-variant">
                  Mostrando <span className="font-bold text-on-surface">{orders.length}</span> {orders.length === 1 ? 'pedido' : 'pedidos'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-on-surface-variant">Total do dia:</span>
                  <span className="text-lg font-headline font-black text-primary">
                    {formatPrice(orders.reduce((acc, o) => acc + o.payment.total, 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal / Dialog de Detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 transition-all">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 md:p-8 pb-6 flex justify-between items-start border-b border-outline-variant/10">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary font-bold text-2xl truncate">
                  {selectedOrder.customer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-headline font-extrabold text-on-surface">{selectedOrder.customer.name}</h2>
                    <span className="bg-surface-variant text-on-surface-variant font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
                      #{selectedOrder.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
                    <a className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors" href={`https://wa.me/${selectedOrder.customer.phone}`} target="_blank" rel="noreferrer">
                      <Phone className="w-4 h-4" />
                      <span>{selectedOrder.customer.phone}</span>
                      <MessageCircle className="w-4 h-4 text-emerald-500 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
              <button
                className="w-10 h-10 rounded-full hover:bg-error/10 hover:text-error transition-colors flex items-center justify-center text-outline"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">

              {/* Delivery Section */}
              <div className="bg-surface-container-low rounded-2xl p-5 flex gap-4 items-center">
                <MapPin className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5">Endereço de Entrega</p>
                  <p className="text-sm font-medium text-on-surface">
                    {selectedOrder.delivery.address.street}, {selectedOrder.delivery.address.number}
                    {selectedOrder.delivery.address.complement ? ` - ${selectedOrder.delivery.address.complement}` : ''}
                    {' • '} {selectedOrder.delivery.address.neighborhood}
                  </p>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-primary" />
                  Itens do Pedido
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="border border-outline-variant/20 rounded-2xl p-5 bg-surface-container-lowest">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-on-surface text-lg">{item.quantity}x {item.name}</h4>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{item.kind}</p>
                        </div>
                        <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                      </div>

                      {item.selections && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 mt-2 bg-surface-container-low/40 rounded-xl p-4">
                          {item.selections.creams && item.selections.creams.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-outline uppercase mb-1">Gelatos / Cremes</p>
                              <p className="text-sm text-on-surface font-medium">{item.selections.creams.join(', ')}</p>
                            </div>
                          )}
                          {item.selections.fruits && item.selections.fruits.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-outline uppercase mb-1">Frutas</p>
                              <p className="text-sm text-on-surface font-medium">{item.selections.fruits.join(', ')}</p>
                            </div>
                          )}
                          {item.selections.toppings && item.selections.toppings.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-outline uppercase mb-1">Topings</p>
                              <p className="text-sm text-on-surface font-medium">{item.selections.toppings.join(', ')}</p>
                            </div>
                          )}
                          {item.selections.mix && item.selections.mix.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-outline uppercase mb-1">Confeitos / Mix</p>
                              <p className="text-sm text-on-surface font-medium">{item.selections.mix.join(', ')}</p>
                            </div>
                          )}

                          {item.selections.boosts && Object.keys(item.selections.boosts).length > 0 && (
                            <div className="col-span-1 sm:col-span-2 pt-2">
                              <p className="text-[10px] font-bold text-outline uppercase mb-2">Boosts (Extras Pagos)</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(item.selections.boosts).map(([bKey, bVal]) => (
                                  <span key={bKey} className="bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                    <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[9px]">{bVal}</span>
                                    {bKey}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Ações */}
            <div className="p-6 md:p-8 bg-surface-container-low border-t border-outline-variant/10">
              <div className="flex justify-between items-end mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-start text-on-surface-variant">
                    <CreditCard className="w-5 h-5 text-outline" />
                    <span className="text-sm font-semibold capitalize">{selectedOrder.payment.method} ({selectedOrder.payment.status})</span>
                  </div>
                  <div className="flex items-center gap-2 justify-start text-on-surface-variant">
                    <Receipt className="w-5 h-5 text-outline" />
                    <span className="text-xs font-medium">Subtotal: {formatPrice(selectedOrder.payment.subtotal)} | Entrega: {formatPrice(selectedOrder.delivery.fee)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total do Pedido</p>
                  <p className="text-3xl font-headline font-black text-primary">{formatPrice(selectedOrder.payment.total)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedOrder.status === 'pending' && (
                  <button onClick={() => handleStatusChange(selectedOrder.id, 'preparing')} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Confirmar & Imprimir
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button onClick={() => handleStatusChange(selectedOrder.id, 'out_for_delivery')} className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Truck className="w-5 h-5" /> Despachar Pedido
                  </button>
                )}
                {selectedOrder.status === 'out_for_delivery' && (
                  <button onClick={() => handleStatusChange(selectedOrder.id, 'delivered')} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Concluir Entrega
                  </button>
                )}

                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  className="px-6 py-4 border-2 border-error text-error bg-error/5 hover:bg-error hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
