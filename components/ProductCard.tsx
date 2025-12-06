// components/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import type { StoreProduct } from "@/lib/types";

export default function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-3xl border border-white/10 bg-black/60 p-3 md:p-4 flex flex-col gap-3 hover:border-neon/70 hover:shadow-glow transition-all"
    >
      {/* IMAGE BLOCK */}
      <div className="relative w-full h-72 md:h-80 rounded-2xl bg-black/80 overflow-hidden border border-white/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>

      {/* TEXT BLOCK */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm md:text-base font-semibold line-clamp-1">
            {product.name}
          </h3>
          <span className="text-[10px] md:text-xs uppercase text-white/60">
            {product.brand}
          </span>
        </div>

        <p className="text-[11px] md:text-xs text-white/60 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base md:text-lg font-bold text-neon">
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-white/40 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
