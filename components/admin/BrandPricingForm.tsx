"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { BrandPricing } from "@prisma/client";
import type { ProductCategory, AgeGroup } from "@/lib/types";
import { getDefaultSizes } from "@/lib/utils";

type BrandPricingFormProps = {
  readonly brands: readonly string[];
  readonly existingPricing: readonly BrandPricing[];
};

type SizePricing = Record<string, { price: number; mrp: number }>;

export default function BrandPricingForm({ brands, existingPricing }: BrandPricingFormProps) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || "");
  const [category, setCategory] = useState<ProductCategory>("tshirt");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [sizes, setSizes] = useState(getDefaultSizes("adult"));
  const [isFreeSize, setIsFreeSize] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [sizePricing, setSizePricing] = useState<SizePricing>({});

  // Load existing pricing for selected brand+category+ageGroup
  const existingBrandPricing = existingPricing.find(
    bp => bp.brand === selectedBrand && bp.category === category && bp.ageGroup === ageGroup
  );

  // Auto-populate sizes when ageGroup changes (unless Free Size is selected)
  useEffect(() => {
    if (!isFreeSize) {
      setSizes(getDefaultSizes(ageGroup));
    }
  }, [ageGroup, isFreeSize]);

  // Load pricing when brand/category/ageGroup changes
  useEffect(() => {
    const brandData = existingPricing.find(
      bp => bp.brand === selectedBrand && bp.category === category && bp.ageGroup === ageGroup
    );
    
    if (brandData?.sizePricing) {
      try {
        const parsed = JSON.parse(brandData.sizePricing);
        setSizePricing(parsed);
        
        // Extract sizes from pricing
        const sizeList = Object.keys(parsed);
        if (sizeList.length > 0) {
          setSizes(sizeList.join(", "));
        }
      } catch {
        setSizePricing({});
      }
    } else {
      setSizePricing({});
    }
  }, [selectedBrand, category, ageGroup, existingPricing]);

  const handleSavePricing = async () => {
    if (!selectedBrand) {
      setError("Please select a brand");
      return;
    }

    // Validate that at least one size has pricing
    const hasPricing = Object.keys(sizePricing).some(
      size => sizePricing[size]?.price > 0
    );

    if (!hasPricing) {
      setError("Please set pricing for at least one size");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/brands/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: selectedBrand,
          category,
          ageGroup,
          sizePricing: JSON.stringify(sizePricing),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save brand pricing");
      }

      setSuccess(`✓ Pricing saved for ${selectedBrand} (${category}, ${ageGroup}). All matching products will use these prices.`);
      setTimeout(() => setSuccess(null), 5000);
      router.refresh();
    } catch (err: any) {
      console.error("Brand pricing error:", err);
      setError(err.message || "Failed to save pricing");
    } finally {
      setIsSaving(false);
    }
  };

  const sizeList = sizes.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Brand Selection */}
      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <label htmlFor="brand-select" className="text-sm font-medium text-white/90">Select Brand</label>
        <select
          id="brand-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-neon focus:outline-none"
        >
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        {existingBrandPricing && (
          <p className="mt-2 text-xs text-green-400">
            ✓ This combination has existing pricing configured
          </p>
        )}
      </div>

      {/* Category + Age Group Selection */}
      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <p className="text-sm font-medium text-white/90 mb-3">Product Type</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="category-select" className="text-xs text-white/70">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white focus:border-neon focus:outline-none"
            >
              <option value="tshirt">T-Shirt</option>
              <option value="shorts">Shorts</option>
              <option value="pants">Pants</option>
              <option value="beanie-hat">Beanie Hat</option>
            </select>
          </div>
          <div>
            <label htmlFor="agegroup-select" className="text-xs text-white/70">Age Group</label>
            <select
              id="agegroup-select"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white focus:border-neon focus:outline-none"
            >
              <option value="adult">Adult</option>
              <option value="kids">Kids</option>
            </select>
          </div>
        </div>
      </div>

      {/* Free Size Option */}
      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="brandFreeSize"
            checked={isFreeSize}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsFreeSize(checked);
              if (checked) {
                setSizes("Free Size");
                // Set single pricing for free size
                setSizePricing({ "Free Size": { price: 0, mrp: 0 } });
              } else {
                setSizes(getDefaultSizes(ageGroup));
                setSizePricing({});
              }
            }}
            className="h-4 w-4 cursor-pointer accent-neon"
          />
          <label htmlFor="brandFreeSize" className="cursor-pointer text-sm text-white/90">
            <span className="font-medium">Free Size / One Size</span>
            <span className="ml-2 text-xs text-white/60">
              (For products like hats that don't need multiple sizes)
            </span>
          </label>
        </div>
      </div>

      {/* Sizes Input - Only show if NOT free size */}
      {!isFreeSize && (
        <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
          <label htmlFor="brandSizes" className="text-sm font-medium text-white/90">
            Available Sizes
          </label>
          <p className="text-xs text-white/50 mt-1">
            Comma-separated list of sizes for this brand
          </p>
          <input
            id="brandSizes"
            type="text"
            value={sizes}
            onChange={(e) => {
              setSizes(e.target.value);
              // Auto-create pricing entries for new sizes
              const newSizeList = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              const newPricing = { ...sizePricing };
              for (const size of newSizeList) {
                if (!newPricing[size]) {
                  newPricing[size] = { price: 0, mrp: 0 };
                }
              }
              setSizePricing(newPricing);
            }}
            placeholder="S, M, L, XL, XXL, XXXL (add any sizes you need)"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-neon focus:outline-none"
          />
        </div>
      )}

      {/* Size-Specific Pricing */}
      {sizeList.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
          <h3 className="text-sm font-medium text-white/90 mb-4">
            Size-Specific Pricing for {selectedBrand}
          </h3>
          <div className="space-y-3">
            {sizeList.map((size) => (
              <div key={size} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-4">
                <span className="flex-shrink-0 text-base font-semibold text-neon w-12">{size}</span>
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 699"
                      value={sizePricing[size]?.price || ''}
                      onChange={(e) => {
                        const newPricing = { ...sizePricing };
                        if (!newPricing[size]) newPricing[size] = { price: 0, mrp: 0 };
                        newPricing[size].price = Number(e.target.value || 0);
                        setSizePricing(newPricing);
                      }}
                      className="w-full rounded border border-white/20 bg-black/60 px-3 py-2 text-sm text-white focus:border-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 999"
                      value={sizePricing[size]?.mrp || ''}
                      onChange={(e) => {
                        const newPricing = { ...sizePricing };
                        if (!newPricing[size]) newPricing[size] = { price: 0, mrp: 0 };
                        newPricing[size].mrp = Number(e.target.value || 0);
                        setSizePricing(newPricing);
                      }}
                      className="w-full rounded border border-white/20 bg-black/60 px-3 py-2 text-sm text-white/70 focus:border-neon focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/40 bg-green-950/40 px-4 py-3 text-xs text-green-400">
          {success}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSavePricing}
          disabled={isSaving}
          className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : `Save Pricing: ${selectedBrand} - ${category} (${ageGroup})`}
        </button>
      </div>
    </div>
  );
}
