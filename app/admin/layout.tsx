// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-[0.25em] text-white/60">
              3Dark Admin
            </span>
          </div>
          <nav className="flex gap-4 text-xs">
            <Link href="/admin/products" className="hover:text-neon">
              Products
            </Link>
            <Link href="/" className="text-white/60 hover:text-white">
              View site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
