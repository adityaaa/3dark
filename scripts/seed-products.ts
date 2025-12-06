// scripts/seed-products.ts - Seed production database with products
import { PrismaClient } from "@prisma/client";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding products...");

  // Get all product images
  const productsDir = join(process.cwd(), "public", "products");
  const imageFiles = readdirSync(productsDir).filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} product images`);

  // Parse product info from filenames
  const products = imageFiles.map((filename) => {
    const parts = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "").split("-");
    const brand = parts[0]; // Caballo or RC
    const category = parts[1]; // adult, kids, unisex, FreeSize, freeSize
    const name = parts.slice(2, -1).join(" "); // Everything except the last part
    const sku = parts[parts.length - 1]; // Last part is the SKU

    // Determine price based on brand and category
    let price = 799;
    let mrp = 1999;
    if (brand.toLowerCase() === "caballo") {
      if (category.toLowerCase().includes("adult")) {
        price = 799;
        mrp = 1999;
      } else if (category.toLowerCase().includes("kids")) {
        price = 699;
        mrp = 1699;
      } else if (category.toLowerCase().includes("freesize")) {
        price = 599;
        mrp = 1499;
      }
    } else if (brand.toLowerCase() === "rc") {
      price = 899;
      mrp = 2199;
    }

    // Create slug
    const slug = `${brand}-${name}-${sku}`.toLowerCase().replace(/\s+/g, "-");

    // Determine tags
    const tags = [];
    if (name.toLowerCase().includes("tiger")) tags.push("tiger");
    if (name.toLowerCase().includes("leopard")) tags.push("leopard");
    if (name.toLowerCase().includes("eagle")) tags.push("eagle");
    if (name.toLowerCase().includes("lion")) tags.push("lion");
    if (name.toLowerCase().includes("panda")) tags.push("panda");
    if (name.toLowerCase().includes("parrot")) tags.push("parrot");
    if (name.toLowerCase().includes("wolf")) tags.push("wolf");
    if (category.toLowerCase().includes("adult")) tags.push("adult");
    if (category.toLowerCase().includes("kids")) tags.push("kids");
    if (category.toLowerCase().includes("unisex")) tags.push("unisex");
    if (name.toLowerCase().includes("hat")) tags.push("hat", "accessories");
    if (name.toLowerCase().includes("shorts")) tags.push("shorts");

    return {
      slug,
      name: name.replaceAll("-", " ").replaceAll(/\b\w/g, (l) => l.toUpperCase()),
      brand: brand === "RC" ? "Rock Chang" : "Caballo",
      description: `Glow-in-the-dark ${name.toLowerCase()} featuring stunning artwork. Premium quality fabric with vibrant glow effect.`,
      price,
      mrp,
      tags: tags.join(","),
      sizes: category.toLowerCase().includes("freesize") ? "Free Size" : "S,M,L,XL,XXL",
      sizePricing: null,
      image: filename,
      gallery: null,
    };
  });

  // Insert products
  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
      console.log(`✅ ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to insert ${product.name}:`, error);
    }
  }

  console.log(`\n✅ Seeded ${products.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
