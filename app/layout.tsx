import "./globals.css";
import { ReactNode } from "react";
import Image from "next/image";
import { CartProvider } from "@/components/CartContext";
import NavbarClient from "@/components/NavbarClient";

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logos/logo.png" 
              alt="3Dark Logo" 
              width={40} 
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <div className="text-lg font-bold">3DARK</div>
              <div className="text-xs text-white/60">Glow-in-the-dark fashion</div>
            </div>
          </div>
          <div className="text-center text-xs text-white/60 sm:text-right">
            <div>© {new Date().getFullYear()} 3Dark. All rights reserved.</div>
            <div className="mt-1">Glow-in-the-dark tees for riders, gamers, and night owls.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const metadata = {
  title: "3Dark – Glow in the Dark T-Shirts",
  description: "Hyper-realistic glow-in-the-dark T-shirts and streetwear.",
  icons: {
    icon: '/logos/logo.png',
    apple: '/logos/logo.png',
  },
  openGraph: {
    title: "3Dark – Glow in the Dark T-Shirts",
    description: "Hyper-realistic glow-in-the-dark T-shirts and streetwear.",
    images: ['/logos/logo.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
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

