'use client';

import { useState } from 'react';

interface CartItemProps {
    id: string;
    name: string;
    flavor: string;
    price: number;
    image: string;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartItem({
    id,
    name,
    flavor,
    price,
    image,
    quantity,
    onQuantityChange,
    onRemove,
}: CartItemProps) {
    const handleIncrease = () => {
        onQuantityChange(quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <div className="bg-surface-container-lowest rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-6 items-center shadow-[0_8px_32px_rgba(61,11,55,0.04)] hover:scale-[1.02] transition-transform duration-300">
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-surface-container">
                <img
                    alt={name}
                    className="w-full h-full object-cover"
                    src={image}
                />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-headline text-base sm:text-lg text-tertiary leading-tight truncate pr-2">
                        {name}
                    </h3>
                    <button
                        onClick={onRemove}
                        className="text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
                <p className="text-[10px] sm:text-xs text-on-secondary-container bg-secondary-container/30 px-2 py-1 rounded-full inline-block mt-1 font-medium italic truncate max-w-full">
                    {flavor}
                </p>
                <div className="flex flex-wrap justify-between items-center sm:items-end mt-2 sm:mt-4 gap-2">
                    <span className="font-headline text-[#3D0B37] text-base sm:text-lg">
                        R$ {price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-4 bg-surface-container-high px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                        <button
                            onClick={handleDecrease}
                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-tertiary hover:scale-110 active:scale-90 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">remove</span>
                        </button>
                        <span className="font-bold text-xs sm:text-sm min-w-[1.5ch] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrease}
                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-tertiary hover:scale-110 active:scale-90 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
