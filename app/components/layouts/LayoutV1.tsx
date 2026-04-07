import Image from "next/image";
import Link from "next/link";
import LayoutHeader from "../shared/LayoutHeader";

export default function LayoutV1() {
    return (
        <div className="bg-background text-on-background font-body organic-texture min-h-screen overflow-x-hidden w-full relative">
            <LayoutHeader />

            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto w-full relative z-10">
                {/* Hero Section: Editorial Style */}
                <section className="relative py-8 md:py-20 flex flex-col md:flex-row items-center justify-between min-h-[500px] w-full">
                    <div className="relative z-10 max-w-lg text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-tertiary-container leading-[1.1] tracking-tight mb-6">
                            Escolha o seu açaí. <br className="hidden md:block" />
                            <span className="text-primary-fixed-dim italic">Sinta a energia.</span>
                        </h2>
                        <p className="text-on-surface-variant text-base md:text-lg font-medium mx-auto md:mx-0 max-w-[280px] md:max-w-md mb-8">
                            Cremoso, gelado e do seu jeito. O verdadeiro sabor da fruta servido com frescor absoluto.
                        </p>
                        <Link href="/builder">
                            <button className="bg-inverse-primary text-on-primary-fixed px-8 z-10 py-4 rounded-full font-headline text-sm md:text-base font-bold shadow-[0_8px_16px_rgba(255,186,32,0.3)] hover:scale-105 active:scale-95 transition-all duration-200">
                                Pedir Agora
                            </button>
                        </Link>
                    </div>

                    <div className="mt-12 md:mt-0 relative w-72 h-72 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 opacity-95 mx-auto md:mx-0 z-0">
                        <Image
                            alt="Açaí bowl premium"
                            className="w-full h-full object-contain drop-shadow-[0_12px_16px_rgba(61,11,55,0.15)] hover:drop-shadow-[0_16px_24px_rgba(61,11,55,0.25)] rotate-12 hover:rotate-[15deg] transition-all duration-700 hover:-translate-y-4"
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
                                <Link href="/builder">
                                    <button className="bg-[#FFB800] text-[#271900] px-8 py-4 rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-inverse-primary/20">
                                        Pedir Agora
                                    </button>
                                </Link>
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
                                <Link href="/gelato-builder">
                                    <button className="bg-[#FFB800] text-[#271900] px-8 py-4 rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-inverse-primary/20">
                                        Pedir Agora
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <span className="absolute -top-4 -left-4 text-8xl font-black opacity-[0.03] pointer-events-none select-none text-secondary md:block hidden">
                            CREAMY
                        </span>
                    </div>
                </div>

                {/* Secondary Info Section */}
                <section className="mt-12 md:mt-24 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 p-6 md:p-12 bg-white rounded-2xl shadow-sm">
                    <div className="md:w-1/2">
                        <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-on-primary-container mb-2">
                            Ingredientes Reais
                        </h4>
                        <p className="text-xl md:text-2xl font-bold font-headline text-tertiary-container mb-4 md:mb-6">
                            Direto da fonte, para a sua colher.
                        </p>
                        <div className="flex flex-wrap gap-3 md:gap-4">
                            <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-secondary-container rounded-full text-on-secondary-container text-[10px] md:text-xs font-bold uppercase">
                                <span className="material-symbols-outlined text-sm">eco</span> 100% Orgânico
                            </div>
                            <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-secondary-container rounded-full text-on-secondary-container text-[10px] md:text-xs font-bold uppercase">
                                <span className="material-symbols-outlined text-sm">bolt</span> Energia Pura
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-surface-container relative">
                        <Image
                            alt="Amazon rainforest"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdqdbF7HFGvfI5tic6LNQDfRwMJ0r0WLaE_qzzb2Gb2djpAgMBdo7B7GrUySOGM_EsEhjYRj2svThZqGWKYEPTvV9aGbr-PLlxQYJ4UyHosTCD-9w32-jKjqqYyfRmlR-gUfXIb7-B6Mkm_1Mb5oATATF1UxsXWM_lsn4-HHrm_1bgMIKPXsf62pDzqRYr8p6BShmONNIg21hqX3VxYIYbt2tizXan8rD6Y_qeKWG70avyQcHzaK_xdljRtwrkOUmthT1S-pQDfa6K"
                            fill
                            unoptimized
                        />
                    </div>
                </section>
            </main>


        </div>
    );
}
