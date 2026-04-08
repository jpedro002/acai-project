"use client";

import { useCatalog } from "@/app/hooks/useCatalog";
import builderData from "@/app/data/builder-data.json";
import Image from "next/image";

interface FruitsStepProps {
    selectedFruits: string[];
    setSelectedFruits: (fruits: string[]) => void;
    maxFruits: number;
    onNext: () => void;
    onBack: () => void;
}

export default function FruitsStep({ selectedFruits, setSelectedFruits, maxFruits, onNext, onBack }: FruitsStepProps) {
    const { items: fruits } = useCatalog("fruit", builderData.builder.fruits);

    const toggleFruit = (fruitId: string) => {
        if (selectedFruits.includes(fruitId)) {
            setSelectedFruits(selectedFruits.filter(id => id !== fruitId));
        } else {
            if (selectedFruits.length < maxFruits) {
                setSelectedFruits([...selectedFruits, fruitId]);
            }
        }
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha suas Frutas</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Até {maxFruits} opções ({selectedFruits.length}/{maxFruits})</div>
                </div>
            </div>

            {/* Options List */}
            <div className="space-y-6 mb-12">
                {fruits.map((fruit) => {
                    const isSelected = selectedFruits.includes(fruit.id);
                    return (
                        <div
                            key={fruit.id}
                            onClick={() => toggleFruit(fruit.id)}
                            className={`relative group cursor-pointer active:scale-95 transition-transform duration-200 editorial-shadow rounded-xl overflow-hidden bg-surface-container-lowest ${isSelected ? 'ring-2 ring-inverse-primary' : ''}`}
                        >
                            <div className="aspect-[16/7] w-full overflow-hidden relative">
                                <Image
                                    fill
                                    src={fruit.imageUrl}
                                    alt={fruit.imageAlt}
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
                                <h3 className="font-headline font-bold text-xl text-tertiary-container tracking-tight">{fruit.title}</h3>
                                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{fruit.description}</p>
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
