import Link from "next/link";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/utils";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  const products = productsDb.map(mapProduct);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-xs text-white/60">
          Glow-in-the-dark tees, imported and curated.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group rounded-2xl bg-bg-soft/80 p-3 border border-white/5 hover:border-neon/40 hover:shadow-glow transition"
          >
            <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-black/60">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain"
              />
            </div>


            <div className="mt-3 flex flex-col gap-1">
              <span className="text-sm font-medium group-hover:text-neon">
                {p.name}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-white/40">
                {p.brand}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-sm font-semibold">₹{p.price}</span>
                <span className="text-[11px] line-through text-white/40">
                  ₹{p.mrp}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
