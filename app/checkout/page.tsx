'use client';

import LayoutHeader from '@/app/components/shared/LayoutHeader';

export default function CheckoutPage() {
  return (
    <>
      <LayoutHeader />
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-12 pb-32">
        {/* Header Text */}
        <section className="space-y-2">
          <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-tertiary-container">Quase lá!</h2>
          <p className="text-on-surface-variant font-medium">Preencha os detalhes para receber sua energia da Amazônia.</p>
        </section>

        {/* Seus Dados Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-inverse-primary">person</span>
            <h3 className="font-headline text-xl font-bold tracking-tight">Seus Dados</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Como te chamam?</label>
              <input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Nome Completo" type="text" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Telefone para contato</label>
              <input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50" placeholder="(11) 99999-9999" type="tel" />
            </div>
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
              <input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50" placeholder="Endereço e Número" type="text" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-1">Bairro</label>
              <div className="relative">
                <select defaultValue="" className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all appearance-none text-on-surface-variant">
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
            <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest shadow-sm border-2 border-transparent hover:border-inverse-primary transition-all group">
              <span className="material-symbols-outlined text-2xl mb-2 text-on-surface-variant group-hover:text-inverse-primary">qr_code_2</span>
              <span className="text-xs font-bold uppercase tracking-wider">Pix</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest shadow-sm border-2 border-inverse-primary transition-all group">
              <span className="material-symbols-outlined text-2xl mb-2 text-inverse-primary">credit_card</span>
              <span className="text-xs font-bold uppercase tracking-wider">Cartão</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest shadow-sm border-2 border-transparent hover:border-inverse-primary transition-all group">
              <span className="material-symbols-outlined text-2xl mb-2 text-on-surface-variant group-hover:text-inverse-primary">account_balance_wallet</span>
              <span className="text-xs font-bold uppercase tracking-wider">Débito</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest shadow-sm border-2 border-transparent hover:border-inverse-primary transition-all group">
              <span className="material-symbols-outlined text-2xl mb-2 text-on-surface-variant group-hover:text-inverse-primary">payments</span>
              <span className="text-xs font-bold uppercase tracking-wider">Dinheiro</span>
            </button>
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
              <span>R$ 42,90</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Taxa de Entrega</span>
              <span>R$ 7,00</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-inverse-primary">R$ 49,90</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="pt-4">
          <button className="w-full bg-inverse-primary text-on-primary-fixed py-6 rounded-full font-headline font-extrabold text-xl shadow-[0_12px_48px_rgba(255,184,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group">
            Confirmar Pedido
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </main>
    </>
  );
}
