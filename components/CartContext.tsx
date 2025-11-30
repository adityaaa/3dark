"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { StoreProduct } from "@/lib/storeProducts";

export type CartItem = {
  product: StoreProduct;
  size: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: StoreProduct, size: string, qty?: number) => void;
  removeItem: (productId: number, size: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: StoreProduct, size: string, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { product, size, qty }];
    });
  }

  function removeItem(productId: number, size: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.qty,
    0
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
