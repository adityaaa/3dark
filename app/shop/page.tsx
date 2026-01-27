import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing, getLowestPrice } from "@/lib/utils";
import ShopProductCard from "@/components/ShopProductCard";
import FilterDrawer from "@/components/FilterDrawer";

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
  const isSqlite = process.env.DATABASE_URL?.startsWith("file:");

  // Build where clause based on filters
  const where: any = {};
  
  if (search) {
    const containsFilter = (value: string) =>
      isSqlite
        ? { contains: value }
        : { contains: value, mode: "insensitive" as const };

    where.OR = [
      { name: containsFilter(search) },
      { description: containsFilter(search) },
      { brand: containsFilter(search) },
      { category: containsFilter(search) },
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

  // Get unique categories and brands for filters
  const allProducts = await prisma.product.findMany();
  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort((a, b) => a.localeCompare(b));
  const brandsSet = Array.from(new Set(allProducts.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));
  
  // Get price range
  const prices = allProducts.map((p) => p.price);
  const minPriceValue = Math.min(...prices);
  const maxPriceValue = Math.max(...prices);

  // Determine product count text
  const productCountText = search 
    ? `Found ${products.length} ${products.length === 1 ? "product" : "products"}`
    : "Glow-in-the-dark tees, imported and curated.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {search ? `Search: "${search}"` : "Shop"}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {productCountText}
          </p>
        </div>
        
        {/* Filter Button */}
        <FilterDrawer
          categories={categories}
          brands={brandsSet}
          minPrice={minPriceValue}
          maxPrice={maxPriceValue}
        />
      </div>

      {/* Active Filters Display */}
      {(category || brand || minPrice || maxPrice || sortBy) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-white/60">Active filters:</span>
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon/20 border border-neon/40 text-xs text-neon">
              {category}
              <a
                href={`/shop?${new URLSearchParams({ ...searchParams, category: "" }).toString().replace("category=&", "").replace("category=", "")}`}
                className="hover:text-white"
              >
                ×
              </a>
            </span>
          )}
          {brand && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon/20 border border-neon/40 text-xs text-neon">
              {brand}
              <a
                href={`/shop?${new URLSearchParams({ ...searchParams, brand: "" }).toString().replace("brand=&", "").replace("brand=", "")}`}
                className="hover:text-white"
              >
                ×
              </a>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon/20 border border-neon/40 text-xs text-neon">
              ₹{minPrice || minPriceValue} - ₹{maxPrice || maxPriceValue}
              <a
                href={`/shop?${new URLSearchParams({ ...searchParams, minPrice: "", maxPrice: "" }).toString().replaceAll(/minPrice=&|maxPrice=&|minPrice=|maxPrice=/g, "")}`}
                className="hover:text-white"
              >
                ×
              </a>
            </span>
          )}
          <a
            href="/shop"
            className="text-xs text-white/60 hover:text-neon transition-colors underline"
          >
            Clear all
          </a>
        </div>
      )}

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
