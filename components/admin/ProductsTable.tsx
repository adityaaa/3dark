"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@prisma/client";

type ProductsTableProps = {
  readonly products: readonly Product[];
};

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  
  // Bulk edit state
  const [bulkBrand, setBulkBrand] = useState("");
  const [bulkDiscount, setBulkDiscount] = useState("");

  const allSelected = selectedIds.size === products.length && products.length > 0;
  const someSelected = selectedIds.size > 0;

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  }

  function toggleSelect(id: number) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  }

  async function handleBulkDelete() {
    if (!someSelected) return;
    
    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.size} product(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete products");
      }

      setSelectedIds(new Set());
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete products. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleBulkEdit() {
    if (!someSelected) return;

    setIsDeleting(true);
    try {
      const updates: Record<string, any> = {};
      if (bulkBrand) updates.brand = bulkBrand;
      if (bulkDiscount) {
        // Apply discount percentage to selected products
        updates.applyDiscount = Number(bulkDiscount);
      }

      if (Object.keys(updates).length === 0) {
        alert("Please enter at least one field to update");
        return;
      }

      const res = await fetch("/api/admin/products/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ids: Array.from(selectedIds),
          updates 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update products");
      }

      setSelectedIds(new Set());
      setShowBulkEdit(false);
      setBulkBrand("");
      setBulkDiscount("");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update products. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {someSelected && (
        <div className="rounded-xl border border-neon/40 bg-neon/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              {selectedIds.size} product{selectedIds.size === 1 ? "" : "s"} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkEdit(!showBulkEdit)}
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium hover:border-neon hover:text-neon"
              >
                {showBulkEdit ? "Cancel Edit" : "Bulk Edit"}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>

          {/* Bulk Edit Form */}
          {showBulkEdit && (
            <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
              <div>
                <label htmlFor="bulk-brand" className="text-xs text-white/70">Brand (optional)</label>
                <input
                  id="bulk-brand"
                  type="text"
                  value={bulkBrand}
                  onChange={(e) => setBulkBrand(e.target.value)}
                  placeholder="e.g. Rock Chang"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label htmlFor="bulk-discount" className="text-xs text-white/70">Apply Discount %</label>
                <input
                  id="bulk-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={bulkDiscount}
                  onChange={(e) => setBulkDiscount(e.target.value)}
                  placeholder="e.g. 20 (20% off)"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleBulkEdit}
                  disabled={isDeleting}
                  className="rounded-full bg-neon px-6 py-2 text-xs font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-50"
                >
                  {isDeleting ? "Updating..." : "Apply Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 cursor-pointer accent-neon"
                />
              </th>
              <th className="px-4 py-3 font-medium text-white/60">Image</th>
              <th className="px-4 py-3 font-medium text-white/60">Name</th>
              <th className="px-4 py-3 font-medium text-white/60">Slug</th>
              <th className="px-4 py-3 font-medium text-white/60">Brand</th>
              <th className="px-4 py-3 font-medium text-white/60">Price</th>
              <th className="px-4 py-3 font-medium text-white/60">Sizes</th>
              <th className="px-4 py-3 font-medium text-white/60">Updated</th>
              <th className="px-4 py-3 font-medium text-white/60"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className={`border-t border-white/10 hover:bg-white/5 ${
                  selectedIds.has(p.id) ? "bg-neon/5" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="h-4 w-4 cursor-pointer accent-neon"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-black/60">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-medium">{p.name || "—"}</td>
                <td className="px-4 py-3 text-[11px] text-white/60">
                  {p.slug || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">{p.brand || "—"}</td>
                <td className="px-4 py-3 text-xs">
                  ₹{p.price}{" "}
                  <span className="text-[10px] text-white/50">
                    (MRP ₹{p.mrp})
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{p.sizes || "-"}</td>
                <td className="px-4 py-3 text-[11px] text-white/50">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="rounded-full border border-white/20 px-3 py-1 text-[11px] hover:border-neon hover:text-neon"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
