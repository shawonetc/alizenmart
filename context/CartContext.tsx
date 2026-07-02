"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import Toast from "@/components/Toast";

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showToast: (message: string, image?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; image?: string }>({
    isVisible: false,
    message: "",
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string, image?: string) => {
    setToast({ isVisible: true, message, image });
  };

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const targetId = product.id || Date.now();
      const existingItem = prevCart.find((item) => item.id === targetId);
      const addQty = product.quantity || 1;
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === targetId ? { ...item, quantity: item.quantity + addQty } : item
        );
      }
      return [...prevCart, { ...product, quantity: addQty, id: targetId }];
    });

    // Track AddToCart in Meta Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: product.title,
        content_ids: [product.id?.toString() || ""],
        content_type: "product",
        value: product.price,
        currency: "BDT",
      });
    }

    showToast(`${product.title} কার্টে যোগ করা হয়েছে!`, product.image);
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId && item.title !== productId));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id === productId || item.title === productId) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        showToast,
      }}
    >
      {children}
      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        productImage={toast.image}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
