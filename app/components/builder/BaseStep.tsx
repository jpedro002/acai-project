"use client";

import { useCatalog } from "@/app/hooks/useCatalog";
import Image from "next/image";
import BaseCard from "./BaseCard";

interface BaseStepProps {
    selectedBase: string | null;
    setSelectedBase: (base: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    onNext: () => void;
}

export default function BaseStep({ selectedBase, setSelectedBase, selectedSize, setSelectedSize, onNext }: BaseStepProps) {
    const { items: bases, loading } = useCatalog("base");

    const sizes = [
        { id: "300", label: "300ml" },
        { id: "500", label: "500ml" },
        { id: "700", label: "700ml" },
        { id: "1000", label: "1 litro" }
    ];

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const selectedBaseData = bases.find(b => b.id === selectedBase);

    return (
        <div className="w-full">
            {/* Builder Title Section */}
            <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-tertiary tracking-tighter leading-none mb-2">ESCOLHA SUA BASE</h2>
                <p className="text-on-surface-variant font-medium">O começo de toda jornada épica na floresta.</p>
            </div>

            {/* Interactive Bowl Canvas */}
            <div className="relative w-full aspect-square max-w-md mx-auto mb-12 flex items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 rotate-12">
                    <Image
                        width={192}
                        height={192}
                        className="w-full h-full text-secondary-container"
                        alt="abstract organic palm leaf shape"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiu75bzZu-bqBnmkVt_VLwL1HVTgVFiOj-3c005zwQ4Hxr1Hyxk50iD8xB23T1R1LKiPFmcw8vmEsT_681hftBbwc7ruC5T6RcvrNZLeA6fMSGEkpCnfzIFJyrEa-ZJK96tjDniaQrRXayeBqH6N4s9DWPhwfD5OtVuy6vbug6S2xEBNLhuSA-OSu8xaUDakmZVOwKO5mJJA-1kpHa2ApJJ9ee24gXmfLKRLKSsS0JaLj5So9nycGJ2fTWoX4Izw5MdI34jJAF-_Kl"
                        unoptimized
                    />
                </div>
                {/* The Main Bowl */}
                <div className="relative z-10 w-full h-full rounded-full bg-surface-container shadow-2xl border-[16px] border-white flex items-center justify-center overflow-hidden transition-all duration-300">
                    <Image
                        fill
                        className={`w-full h-full object-cover scale-110 transition-all duration-500 ${selectedBase ? "opacity-100" : "opacity-20"}`}
                        alt={selectedBaseData ? selectedBaseData.imageAlt : "top-down macro shot of an empty white ceramic artisan bowl"}
                        src={selectedBaseData ? selectedBaseData.imageUrl : "https://lh3.googleusercontent.com/aida-public/AB6AXuA8ubVEIEaEPrz5U5Sp14n-U-iYYuIxliYnQpYnLUpRLFbqIoqtEBkSi1WpzfYCdNC-6SdGMt-lgSBuHR985cq8d3AxaZ60dO4_j04hZK80VLc777Naswq4dQ6o1Dc39HZjDRhgpmJSctgp4xoPp0BvkLZJgektaCyni_XbjOqw7q7lXNAzEph7RD8W4fP_ZCFI6Lkqsjla3ADm34pReUlY7kdmk8lznlMngPgD5qiBVOl0DxW4MJfYkFsE6uB7xMLAz_JaIHGpecea"}
                        unoptimized
                    />
                    {/* Floating Overlay Label */}
                    {!selectedBase && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/20 backdrop-blur-[2px] transition-opacity duration-300">
                            <span className="material-symbols-outlined text-6xl text-tertiary mb-4 opacity-40" data-icon="restaurant">restaurant</span>
                            <span className="text-tertiary font-headline font-bold tracking-tight opacity-40 uppercase">Toque em uma base</span>
                        </div>
                    )}
                    {selectedBaseData && (
                        <div className="absolute bottom-4 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform translate-y-0">
                            <span className="text-tertiary font-headline font-bold tracking-tight uppercase text-sm">{selectedBaseData.title}</span>
                        </div>
                    )}
                </div>
                {/* Energy Meter (Floating Widget) */}
                <div className="absolute -right-4 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl z-20 border border-outline-variant/10">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold font-label uppercase tracking-tighter text-on-surface-variant">Energia</span>
                        <div className="w-2 h-24 bg-surface-container rounded-full relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-[100%] bg-[#FFB800] rounded-full"></div>
                        </div>
                        <span className="material-symbols-outlined text-[#FFB800]" data-icon="bolt" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8 flex flex-col md:flex-row items-center gap-4 justify-center">
                <span className="text-tertiary font-headline font-bold uppercase tracking-widest text-sm">Tamanho:</span>
                <div className="flex flex-wrap justify-center gap-2 bg-surface-container rounded-3xl p-1.5 border border-outline-variant/20 shadow-inner">
                    {sizes.map(size => (
                        <button
                            key={size.id}
                            onClick={() => setSelectedSize(size.id)}
                            className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${selectedSize === size.id ? 'bg-[#FFB800] text-[#3D0B37] shadow-md scale-105' : 'text-on-surface-variant hover:bg-white/50 hover:text-tertiary'}`}
                        >
                            {size.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {bases.map((base) => (
                    <BaseCard
                        key={base.id}
                        title={base.title}
                        description={base.description}
                        price={formatPrice(base.prices[selectedSize as keyof typeof base.prices])}
                        imageUrl={base.imageUrl}
                        imageAlt={base.imageAlt}
                        badge={base.badge}
                        imageBgClass={base.imageBgClass}
                        selected={selectedBase === base.id}
                        onClick={() => setSelectedBase(base.id)}
                    />
                ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-tertiary p-8 rounded-[32px] text-white">
                <div>
                    <h4 className="text-2xl font-headline font-bold mb-1">Tudo pronto?</h4>
                    <p className="text-white/60 font-medium">Agora vamos adicionar as coberturas!</p>
                </div>
                <button
                    onClick={onNext}
                    disabled={!selectedBase}
                    className={`w-full md:w-auto bg-inverse-primary text-on-primary-fixed px-10 py-4 rounded-full font-headline font-bold text-lg transition-transform duration-200 shadow-xl shadow-[#FFB800]/20 ${!selectedBase ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                    PRÓXIMO PASSO
                </button>
            </div>
        </div>
    );
}