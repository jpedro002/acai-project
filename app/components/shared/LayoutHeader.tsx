'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartModal from '../cart/CartModal';

export default function LayoutHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hasVisitedAdmin') === 'true') {
      setShowAdminMenu(true);
    }
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
          <span
            className="material-symbols-outlined text-[#3D0B37] hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setIsCartOpen(true)}
          >
            shopping_bag
          </span>
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

              {showAdminMenu && (
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
              )}
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
