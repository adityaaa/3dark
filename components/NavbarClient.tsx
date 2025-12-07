"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function NavbarClient() {
  const cart = useCart();
  const { data: session } = useSession();
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCustomer = session?.user && (session.user as any).role === "customer";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logos/logo.png" 
            alt="3Dark Logo" 
            width={32} 
            height={32}
            className="h-8 w-8 object-contain"
          />
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
          <Link href="/track-order" className="hover:text-neon">
            Track Order
          </Link>
          
          {/* Account Menu */}
          {isCustomer ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="hover:text-neon flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>
              
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-white/10 py-2">
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-white/10 transition"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-white/10 transition"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 transition text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-neon">
              Login
            </Link>
          )}

          <Link href="/cart" className="relative hover:text-neon">
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
