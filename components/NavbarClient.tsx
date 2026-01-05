"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";

export default function NavbarClient() {
  const cart = useCart();
  const { data: session } = useSession();
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
    { href: "/track-order", label: "Track Order" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-bg/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="hover:text-neon transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Account Menu - Desktop */}
          {isCustomer ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="hover:text-neon flex items-center gap-1 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
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
            <Link href="/login" className="hover:text-neon transition-colors">
              Login
            </Link>
          )}

          {/* Cart - Desktop */}
          <Link href="/cart" className="relative hover:text-neon transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-[10px] font-bold text-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-4 z-50">
          {/* Cart - Mobile */}
          <Link href="/cart" className="relative hover:text-neon transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-[10px] font-bold text-black">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:text-neon transition-colors"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-bg/98 backdrop-blur-lg z-40 border-t border-white/10">
          <div className="flex flex-col px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 hover:bg-white/5 rounded-lg transition-colors text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-white/10 my-2"></div>
            
            {isCustomer ? (
              <>
                <Link
                  href="/account"
                  className="px-4 py-3 hover:bg-white/5 rounded-lg transition-colors text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/account"
                  className="px-4 py-3 hover:bg-white/5 rounded-lg transition-colors text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors text-red-400 text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-3 hover:bg-white/5 rounded-lg transition-colors text-base"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
