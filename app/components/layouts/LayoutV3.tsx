import Image from "next/image";
import LayoutHeader from "../shared/LayoutHeader";

export default function LayoutV3() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-x-hidden selection:bg-inverse-primary selection:text-on-primary-fixed w-full">
      {/* Organic Textures (Asymmetrical Background Elements) */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary-container opacity-[0.04] blur-[80px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-tertiary-container opacity-[0.05] blur-[100px] pointer-events-none z-0"></div>

      <LayoutHeader />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 lg:pt-24 flex flex-col items-center w-full">
        {/* Editorial Headline */}
        <div className="text-center mb-8 md:mb-12 lg:mb-20 max-w-2xl relative">
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-7xl text-on-surface tracking-tighter leading-none mb-3 md:mb-4">
            Choose Your <span className="text-tertiary-container">Energy</span>
          </h2>
          <p className="font-body text-sm md:text-base text-on-surface-variant">Primal Amazonian roots or creamy artisanal delight?</p>
        </div>

        {/* Cards Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-16 max-w-5xl">
          {/* Açaí Card */}
          <article className="bg-surface-container-lowest rounded-xl flex flex-col overflow-hidden shadow-[0_32px_48px_-12px_rgba(26,28,28,0.06)] transition-transform duration-500 hover:-translate-y-2 group">
            {/* High-Quality Top-Down Photo */}
            <div className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeatjBw3qp8e1AtKz1vSZAm_fgBOk7q-9hce0xxdRgjiwG0P7C5bpkiE3JTR1tM_SqSbjLxHom-NSMHJqI3w1xO5rGVh8eJesjKim7E5c_GfiBanQG6OGIJLWxAU2JQ_TZSZTR65FMhB9a5-v2f512O8JY-5V-DUGKr5YmkUWDzZr7lKn-N06pA5MemskZaBWMZ0ODmKSCe_7PThDMpcesnItOqx_un8zRGoaUNKsWjTW8qHIRQieE44qw3jlkkBL-Il_35IBlF_1m"
                alt="Açaí Bowl Top-Down"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle Gradient Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col grow justify-between">
              <div className="mb-6 md:mb-8">
                <h3 className="font-headline font-black text-3xl md:text-4xl text-on-surface tracking-tight mb-2 md:mb-3">Açaí</h3>
                <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Pure Amazonian energy. Blended thick with wild berries and topped with organic crunch. The primal pulse.
                </p>
              </div>
              <button className="w-full bg-inverse-primary text-on-primary-fixed font-headline font-bold text-sm md:text-base py-3 md:py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_8px_16px_-4px_rgba(255,186,32,0.2)]">
                Quero esse!
              </button>
            </div>
          </article>

          {/* Gelato Card */}
          <article className="bg-surface-container-lowest rounded-xl flex flex-col overflow-hidden shadow-[0_32px_48px_-12px_rgba(26,28,28,0.06)] transition-transform duration-500 hover:-translate-y-2 group">
            {/* High-Quality Top-Down Photo */}
            <div className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGcIuk4k3AFNJ-dMllX6BWtfs9QWtEDRELtS-zVvRD3b4VverARi24x5VbSymNn-zw4M24n3ElRTi4klRX2sRx3YljGUDUj4OCAEnLeOEpLQ8GOE4DLST-JGRqpjWfW-eG1j--WFOUKdE2vfB4j5Bxr_UidaWC5cKA7PNKWytroro1-10F8C7AOQg0wrIHL-uoAAAXFys9kfJoUyHwBWmgl7wfmLZ7uQycHZknWv9b0cd0k_306WXeTDQGH98DTfHUYmv_vsuMKJHd"
                alt="Gelato Top-Down"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle Gradient Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col grow justify-between">
              <div className="mb-6 md:mb-8">
                <h3 className="font-headline font-black text-3xl md:text-4xl text-on-surface tracking-tight mb-2 md:mb-3">Gelato</h3>
                <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Creamy, slow-churned artisanal delight. Rich textures and sophisticated flavors crafted to perfection.
                </p>
              </div>
              <button className="w-full bg-inverse-primary text-on-primary-fixed font-headline font-bold text-sm md:text-base py-3 md:py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_8px_16px_-4px_rgba(255,186,32,0.2)]">
                Quero esse!
              </button>
            </div>
          </article>
        </div>
      </main>

      {/* Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-2 bg-white/90 backdrop-blur-xl z-50 rounded-t-[24px] shadow-[0_-8px_32px_rgba(61,11,55,0.06)] md:hidden">
        <a href="/?layout=v1" className="flex flex-col items-center justify-center text-[#3D0B37] px-4 py-2 hover:opacity-80 transition-all active:scale-95">
          <span className="material-symbols-outlined">home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest">Início</span>
        </a>
        <a href="/?layout=v2" className="flex flex-col items-center justify-center text-[#3D0B37] px-4 py-2 hover:opacity-80 transition-all active:scale-95">
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest">V2</span>
        </a>
        <a href="/?layout=v3" className="flex flex-col items-center justify-center bg-[#FFB800] text-[#271900] rounded-full px-6 py-2 transition-all scale-105 active:scale-95">
          <span className="material-symbols-outlined">favorite</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest">V3</span>
        </a>
        <a href="/admin" className="flex flex-col items-center justify-center text-[#3D0B37] px-4 py-2 hover:opacity-80 transition-all active:scale-95">
          <span className="material-symbols-outlined">person</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest">Perfil</span>
        </a>
      </nav>
    </div>
  );
}
