"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import BranchSelector from "@/components/BranchSelector";
import { ShoppingBasket, Truck, Store, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  base_price: number;
  image_url: string;
  category_id: string;
  category_name?: string;
  calories?: number;
  description?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { cartItems, cartTotal, selectedBranch, orderType, setOrderType, clearCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('display_order');

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        setFetchError(`خطأ في الأقسام: ${categoriesError.message}`);
      } else if (categoriesData) {
        setCategories(categoriesData);
      }

      // Fetch Products with category names
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          base_price, 
          image_url, 
          category_id,
          description,
          categories(name)
        `)
        .eq('is_available', true);

      if (productsError) {
        console.error("Error fetching products:", productsError);
        setFetchError(prev => prev ? `${prev} | خطأ في المنتجات: ${productsError.message}` : `خطأ في المنتجات: ${productsError.message}`);
      } else if (productsData) {
        const mappedProducts = productsData.map((p: any) => ({
          ...p,
          category_name: p.categories?.name
        }));
        setProducts(mappedProducts);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const filteredProducts = activeCategoryId
    ? products.filter(p => p.category_id === activeCategoryId)
    : products;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("السلة فارغة! أضف بعض المنتجات أولاً.");
      return;
    }
    if (!selectedBranch) {
      alert("يرجى اختيار الفرع أولاً.");
      return;
    }
    if (!orderType) {
      alert("يرجى اختيار نوع الطلب (توصيل أو استلام).");
      return;
    }

    // Proceed to actual checkout (not implemented yet in this step, but validated)
    alert(`شكراً لطلبك! جارٍ معالجة طلبك لفرع ${selectedBranch.name} بنظام ${orderType === 'delivery' ? 'التوصيل' : 'الاستلام'}`);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto pb-40 px-4 sm:px-6 lg:px-8">
        <CategoryBar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
        />

        <BranchSelector />

        {fetchError && (
          <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-center">
            <p className="text-red-500 font-bold mb-2">تنبيه: فشل الاتصال بقاعدة البيانات</p>
            <p className="text-red-500/70 text-xs dir-ltr">{fetchError}</p>
            <p className="mt-4 text-xs text-foreground/40 font-bold">تأكد من إضافة Environment Variables في Vercel بشكل صحيح</p>
          </div>
        )}

        <div className="mt-2 text-right">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/40 space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-sm">جاري التنور وقلي الأفكار... 🔥</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-3xl font-black flex items-center gap-3">
                  {activeCategoryId
                    ? categories.find(c => c.id === activeCategoryId)?.name
                    : "الأكثر طلباً 🔥"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline text-xs font-bold text-foreground/30 uppercase tracking-widest">المجموع</span>
                  <button className="text-xs font-bold text-foreground/50 bg-foreground/5 px-4 py-1.5 rounded-full uppercase tracking-tighter">
                    {filteredProducts.length} صنف
                  </button>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.base_price}
                      category={product.category_name || ""}
                      calories={product.calories}
                      image={product.image_url || "/placeholder-food.jpg"}
                      description={product.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-foreground/40 bg-foreground/5 rounded-[3rem] border-2 border-dashed border-foreground/5">
                  <p className="font-bold text-lg italic">لا توجد أصناف في هذا القسم حالياً.. انتظرنا قريباً! 👋</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Checkout Button or Order Type Selector */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-40 max-w-lg mx-auto md:max-w-xl lg:max-w-2xl">
        {isCartOpen && cartItems.length > 0 ? (
          <div className="bg-card p-6 rounded-[2.5rem] shadow-2xl border-2 border-primary/20 mb-4 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">تفاصيل الطلب</h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-foreground/5 rounded-full hover:bg-foreground/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl">
                <span className="font-bold">الفرع المختار:</span>
                <span className="text-primary font-black">{selectedBranch?.name || "لم يتم الاختيار"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${orderType === 'pickup' ? 'border-primary bg-primary/5' : 'border-transparent bg-foreground/5'}`}
                >
                  <Store className={orderType === 'pickup' ? 'text-primary' : 'text-foreground/40'} />
                  <span className={`text-sm font-bold ${orderType === 'pickup' ? 'text-primary' : 'text-foreground/60'}`}>استلام</span>
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${orderType === 'delivery' ? 'border-primary bg-primary/5' : 'border-transparent bg-foreground/5'}`}
                >
                  <Truck className={orderType === 'delivery' ? 'text-primary' : 'text-foreground/40'} />
                  <span className={`text-sm font-bold ${orderType === 'delivery' ? 'text-primary' : 'text-foreground/60'}`}>توصيل</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:scale-[1.02] transform transition-all active:scale-95"
            >
              تأكيد الطلب | {cartTotal.toFixed(2)} ر.س
            </button>
          </div>
        ) : (
          <button
            onClick={() => cartItems.length > 0 ? setIsCartOpen(true) : alert("السلة فارغة")}
            className="w-full bg-foreground text-background py-5 rounded-[2.5rem] font-black text-lg shadow-2xl shadow-black/40 flex items-center justify-between px-10 hover:scale-[1.02] transform transition-all active:scale-95 border-2 border-white/5 ring-4 ring-black/5"
          >
            <span className="flex items-center gap-2">
              عرض السلة <ShoppingBasket size={24} />
            </span>
            <div className="flex items-center gap-4">
              {cartItems.length > 0 && (
                <span className="bg-primary px-3 py-1 rounded-full text-white text-xs font-black">
                  {cartItems.length}
                </span>
              )}
              <span className="text-2xl font-black tracking-tighter">
                {cartTotal.toFixed(2)} <span className="text-[10px]">ر.س</span>
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
