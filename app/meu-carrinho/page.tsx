'use client';

import Cart from '@/app/components/cart/Cart';
import LayoutHeader from '@/app/components/shared/LayoutHeader';
import { useState } from 'react';

export default function MeuCarrinhoPage() {
    const [cartItems] = useState([
        {
            id: '1',
            name: 'Tigela Energética',
            flavor: 'Morango e Mel',
            price: 32.9,
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuARJIWcgDoy275FWGdfi1crrghGSsaTXNdD3jL-KpstIh8TfWxtawE2KcNl8bmJNPmL2Qw8lgQ3BYtLCe3FwwDfN9nW5M45w5bdH29181kJZpi2qUIBgNxH_WnATe7er_C8uP8gcEiS15tGQpH1K0A6ha7Pt2NFy8IG0xRA1bVWmjsbiKA0nwtbmpmiLAWRExRQUYriEh3U0y_2XJmS74hCiBiKp3BPlUX3uSSX6W_2PUaZuxMuaTMkInQ1olFpU5ReBOwPih7CD5hr',
            quantity: 1,
        },
        {
            id: '2',
            name: 'Açaí Fresh Mint',
            flavor: 'Hortelã e Banana',
            price: 28.5,
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA9PgJk_ip0FA-jd0aZ-C-eDmCX_WlLudtpERshN8PCOBf6CNJVTd_8s7zOOd4b_ZkgpETnWLKJBpq8UBR9mCNLmnoOURmZn--Ce_bioT_EJ42f7zOn1Xugvt4AB0v6l5g1ejX3Y52I-OOpcSgiTKz1hoPuXu7yXiD7NeDapaSzICFNihM7o3F0eLzfXOMd9cYRBgwni7kymcZGg1O1xwQNZ1rykpNrF7yS1HGcMwp17SSERAaWkR48m3avkY6x0AOSEjEWyypMiozr',
            quantity: 1,
        },
    ]);

    const handleCheckout = () => {
        alert('Ir para pagamento');
        // Aqui você pode redirecionar para a página de pagamento
        // window.location.href = '/checkout';
    };

    return (
        <>
            <LayoutHeader />
            <Cart initialItems={cartItems} onCheckout={handleCheckout} />
        </>
    );
}
