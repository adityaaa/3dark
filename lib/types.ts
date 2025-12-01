// lib/types.ts - All TypeScript types in one place

/**
 * StoreProduct - Frontend representation of a product
 * Used in shop, product pages, cart, etc.
 */
export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  glowLevel: number;
  image: string;      // primary image
  images: string[];   // all images (primary + gallery)
  tags: string[];
  sizes: string[];
};

/**
 * AdminProduct - Admin form representation
 */
export type AdminProduct = {
  id?: number;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  glowLevel?: number;
  tags: string;   // comma or hashtag separated
  sizes: string;  // "S, M, L, XL"
  image?: string | null;
  gallery?: string | null;
};

/**
 * CartItem - Shopping cart item
 */
export type CartItem = {
  product: StoreProduct;
  size: string;
  qty: number;
};
