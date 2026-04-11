"use client";

import { useState } from "react";
import { useCatalog } from "@/app/hooks/useCatalog";
import builderData from "@/app/data/builder-data.json";
import LimitReachedBanner from "./LimitReachedBanner";

interface MixStepProps {
    selectedMix: string[];
    setSelectedMix: (mix: string[]) => void;
    maxMix: number;
    onNext: () => void;
    onBack: () => void;
}

export default function MixStep({ selectedMix, setSelectedMix, maxMix, onNext, onBack }: MixStepProps) {
    const { items: mixItems } = useCatalog("mix", builderData.builder.mix);
    const [shakeId, setShakeId] = useState<string | null>(null);

    const isAtLimit = selectedMix.length >= maxMix;

    const toggleMix = (mixId: string) => {
        if (selectedMix.includes(mixId)) {
            setSelectedMix(selectedMix.filter(id => id !== mixId));
        } else {
            if (selectedMix.length < maxMix) {
                setSelectedMix([...selectedMix, mixId]);
            }
        }
    };

    const handleItemClick = (mixId: string) => {
        if (isAtLimit && !selectedMix.includes(mixId)) {
            setShakeId(mixId);
            setTimeout(() => setShakeId(null), 500);
            return;
        }
        toggleMix(mixId);
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-2">Passo 5 de 7</p>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha seu Mix</h2>
                    </div>
                    <div className={`font-body text-sm font-bold px-3 py-1.5 rounded-full transition-colors duration-300 ${isAtLimit ? 'bg-[#FFB800]/20 text-[#7C5800]' : 'text-on-surface-variant'}`}>
                        {selectedMix.length}/{maxMix}
                    </div>
                </div>
            </div>

            {/* Limit Reached Banner */}
            <LimitReachedBanner current={selectedMix.length} max={maxMix} label="mix" />

            {/* Options List */}
            <div className="space-y-3 mb-12 max-w-2xl">
                {mixItems.map((mixItem) => {
                    const isSelected = selectedMix.includes(mixItem.id);
                    const isDisabled = isAtLimit && !isSelected;
                    const isShaking = shakeId === mixItem.id;

                    return (
                        <label
                            key={mixItem.id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(mixItem.id);
                            }}
                            className={`
                                flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer
                                ${isSelected ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-surface-container hover:border-[#FFB800]/30 bg-surface-container-lowest'}
                                ${isDisabled ? 'opacity-40 grayscale-[0.3] cursor-not-allowed' : ''}
                                ${isShaking ? 'animate-shake' : ''}
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-5 h-5 rounded border-2 border-surface-container cursor-pointer accent-[#FFB800]"
                            />
                            <span className="text-sm font-semibold text-tertiary-container flex-1">{mixItem.title}</span>
                            {isSelected && (
                                <span className="material-symbols-outlined text-[#FFB800] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            )}
                        </label>
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
