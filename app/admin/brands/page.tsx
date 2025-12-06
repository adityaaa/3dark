// app/admin/brands/page.tsx
import { prisma } from "@/lib/db";
import BrandPricingForm from "@/components/admin/BrandPricingForm";

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  // Get all unique brands from products
  const products = await prisma.product.findMany({
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });

  const brands = products.map(p => p.brand).filter(Boolean);

  // Get existing brand pricing
  const brandPricings = await prisma.brandPricing.findMany({
    orderBy: { brand: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-wide">
          Brand Pricing Management
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Set size-specific pricing for each brand. All products of the same brand will use these prices.
        </p>
      </div>

      <BrandPricingForm brands={brands} existingPricing={brandPricings} />
    </div>
  );
}
