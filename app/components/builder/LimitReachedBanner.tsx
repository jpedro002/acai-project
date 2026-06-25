"use client";

import { useEffect, useState } from "react";

interface LimitReachedBannerProps {
    current: number;
    max: number;
    label: string;
}

export default function LimitReachedBanner({ current, max, label }: LimitReachedBannerProps) {
    const isAtLimit = current >= max;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isAtLimit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShow(true);
        } else {
            // small delay to let exit transition play if needed
            const timeout = setTimeout(() => setShow(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isAtLimit]);

    if (!show) return null;

    return (
        <div
            className={`
                flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6
                bg-gradient-to-r from-[#FFB800]/15 via-[#FFB800]/10 to-[#FFB800]/5
                border border-[#FFB800]/30
                backdrop-blur-sm
                transition-all duration-300
                ${isAtLimit ? 'animate-slide-down opacity-100' : 'opacity-0 translate-y-[-8px]'}
            `}
            role="status"
            aria-live="polite"
        >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFB800]/20 shrink-0">
                <span
                    className="material-symbols-outlined text-[#B27F00] text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    info
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#7C5800] leading-tight">
                    Limite de {label} atingido!
                </p>
                <p className="text-xs text-[#7C5800]/70 mt-0.5 leading-snug">
                    Remova uma opção selecionada para escolher outra. ({current}/{max})
                </p>
            </div>
            <div className="shrink-0 flex items-center gap-1 bg-[#FFB800]/20 px-3 py-1.5 rounded-full">
                <span className="text-xs font-black text-[#7C5800] tracking-wide">{current}/{max}</span>
            </div>
        </div>
    );
}
