"use client";

import { useState, useEffect } from "react";
import builderData from "@/app/data/builder-data.json";
import { useConfigDoc } from "@/app/hooks/useConfigDoc";
import { addCartItemAtom } from "@/app/state/cartAtoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LayoutHeader from "../components/shared/LayoutHeader";
import GelatoBaseStep from "../components/builder/GelatoBaseStep";
import CreamsStep from "../components/builder/CreamsStep";
import FruitsStep from "../components/builder/FruitsStep";
import ToppingsStep from "../components/builder/ToppingsStep";
import MixStep from "../components/builder/MixStep";
import BoostStep from "../components/builder/BoostStep";

export default function GelatoBuilderPage() {
    const router = useRouter();
    const addCartItem = useSetAtom(addCartItemAtom);
    const [step, setStep] = useState(1);

    // Scroll para topo quando mudar de step
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [step]);

    // Base Step State
    const [selectedSize, setSelectedSize] = useState<string>("P");

    // Creams Step State
    const [selectedCreams, setSelectedCreams] = useState<string[]>([]);

    // Fruits Step State
    const [selectedFruits, setSelectedFruits] = useState<string[]>([]);

    // Toppings Step State
    const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

    // Mix Step State
    const [selectedMix, setSelectedMix] = useState<string[]>([]);

    // Boost Step State
    const [boostItems, setBoostItems] = useState<Record<string, number>>({});
    const [observations, setObservations] = useState<string>("");

    const { data: gelatoConfig } = useConfigDoc("gelatoBuilder", builderData.gelatoBuilder);

    const getLimitsForSize = (sizeId: string) => {
        const selectedOption = gelatoConfig.sizes?.find((item: { value: string; limits?: { creams: number; fruits: number; toppings: number; mix: number } }) => item.value === sizeId);
        return selectedOption?.limits ?? { creams: 2, fruits: 1, toppings: 1, mix: 2 };
    };

    const selectedSizeLimits = getLimitsForSize(selectedSize);

    const handleSelectedSizeChange = (sizeId: string) => {
        const limits = getLimitsForSize(sizeId);
        setSelectedSize(sizeId);
        setSelectedCreams((prev) => prev.slice(0, limits.creams));
        setSelectedFruits((prev) => prev.slice(0, limits.fruits));
        setSelectedToppings((prev) => prev.slice(0, limits.toppings));
        setSelectedMix((prev) => prev.slice(0, limits.mix));
    };

    const getTitlesByIds = (
        ids: string[],
        source: Array<{ id: string; title?: string; name?: string }>
    ) => {
        return ids
            .map((id) => source.find((item) => item.id === id))
            .filter(Boolean)
            .map((item) => item?.title ?? item?.name ?? "")
            .filter((value) => value.length > 0);
    };

    const parseBRLPrice = (value: string) => {
        const normalized = value.replace(/[^\d,]/g, "").replace(",", ".");
        const parsed = Number(normalized);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const handleFinishOrder = () => {
        const selectedSizeData = gelatoConfig.sizes.find((size: { value: string; title: string; price: string }) => size.value === selectedSize);
        if (!selectedSizeData) {
            toast.error("Escolha um tamanho antes de finalizar.");
            return;
        }

        const creams = getTitlesByIds(selectedCreams, builderData.builder.creams);
        const fruits = getTitlesByIds(selectedFruits, builderData.builder.fruits);
        const toppings = getTitlesByIds(selectedToppings, builderData.builder.toppings);
        const mix = getTitlesByIds(selectedMix, builderData.builder.mix);

        const boostsTotal = Object.entries(boostItems).reduce((sum, [boostId, quantity]) => {
            const boost = builderData.builder.boosts.find((item) => item.id === boostId);
            if (!boost) {
                return sum;
            }

            return sum + boost.price * quantity;
        }, 0);

        const basePrice = parseBRLPrice(selectedSizeData.price);
        const totalPrice = Number((basePrice + boostsTotal).toFixed(2));

        const flavorSections = [
            creams.length ? `Sabores: ${creams.join(', ')}` : null,
            fruits.length ? `Frutas: ${fruits.join(', ')}` : null,
            toppings.length ? `Coberturas: ${toppings.join(', ')}` : null,
            mix.length ? `Mix: ${mix.join(', ')}` : null,
        ].filter(Boolean);

        const firstCreamImage = builderData.builder.creams.find((item) => selectedCreams.includes(item.id))?.imageUrl;

        addCartItem({
            kind: "gelato",
            name: selectedSizeData.title,
            flavor: flavorSections.join(" | ") || "Gelato personalizado",
            size: selectedSizeData.value,
            price: totalPrice,
            image: firstCreamImage ?? builderData.builder.bases[0].imageUrl,
            selections: {
                creams,
                fruits,
                toppings,
                mix,
                boosts: boostItems,
                observations: observations.trim() || undefined,
            },
        });

        toast.success("Item adicionado ao carrinho!");
        router.push("/meu-carrinho");
    };

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
                    <GelatoBaseStep
                        selectedSize={selectedSize}
                        setSelectedSize={handleSelectedSizeChange}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <CreamsStep
                        selectedCreams={selectedCreams}
                        setSelectedCreams={setSelectedCreams}
                        maxCreams={selectedSizeLimits.creams}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <FruitsStep
                        selectedFruits={selectedFruits}
                        setSelectedFruits={setSelectedFruits}
                        maxFruits={selectedSizeLimits.fruits}
                        onNext={() => setStep(4)}
                        onBack={() => setStep(2)}
                    />
                )}

                {step === 4 && (
                    <ToppingsStep
                        selectedToppings={selectedToppings}
                        setSelectedToppings={setSelectedToppings}
                        maxToppings={selectedSizeLimits.toppings}
                        onNext={() => setStep(5)}
                        onBack={() => setStep(3)}
                    />
                )}

                {step === 5 && (
                    <MixStep
                        selectedMix={selectedMix}
                        setSelectedMix={setSelectedMix}
                        maxMix={selectedSizeLimits.mix}
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
                        onNext={handleFinishOrder}
                        onBack={() => setStep(5)}
                    />
                )}
            </main>
        </div>
    );
}