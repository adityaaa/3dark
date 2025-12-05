// lib/utils.ts - Utility functions

import type { Product } from "@prisma/client";
import type { StoreProduct } from "./types";

/**
 * Convert database Product to StoreProduct format
 * Handles image normalization and parsing of comma-separated fields
 */
export function mapProduct(p: Product): StoreProduct {
  const tags = p.tags
    ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const sizes = p.sizes
    ? p.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Normalize main image - handle both local paths and external URLs (Vercel Blob)
  const normalizeImagePath = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path; // External URL (Vercel Blob)
    }
    if (path.startsWith("/")) {
      return path; // Already normalized local path
    }
    // Local path needs normalization
    return `/products/${path.replace(/^public[\\/]products[\\/]/, "")}`;
  };

  const baseImageRaw = p.image || "";
  const baseImage = normalizeImagePath(baseImageRaw);

  // Parse gallery (comma-separated paths)
  const galleryList = p.gallery
    ? p.gallery
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const normalizedGallery = galleryList.map(normalizeImagePath);

  const images = normalizedGallery.length > 0
    ? [baseImage, ...normalizedGallery]
    : [baseImage];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    mrp: p.mrp,
    glowLevel: p.glowLevel,
    image: images[0],
    images,
    tags,
    sizes,
  };
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(price: number, mrp: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
