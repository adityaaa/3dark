export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  tags: string[];
  sizes: string[];
  glowLevel: number;
  image: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "neon-skull-rider",
    name: "Neon Skull Rider Tee",
    brand: "3Dark",
    description:
      "Premium cotton glow-in-the-dark tee with neon skull rider artwork. Charges in light, glows intensely at night.",
    price: 899,
    mrp: 1299,
    tags: ["skull", "biker", "neon"],
    sizes: ["S", "M", "L", "XL"],
    glowLevel: 5,
    image: "/images/skull-rider.jpg"
  },
  {
    id: "2",
    slug: "cosmic-wolf",
    name: "Cosmic Wolf Tee",
    brand: "Rock Chang",
    description:
      "Hyper-detailed cosmic wolf design with strong glow pigments. Perfect for concerts and night rides.",
    price: 999,
    mrp: 1499,
    tags: ["wolf", "cosmic", "blue"],
    sizes: ["M", "L", "XL"],
    glowLevel: 4,
    image: "/images/cosmic-wolf.jpg"
  }
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
