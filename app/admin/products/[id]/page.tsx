// app/admin/products/[id]/page.tsx
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  // Fetch brand pricing to show/apply to this product
  const brandPricing = await prisma.brandPricing.findUnique({
    where: { brand: product.brand },
  });

  // Use brand pricing if available, otherwise use product's own pricing
  const sizePricingToUse = brandPricing?.sizePricing || product.sizePricing || "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-wide">
          Edit product
        </h1>
        {brandPricing && (
          <p className="text-xs text-green-400">
            ℹ️ This product uses brand-level pricing for "{product.brand}". Pricing is managed centrally at{" "}
            <a href="/admin/brands" className="underline hover:text-neon">Brand Pricing</a>.
          </p>
        )}
      </div>

      <ProductForm
        mode="edit"
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          tags: product.tags,
          sizes: product.sizes,
          image: product.image,
          gallery: product.gallery ?? "",
          sizePricing: sizePricingToUse,
        }}
      />
    </div>
  );
}
