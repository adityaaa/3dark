import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing, getLowestPrice } from "@/lib/utils";
import ShopProductCard from "@/components/ShopProductCard";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  // Get all brand pricings
  const brandPricings = await prisma.brandPricing.findMany();
  
  // Create a map keyed by brand+category+ageGroup for quick lookup
  const brandPricingMap = new Map(
    brandPricings.map(bp => [`${bp.brand}:${bp.category}:${bp.ageGroup}`, bp.sizePricing])
  );
  
  // Map products and apply brand pricing
  const products = productsDb.map(p => {
    const product = mapProduct(p);
    const pricingKey = `${p.brand}:${p.category}:${p.ageGroup}`;
    const brandPricing = brandPricingMap.get(pricingKey);
    return applyBrandPricing(product, brandPricing || null);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-xs text-white/60">
          Glow-in-the-dark tees, imported and curated.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {products.map((p) => {
          const { price: displayPrice, mrp: displayMrp } = getLowestPrice(p);
          return (
            <ShopProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              brand={p.brand}
              image={p.image}
              images={p.images}
              price={displayPrice}
              mrp={displayMrp}
            />
          );
        })}
      </div>
    </div>
  );
}
