import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing } from "@/lib/utils";
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

  // Get brand pricing if available
  const brandPricing = await prisma.brandPricing.findUnique({
    where: { brand: productDb.brand },
  });

  let product = mapProduct(productDb);
  if (brandPricing) {
    product = applyBrandPricing(product, brandPricing.sizePricing);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ProductClient product={product} />
    </div>
  );
}
