import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/storeProducts";
import ProductClient from "./product-client";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const productDb = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!productDb) return notFound();

  const product = mapProduct(productDb);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-black/70 border border-neon/40 shadow-glow h-80 flex items-center justify-center">
          <span className="text-xs text-white/60">
            {product.name} glow preview (placeholder)
          </span>
        </div>

        <ProductClient product={product} />
      </div>
    </div>
  );
}
