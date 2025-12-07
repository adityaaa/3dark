import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing } from "@/lib/utils";
import ProductClient from "./product-client";
import ProductReviews from "@/components/ProductReviews";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const productDb = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!productDb) return notFound();

  // Get brand pricing if available for this product's brand+category+ageGroup
  const brandPricing = await prisma.brandPricing.findFirst({
    where: {
      brand: productDb.brand,
      category: productDb.category,
      ageGroup: productDb.ageGroup,
    },
  });

  let product = mapProduct(productDb);
  if (brandPricing) {
    product = applyBrandPricing(product, brandPricing.sizePricing);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ProductClient product={product} />
      
      {/* Product Reviews Section */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
