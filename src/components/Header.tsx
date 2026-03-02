"use client";

import React from 'react';
import { ShoppingCart, Search, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const { selectedBranch, cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between mx-auto max-w-7xl lg:px-8 mt-2 rounded-2xl shadow-lg border-b-0 md:mt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0">
                    <span className="text-white font-bold text-xl md:text-2xl">ج</span>
                </div>
                <div>
                    <h1 className="text-lg md:text-xl font-bold leading-tight">جمر التنور</h1>
                    {selectedBranch ? (
                        <div className="flex items-center gap-1 text-primary">
                            <MapPin size={10} />
                            <span className="text-[10px] md:text-xs font-bold">{selectedBranch.name}</span>
                        </div>
                    ) : (
                        <p className="text-[10px] md:text-xs text-foreground/60 leading-none">طعم الأصالة في كل لقمة</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2.5 rounded-xl hover:bg-foreground/5 transition-colors">
                    <Search size={22} className="text-foreground/70" />
                </button>
                <button className="relative p-2.5 md:px-5 bg-primary text-white rounded-xl shadow-md shadow-primary/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
                    <ShoppingCart size={22} />
                    <span className="hidden md:inline font-bold text-sm">السلة</span>
                    <span className="absolute -top-1 -right-1 bg-secondary text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary md:static md:bg-white/20 md:border-0 md:w-6 md:h-6">
                        {cartCount}
                    </span>
                </button>
            </div>
        </header>
    );
}
