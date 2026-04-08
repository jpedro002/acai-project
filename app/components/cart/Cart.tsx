'use client';

import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    cartItemsAtom,
    cartSubtotalAtom,
    removeCartItemAtom,
    updateCartItemQuantityAtom,
} from '@/app/state/cartAtoms';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponInput from './CouponInput';

interface CartProps {
    onCheckout?: () => void;
    className?: string;
}

export default function Cart({
    onCheckout,
    className = "pt-24 px-6 max-w-2xl mx-auto pb-32",
}: CartProps) {
    const items = useAtomValue(cartItemsAtom);
    const subtotal = useAtomValue(cartSubtotalAtom);
    const updateCartItemQuantity = useSetAtom(updateCartItemQuantityAtom);
    const removeCartItem = useSetAtom(removeCartItemAtom);
    const [discount, setDiscount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleQuantityChange = (itemId: string, quantity: number) => {
        updateCartItemQuantity({ id: itemId, quantity });
    };

    const handleRemoveItem = (itemId: string) => {
        removeCartItem(itemId);
    };

    const handleApplyCoupon = (coupon: string) => {
        if (coupon.toUpperCase() === 'DESCONTO10') {
            setDiscount(subtotal * 0.1);
        } else {
            setDiscount(0);
        }
    };

    // To prevent hydration mismatch with atomWithStorage
    if (!mounted) return null;

    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <main className={`flex flex-col items-center justify-center min-h-screen ${className}`}>
                <span className="material-symbols-outlined text-6xl text-tertiary mb-4">
                    shopping_cart
                </span>
                <h2 className="font-headline text-2xl text-tertiary mb-2">
                    Seu carrinho está vazio
                </h2>
                <p className="text-on-surface-variant font-medium text-center">
                    Comece a adicionar seus açaís favoritos!
                </p>
            </main>
        );
    }

    return (
        <main className={className}>
            {/* Message */}
            <div className="mb-10 text-left">
                <h2 className="font-headline text-3xl text-tertiary mb-2 leading-tight">
                    Quase lá!
                </h2>
                <p className="text-on-surface-variant font-medium">
                    Só mais um clique para seu açaí.
                </p>
            </div>

            {/* Cart Items List */}
            <section className="space-y-8 mb-12">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        flavor={item.flavor}
                        price={item.price}
                        image={item.image}
                        quantity={item.quantity}
                        onQuantityChange={(quantity) =>
                            handleQuantityChange(item.id, quantity)
                        }
                        onRemove={() => handleRemoveItem(item.id)}
                    />
                ))}
            </section>

            {/* Coupon */}
            <CouponInput onApply={handleApplyCoupon} />

            {/* Order Summary */}
            <CartSummary subtotal={subtotal} deliveryFee={0} discount={discount} />

            {/* Main Action CTA */}
            <button
                onClick={onCheckout}
                className="w-full bg-[#FFB800] text-[#271900] py-5 rounded-full font-headline text-lg font-extrabold shadow-[0_12px_24px_rgba(255,184,0,0.25)] hover:scale-[1.03] active:scale-95 transition-all mb-8"
            >
                Finalizar Pedido
            </button>
        </main>
    );
}
