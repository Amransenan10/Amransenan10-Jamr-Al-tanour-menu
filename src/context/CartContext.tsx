"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type OrderType = 'pickup' | 'delivery' | null;

export interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    options?: any[]; // For future use if options are added
}

export interface Branch {
    id: string;
    name: string;
}

interface CartContextType {
    cartItems: CartItem[];
    selectedBranch: Branch | null;
    orderType: OrderType;
    addToCart: (product: { id: string; name: string; price: number; image: string }) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    setBranch: (branch: Branch | null) => void;
    setOrderType: (type: OrderType) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const BRANCHES: Branch[] = [
    { id: 'suwaidi-west', name: 'فرع السويدي الغربي' },
    { id: 'tuwaiq', name: 'فرع حي طويق' },
];

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [orderType, setOrderType] = useState<OrderType>(null);

    // Initial load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        const savedBranch = localStorage.getItem('selectedBranch');
        const savedOrderType = localStorage.getItem('orderType');

        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedBranch) {
            const branch = JSON.parse(savedBranch);
            // Verify branch still exists in our constants
            if (BRANCHES.some(b => b.id === branch.id)) {
                setSelectedBranch(branch);
            }
        }
        if (savedOrderType) setOrderType(savedOrderType as OrderType);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (selectedBranch) {
            localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));
        } else {
            localStorage.removeItem('selectedBranch');
        }
    }, [selectedBranch]);

    useEffect(() => {
        if (orderType) {
            localStorage.setItem('orderType', orderType);
        } else {
            localStorage.removeItem('orderType');
        }
    }, [orderType]);

    const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
        if (!selectedBranch) {
            console.error("No branch selected");
            return;
        }

        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item => item.product_id === product.id);

            if (existingItemIndex > -1) {
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += 1;
                return newCart;
            }

            return [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            selectedBranch,
            orderType,
            addToCart,
            removeFromCart,
            updateQuantity,
            setBranch: setSelectedBranch,
            setOrderType,
            clearCart,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
