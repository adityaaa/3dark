// Minimal seed script
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding products...\n");

  const img1 = "/products/RC-unisex-black-tiger-GR-693-1.png";
  
  await prisma.product.create({
    data: {
      slug: "rc-unisex-black-tiger",
      name: "RC Unisex Black Tiger T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Premium black tiger print t-shirt. 100% cotton, comfortable fit. Perfect for casual wear.",
      price: 499,
      mrp: 999,
      tags: "tiger,black,unisex,premium,cotton",
      sizes: "S,M,L,XL",
      image: img1,
      gallery: img1,
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899, totalStock: 15 },
        M: { price: 499, mrp: 999, totalStock: 20 },
        L: { price: 549, mrp: 1099, totalStock: 10 },
        XL: { price: 599, mrp: 1199, totalStock: 5 }
      }),
      stockBySizes: JSON.stringify({ S: 15, M: 20, L: 10, XL: 5 }),
      totalStock: 50,
      trackInventory: true
    }
  });
  console.log("✅ Added: RC Unisex Black Tiger");

  const img2 = "/products/RC-unisex-white-tiger-GR-747-1.png";
  await prisma.product.create({
    data: {
      slug: "rc-unisex-white-tiger",
      name: "RC Unisex White Tiger T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Elegant white tiger design t-shirt. Premium quality cotton. Stand out from the crowd!",
      price: 499,
      mrp: 999,
      tags: "tiger,white,unisex,premium",
      sizes: "S,M,L,XL",
      image: img2,
      gallery: img2,
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899, totalStock: 10 },
        M: { price: 499, mrp: 999, totalStock: 15 },
        L: { price: 549, mrp: 1099, totalStock: 10 },
        XL: { price: 599, mrp: 1199, totalStock: 5 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 15, L: 10, XL: 5 }),
      totalStock: 40,
      trackInventory: true
    }
  });
  console.log("✅ Added: RC Unisex White Tiger");

  const img3 = "/products/Caballo-adult-Tiger-Shorts-A-0321-1.jpg";
  await prisma.product.create({
    data: {
      slug: "caballo-adult-tiger-shorts",
      name: "Caballo Adult Tiger Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Stylish tiger print shorts. Perfect for casual and sportswear. Comfortable and trendy!",
      price: 699,
      mrp: 1499,
      tags: "tiger,shorts,adult,caballo,sports",
      sizes: "S,M,L,XL",
      image: img3,
      gallery: img3,
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1399, totalStock: 8 },
        M: { price: 699, mrp: 1499, totalStock: 12 },
        L: { price: 749, mrp: 1599, totalStock: 7 },
        XL: { price: 799, mrp: 1699, totalStock: 3 }
      }),
      stockBySizes: JSON.stringify({ S: 8, M: 12, L: 7, XL: 3 }),
      totalStock: 30,
      trackInventory: true
    }
  });
  console.log("✅ Added: Caballo Tiger Shorts");

  console.log("\n🎉 Database seeded successfully! 3 products added.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
