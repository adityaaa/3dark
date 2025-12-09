// app/admin/inventory/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, AlertTriangle, Search, RefreshCw } from "lucide-react";

type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  ageGroup: string;
  image: string;
  sizes: string;
  stockBySizes: Record<string, number>;
  totalStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/inventory?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInventory();
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setStockInput(product.stockBySizes);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setStockInput({});
  };

  const handleStockChange = (size: string, value: string) => {
    const qty = Number.parseInt(value) || 0;
    setStockInput((prev) => ({ ...prev, [size]: qty }));
  };

  const saveStock = async () => {
    if (!editingProduct) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct.id,
          stockBySizes: stockInput,
          notes: "Manual stock update via inventory dashboard",
        }),
      });

      if (res.ok) {
        await fetchInventory();
        closeEditModal();
      } else {
        alert("Failed to update stock");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error updating stock");
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: products.length,
    lowStock: products.filter((p) => p.isLowStock).length,
    outOfStock: products.filter((p) => p.isOutOfStock).length,
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-sm text-white/60 mt-1">
              Track and manage product stock levels
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <Package className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-white/60">Total Products</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/20 p-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.lowStock}
                </p>
                <p className="text-xs text-white/60">Low Stock</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/20 p-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">
                  {stats.outOfStock}
                </p>
                <p className="text-xs text-white/60">Out of Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-neon text-black"
                  : "border border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setFilter("low-stock")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "low-stock"
                  ? "bg-yellow-500 text-black"
                  : "border border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilter("out-of-stock")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "out-of-stock"
                  ? "bg-red-500 text-white"
                  : "border border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              Out of Stock
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-white/20 bg-white/5 py-2 pl-10 pr-4 text-sm focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Search
            </button>
          </form>

          <button
            onClick={fetchInventory}
            className="rounded-lg border border-white/20 bg-white/5 p-2 hover:bg-white/10"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-neon border-r-transparent" />
            <p className="mt-4 text-sm text-white/60">Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/60">No products found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                      Sizes
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                      Total Stock
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => {
                    const sizes = product.sizes.split(",");
                    return (
                      <tr
                        key={product.id}
                        className="bg-white/5 hover:bg-white/10"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-white/60">
                                {product.category} · {product.ageGroup}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neon">
                            {product.brand}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {sizes.map((size) => (
                              <span
                                key={size}
                                className="rounded bg-white/10 px-2 py-0.5 text-xs"
                              >
                                {size}: {product.stockBySizes[size] || 0}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-lg font-bold ${
                              product.isOutOfStock
                                ? "text-red-400"
                                : product.isLowStock
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {product.totalStock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {product.isOutOfStock ? (
                            <span className="inline-flex rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                              Out of Stock
                            </span>
                          ) : product.isLowStock ? (
                            <span className="inline-flex rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-semibold text-yellow-400">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-lg bg-neon px-3 py-1 text-xs font-semibold text-black hover:bg-neon/80"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Stock Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black p-6">
              <h2 className="mb-4 text-2xl font-bold">Update Stock</h2>
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={editingProduct.image}
                    alt={editingProduct.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold">{editingProduct.name}</p>
                  <p className="text-xs text-white/60">
                    {editingProduct.brand} · {editingProduct.category}
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                {editingProduct.sizes.split(",").map((size) => (
                  <div key={size} className="flex items-center gap-3">
                    <label className="w-16 text-sm font-medium">{size}:</label>
                    <input
                      type="number"
                      min="0"
                      value={stockInput[size] || 0}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
                    />
                    <span className="text-sm text-white/60">
                      (was: {editingProduct.stockBySizes[size] || 0})
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStock}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-neon px-4 py-2 font-semibold text-black hover:bg-neon/80 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
