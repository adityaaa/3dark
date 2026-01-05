"use client";

import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterDrawerProps {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
}

export default function FilterDrawer({
  categories,
  brands,
  minPrice,
  maxPrice,
}: Readonly<FilterDrawerProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    searchParams.get("brand") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || minPrice,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ]);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || ""
  );

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    category: true,
    brand: true,
    price: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Count active filters
  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0) +
    (sortBy ? 1 : 0);

  function applyFilters() {
    const params = new URLSearchParams(searchParams);

    // Clear old filter params
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sortBy");

    // Add new filter params
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (priceRange[0] !== minPrice) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== maxPrice) params.set("maxPrice", priceRange[1].toString());
    if (sortBy) params.set("sortBy", sortBy);

    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  }

  function clearFilters() {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([minPrice, maxPrice]);
    setSortBy("");
    
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sortBy");

    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <>
      {/* Filter Button - Mobile/Tablet */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-colors text-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neon text-black text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-bg border-l border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full text-sm font-semibold text-white/80"
                >
                  <span>Category</span>
                  {expandedSections.category ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2 pl-2">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 accent-neon"
                        />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {cat}
                        </span>
                      </label>
                    ))}
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="text-xs text-neon hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("brand")}
                  className="flex items-center justify-between w-full text-sm font-semibold text-white/80"
                >
                  <span>Brand</span>
                  {expandedSections.brand ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2 pl-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-4 h-4 accent-neon"
                        />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                    {selectedBrand && (
                      <button
                        onClick={() => setSelectedBrand("")}
                        className="text-xs text-neon hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full text-sm font-semibold text-white/80"
                >
                  <span>Price Range</span>
                  {expandedSections.price ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="space-y-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label htmlFor="minPrice" className="text-xs text-white/60 block mb-1">Min</label>
                        <input
                          id="minPrice"
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([Number(e.target.value), priceRange[1]])
                          }
                          min={minPrice}
                          max={priceRange[1]}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:border-neon/50 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="maxPrice" className="text-xs text-white/60 block mb-1">Max</label>
                        <input
                          id="maxPrice"
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([priceRange[0], Number(e.target.value)])
                          }
                          min={priceRange[0]}
                          max={maxPrice}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:border-neon/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-white/60">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("sort")}
                  className="flex items-center justify-between w-full text-sm font-semibold text-white/80"
                >
                  <span>Sort By</span>
                  {expandedSections.sort ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.sort && (
                  <div className="space-y-2 pl-2">
                    {[
                      { value: "", label: "Newest First" },
                      { value: "price-asc", label: "Price: Low to High" },
                      { value: "price-desc", label: "Price: High to Low" },
                      { value: "name", label: "Name: A to Z" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-4 h-4 accent-neon"
                        />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                onClick={applyFilters}
                className="w-full py-3 rounded-full bg-neon text-black font-semibold hover:brightness-95 transition-all"
              >
                Show Results
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-sm text-white/60 hover:text-neon transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
