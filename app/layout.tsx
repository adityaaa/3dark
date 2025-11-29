import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import NavbarClient from "@/components/NavbarClient";

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} 3Dark. All rights reserved.</span>
        <span>Glow-in-the-dark tees for riders, gamers, and night owls.</span>
      </div>
    </footer>
  );
}

export const metadata = {
  title: "3Dark – Glow in the Dark T-Shirts",
  description: "Hyper-realistic glow-in-the-dark T-shirts and streetwear.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-white">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <NavbarClient />
            <main className="flex-1 bg-gradient-to-b from-bg-soft to-black">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

