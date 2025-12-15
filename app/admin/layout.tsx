// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-[0.25em] text-white/60">
              3Dark Admin
            </span>
          </div>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/admin" className="hover:text-neon">
              Dashboard
            </Link>
            <Link href="/admin/products" className="hover:text-neon">
              Products
            </Link>
            <Link href="/admin/brands" className="hover:text-neon">
              Brand Pricing
            </Link>
            <Link href="/admin/orders" className="hover:text-neon">
              Orders
            </Link>
            <Link href="/admin/shops" className="hover:text-neon">
              Shops
            </Link>
            <Link href="/admin/inventory" className="hover:text-neon">
              Inventory
            </Link>
            <Link href="/admin/settings" className="hover:text-neon">
              Settings
            </Link>
            <Link href="/" className="text-white/60 hover:text-white">
              View site
            </Link>
            <span className="text-white/40">|</span>
            {session?.user && (
              <span className="text-white/60" title={session.user.email || ''}>
                {session.user.name}
              </span>
            )}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
