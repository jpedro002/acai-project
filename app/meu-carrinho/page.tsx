'use client';

import Cart from '@/app/components/cart/Cart';
import LayoutHeader from '@/app/components/shared/LayoutHeader';
import { useRouter } from 'next/navigation';

export default function MeuCarrinhoPage() {
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <>
            <LayoutHeader />
            <Cart onCheckout={handleCheckout} />
        </>
    );
}
