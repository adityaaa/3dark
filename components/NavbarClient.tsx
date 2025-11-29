"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function NavbarClient() {
  const cart = useCart();
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-neon to-magenta glow-border" />
          <span className="text-lg font-semibold tracking-widest">
            3DARK
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/shop" className="hover:text-neon">
            Shop
          </Link>
          <Link href="/lookbook" className="hover:text-neon">
            Lookbook
          </Link>
          <Link href="/about" className="hover:text-neon">
            About
          </Link>
          <Link href="/support" className="hover:text-neon">
            Support
          </Link>
          <Link href="/checkout" className="relative">
            Cart
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-neon px-1.5 py-0.5 text-xs text-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
