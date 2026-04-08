"use client";

import builderData from "@/app/data/builder-data.json";
import { useConfigDoc } from "@/app/hooks/useConfigDoc";

interface GelatoBaseStepProps {
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    onNext: () => void;
}

export default function GelatoBaseStep({
    selectedSize,
    setSelectedSize,
    onNext
}: GelatoBaseStepProps) {
    const { data: gelatoConfig } = useConfigDoc("gelatoBuilder", builderData.gelatoBuilder);
    const options = gelatoConfig.sizes;

    return (
        <div className="relative z-10 flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-surface pb-24">
            {/* Minimal Header (Back-to-Main Exception) */}
            <div className="flex items-center p-4 justify-between sticky top-0 bg-surface/80 backdrop-blur-[20px] z-20">
                <button aria-label="Voltar" className="flex size-12 shrink-0 items-center text-on-surface hover:text-tertiary-container transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>arrow_back</span>
                </button>
                <h2 className="text-on-surface text-lg font-headline font-bold leading-tight flex-1 text-center pr-12">O Tamanho da Fome</h2>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 p-6 flex-1 pt-0">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`relative flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 ambient-shadow cursor-pointer transition-transform hover:scale-[1.02] ${selectedSize === option.value
                            ? "border-2 border-inverse-primary"
                            : "ghost-border hover:border-outline-variant/40"
                            }`}
                        onClick={() => setSelectedSize(option.value)}
                    >
                        <input
                            checked={selectedSize === option.value}
                            className="absolute opacity-0 w-0 h-0"
                            name="bowl_size"
                            type="radio"
                            value={option.value}
                            onChange={() => setSelectedSize(option.value)}
                        />
                        <div className="flex justify-between items-start">
                            <h3 className="text-on-surface font-headline font-bold text-2xl">{option.title}</h3>
                            <span className="text-tertiary-container font-headline font-bold text-lg">{option.price}</span>
                        </div>
                        <p className="text-on-surface-variant text-sm font-body leading-relaxed mt-4">
                            {option.descriptionLines.map((line: string) => (
                                <span key={line} className="block">{line}</span>
                            ))}
                        </p>
                        {selectedSize === option.value && (
                            <div className="absolute top-4 right-4 text-inverse-primary">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                        )}
                    </label>
                ))}
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent pt-12 flex justify-center z-20 max-w-md mx-auto">
                <button
                    className="w-full flex items-center justify-center rounded-full h-14 bg-inverse-primary text-on-primary-fixed font-headline font-bold text-base tracking-[0.015em] transition-transform hover:scale-105 ambient-shadow"
                    onClick={onNext}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}