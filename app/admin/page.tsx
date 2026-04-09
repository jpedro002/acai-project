"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase/client";

interface Order {
  id: string;
  customerName: string;
  itemsSummary: string;
  status: string;
  total: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    if (!db) {
      console.warn("Firestore database is not initialized. Configure environment variables.");
      return;
    }

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      let revenue = 0;

      console.log("Total de pedidos no snapshot:", snapshot.size);

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`Documento ID [${doc.id}] dados:`, JSON.stringify(data, null, 2));
        
        const customerName = data.customer?.name || data.customerName || "Cliente não logado";
        const itemsSummary = Array.isArray(data.items)
          ? data.items
            .map((item: { name?: string; size?: string }) => {
              if (!item?.name) {
                return null;
              }

              return item.size ? `${item.name} (${item.size})` : item.name;
            })
            .filter(Boolean)
            .join(", ")
          : data.itemsSummary || "Produtos...";

        ordersData.push({
          id: doc.id,
          customerName,
          itemsSummary,
          status: data.status || "Recebido",
          total: data.total || 0,
        });
        revenue += data.total || 0;
      });

      setOrders(ordersData);
      setStats({
        totalOrders: ordersData.length,
        totalRevenue: revenue,
      });
    });

    return () => unsubscribe();
  }, []);


  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-black font-headline text-on-surface">Visão Geral</h1>
        <p className="text-on-surface-variant mt-2">Acompanhe as vendas de Açaí e Gelato hoje em tempo real.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Pedidos Hoje</span>
          <span className="text-4xl font-black text-primary">{stats.totalOrders}</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Faturamento</span>
          <span className="text-4xl font-black text-secondary">{formatPrice(stats.totalRevenue)}</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Avaliação Média</span>
          <span className="text-4xl font-black text-inverse-primary">-</span>
        </div>
      </section>

      <section className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-6">
        <h2 className="text-xl font-bold font-headline mb-4">Últimos Pedidos em Tempo Real</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead>
              <tr className="border-b border-surface-variant text-on-surface-variant">
                <th className="py-3 px-4">Pedido ID</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-on-surface-variant">
                    Sem pedidos por enquanto.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-surface-variant/50 hover:bg-surface-variant/20 transition-colors">
                    <td className="py-3 px-4 font-bold">#{order.id.slice(-4).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.itemsSummary}</td>
                    <td className="py-3 px-4">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded-md text-xs font-bold">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
