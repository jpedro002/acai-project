"use client";

import { useState, useEffect } from "react";
import builderData from "@/app/data/builder-data.json";
import { useConfigDoc } from "@/app/hooks/useConfigDoc";
import { useCatalog } from "@/app/hooks/useCatalog";
import { addCartItemAtom } from "@/app/state/cartAtoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import LayoutHeader from "../components/shared/LayoutHeader";
import BaseStep from "../components/builder/BaseStep";
import CreamsStep from "../components/builder/CreamsStep";
import FruitsStep from "../components/builder/FruitsStep";
import ToppingsStep from "../components/builder/ToppingsStep";
import MixStep from "../components/builder/MixStep";
import BoostStep from "../components/builder/BoostStep";

interface BaseCatalogItem {
    id: string;
    title: string;
    description: string;
    prices: Record<string, number>;
    imageUrl: string;
    imageAlt: string;
    badge?: string;
    imageBgClass?: string;
    type: string;
    sizeLimits?: Record<string, { creams?: number; fruits?: number; toppings?: number; mix?: number }>;
}

export default function BuilderPage() {
    const router = useRouter();
    const addCartItem = useSetAtom(addCartItemAtom);
    const [step, setStep] = useState(1);

    // Scroll para topo quando mudar de step
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [step]);

    // Base Step State
    const [selectedBase, setSelectedBase] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("500");

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

    const { data: builderConfig } = useConfigDoc("builder", {
        sizes: builderData.builder.sizes,
        limits: builderData.builder.limits,
    });

    // Fetch bases from Firestore to get sizeLimits
    const { items: catalogBases } = useCatalog<BaseCatalogItem>("base", builderData.builder.bases as unknown as BaseCatalogItem[]);

    /**
     * Resolve limits with fallback hierarchy:
     * 1. base.sizeLimits[selectedSize] (most specific)
     * 2. size.limits (from config)
     * 3. builder.limits (global default)
     */
    const getLimitsForSize = (sizeId: string, baseId: string | null) => {
        const globalDefaults = builderConfig.limits ?? builderData.builder.limits;

        // Try base-specific limits first
        if (baseId) {
            const baseData = catalogBases.find((b) => b.id === baseId);
            if (baseData?.sizeLimits?.[sizeId]) {
                return {
                    creams: baseData.sizeLimits[sizeId].creams ?? globalDefaults.creams,
                    fruits: baseData.sizeLimits[sizeId].fruits ?? globalDefaults.fruits,
                    toppings: baseData.sizeLimits[sizeId].toppings ?? globalDefaults.toppings,
                    mix: baseData.sizeLimits[sizeId].mix ?? globalDefaults.mix,
                };
            }
        }

        // Fallback to size limits
        const size = builderConfig.sizes?.find((item: { id: string; limits?: { creams: number; fruits: number; toppings: number; mix: number } }) => item.id === sizeId);
        return size?.limits ?? globalDefaults;
    };

    const selectedSizeLimits = getLimitsForSize(selectedSize, selectedBase);

    const handleSelectedSizeChange = (sizeId: string) => {
        const limits = getLimitsForSize(sizeId, selectedBase);
        setSelectedSize(sizeId);
        setSelectedCreams((prev) => prev.slice(0, limits.creams));
        setSelectedFruits((prev) => prev.slice(0, limits.fruits));
        setSelectedToppings((prev) => prev.slice(0, limits.toppings));
        setSelectedMix((prev) => prev.slice(0, limits.mix));
    };

    // When base changes, recalculate limits and trim selections
    const handleSelectedBaseChange = (baseId: string) => {
        setSelectedBase(baseId);
        const limits = getLimitsForSize(selectedSize, baseId);
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

    const handleFinishOrder = () => {
        if (!selectedBase) {
            alert("Escolha uma base antes de finalizar.");
            return;
        }

        const selectedBaseData = builderData.builder.bases.find((base) => base.id === selectedBase);

        if (!selectedBaseData) {
            alert("Não foi possível montar o item selecionado.");
            return;
        }

        const selectedSizeData = builderConfig.sizes.find((size: { id: string; label: string }) => size.id === selectedSize);
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

        const basePrice = selectedBaseData.prices[selectedSize as keyof typeof selectedBaseData.prices] ?? 0;
        const totalPrice = Number((basePrice + boostsTotal).toFixed(2));

        const flavorSections = [
            creams.length ? `Cremes: ${creams.join(', ')}` : null,
            fruits.length ? `Frutas: ${fruits.join(', ')}` : null,
            toppings.length ? `Coberturas: ${toppings.join(', ')}` : null,
            mix.length ? `Mix: ${mix.join(', ')}` : null,
        ].filter(Boolean);

        addCartItem({
            kind: "acai",
            name: `Açaí ${selectedSizeData?.label ?? selectedSize}`,
            flavor: flavorSections.join(" | ") || selectedBaseData.title,
            size: selectedSizeData?.label ?? selectedSize,
            price: totalPrice,
            image: selectedBaseData.imageUrl,
            selections: {
                baseId: selectedBaseData.id,
                baseTitle: selectedBaseData.title,
                creams,
                fruits,
                toppings,
                mix,
                boosts: boostItems,
                observations: observations.trim() || undefined,
            },
        });

        alert("Item adicionado ao carrinho com sucesso!");
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
                    <BaseStep
                        selectedBase={selectedBase}
                        setSelectedBase={handleSelectedBaseChange}
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
