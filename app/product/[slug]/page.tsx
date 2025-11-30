import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/storeProducts";
import ProductClient from "./product-client";
import Image from "next/image";

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
        <div className="relative h-80 rounded-3xl bg-black/70 border border-neon/40 shadow-glow overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>


        <ProductClient product={product} />
      </div>
    </div>
  );
}
