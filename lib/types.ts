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

/**
 * CheckoutFormData - Customer information for checkout
 */
export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
};

/**
 * Order - Order representation
 */
export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string | null;
  orderStatus: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * OrderItem - Individual item in an order
 */
export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  size: string;
  quantity: number;
  price: number;
};

/**
 * OrderWithItems - Order with its items populated
 */
export type OrderWithItems = Order & {
  items: OrderItem[];
};
