import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductClient from "./product-client";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-black/70 border border-neon/40 shadow-glow h-80 flex items-center justify-center">
          <span className="text-xs text-white/60">
            {product.name} image preview / glow simulation
          </span>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductClient product={product} />
        </Suspense>
      </div>
    </div>
  );
}
