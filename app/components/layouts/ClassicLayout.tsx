import Image from "next/image";

export default function ClassicLayout() {
  return (
    <>
      {/* Hero Section: Editorial Style */}
      <section className="relative py-8 md:py-20 overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[500px]">
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-tertiary-container leading-[1.1] tracking-tight mb-6">
            O roxo que <span className="text-primary-fixed-dim italic">pulsa</span>:<br className="hidden md:block"/> Escolha o seu.
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg font-medium mx-auto md:mx-0 max-w-[280px] md:max-w-md mb-8">
            A energia ancestral da Amazônia, servida com frescor absoluto.
          </p>
          <button className="bg-inverse-primary text-on-primary-fixed px-8 py-4 rounded-full font-headline text-sm md:text-base font-bold shadow-[0_8px_16px_rgba(255,186,32,0.3)] hover:scale-105 active:scale-95 transition-all duration-200">
            Pedir Agora
          </button>
        </div>
        
        <div className="mt-12 md:mt-0 relative w-72 h-72 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] md:absolute md:-right-8 md:top-1/2 md:-translate-y-1/2 opacity-95 mx-auto md:mx-0 z-0">
          <Image
            alt="Açaí bowl premium"
            className="w-full h-full object-contain drop-shadow-2xl rotate-12 hover:rotate-[15deg] transition-transform duration-700"
            src="/açai_hero-removebg-preview.png"
            fill
            unoptimized
          />
        </div>
      </section>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 my-12">
        {/* Açaí Option */}
        <div className="group relative flex flex-col items-center">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_32px_48px_rgba(61,11,55,0.08)] transition-all duration-500 group-hover:scale-[1.02] bg-surface-container-lowest">
            <Image
              alt="Açaí Bowl"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtgxCelwTqo4GCIG9E7eyVbB5h1tjtybU30FlTSiglCpAHLdst2QYMtI2r-kUyH-tPbeCJNq7VeVkR_TrL6naPq97TEs6uCLGCeD3KpEpuRNgxRHG81OI2eE8T_vqprASmdnEml7vvuPrxzwkO-upmZL2eRapD6ixXSJq3sexh605xCpTWzFkrIvA9o1Q6MjP9CDtA7LTOmEw74KDa_0bsS6lm8gOoVNwPHPfWWGEAOtx3FKb1k9wrwoHyghUlOhMCOyet-g6dGxqt"
              fill
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start">
              <h3 className="text-5xl font-black font-headline text-white mb-6 leading-none">
                Açaí
              </h3>
              <button className="bg-[#FFB800] text-[#271900] px-8 py-4 rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-inverse-primary/20">
                Pedir Agora
              </button>
            </div>
          </div>
          <span className="absolute -top-4 -right-4 text-8xl font-black opacity-[0.03] pointer-events-none select-none text-tertiary-container md:block hidden">
            PURPLE
          </span>
        </div>

        {/* Gelato Option */}
        <div className="group relative flex flex-col items-center">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_32px_48px_rgba(61,11,55,0.08)] transition-all duration-500 group-hover:scale-[1.02] bg-surface-container-lowest border border-white/20">
            <Image
              alt="Gelato Selection"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXZYIpD31bSfP7yNw8OWinNiQqjzPsqFWrpawOtEi4su_EXI5pied_yuuhbOJZagFWm4L4qsX7KydZQaFcDZr3zViyC6ljAsyeGlzLuAcJoHY9EaEBsoJrlN2RGiabZu2gqjd0KF5ZDda26DXHGmQO4pGIodsOSiQHni9N5mffHrb5D5YeIS0wA92vBBTJpkN4j6XvqO6wSM97qjOoCONSNhNx1kqPzlR0d8rUKUJQUQa1MgzuHNbK2ylIXPACWZI5TwyhxKyR_bpy"
              fill
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start">
              <h3 className="text-5xl font-black font-headline text-white mb-6 leading-none">
                Gelato
              </h3>
              <button className="bg-[#FFB800] text-[#271900] px-8 py-4 rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-inverse-primary/20">
                Pedir Agora
              </button>
            </div>
          </div>
          <span className="absolute -top-4 -left-4 text-8xl font-black opacity-[0.03] pointer-events-none select-none text-secondary md:block hidden">
            CREAMY
          </span>
        </div>
      </div>

      {/* Secondary Info Section */}
      <section className="mt-24 mb-12 flex flex-col md:flex-row items-center justify-between gap-12 p-12 bg-white rounded-2xl shadow-sm">
        <div className="md:w-1/2">
          <h4 className="text-sm font-bold uppercase tracking-widest text-on-primary-container mb-2">
            Ingredientes Reais
          </h4>
          <p className="text-2xl font-bold font-headline text-tertiary-container mb-6">
            Direto da fonte, para a sua colher.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container rounded-full text-on-secondary-container text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-sm">eco</span> 100% Orgânico
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container rounded-full text-on-secondary-container text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-sm">bolt</span> Energia Pura
            </div>
          </div>
        </div>
        <div className="md:w-1/3 aspect-video rounded-xl overflow-hidden bg-surface-container relative">
          <Image
            alt="Amazon rainforest"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdqdbF7HFGvfI5tic6LNQDfRwMJ0r0WLaE_qzzb2Gb2djpAgMBdo7B7GrUySOGM_EsEhjYRj2svThZqGWKYEPTvV9aGbr-PLlxQYJ4UyHosTCD-9w32-jKjqqYyfRmlR-gUfXIb7-B6Mkm_1Mb5oATATF1UxsXWM_lsn4-HHrm_1bgMIKPXsf62pDzqRYr8p6BShmONNIg21hqX3VxYIYbt2tizXan8rD6Y_qeKWG70avyQcHzaK_xdljRtwrkOUmthT1S-pQDfa6K"
            fill
            unoptimized
          />
        </div>
      </section>
    </>
  );
}
