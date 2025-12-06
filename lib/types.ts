// lib/types.ts - All TypeScript types in one place

/**
 * Product categories
 */
export type ProductCategory = "tshirt" | "shorts" | "pants" | "beanie-hat";

/**
 * Age groups for sizing
 */
export type AgeGroup = "adult" | "kids";

/**
 * StoreProduct - Frontend representation of a product
 * Used in shop, product pages, cart, etc.
 */
export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  ageGroup: AgeGroup;
  description: string;
  price: number;
  mrp: number;
  image: string;      // primary image
  images: string[];   // all images (primary + gallery)
  tags: string[];
  sizes: string[];
  sizePricing?: Record<string, { price: number; mrp: number }>;  // size-specific pricing
};

/**
 * AdminProduct - Admin form representation
 */
export type AdminProduct = {
  id?: number;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  ageGroup: AgeGroup;
  description: string;
  price: number;
  mrp: number;
  tags: string;   // comma or hashtag separated
  sizes: string;  // "S, M, L, XL"
  sizePricing?: string | null;  // JSON: {"S": {"price": 499, "mrp": 599}, ...}
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
