'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { cartCountAtom } from '@/app/state/cartAtoms';
import CartModal from '../cart/CartModal';

export default function LayoutHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useAtomValue(cartCountAtom);

  useEffect(() => {
    // Hydration guard: cart count comes from localStorage, only known client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 h-16 shadow-none">
        <div className="flex items-center gap-4">
          <span
            className="material-symbols-outlined text-[#3D0B37] hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            menu
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#3D0B37] font-headline tracking-tighter">
          Point dos amigos
        </h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrinho"
          >
            <span className="material-symbols-outlined text-[#3D0B37] hover:scale-105 transition-transform cursor-pointer">
              shopping_bag
            </span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FFB800] text-[#271900] text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Menu Modal (Slide from left) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-64 sm:w-80 h-full bg-background shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto flex flex-col">
            <header className="flex justify-between items-center px-6 h-16 border-b border-outline-variant/10 bg-[#f9f9f9]">
              <span className="font-['Montserrat'] font-bold tracking-tight text-lg text-[#3D0B37]">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[#3D0B37]">
                  close
                </span>
              </button>
            </header>

            <nav className="flex flex-col flex-1 p-6 space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-on-surface hover:text-[#3D0B37] transition-colors p-2 rounded-lg hover:bg-surface-container-high"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined">home</span>
                <span className="font-semibold text-lg">Início</span>
              </Link>

              <Link
                href="/builder"
                className="flex items-center gap-3 text-on-surface hover:text-[#3D0B37] transition-colors p-2 rounded-lg hover:bg-surface-container-high"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined">icecream</span>
                <span className="font-semibold text-lg">Montar Açaí</span>
              </Link>

              <Link
                href="/gelato-builder"
                className="flex items-center gap-3 text-on-surface hover:text-[#3D0B37] transition-colors p-2 rounded-lg hover:bg-surface-container-high"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined">cruelty_free</span>
                <span className="font-semibold text-lg">Montar Gelato</span>
              </Link>

              <Link
                href="/meus-pedidos"
                className="flex items-center gap-3 text-on-surface hover:text-[#3D0B37] transition-colors p-2 rounded-lg hover:bg-surface-container-high"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined">receipt_long</span>
                <span className="font-semibold text-lg">Meus Pedidos</span>
              </Link>

              <div className="pt-4 mt-4 border-t border-outline-variant/20">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 text-secondary hover:text-[#3D0B37] transition-colors p-2 rounded-lg hover:bg-surface-container-high"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  <span className="font-semibold text-lg">Administração</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
