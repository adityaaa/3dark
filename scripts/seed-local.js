// Seed script for local SQLite database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding local database...\n");

  // Sample products matching the public/products folder
  const products = [
    {
      slug: "rc-unisex-black-tiger",
      name: "RC Unisex Black Tiger T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Premium black tiger print t-shirt with striking design. Made from 100% cotton for ultimate comfort and breathability.",
      price: 499,
      mrp: 999,
      tags: "tiger,black,unisex,premium,cotton",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 15, M: 20, L: 10, XL: 5 }),
      totalStock: 50,
      image: "/products/RC-unisex-black-tiger-GR-693-1.png",
      gallery: "/products/RC-unisex-black-tiger-GR-693-2.png,/products/RC-unisex-black-tiger-GR-693-3.png,/products/RC-unisex-black-tiger-GR-693-4.jpeg"
    },
    {
      slug: "rc-unisex-white-tiger",
      name: "RC Unisex White Tiger T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Elegant white tiger design t-shirt. Premium quality cotton with detailed artwork.",
      price: 499,
      mrp: 999,
      tags: "tiger,white,unisex,premium,cotton",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 15, L: 10, XL: 5 }),
      totalStock: 40,
      image: "/products/RC-unisex-white-tiger-GR-747-1.png",
      gallery: "/products/RC-unisex-white-tiger-GR-747-2.png,/products/RC-unisex-white-tiger-GR-747-3.jpeg"
    },
    {
      slug: "rc-unisex-tiger-green",
      name: "RC Unisex Tiger T-Shirt (Green)",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Bold tiger design on premium fabric. Perfect for wildlife enthusiasts.",
      price: 499,
      mrp: 999,
      tags: "tiger,green,unisex,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 12, M: 18, L: 15, XL: 8 }),
      totalStock: 53,
      image: "/products/RC-unisex-tiger-GR-753-1.jpeg",
      gallery: "/products/RC-unisex-tiger-GR-753-2.jpg"
    },
    {
      slug: "rc-unisex-tiger-822",
      name: "RC Unisex Tiger T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Fierce tiger graphic on comfortable cotton tee. Stand out with style.",
      price: 499,
      mrp: 999,
      tags: "tiger,unisex,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 20, L: 12, XL: 8 }),
      totalStock: 50,
      image: "/products/RC-unisex-tiger-GR-822-1.jpeg"
    },
    {
      slug: "rc-unisex-tiger-823",
      name: "RC Unisex Tiger T-Shirt (Orange)",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Vibrant tiger design with eye-catching colors. Premium quality guaranteed.",
      price: 499,
      mrp: 999,
      tags: "tiger,orange,unisex,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 8, M: 15, L: 10, XL: 7 }),
      totalStock: 40,
      image: "/products/RC-unisex-tiger-GR-823-1.jpeg"
    },
    {
      slug: "rc-unisex-lion",
      name: "RC Unisex Lion T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Majestic lion design for the king of the jungle. Bold and beautiful.",
      price: 499,
      mrp: 999,
      tags: "lion,unisex,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 12, M: 18, L: 14, XL: 6 }),
      totalStock: 50,
      image: "/products/RC-unisex-lion-GR-691-1.jpeg"
    },
    {
      slug: "rc-unisex-panda",
      name: "RC Unisex Panda T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Cute panda design on premium cotton. Perfect for casual wear.",
      price: 499,
      mrp: 999,
      tags: "panda,unisex,cute,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 15, L: 12, XL: 8 }),
      totalStock: 45,
      image: "/products/RC-unisex-panda-GR-734-1.jpeg"
    },
    {
      slug: "rc-unisex-parrot",
      name: "RC Unisex Parrot T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Colorful parrot design for vibrant personalities. Stand out in style.",
      price: 499,
      mrp: 999,
      tags: "parrot,bird,unisex,colorful",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 8, M: 12, L: 10, XL: 5 }),
      totalStock: 35,
      image: "/products/RC-unisex-parrot-GR-842-1.jpeg"
    },
    {
      slug: "rc-unisex-wolf",
      name: "RC Unisex Wolf T-Shirt",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Powerful wolf design symbolizing strength and freedom. Premium quality cotton.",
      price: 499,
      mrp: 999,
      tags: "wolf,unisex,premium,wild",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899 },
        M: { price: 499, mrp: 999 },
        L: { price: 549, mrp: 1099 },
        XL: { price: 599, mrp: 1199 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 20, L: 15, XL: 10 }),
      totalStock: 55,
      image: "/products/RC-unisex-wolf-GR-753-1.jpeg",
      gallery: "/products/RC-unisex-wolf-GR-753-2.jpg"
    },
    {
      slug: "caballo-adult-tiger-shorts",
      name: "Caballo Adult Tiger Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Premium tiger print shorts for adults. Comfortable fit with bold design.",
      price: 699,
      mrp: 1399,
      tags: "tiger,shorts,adult,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 8, M: 12, L: 10, XL: 5 }),
      totalStock: 35,
      image: "/products/Caballo-adult-Tiger-Shorts-A-0321-1.jpg"
    },
    {
      slug: "caballo-adult-tiger-shorts-735",
      name: "Caballo Adult Tiger Shorts (Blue)",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Stylish tiger shorts with blue accents. Perfect for summer wear.",
      price: 699,
      mrp: 1399,
      tags: "tiger,shorts,adult,blue",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 15, L: 12, XL: 8 }),
      totalStock: 45,
      image: "/products/Caballo-adult-Tiger-Shorts-A-0735-1.jpg"
    },
    {
      slug: "caballo-adult-2tigers-shorts",
      name: "Caballo Adult 2 Tigers Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Double tiger design shorts. Bold and comfortable.",
      price: 699,
      mrp: 1399,
      tags: "tiger,shorts,adult,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 7, M: 10, L: 8, XL: 5 }),
      totalStock: 30,
      image: "/products/Caballo-adult-2Tigers-Shorts-A-0829-1.jpg"
    },
    {
      slug: "caballo-adult-3tigers-shorts",
      name: "Caballo Adult 3 Tigers Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Triple tiger design for ultimate wildlife style.",
      price: 699,
      mrp: 1399,
      tags: "tiger,shorts,adult,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 6, M: 12, L: 10, XL: 7 }),
      totalStock: 35,
      image: "/products/Caballo-adult-3Tigers-Shorts-A-0876-1.jpg"
    },
    {
      slug: "caballo-adult-blue-leopard-shorts",
      name: "Caballo Adult Blue Leopard Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Stunning blue leopard print shorts. Stand out from the crowd.",
      price: 699,
      mrp: 1399,
      tags: "leopard,shorts,adult,blue",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 8, M: 15, L: 12, XL: 10 }),
      totalStock: 45,
      image: "/products/Caballo-adult-BlueLeopard-Shorts-A-0813-1.jpg"
    },
    {
      slug: "caballo-adult-blue-tiger-shorts",
      name: "Caballo Adult Blue Tiger Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Eye-catching blue tiger design. Premium comfort and style.",
      price: 699,
      mrp: 1399,
      tags: "tiger,shorts,adult,blue",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 10, M: 18, L: 15, XL: 12 }),
      totalStock: 55,
      image: "/products/Caballo-adult-BlueTiger-Shorts-A-0793-1.jpg"
    },
    {
      slug: "caballo-adult-fire-eagle-shorts",
      name: "Caballo Adult Fire Eagle Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Blazing fire eagle design. Perfect for bold personalities.",
      price: 699,
      mrp: 1399,
      tags: "eagle,shorts,adult,fire",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 5, M: 10, L: 8, XL: 5 }),
      totalStock: 28,
      image: "/products/Caballo-adult-Fire-Eagle-Shorts-A-0814-1.jpg"
    },
    {
      slug: "caballo-adult-leopard-shorts",
      name: "Caballo Adult Leopard Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Classic leopard print shorts. Timeless style and comfort.",
      price: 699,
      mrp: 1399,
      tags: "leopard,shorts,adult,premium",
      sizes: "S,M,L,XL",
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1299 },
        M: { price: 699, mrp: 1399 },
        L: { price: 749, mrp: 1499 },
        XL: { price: 799, mrp: 1599 }
      }),
      stockBySizes: JSON.stringify({ S: 12, M: 20, L: 15, XL: 10 }),
      totalStock: 57,
      image: "/products/Caballo-adult-Leopard-Shorts-A-0830-1.jpg"
    },
    {
      slug: "caballo-kids-cute-cub",
      name: "Caballo Kids Cute Cub T-Shirt",
      brand: "Caballo",
      category: "tshirt",
      ageGroup: "kids",
      description: "Adorable cub design for kids. Soft, comfortable, and cute!",
      price: 399,
      mrp: 799,
      tags: "kids,cub,cute,tiger",
      sizes: "2-3Y,4-5Y,6-7Y,8-9Y",
      sizePricing: JSON.stringify({
        "2-3Y": { price: 349, mrp: 699 },
        "4-5Y": { price: 399, mrp: 799 },
        "6-7Y": { price: 449, mrp: 899 },
        "8-9Y": { price: 499, mrp: 999 }
      }),
      stockBySizes: JSON.stringify({ "2-3Y": 10, "4-5Y": 15, "6-7Y": 12, "8-9Y": 8 }),
      totalStock: 45,
      image: "/products/Caballo-kids-cute-cub-A-0800-1.JPG",
      gallery: "/products/Caballo-kids-cute-cub-A-0800-2.JPG,/products/Caballo-kids-cute-cub-A-0800-3.png,/products/Caballo-kids-cute-cub-A-0800-4.png,/products/Caballo-kids-cute-cub-A-0800-5.jpg"
    },
    {
      slug: "caballo-kids-cute-cub-801",
      name: "Caballo Kids Cute Cub T-Shirt (Orange)",
      brand: "Caballo",
      category: "tshirt",
      ageGroup: "kids",
      description: "Vibrant orange cub design for energetic kids.",
      price: 399,
      mrp: 799,
      tags: "kids,cub,cute,tiger,orange",
      sizes: "2-3Y,4-5Y,6-7Y,8-9Y",
      sizePricing: JSON.stringify({
        "2-3Y": { price: 349, mrp: 699 },
        "4-5Y": { price: 399, mrp: 799 },
        "6-7Y": { price: 449, mrp: 899 },
        "8-9Y": { price: 499, mrp: 999 }
      }),
      stockBySizes: JSON.stringify({ "2-3Y": 8, "4-5Y": 12, "6-7Y": 10, "8-9Y": 6 }),
      totalStock: 36,
      image: "/products/Caballo-kids-cute-cub-A-0801-1.jpg"
    },
    {
      slug: "caballo-kids-cute-cub-802",
      name: "Caballo Kids Cute Cub T-Shirt (Blue)",
      brand: "Caballo",
      category: "tshirt",
      ageGroup: "kids",
      description: "Cool blue cub design for playful kids.",
      price: 399,
      mrp: 799,
      tags: "kids,cub,cute,tiger,blue",
      sizes: "2-3Y,4-5Y,6-7Y,8-9Y",
      sizePricing: JSON.stringify({
        "2-3Y": { price: 349, mrp: 699 },
        "4-5Y": { price: 399, mrp: 799 },
        "6-7Y": { price: 449, mrp: 899 },
        "8-9Y": { price: 499, mrp: 999 }
      }),
      stockBySizes: JSON.stringify({ "2-3Y": 12, "4-5Y": 18, "6-7Y": 15, "8-9Y": 10 }),
      totalStock: 55,
      image: "/products/Caballo-kids-cute-cub-A-0802-1.jpg"
    },
    {
      slug: "caballo-leopard-hat",
      name: "Caballo Leopard Hat (Free Size)",
      brand: "Caballo",
      category: "beanie-hat",
      ageGroup: "adult",
      description: "Stylish leopard print hat. One size fits all.",
      price: 299,
      mrp: 599,
      tags: "leopard,hat,beanie,accessories",
      sizes: "Free Size",
      sizePricing: JSON.stringify({
        "Free Size": { price: 299, mrp: 599 }
      }),
      stockBySizes: JSON.stringify({ "Free Size": 30 }),
      totalStock: 30,
      image: "/products/Caballo-FreeSize-Leopard-Hat.png"
    },
    {
      slug: "caballo-tigers-hat",
      name: "Caballo Tigers Hat (Free Size)",
      brand: "Caballo",
      category: "beanie-hat",
      ageGroup: "adult",
      description: "Bold tigers print hat. Perfect accessory for any outfit.",
      price: 299,
      mrp: 599,
      tags: "tiger,hat,beanie,accessories",
      sizes: "Free Size",
      sizePricing: JSON.stringify({
        "Free Size": { price: 299, mrp: 599 }
      }),
      stockBySizes: JSON.stringify({ "Free Size": 25 }),
      totalStock: 25,
      image: "/products/Caballo-freeSize-Tigers-hat-1.png"
    }
  ];

  console.log(`Adding ${products.length} products...\n`);

  for (const product of products) {
    try {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ Added: ${product.name}`);
    } catch (error) {
      console.log(`⚠️  Skipped: ${product.name} (already exists or error)`);
    }
  }

  console.log("\n✅ Seeding complete!");
  console.log(`\n📊 Total products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
