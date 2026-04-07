"use client";

import { useState } from "react";
import Link from "next/link";
import LayoutHeader from "../components/shared/LayoutHeader";
import BaseStep from "../components/builder/BaseStep";
import CreamsStep from "../components/builder/CreamsStep";
import FruitsStep from "../components/builder/FruitsStep";
import ToppingsStep from "../components/builder/ToppingsStep";
import MixStep from "../components/builder/MixStep";
import BoostStep from "../components/builder/BoostStep";

export default function BuilderPage() {
    const [step, setStep] = useState(1);

    // Base Step State
    const [selectedBase, setSelectedBase] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("500");

    // Creams Step State
    const [selectedCreams, setSelectedCreams] = useState<string[]>([]);

    // Fruits Step State
    const [selectedFruits, setSelectedFruits] = useState<string[]>([]);

    // Toppings Step State
    const [selectedTopping, setSelectedTopping] = useState<string | null>(null);

    // Mix Step State
    const [selectedMix, setSelectedMix] = useState<string[]>([]);

    // Boost Step State
    const [boostItems, setBoostItems] = useState<Record<string, number>>({});
    const [observations, setObservations] = useState<string>("");

    return (
        <div className="bg-background font-body text-on-surface antialiased overflow-x-hidden min-h-screen">
            <LayoutHeader />

            <main className="pt-24 pb-32 px-4 max-w-5xl mx-auto min-h-screen">
                {/* Progress Bar */}
                <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-2 rounded-full transition-colors ${step >= s ? 'bg-tertiary-container' : 'bg-surface-variant'}`}
                        ></div>
                    ))}
                </div>

                {step === 1 && (
                    <BaseStep
                        selectedBase={selectedBase}
                        setSelectedBase={setSelectedBase}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <CreamsStep
                        selectedCreams={selectedCreams}
                        setSelectedCreams={setSelectedCreams}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <FruitsStep
                        selectedFruits={selectedFruits}
                        setSelectedFruits={setSelectedFruits}
                        onNext={() => setStep(4)}
                        onBack={() => setStep(2)}
                    />
                )}

                {step === 4 && (
                    <ToppingsStep
                        selectedTopping={selectedTopping}
                        setSelectedTopping={setSelectedTopping}
                        onNext={() => setStep(5)}
                        onBack={() => setStep(3)}
                    />
                )}

                {step === 5 && (
                    <MixStep
                        selectedMix={selectedMix}
                        setSelectedMix={setSelectedMix}
                        onNext={() => setStep(6)}
                        onBack={() => setStep(4)}
                    />
                )}

                {step === 6 && (
                    <BoostStep
                        boostItems={boostItems}
                        setBoostItems={setBoostItems}
                        observations={observations}
                        setObservations={setObservations}
                        onNext={() => alert("Pedido finalizado com sucesso!")}
                        onBack={() => setStep(5)}
                    />
                )}
            </main>
        </div>
    );
}
