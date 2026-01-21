// app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import MobileNav from "@/components/admin/MobileNav";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions);

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/brands", label: "Brand Pricing" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/shops", label: "Shops" },
    { href: "/admin/inventory", label: "Inventory" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-[0.25em] text-white/60">
              3Dark Admin
            </span>
          </div>
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-4 text-xs">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-neon">
                {link.label}
              </Link>
            ))}
            <Link href="/" className="text-white/60 hover:text-white">
              View site
            </Link>
            {session?.user && (
              <>
                <span className="text-white/40">|</span>
                <span className="text-white/60" title={session.user.email || ''}>
                  {session.user.name}
                </span>
                <LogoutButton />
              </>
            )}
          </nav>
          {/* Mobile Navigation - only on mobile */}
          <div className="md:hidden">
            <MobileNav
              links={navLinks}
              userName={session?.user?.name}
              userEmail={session?.user?.email}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
