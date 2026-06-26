"use client";
import { useCatalog } from "@/app/hooks/useCatalog";
import builderData from "@/app/data/builder-data.json";

interface BoostStepProps {
    boostItems: Record<string, number>;
    setBoostItems: (items: Record<string, number>) => void;
    observations: string;
    setObservations: (obs: string) => void;
    onNext: () => void;
    onBack: () => void;
}
export default function BoostStep({ boostItems, setBoostItems, observations, setObservations, onNext, onBack }: BoostStepProps) {
    const handleIncrement = (id: string) => {
        setBoostItems({ ...boostItems, [id]: (boostItems[id] || 0) + 1 });
    };
    const { items } = useCatalog("boost", builderData.builder.boosts);

    const handleDecrement = (id: string) => {
        if (boostItems[id] > 0) {
            setBoostItems({ ...boostItems, [id]: boostItems[id] - 1 });
        }
    };

    return (
        <div className="w-full flex flex-col min-h-[60vh] pb-32">
            <div className="mt-8 mb-6">
                <h2 className="text-3xl font-black text-tertiary tracking-tight mb-2">Turbinar meu Pedido</h2>
                <p className="text-on-surface-variant font-body text-sm font-medium">Adicione extras gostosos e envie observações.</p>
            </div>

            <div className="flex flex-col gap-4 py-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-[0_32px_48px_rgba(26,28,28,0.04)]">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                                style={{ backgroundImage: `url("${item.image}")` }}
                                aria-label={item.alt}>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-on-surface text-base font-headline font-bold leading-normal line-clamp-1">{item.name}</p>
                                <p className="text-on-surface-variant text-sm font-medium leading-normal line-clamp-2 mt-0.5">+ R$ {item.price.toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-on-surface">
                                <button onClick={() => handleDecrement(item.id)} className="text-base font-headline font-bold leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high cursor-pointer hover:scale-105 hover:bg-surface-variant transition-all">-</button>
                                <span className="text-base font-medium leading-normal w-6 text-center font-headline">{boostItems[item.id] || 0}</span>
                                <button onClick={() => handleIncrement(item.id)} className="text-base font-headline font-bold leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high cursor-pointer hover:scale-105 hover:bg-surface-variant transition-all">+</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <label className="block text-on-surface font-headline font-bold mb-3 text-lg">Observações do Pedido</label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ex: Tirar o morango, colocar extra leite condensado..."
                    className="w-full h-32 p-4 rounded-xl bg-surface-container-lowest border border-surface-container focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] resize-none text-on-surface placeholder:text-surface-variant"
                ></textarea>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-5xl mx-auto bg-surface/80 backdrop-blur-[20px] pb-8 pt-4 px-6 shadow-[0_-8px_32px_rgba(26,28,28,0.04)] z-50 flex gap-4 md:gap-8 justify-between items-center">
                <button
                    onClick={onBack}
                    className="whitespace-nowrap bg-transparent text-tertiary px-6 py-4 rounded-full font-headline font-bold text-sm tracking-wide uppercase hover:bg-surface-container transition-colors duration-200"
                >
                    Voltar
                </button>
                <div className="flex flex-col w-full">
                    <button
                        onClick={onNext}
                        className="w-full bg-[#FFB800] text-[#3D0B37] rounded-full py-4 px-6 font-headline font-bold text-sm tracking-wide uppercase hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(255,184,0,0.4)] transition-all"
                    >
                        Concluir Pedido
                    </button>
                </div>
            </div>
        </div>
    );
}
