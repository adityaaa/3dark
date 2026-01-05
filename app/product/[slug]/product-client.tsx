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
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
      {/* LEFT: gallery */}
      <div className="space-y-3 sm:space-y-4">
        {/* Main image */}
        <div className="relative h-72 sm:h-80 md:h-96 lg:h-[500px] w-full rounded-2xl sm:rounded-3xl bg-black/70 border border-neon/40 shadow-glow overflow-hidden touch-manipulation">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-3 sm:p-4"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin -webkit-overflow-scrolling-touch">
            {product.images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg sm:rounded-xl border overflow-hidden bg-black/70 transition-all snap-center touch-manipulation ${
                  idx === activeIndex
                    ? "border-neon shadow-glow ring-2 ring-neon/30"
                    : "border-white/20 hover:border-neon/50 active:scale-95"
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
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            {product.name}
          </h1>
          <p className="text-xs text-white/60 uppercase tracking-wide mt-1">
            {product.brand}
          </p>
        </div>

        <p className="text-sm text-white/80">{product.description}</p>

        {/* Show size selector only if NOT free size */}
        {!isFreeSize && product.sizes.length > 0 && (
          <div className="mt-2 sm:mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white/90">
                Select Size {product.ageGroup === 'kids' && '(Age)'}
              </p>
              <SizeGuide category={product.category} ageGroup={product.ageGroup} />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-lg sm:rounded-full border px-4 py-2.5 sm:px-4 sm:py-2 text-sm font-medium min-w-[60px] sm:min-w-0 min-h-[44px] sm:min-h-0 touch-manipulation transition-all ${
                    s === size
                      ? "border-neon bg-neon text-black shadow-md"
                      : "border-white/20 text-white/70 hover:border-neon/50 active:scale-95"
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
          <div className="mt-2 sm:mt-3">
            <span className="inline-block rounded-lg sm:rounded-full bg-neon/20 border border-neon/40 px-4 py-2 text-sm font-medium text-neon">
              Free Size / One Size
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 sm:mt-4">
          <div className="text-xl sm:text-2xl font-bold">
            ₹{selectedPricing.price}
            {selectedPricing.mrp > selectedPricing.price && (
              <span className="ml-2 text-base sm:text-lg text-white/50 line-through">
                ₹{selectedPricing.mrp}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 sticky bottom-4 sm:static">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto rounded-xl sm:rounded-full bg-neon px-6 py-4 sm:px-6 sm:py-3 text-base font-bold text-black shadow-lg shadow-neon/50 hover:shadow-xl hover:brightness-95 active:scale-[0.98] transition-all min-h-[52px] touch-manipulation"
          >
            Add to cart – ₹{selectedPricing.price}
          </button>
        </div>

        <p className="text-xs sm:text-[11px] text-white/50 mt-3 leading-relaxed">
          Charge under bright light for 10–15 minutes. Glow duration depends on
          pigment strength and environment.
        </p>
      </div>
    </div>
  );
}
