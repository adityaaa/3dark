// app/admin/brands/page.tsx
import { prisma } from "@/lib/db";
import BrandPricingForm from "@/components/admin/BrandPricingForm";

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  // Get all brands from Brand table
  const brandRecords = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  const brands = brandRecords.map(b => b.name);

  // Get existing brand pricing (all category+ageGroup combinations)
  const brandPricings = await prisma.brandPricing.findMany({
    orderBy: [
      { brand: 'asc' },
      { category: 'asc' },
      { ageGroup: 'asc' },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-wide">
          Brand Pricing Management
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Set category and age-specific pricing for each brand. All products matching brand + category + age group will use these prices.
        </p>
      </div>

      <BrandPricingForm brands={brands} existingPricing={brandPricings} />

      {/* Show existing pricing summary */}
      {brandPricings.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Existing Pricing Configurations</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {brandPricings.map((bp) => (
              <div key={bp.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-white">{bp.brand}</span>
                  <span className="text-xs text-white/60">•</span>
                  <span className="text-sm text-white/70 capitalize">{bp.category}</span>
                  <span className="text-xs text-white/60">•</span>
                  <span className="text-sm text-white/70 capitalize">{bp.ageGroup}</span>
                </div>
                <div className="text-xs text-green-400">
                  {bp.sizePricing ? `${Object.keys(JSON.parse(bp.sizePricing)).length} sizes configured` : 'No pricing set'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
