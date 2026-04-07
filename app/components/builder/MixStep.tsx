"use client";

interface MixStepProps {
    selectedMix: string[];
    setSelectedMix: (mix: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function MixStep({ selectedMix, setSelectedMix, onNext, onBack }: MixStepProps) {
    const maxMix = 2;

    const mixItems = [
        { id: "creme-cookies", title: "CREME DE COOKIES" },
        { id: "doce-leite", title: "DOCE DE LEITE" },
        { id: "finni-bananinha", title: "FINNI BANANINHA" },
        { id: "mix-amendoin", title: "MIX AMENDOIN" },
        { id: "mix-canudinho", title: "MIX CANUDINHO" },
        { id: "mix-castanha", title: "MIX CASTANHA" },
        { id: "mix-cereja", title: "MIX CEREJA" },
        { id: "mix-chocobol", title: "MIX CHOCOBOL" },
        { id: "mix-chocobol-bol-g", title: "MIX CHOCOBOL BOL G" },
        { id: "mix-chocopower", title: "MIX CHOCOPOWER PRETO E BRANCO" },
        { id: "mix-gotas-chocolate", title: "MIX GOTAS DE CHOCOLATE" },
        { id: "mix-granola", title: "MIX GRANOLA" },
        { id: "mix-granulado-chocolate", title: "MIX GRANULADO CHOCOLATE" },
        { id: "mix-leite-em-po", title: "MIX LEITE EM PO" },
        { id: "mix-marshmelow", title: "MIX MARSHMELOW" },
        { id: "mix-mm", title: "MIX MM" },
        { id: "pasta-amendoin", title: "PASTA DE AMENDOIN" }
    ];

    const toggleMix = (mixId: string) => {
        if (selectedMix.includes(mixId)) {
            setSelectedMix(selectedMix.filter(id => id !== mixId));
        } else {
            if (selectedMix.length < maxMix) {
                setSelectedMix([...selectedMix, mixId]);
            }
        }
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-2">Passo 5 de 7</p>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha seu Mix</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Até {maxMix} opções ({selectedMix.length}/{maxMix})</div>
                </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-12 max-w-2xl">
                {mixItems.map((mixItem) => {
                    const isSelected = selectedMix.includes(mixItem.id);
                    return (
                        <label
                            key={mixItem.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${isSelected ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-surface-container hover:border-[#FFB800]/30 bg-surface-container-lowest'}`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleMix(mixItem.id)}
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
