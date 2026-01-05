import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing, getLowestPrice } from "@/lib/utils";
import ShopProductCard from "@/components/ShopProductCard";

export const dynamic = 'force-dynamic';

interface SearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

export default async function ShopPage({
  searchParams,
}: Readonly<{
  searchParams: SearchParams;
}>) {
  const { search, category, brand, minPrice, maxPrice, sortBy } = searchParams;

  // Build where clause based on filters
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }
  
  if (category) where.category = category;
  if (brand) where.brand = brand;
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number.parseInt(minPrice, 10);
    if (maxPrice) where.price.lte = Number.parseInt(maxPrice, 10);
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: "desc" }; // default
  if (sortBy === "price-asc") orderBy = { price: "asc" };
  if (sortBy === "price-desc") orderBy = { price: "desc" };
  if (sortBy === "name") orderBy = { name: "asc" };

  const productsDb = await prisma.product.findMany({
    where,
    orderBy,
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {search ? `Search: "${search}"` : "Shop"}
          </h1>
          {search && (
            <p className="text-sm text-white/60 mt-1">
              Found {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>
        <p className="text-xs md:text-sm text-white/60">
          Glow-in-the-dark tees, imported and curated.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/60 mb-4">No products found</p>
          {search && (
            <p className="text-sm text-white/40">
              Try different search terms or{" "}
              <a href="/shop" className="text-neon hover:underline">
                browse all products
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      )}
    </div>
  );
}
