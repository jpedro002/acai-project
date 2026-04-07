'use client';

import { useState } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponInput from './CouponInput';

export interface CartItemType {
    id: string;
    name: string;
    flavor: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartProps {
    initialItems?: CartItemType[];
    onCheckout?: () => void;
    onClose?: () => void;
    className?: string; // Add className for styling overrides
}

export default function Cart({
    initialItems = [],
    onCheckout,
    onClose,
    className = "pt-24 px-6 max-w-2xl mx-auto pb-32", // Default styling
}: CartProps) {
    const [items, setItems] = useState<CartItemType[]>(initialItems);
    const [discount, setDiscount] = useState(0);

    const handleQuantityChange = (itemId: string, quantity: number) => {
        setItems(
            items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (itemId: string) => {
        setItems(items.filter((item) => item.id !== itemId));
    };

    const handleApplyCoupon = (coupon: string) => {
        // Aqui você pode adicionar a lógica de validação de cupom
        console.log('Cupom aplicado:', coupon);
        // Por exemplo, se coupon === 'DESCONTO10', aplicar 10% de desconto
        if (coupon.toUpperCase() === 'DESCONTO10') {
            setDiscount(subtotal * 0.1);
        }
    };

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

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
                        id={item.id}
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
