// app/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-wide">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neon px-4 py-2 text-xs font-semibold text-black shadow-glow hover:brightness-95"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-white/60">
          No products yet. Click “Add product” to create your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white/5">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-medium text-white/60">Name</th>
                <th className="px-4 py-3 font-medium text-white/60">Slug</th>
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
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-xs">{p.name || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-white/60">
                    {p.slug || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    ₹{p.price}{" "}
                    <span className="text-[10px] text-white/50">
                      (MRP ₹{p.mrp})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {p.sizes || "-"}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-white/50">
                    {p.updatedAt.toLocaleString()}
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
      )}
    </div>
  );
}
