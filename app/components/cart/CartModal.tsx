'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cart from './Cart';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const router = useRouter();

    // Prevent scrolling on the body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="relative w-full max-w-md h-full bg-background shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                <header className="flex items-center px-6 h-16 w-full sticky top-0 z-50 bg-[#f9f9f9] no-border tonal-shift bg-surface-container-low shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform"
                        >
                            <span className="material-symbols-outlined text-[#3D0B37]">
                                close
                            </span>
                        </button>
                        <h1 className="font-['Montserrat'] font-bold tracking-tight text-lg text-[#3D0B37]">
                            Meu Carrinho
                        </h1>
                    </div>
                </header>

                {/* Renderiza o Cart sem padding excessivo no topo já que o header subiu */}
                <div className="relative h-full flex flex-col">
                    <Cart
                        className="pt-6 px-6 max-w-2xl mx-auto pb-32 flex-1"
                        onCheckout={() => {
                            onClose();
                            router.push('/checkout');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
