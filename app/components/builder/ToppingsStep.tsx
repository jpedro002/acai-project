"use client";

import { useState } from "react";
import { useCatalog } from "@/app/hooks/useCatalog";
import builderData from "@/app/data/builder-data.json";
import Image from "next/image";
import LimitReachedBanner from "./LimitReachedBanner";

interface ToppingsStepProps {
    selectedToppings: string[];
    setSelectedToppings: (toppings: string[]) => void;
    maxToppings: number;
    onNext: () => void;
    onBack: () => void;
}

export default function ToppingsStep({ selectedToppings, setSelectedToppings, maxToppings, onNext, onBack }: ToppingsStepProps) {
    const { items: toppings } = useCatalog("topping", builderData.builder.toppings);
    const [shakeId, setShakeId] = useState<string | null>(null);

    const isAtLimit = selectedToppings.length >= maxToppings;

    const toggleTopping = (toppingId: string) => {
        if (selectedToppings.includes(toppingId)) {
            setSelectedToppings(selectedToppings.filter(id => id !== toppingId));
            return;
        }

        if (selectedToppings.length < maxToppings) {
            setSelectedToppings([...selectedToppings, toppingId]);
        }
    };

    const handleCardClick = (toppingId: string) => {
        if (isAtLimit && !selectedToppings.includes(toppingId)) {
            setShakeId(toppingId);
            setTimeout(() => setShakeId(null), 500);
            return;
        }
        toggleTopping(toppingId);
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-2">Passo 4 de 7</p>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha sua Cobertura</h2>
                    </div>
                    <div className={`font-body text-sm font-bold px-3 py-1.5 rounded-full transition-colors duration-300 ${isAtLimit ? 'bg-[#FFB800]/20 text-[#7C5800]' : 'text-on-surface-variant'}`}>
                        {selectedToppings.length}/{maxToppings}
                    </div>
                </div>
            </div>

            {/* Limit Reached Banner */}
            <LimitReachedBanner current={selectedToppings.length} max={maxToppings} label="coberturas" />

            {/* Options List */}
            <div className="space-y-6 mb-12">
                {toppings.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    const isDisabled = isAtLimit && !isSelected;
                    const isShaking = shakeId === topping.id;

                    return (
                        <div
                            key={topping.id}
                            onClick={() => handleCardClick(topping.id)}
                            className={`
                                relative group cursor-pointer active:scale-95 transition-transform duration-200 editorial-shadow rounded-xl overflow-hidden bg-surface-container-lowest
                                ${isSelected ? 'ring-2 ring-inverse-primary' : ''}
                                ${isDisabled ? 'opacity-40 grayscale-[0.3] cursor-not-allowed' : ''}
                                ${isShaking ? 'animate-shake' : ''}
                            `}
                        >
                            <div className="aspect-[16/7] w-full overflow-hidden relative">
                                <Image
                                    fill
                                    src={topping.imageUrl}
                                    alt={topping.imageAlt || topping.title}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? '' : 'opacity-90 group-hover:scale-105'}`}
                                    unoptimized
                                />
                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-inverse-primary text-on-primary-fixed p-1.5 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="font-headline font-bold text-xl text-tertiary-container tracking-tight">{topping.title}</h3>
                                {topping.description && <p className="text-on-surface-variant mt-2">{topping.description}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-tertiary p-8 rounded-[32px] text-white">
                <button
                    onClick={onBack}
                    className="w-full md:w-auto bg-transparent border-2 border-white/20 text-white px-10 py-4 rounded-full font-headline font-bold text-lg hover:bg-white/10 transition-colors duration-200"
                >
                    Voltar
                </button>

                <div className="flex flex-col md:items-end text-center md:text-right w-full md:w-auto">
                    <button
                        onClick={onNext}
                        className="w-full md:w-auto bg-[#FFB800] text-[#3D0B37] px-12 py-4 rounded-full font-headline font-black text-xl hover:bg-[#FFD15C] transition-colors duration-200 shadow-[0_8px_24px_rgba(255,184,0,0.4)] hover:shadow-[0_12px_32px_rgba(255,184,0,0.6)]"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}
