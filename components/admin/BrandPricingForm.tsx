"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BrandPricing } from "@prisma/client";

type BrandPricingFormProps = {
  readonly brands: readonly string[];
  readonly existingPricing: readonly BrandPricing[];
};

type SizePricing = Record<string, { price: number; mrp: number }>;

export default function BrandPricingForm({ brands, existingPricing }: BrandPricingFormProps) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || "");
  const [sizes, setSizes] = useState("S, M, L, XL, XXL, XXXL");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing pricing for selected brand
  const existingBrandPricing = existingPricing.find(bp => bp.brand === selectedBrand);
  
  const [sizePricing, setSizePricing] = useState<SizePricing>(() => {
    if (existingBrandPricing?.sizePricing) {
      try {
        return JSON.parse(existingBrandPricing.sizePricing);
      } catch {
        return {};
      }
    }
    return {};
  });

  // When brand changes, load its pricing
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setError(null);
    setSuccess(null);
    
    const brandData = existingPricing.find(bp => bp.brand === brand);
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
  };

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
          sizePricing: JSON.stringify(sizePricing),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save brand pricing");
      }

      setSuccess(`✓ Pricing saved for ${selectedBrand}. All ${selectedBrand} products will use these prices.`);
      setTimeout(() => setSuccess(null), 5000);
      router.refresh();
    } catch (err: any) {
      console.error(err);
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
        <label className="text-sm font-medium text-white/90">Select Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-neon focus:outline-none"
        >
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        {existingPricing.find(bp => bp.brand === selectedBrand) && (
          <p className="mt-2 text-xs text-green-400">
            ✓ This brand has existing pricing configured
          </p>
        )}
      </div>

      {/* Sizes Input */}
      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <label className="text-sm font-medium text-white/90">
          Available Sizes
        </label>
        <p className="text-xs text-white/50 mt-1">
          Comma-separated list of sizes for this brand
        </p>
        <input
          type="text"
          value={sizes}
          onChange={(e) => {
            setSizes(e.target.value);
            // Auto-create pricing entries for new sizes
            const newSizeList = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            const newPricing = { ...sizePricing };
            newSizeList.forEach(size => {
              if (!newPricing[size]) {
                newPricing[size] = { price: 0, mrp: 0 };
              }
            });
            setSizePricing(newPricing);
          }}
          placeholder="S, M, L, XL, XXL, XXXL"
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-neon focus:outline-none"
        />
      </div>

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
          {isSaving ? "Saving..." : `Save Pricing for ${selectedBrand}`}
        </button>
      </div>
    </div>
  );
}
