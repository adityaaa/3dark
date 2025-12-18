import "./globals.css";
import { ReactNode } from "react";
import Image from "next/image";
import { CartProvider } from "@/components/CartContext";
import NavbarClient from "@/components/NavbarClient";
import { Providers } from "@/components/Providers";

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
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
              <div className="text-xs text-white/60">Wildlife-inspired streetwear</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/3darkclothings/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-neon"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/3dark.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-neon"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/919425322743"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition hover:text-neon"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
            <div className="text-center text-xs text-white/60 sm:text-right">
              <div>© {new Date().getFullYear()} 3Dark. All rights reserved.</div>
              <div className="mt-1">Premium wildlife-inspired streetwear for India.</div>
            </div>
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
        <Providers>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <NavbarClient />
              <main className="flex-1 bg-gradient-to-b from-bg-soft to-black">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

