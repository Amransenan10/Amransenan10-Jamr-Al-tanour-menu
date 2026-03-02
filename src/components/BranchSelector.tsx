"use client";

import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { useCart, BRANCHES, Branch } from '@/context/CartContext';

export default function BranchSelector() {
    const { selectedBranch, setBranch } = useCart();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-6">
            <div className="bg-card rounded-[2rem] p-4 md:p-6 shadow-sm border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">اختيار الفرع</h2>
                        <p className="text-xs text-foreground/50">يجب اختيار الفرع قبل البدء بالطلب</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BRANCHES.map((branch) => {
                        const isSelected = selectedBranch?.id === branch.id;
                        return (
                            <button
                                key={branch.id}
                                onClick={() => setBranch(branch)}
                                className={`
                                    relative flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all duration-300
                                    ${isSelected
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-transparent bg-foreground/5 hover:bg-foreground/10'}
                                `}
                            >
                                <span className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground/70'}`}>
                                    {branch.name}
                                </span>
                                {isSelected && (
                                    <div className="bg-primary text-white p-1 rounded-full">
                                        <Check size={12} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {!selectedBranch && (
                    <div className="mt-4 flex items-center gap-2 text-primary animate-pulse">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <p className="text-xs font-bold">يرجى اختيار فرعك المفضل للمتابعة..</p>
                    </div>
                )}
            </div>
        </div>
    );
}
