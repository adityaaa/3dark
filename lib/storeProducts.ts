import type { Product } from "@prisma/client";

export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  glowLevel: number;
  image: string;
  tags: string[];
  sizes: string[];
};

export function mapProduct(p: Product): StoreProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    mrp: p.mrp,
    glowLevel: p.glowLevel,
    image: p.image,
    tags: p.tags
      ? p.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    sizes: p.sizes
      ? p.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };
}
