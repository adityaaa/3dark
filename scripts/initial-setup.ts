#!/usr/bin/env tsx
// scripts/initial-setup.ts
// One-stop script to set up admin account and seed products

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

async function createAdmin() {
  console.log("\n🔐 Setting up Admin Account...\n");

  const email = process.env.ADMIN_EMAIL || "admin@3dark.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@3dark2024";
  const name = process.env.ADMIN_NAME || "Admin";

  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`✅ Admin already exists: ${email}`);
    console.log(`   If you need to reset password, run: NEW_PASSWORD='your-password' npx tsx scripts/update-admin-password.ts`);
    return existingAdmin;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Please change the password after first login!`);

  return admin;
}

async function seedProducts() {
  console.log("\n🌱 Seeding Products...\n");

  // Get all product images
  const productsDir = join(process.cwd(), "public", "products");
  let imageFiles: string[] = [];
  
  try {
    imageFiles = readdirSync(productsDir).filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
  } catch (error) {
    console.error("❌ Could not read products directory:", error);
    return;
  }

  console.log(`Found ${imageFiles.length} product images`);

  if (imageFiles.length === 0) {
    console.log("⚠️  No product images found in /public/products/");
    return;
  }

  // Group images by base name (for gallery support)
  const productGroups = new Map<string, string[]>();
  
  imageFiles.forEach((filename) => {
    // Extract base name without the trailing number
    const baseName = filename.replace(/(-\d+)\.(jpg|jpeg|png|webp)$/i, "");
    
    if (!productGroups.has(baseName)) {
      productGroups.set(baseName, []);
    }
    productGroups.get(baseName)!.push(filename);
  });

  console.log(`Grouped into ${productGroups.size} unique products\n`);

  // Parse product info and create products
  const products = Array.from(productGroups.entries()).map(([baseName, images]) => {
    const parts = baseName.split("-");
    const brand = parts[0]; // Caballo or RC
    let categoryPart = parts[1] || ""; // adult, kids, unisex, FreeSize, freeSize
    const nameParts = parts.slice(2); // Everything after brand and category
    
    // Skip invalid products
    if (!brand || nameParts.length === 0) {
      console.log(`⚠️  Skipping invalid product: ${baseName}`);
      return null;
    }
    
    // Determine category and age group
    let category = "tshirt";
    let ageGroup = "adult";
    let sizes = "S,M,L,XL,XXL,XXXL";
    
    if (categoryPart.toLowerCase().includes("freesize")) {
      category = "beanie-hat";
      ageGroup = "adult";
      sizes = "Free Size";
    } else if (categoryPart.toLowerCase() === "kids") {
      ageGroup = "kids";
      category = "tshirt";
    } else if (categoryPart.toLowerCase() === "adult") {
      ageGroup = "adult";
      category = "tshirt";
    } else if (categoryPart.toLowerCase() === "unisex") {
      ageGroup = "adult";
      category = "tshirt";
    }
    
    // Check if it's shorts or pants
    const nameStr = nameParts.join(" ").toLowerCase();
    if (nameStr.includes("shorts")) {
      category = "shorts";
    } else if (nameStr.includes("pants")) {
      category = "pants";
    } else if (nameStr.includes("hat")) {
      category = "beanie-hat";
      sizes = "Free Size";
    }

    // Determine price based on brand, category, and age group
    let price = 799;
    let mrp = 1999;
    
    if (brand.toLowerCase() === "caballo") {
      if (ageGroup === "adult") {
        price = 799;
        mrp = 1999;
      } else if (ageGroup === "kids") {
        price = 699;
        mrp = 1699;
      }
      if (category === "beanie-hat") {
        price = 599;
        mrp = 1499;
      }
    } else if (brand.toLowerCase() === "rc") {
      price = 899;
      mrp = 2199;
    }

    // Create clean name
    const cleanName = nameParts
      .join(" ")
      .replaceAll("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Create slug
    const slug = `${brand}-${nameParts.join("-")}`.toLowerCase();

    // Determine tags
    const tags: string[] = [];
    if (nameStr.includes("tiger")) tags.push("tiger", "wildlife");
    if (nameStr.includes("leopard")) tags.push("leopard", "wildlife");
    if (nameStr.includes("eagle")) tags.push("eagle", "birds");
    if (nameStr.includes("lion")) tags.push("lion", "wildlife");
    if (nameStr.includes("panda")) tags.push("panda", "wildlife");
    if (nameStr.includes("parrot")) tags.push("parrot", "birds");
    if (nameStr.includes("wolf")) tags.push("wolf", "wildlife");
    if (nameStr.includes("cub")) tags.push("cute", "kids");
    if (ageGroup === "adult") tags.push("adult");
    if (ageGroup === "kids") tags.push("kids");
    if (category === "shorts") tags.push("shorts", "bottomwear");
    if (category === "pants") tags.push("pants", "bottomwear");
    if (category === "beanie-hat") tags.push("hat", "accessories");
    if (category === "tshirt") tags.push("tshirt", "topwear");
    tags.push("glow-in-the-dark", "3d-print");

    // Gallery setup - primary image is first, rest go to gallery
    const primaryImage = images[0];
    const galleryImages = images.slice(1);

    return {
      slug,
      name: cleanName,
      brand: brand === "RC" ? "Rock Chang" : "Caballo",
      category,
      ageGroup,
      description: `Premium ${category} featuring stunning ${cleanName.toLowerCase()} artwork with glow-in-the-dark 3D print technology. Made from high-quality fabric for ultimate comfort and durability. Stand out with this unique design that comes alive in the dark!`,
      price,
      mrp,
      tags: tags.join(","),
      sizes,
      sizePricing: null,
      image: `/products/${primaryImage}`,
      gallery: galleryImages.length > 0 ? galleryImages.map(img => `/products/${img}`).join(",") : null,
    };
  });

  // Filter out invalid products and insert
  const validProducts = products.filter((p) => p !== null);
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of validProducts) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
      console.log(`✅ ${product.name} (${product.category}, ${product.ageGroup})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to insert ${product.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Successfully seeded ${successCount} products!`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} products failed to seed.`);
  }
}

async function main() {
  console.log("🚀 Starting Initial Setup for 3dark.in\n");
  console.log("=" .repeat(50));

  try {
    // Step 1: Create/verify admin account
    await createAdmin();

    // Step 2: Seed products
    await seedProducts();

    console.log("\n" + "=".repeat(50));
    console.log("\n✨ Setup Complete!\n");
    console.log("Next steps:");
    console.log("1. Login to admin panel at /admin with:");
    console.log(`   Email: ${process.env.ADMIN_EMAIL || "admin@3dark.com"}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || "Admin@3dark2024"}`);
    console.log("\n2. Run seed fake reviews:");
    console.log("   npx tsx scripts/seed-fake-reviews.ts");
    console.log("\n3. Visit your shop page to see products!");
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during setup:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
