"use client";

import { useState } from "react";
import { useCatalog } from "@/app/hooks/useCatalog";
import builderData from "@/app/data/builder-data.json";
import Image from "next/image";
import LimitReachedBanner from "./LimitReachedBanner";

interface CreamsStepProps {
    selectedCreams: string[];
    setSelectedCreams: (creams: string[]) => void;
    maxCreams: number;
    onNext: () => void;
    onBack: () => void;
}

export default function CreamsStep({ selectedCreams, setSelectedCreams, maxCreams, onNext, onBack }: CreamsStepProps) {
    const { items: creams } = useCatalog("cream", builderData.builder.creams);
    const [shakeId, setShakeId] = useState<string | null>(null);

    const isAtLimit = selectedCreams.length >= maxCreams;

    const toggleCream = (creamId: string) => {
        if (selectedCreams.includes(creamId)) {
            setSelectedCreams(selectedCreams.filter(id => id !== creamId));
        } else {
            if (selectedCreams.length < maxCreams) {
                setSelectedCreams([...selectedCreams, creamId]);
            }
        }
    };

    const handleCardClick = (creamId: string) => {
        if (isAtLimit && !selectedCreams.includes(creamId)) {
            // Trigger shake animation
            setShakeId(creamId);
            setTimeout(() => setShakeId(null), 500);
            return;
        }
        toggleCream(creamId);
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha seus Cremes</h2>
                    </div>
                    <div className={`font-body text-sm font-bold px-3 py-1.5 rounded-full transition-colors duration-300 ${isAtLimit ? 'bg-[#FFB800]/20 text-[#7C5800]' : 'text-on-surface-variant'}`}>
                        {selectedCreams.length}/{maxCreams}
                    </div>
                </div>
            </div>

            {/* Limit Reached Banner */}
            <LimitReachedBanner current={selectedCreams.length} max={maxCreams} label="cremes" />

            {/* Asymmetric Hero Accent (Organic Texture) */}
            <div className="absolute -z-10 top-40 right-0 opacity-[0.04] pointer-events-none">
                <svg fill="none" height="400" viewBox="0 0 200 200" width="400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="#3D0B37"></path>
                </svg>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {creams.map((cream) => {
                    const isSelected = selectedCreams.includes(cream.id);
                    const isDisabled = isAtLimit && !isSelected;
                    const isShaking = shakeId === cream.id;

                    return (
                        <div
                            key={cream.id}
                            onClick={() => handleCardClick(cream.id)}
                            className={`
                                group relative bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_32px_rgba(61,11,55,0.04)] border-2 transition-all cursor-pointer
                                ${cream.isFeatured ? 'md:col-span-2' : ''}
                                ${isSelected ? 'border-[#FFB800]' : 'border-transparent hover:border-[#FFB800]/20'}
                                ${isDisabled ? 'opacity-40 grayscale-[0.3] cursor-not-allowed' : ''}
                                ${isShaking ? 'animate-shake' : ''}
                            `}
                        >
                            <div className={`flex ${cream.isFeatured ? 'flex-col md:flex-row gap-6' : 'flex-col'}`}>
                                <div className={`${cream.isFeatured ? 'aspect-[16/9] md:w-1/2' : 'aspect-[4/3]'} rounded-xl overflow-hidden mb-4 relative`}>
                                    <Image
                                        fill
                                        src={cream.imageUrl}
                                        alt={cream.imageAlt}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className={`flex justify-between items-center ${cream.isFeatured ? 'flex-col justify-center flex-1 pr-4' : ''}`}>
                                    <div className={cream.isFeatured ? 'flex justify-between items-start w-full' : ''}>
                                        <div>
                                            <h3 className={`${cream.isFeatured ? 'text-xl' : ''} font-bold text-tertiary tracking-tight`}>{cream.title}</h3>
                                            <p className={`text-xs text-on-surface-variant font-medium ${cream.isFeatured ? 'mt-1' : ''}`}>{cream.description}</p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#FFB800]' : isDisabled ? 'border-2 border-surface-container opacity-50' : 'border-2 border-surface-container group-hover:border-[#FFB800]'}`}>
                                            <span className={`material-symbols-outlined transition-transform ${isSelected ? 'text-[#271900] scale-100' : 'text-[#FFB800] scale-0 group-hover:scale-100'}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>check</span>
                                        </div>
                                    </div>
                                    {cream.isFeatured && (
                                        <div className="mt-4 flex gap-2">
                                            <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold px-2 py-1 rounded uppercase tracking-wider">Favorito da Casa</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isSelected && !cream.isFeatured && (
                                <div className="absolute top-6 right-6 bg-[#FFB800] text-[#271900] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Selecionado</div>
                            )}
                            {isSelected && cream.isFeatured && (
                                <div className="absolute top-6 right-6 bg-[#FFB800] text-[#271900] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Selecionado</div>
                            )}
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
                    VOLTAR
                </button>
                <button
                    onClick={onNext}
                    className="w-full md:w-auto bg-inverse-primary text-on-primary-fixed px-10 py-4 rounded-full font-headline font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl shadow-[#FFB800]/20"
                >
                    PRÓXIMO PASSO
                </button>
            </div>
        </div>
    );
}