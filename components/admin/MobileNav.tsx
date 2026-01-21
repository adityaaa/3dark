"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  readonly links: ReadonlyArray<NavLink>;
  readonly userName?: string | null;
  readonly userEmail?: string | null;
};

export default function MobileNav({ links, userName, userEmail }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button - Shows only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden rounded-lg p-2 hover:bg-white/10"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop with accessibility - use visually hidden button */}
          <button
            type="button"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden cursor-default"
            aria-label="Close menu"
            tabIndex={0}
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setIsOpen(false); }}
            style={{ padding: 0, border: 'none', background: 'transparent' }}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-gray-900 z-50 md:hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm font-semibold uppercase tracking-wider">
                3Dark Admin
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            {userName && (
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-white/60 truncate">{userEmail}</p>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
