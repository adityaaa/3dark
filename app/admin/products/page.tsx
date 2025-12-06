// app/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = 'force-dynamic';

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
          No products yet. Click "Add product" to create your first one.
        </p>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
