// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const top = productsDb.map(mapProduct);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,180,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,140,255,0.18),_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:py-20">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              3Dark • GLOW-IN-THE-DARK OUTFITS
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Hyper-realistic glow gear
              <br />
              built for the night.
            </h1>
            <p className="max-w-xl text-sm text-white/70">
              Premium glow-in-the-dark apparel engineered for riders, gamers,
              and night-life. Charge it in light. Watch it come alive in the
              dark.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-neon px-6 py-2 text-xs font-semibold text-black shadow-glow hover:brightness-95"
              >
                Shop now
              </Link>
              <Link
                href="/lookbook"
                className="rounded-full border border-white/30 px-6 py-2 text-xs font-semibold text-white/80 hover:border-neon hover:text-neon"
              >
                View lookbook
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-1 justify-center md:mt-0">
            <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-neon/40 bg-gradient-to-br from-black via-black to-neon/20 shadow-glow">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,180,0.3),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(0,120,255,0.35),transparent_55%)]" />
              <div className="relative flex h-full flex-col items-center justify-center gap-2 px-5 text-center text-xs text-white/70">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                  Night-ready
                </span>
                <p className="text-sm font-medium">
                  Charges in 10–15 minutes,
                  <br />
                  glows for hours in low light.
                </p>
                <p className="text-[11px] text-white/60">
                  Perfect for rides, concerts, and late-night streets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
            Featured drops
          </h2>
          <Link
            href="/shop"
            className="text-[11px] text-neon hover:underline"
          >
            View all →
          </Link>
        </div>

        {top.length === 0 ? (
          <p className="text-sm text-white/60">
            No products yet. Add some from{" "}
            <Link href="/admin/products" className="text-neon underline">
              Admin &gt; Products
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {top.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-neon/70 hover:bg-white/10"
              >
                <div className="relative mb-3 h-56 w-full overflow-hidden rounded-xl bg-black/60">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {p.brand}
                  </p>
                  <p className="text-sm font-medium line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">₹{p.price}</span>
                    <span className="text-[11px] text-white/50">
                      Glow {p.glowLevel}/5
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
