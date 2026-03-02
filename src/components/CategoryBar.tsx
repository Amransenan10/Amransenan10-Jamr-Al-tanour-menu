"use client";

import React from 'react';

interface Category {
    id: string;
    name: string;
}

interface CategoryBarProps {
    categories: Category[];
    activeCategoryId: string | null;
    onCategoryChange: (id: string | null) => void;
}

export default function CategoryBar({ categories, activeCategoryId, onCategoryChange }: CategoryBarProps) {
    return (
        <div className="pt-24 pb-4 overflow-hidden max-w-7xl mx-auto md:pt-32">
            <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar snap-x rtl:flex-row-reverse text-right lg:justify-center lg:flex-wrap">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`
            flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 snap-center
            ${activeCategoryId === null
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                            : 'bg-card text-foreground/70 hover:bg-foreground/5'}
          `}
                >
                    <span className="text-lg">🍽️</span>
                    <span className="font-medium text-sm">الكل</span>
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 snap-center
              ${activeCategoryId === category.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                : 'bg-card text-foreground/70 hover:bg-foreground/5'}
            `}
                    >
                        <span className="font-medium text-sm">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

