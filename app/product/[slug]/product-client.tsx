// app/product/[slug]/product-client.tsx

"use client";

import Image from "next/image";
import type { StoreProduct } from "@/lib/types";
import { useCart } from "@/components/CartContext";
import SizeGuide from "@/components/SizeGuide";
import { useState } from "react";

export default function ProductClient({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const isFreeSize = product.sizes.length === 1 && (product.sizes[0] === "Free Size" || product.sizes[0] === "One Size");
  const [size, setSize] = useState(isFreeSize ? product.sizes[0] : (product.sizes[0] || "Free"));
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = product.images[activeIndex] || product.image;

  // Get size-specific pricing or fall back to base pricing
  const selectedPricing = product.sizePricing?.[size] || {
    price: product.price,
    mrp: product.mrp
  };

  function handleAddToCart() {
    addItem(product, size);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* LEFT: gallery */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative h-80 md:h-[500px] w-full rounded-3xl bg-black/70 border border-neon/40 shadow-glow overflow-hidden">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-4"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {product.images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-xl border overflow-hidden bg-black/70 transition-all ${
                  idx === activeIndex
                    ? "border-neon shadow-glow ring-2 ring-neon/30"
                    : "border-white/20 hover:border-neon/50 hover:scale-105"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
                {idx === activeIndex && (
                  <div className="absolute inset-0 bg-neon/10" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Image counter */}
        {product.images.length > 1 && (
          <p className="text-xs text-center text-white/50">
            {activeIndex + 1} / {product.images.length}
          </p>
        )}
      </div>

      {/* RIGHT: details */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {product.name}
          </h1>
          <p className="text-xs text-white/60 uppercase tracking-wide mt-1">
            {product.brand}
          </p>
        </div>

        <p className="text-sm text-white/80">{product.description}</p>

        {/* Show size selector only if NOT free size */}
        {!isFreeSize && product.sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/60">
                Select Size {product.ageGroup === 'kids' && '(Age)'}
              </p>
              <SizeGuide category={product.category} ageGroup={product.ageGroup} />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
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
          </div>
        )}

        {/* Show Free Size badge if applicable */}
        {isFreeSize && (
          <div className="mt-3">
            <span className="inline-block rounded-full bg-neon/20 border border-neon/40 px-3 py-1 text-xs font-medium text-neon">
              Free Size / One Size
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4">
          <div className="text-lg font-semibold">
            ₹{selectedPricing.price}
            {selectedPricing.mrp > selectedPricing.price && (
              <span className="ml-2 text-sm text-white/50 line-through">
                ₹{selectedPricing.mrp}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-95"
          >
            Add to cart – ₹{selectedPricing.price}
          </button>
        </div>

        <p className="text-[11px] text-white/50 mt-3">
          Charge under bright light for 10–15 minutes. Glow duration depends on
          pigment strength and environment.
        </p>
      </div>
    </div>
  );
}
