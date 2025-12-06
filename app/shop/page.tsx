import Link from "next/link";
import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing, getLowestPrice } from "@/lib/utils";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  // Get all brand pricings
  const brandPricings = await prisma.brandPricing.findMany();
  const brandPricingMap = new Map(brandPricings.map(bp => [bp.brand, bp.sizePricing]));
  
  // Map products and apply brand pricing
  const products = productsDb.map(p => {
    const product = mapProduct(p);
    const brandPricing = brandPricingMap.get(p.brand);
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
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group rounded-2xl bg-bg-soft/80 p-3 border border-white/5 hover:border-neon/40 hover:shadow-glow transition"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-black/60">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain"
                />
              </div>


              <div className="mt-3 flex flex-col gap-1">
                <span className="text-sm font-medium group-hover:text-neon">
                  {p.name}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-white/40">
                  {p.brand}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">₹{displayPrice}</span>
                  <span className="text-[11px] line-through text-white/40">
                    ₹{displayMrp}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
