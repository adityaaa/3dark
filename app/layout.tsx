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
  metadataBase: new URL('https://3dark.in'),
  title: {
    default: '3Dark – Wildlife-Inspired Streetwear | T-Shirts, Shorts & More',
    template: '%s | 3Dark'
  },
  description: 'Shop premium wildlife-themed streetwear at 3Dark. Bold designs featuring tigers, leopards, eagles & more. Quality t-shirts, shorts, pants & beanies for adults and kids. Free shipping on orders above ₹999.',
  keywords: ['wildlife t-shirts', 'animal print clothing', 'tiger t-shirt', 'leopard shorts', 'streetwear india', 'graphic tees', 'kids animal clothing', 'premium t-shirts', 'wildlife fashion', '3dark'],
  authors: [{ name: '3Dark' }],
  creator: '3Dark',
  publisher: '3Dark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logos/logo.png',
    apple: '/logos/logo.png',
    shortcut: '/logos/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://3dark.in',
    siteName: '3Dark',
    title: '3Dark – Wildlife-Inspired Streetwear',
    description: 'Shop premium wildlife-themed clothing. Bold designs, quality fabrics, perfect fit. T-shirts, shorts, and more for adults and kids.',
    images: [
      {
        url: '/logos/logo.png',
        width: 1200,
        height: 630,
        alt: '3Dark Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3Dark – Wildlife-Inspired Streetwear',
    description: 'Shop premium wildlife-themed clothing. Bold designs, quality fabrics, perfect fit.',
    images: ['/logos/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
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

