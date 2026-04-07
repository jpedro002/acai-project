export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-black font-headline text-on-surface">Visão Geral</h1>
        <p className="text-on-surface-variant mt-2">Acompanhe as vendas de Açaí e Gelato hoje.</p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Pedidos Hoje</span>
          <span className="text-4xl font-black text-primary">124</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Faturamento</span>
          <span className="text-4xl font-black text-secondary">R$ 2.450</span>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-on-surface-variant font-bold uppercase text-xs tracking-wider">Avaliação Média</span>
          <span className="text-4xl font-black text-inverse-primary">4.9</span>
        </div>
      </section>

      <section className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-6">
        <h2 className="text-xl font-bold font-headline mb-4">Últimos Pedidos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead>
              <tr className="border-b border-surface-variant text-on-surface-variant">
                <th className="py-3 px-4">Pedido ID</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-variant/50 hover:bg-surface-variant/20 transition-colors">
                <td className="py-3 px-4 font-bold">#1024</td>
                <td className="py-3 px-4">Maria S.</td>
                <td className="py-3 px-4">Açaí 500ml + Morango</td>
                <td className="py-3 px-4"><span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md text-xs font-bold">Entregue</span></td>
              </tr>
              <tr className="border-b border-surface-variant/50 hover:bg-surface-variant/20 transition-colors">
                <td className="py-3 px-4 font-bold">#1025</td>
                <td className="py-3 px-4">João P.</td>
                <td className="py-3 px-4">Gelato Pistache Duplo</td>
                <td className="py-3 px-4"><span className="bg-primary-container text-on-primary-container px-2 py-1 rounded-md text-xs font-bold">Preparo</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
