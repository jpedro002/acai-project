import Image from "next/image";

export default function EditorialLayout() {
  return (
    <>
      {/* Welcome Message Section */}
      <section className="mb-16 md:mb-24 mt-8">
        <div className="max-w-3xl">
          <span className="text-secondary font-headline font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
            Bem-vindo à Experiência
          </span>
          <h1 className="text-[#3D0B37] font-headline font-black text-5xl md:text-7xl leading-[0.9] tracking-tighter mb-6">
            A energia da floresta, <br />
            <span className="text-secondary">em cada detalhe.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed">
            Descubra a fusão perfeita entre a vitalidade do açaí puro e a cremosidade artesanal do nosso gelato premium.
          </p>
        </div>
      </section>

      {/* Dynamic Floating Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        {/* Açaí Floating Card */}
        <div className="group relative bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_rgba(61,11,55,0.06)] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-4">
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              alt="Premium Açaí Bowl"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeFa_sQDI8NcV3Ij6zP6Mll3C1aHn43iloxeTsuUoCpej5qWdDEOL0ZXC33-e8fp-_tY4uTc8XYoQZiXV3jcGW7Iw3DhltMzeQvBCorY0TcT9uIrpuT8YKbOz6XmALPdNICiWcUqoF2rVCOdpMvzfpeu2mHpAmnB2psm4-9xz0-Lg6UYV9g2fQnwqyFu9uKQj8doxNZyyvXSUrN7cqzz93gQHAFTCCPgz2sSl-Nc12rK-7DEyj6J5A0MKF8Tb0ohZ4qy_tgxZPPs1v"
              fill
              unoptimized
            />
            <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-headline font-bold text-xs tracking-widest uppercase">
                Energia Pura
              </span>
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col flex-grow">
            <h2 className="text-[#3D0B37] font-headline font-extrabold text-3xl md:text-4xl mb-4 tracking-tight">
              O Clássico Açaí
            </h2>
            <p className="text-on-surface-variant text-base mb-10 leading-relaxed">
              Colhido no coração da Amazônia, processado com técnicas que preservam cada nota de sabor e toda a densidade nutricional.
            </p>
            <div className="mt-auto">
              <button className="bg-[#FFB800] text-[#271900] px-10 py-4 rounded-full font-headline font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(255,184,0,0.3)] group-hover:shadow-[0_12px_32px_rgba(255,184,0,0.4)] uppercase">
                Quero esse!
              </button>
            </div>
          </div>
        </div>

        {/* Gelato Floating Card */}
        <div className="group relative bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_rgba(61,11,55,0.06)] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-4 md:mt-20">
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              alt="Artisan Gelato"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_64q8pC8ZWugwiaVpKg4G2Pbtb8R8Dw5wDk-undyTsMoW--uuAbykU02jA3tp7IGMaJW4PzyR4YFc5aVOYIjIKb0m5XQAFrELWrWb4apXHn_GoF4PXFZOzTDBA6n0EV7aoOIg5UQm3wLZU-FdCFrNpdP7DCSZGEakn0n8kl1AJRCoeGLtt_FWii4peUDJDhkAY0lbgJUZ4-d_82wZrqbJ2KIqiLkFg-hlIHOpbs9t_KBMkA8_5oXkrPf6FmGLz3-vFAABaQzGjr9u"
              fill
              unoptimized
            />
            <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-headline font-bold text-xs tracking-widest uppercase">
                Artesanal
              </span>
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col flex-grow">
            <h2 className="text-[#3D0B37] font-headline font-extrabold text-3xl md:text-4xl mb-4 tracking-tight">
              Gelato Premium
            </h2>
            <p className="text-on-surface-variant text-base mb-10 leading-relaxed">
              Textura aveludada e ingredientes selecionados. Uma experiência de frescor inspirada na tradição italiana com alma brasileira.
            </p>
            <div className="mt-auto">
              <button className="bg-[#FFB800] text-[#271900] px-10 py-4 rounded-full font-headline font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(255,184,0,0.3)] group-hover:shadow-[0_12px_32px_rgba(255,184,0,0.4)] uppercase">
                Descobrir Sabores
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section with Bento layout */}
      <section className="mt-32 md:mt-48">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-[#3D0B37] font-headline font-black text-4xl tracking-tighter">
              Nossos Favoritos
            </h3>
            <p className="text-on-surface-variant mt-2">
              Combinações curadas por nossos especialistas.
            </p>
          </div>
          <button className="text-[#3D0B37] font-headline font-bold text-sm underline underline-offset-8 decoration-2 decoration-[#FFB800] hover:text-[#FFB800] transition-colors">
            Ver Cardápio Completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Açaí */}
          <div className="md:col-span-2 h-[400px] bg-secondary-container rounded-xl relative overflow-hidden p-8 group">
            <Image
              alt="Tropical Vibes"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTiVaTZyef5ysD_CIVkqZJxRcmQ2yQaWqYnj80qBiye8bQ7rYi_hlDPIJ0KlRneRqYHRr7onTNVqSXIDe9jEkrRio1hDvQL0vOJCD_HikrHeEejNBmr0nGDtfHFrIm9OZdnc8tw1JKRqGAY2pgsR9nRwtzyD3C-SjA-9zq6jhd8oFPDdka5zIUQv2xHbVxOPeVtkoYGpsqtya_Y-wbdwXkgz6COqb-Yqmf-4FfLtFiUHZfsXlJSMgqs31XyE2b2Axkxfj9yAgtjEbl"
              fill
              unoptimized
            />
            <div className="relative z-10 h-full flex flex-col justify-end">
              <span className="text-[#271900] font-headline font-bold text-sm uppercase mb-2">
                Edição Limitada
              </span>
              <h4 className="text-[#271900] font-headline font-black text-4xl max-w-md leading-none mb-6">
                Açaí com Cupuaçu &amp; Castanhas
              </h4>
              <div className="flex gap-4">
                <button className="bg-[#271900] text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest">
                  Pedir Agora
                </button>
              </div>
            </div>
          </div>

          {/* Quality Badge */}
          <div className="bg-tertiary-container rounded-xl p-8 flex flex-col justify-between h-[400px] text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFB800] rounded-full blur-[60px] opacity-20 transition-all group-hover:scale-150"></div>
            <span className="material-symbols-outlined text-4xl text-[#FFB800]">workspace_premium</span>
            <div>
              <h4 className="font-headline font-bold text-2xl mb-4">Qualidade Certificada</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Garantimos a origem sustentável de cada fruto colhido, apoiando comunidades locais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
