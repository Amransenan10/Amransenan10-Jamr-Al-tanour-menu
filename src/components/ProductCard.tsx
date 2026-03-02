"use client";

import React from 'react';
import { Plus, Flame, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    calories?: number;
    category: string;
    description?: string;
}

export default function ProductCard({ id, name, price, image, calories, category, description }: ProductCardProps) {
    const { addToCart, selectedBranch } = useCart();

    const handleAddToCart = () => {
        if (!selectedBranch) {
            // You could add a toast here if available
            alert("يرجى اختيار الفرع أولاً من أعلى الصفحة");
            return;
        }

        if (!id) {
            console.error("Product ID is missing for:", name);
            return;
        }

        addToCart({ id, name, price, image });
    };

    return (
        <div className={`group relative bg-card rounded-[2.5rem] p-3 shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up border border-border/50 overflow-hidden ${!selectedBranch ? 'opacity-90' : ''}`}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-foreground/5">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {calories && (
                        <div className="glass px-2 py-1 rounded-full flex items-center gap-1">
                            <Flame size={12} className="text-primary" />
                            <span className="text-[10px] font-bold">{calories} سعرة</span>
                        </div>
                    )}
                    {!selectedBranch && (
                        <div className="bg-primary/90 text-white px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
                            <AlertCircle size={12} />
                            <span className="text-[8px] font-black uppercase">اختر الفرع</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mt-4 px-2 pb-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{category}</span>
                <h3 className="text-lg font-bold mt-0.5 line-clamp-1">{name}</h3>
                {description && (
                    <p className="text-[10px] text-foreground/50 mt-1 line-clamp-2 min-h-[2.5rem] leading-tight">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/50 font-medium">السعر</span>
                        <span className="text-xl font-black text-foreground">
                            {price} <span className="text-xs font-bold text-primary">ر.س</span>
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90
                            ${selectedBranch
                                ? 'bg-foreground text-background hover:bg-primary hover:text-white'
                                : 'bg-foreground/20 text-foreground/40 cursor-not-allowed'}
                        `}
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
