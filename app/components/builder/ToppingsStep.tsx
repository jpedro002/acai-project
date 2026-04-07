"use client";

import { useCatalog } from "@/app/hooks/useCatalog";
import Image from "next/image";

interface ToppingsStepProps {
    selectedTopping: string | null;
    setSelectedTopping: (topping: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function ToppingsStep({ selectedTopping, setSelectedTopping, onNext, onBack }: ToppingsStepProps) {
    const { items: toppings, loading } = useCatalog("topping");

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-2">Passo 4 de 7</p>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha sua Cobertura</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Escolha até 1 item</div>
                </div>
            </div>

            {/* Options List */}
            <div className="space-y-6 mb-12">
                {toppings.map((topping) => {
                    const isSelected = selectedTopping === topping.id;
                    return (
                        <div
                            key={topping.id}
                            onClick={() => setSelectedTopping(topping.id)}
                            className={`relative group cursor-pointer active:scale-95 transition-transform duration-200 editorial-shadow rounded-xl overflow-hidden bg-surface-container-lowest ${isSelected ? 'ring-2 ring-inverse-primary' : ''}`}
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
        </div>
    );
}
