'use client';

import { useState } from 'react';

interface CouponInputProps {
    onApply: (coupon: string) => void;
}

export default function CouponInput({ onApply }: CouponInputProps) {
    const [coupon, setCoupon] = useState('');

    const handleApply = () => {
        if (coupon.trim()) {
            onApply(coupon);
            setCoupon('');
        }
    };

    return (
        <section className="mb-12">
            <div className="relative">
                <input
                    className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-inverse-primary transition-all font-medium placeholder:text-on-surface-variant/50"
                    placeholder="Tem um cupom?"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                />
                <button
                    onClick={handleApply}
                    className="absolute right-3 top-2 bottom-2 bg-tertiary text-white px-4 rounded-xl text-xs font-bold font-headline uppercase tracking-wider hover:opacity-90 transition-all"
                >
                    Aplicar
                </button>
            </div>
        </section>
    );
}
