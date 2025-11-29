import Link from "next/link";
import { products } from "@/lib/products";

export default function HomePage() {
  const top = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neon">
            glow in the dark apparel
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold leading-tight">
            Look normal in the light.
            <span className="text-neon block">
              Turn legendary in the dark.
            </span>
          </h1>
          <p className="mt-4 text-sm text-white/70">
            3Dark brings hyper-detailed glow-in-the-dark tees imported from
            Thailand – built for riders, gamers, and night walks.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-95"
            >
              Shop now
            </Link>
            <Link
              href="/lookbook"
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 hover:border-neon hover:text-neon"
            >
              View lookbook
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Try our AI stylist in the corner – tell it where you&apos;re going and it will pick a tee.
          </p>
        </div>

        <div className="relative flex h-72 items-center justify-center rounded-3xl bg-gradient-to-tr from-bg-soft via-black to-bg-soft shadow-glow">
          <div className="absolute inset-6 rounded-3xl border border-neon/30" />
          <span className="text-xs text-white/60 absolute top-4 left-4">
            Live Glow Preview (mocked)
          </span>
          <div className="flex flex-col items-center gap-2">
            <div className="h-40 w-28 rounded-xl bg-gradient-to-b from-neon/10 via-black to-neon/20 border border-neon/40 flex items-center justify-center">
              <span className="text-xs text-neon text-center px-2">
                T-shirt area – brighten in dark mode
              </span>
            </div>
            <p className="text-xs text-white/60">
              Later you can swap this with a real 3D or AI simulation.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bestsellers</h2>
          <Link href="/shop" className="text-xs text-neon">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {top.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group rounded-2xl bg-bg-soft/80 p-3 border border-white/5 hover:border-neon/40 hover:shadow-glow transition"
            >
              <div className="h-40 w-full rounded-xl bg-black/50 flex items-center justify-center text-xs text-white/50">
                {p.name} image
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
      </section>
    </div>
  );
}
