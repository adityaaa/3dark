"use client";

import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-xs text-white/60 uppercase tracking-wide mt-1">
          {product.brand} • Glow {product.glowLevel}/5
        </p>
      </div>

      <p className="text-sm text-white/80">{product.description}</p>

      <div className="flex gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full border px-3 py-1 text-xs ${
              s === size
                ? "border-neon bg-neon text-black"
                : "border-white/20 text-white/70 hover:border-neon/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => addItem(product, size)}
          className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-95"
        >
          Add to cart – ₹{product.price}
        </button>
      </div>

      <p className="text-[11px] text-white/50 mt-2">
        Tip: Charge in bright light for 10–15 minutes. Glow lasts up to 6 hours
        depending on pigment strength.
      </p>
    </div>
  );
}
