// Quick script to add sample products
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Adding sample products...\n");

  const products = [
    {
      slug: "rc-unisex-black-tiger",
      name: "RC Unisex Black Tiger",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Premium black tiger print t-shirt. 100% cotton, comfortable fit.",
      price: 499,
      mrp: 999,
      tags: "tiger,black,unisex,premium",
      sizes: "S,M,L,XL",
      stock: 50,
      image: "/products/RC-unisex-black-tiger-GR-693-1.png",
      images: ["/products/RC-unisex-black-tiger-GR-693-1.png"],
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899, stock: 15 },
        M: { price: 499, mrp: 999, stock: 20 },
        L: { price: 549, mrp: 1099, stock: 10 },
        XL: { price: 599, mrp: 1199, stock: 5 }
      }),
      stockBySizes: JSON.stringify({
        S: 15, M: 20, L: 10, XL: 5
      })
    },
    {
      slug: "rc-unisex-white-tiger",
      name: "RC Unisex White Tiger",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Elegant white tiger design t-shirt. Premium quality cotton.",
      price: 499,
      mrp: 999,
      tags: "tiger,white,unisex,premium",
      sizes: "S,M,L,XL",
      stock: 40,
      image: "/products/RC-unisex-white-tiger-GR-747-1.png",
      images: ["/products/RC-unisex-white-tiger-GR-747-1.png"],
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899, stock: 10 },
        M: { price: 499, mrp: 999, stock: 15 },
        L: { price: 549, mrp: 1099, stock: 10 },
        XL: { price: 599, mrp: 1199, stock: 5 }
      }),
      stockBySizes: JSON.stringify({
        S: 10, M: 15, L: 10, XL: 5
      })
    },
    {
      slug: "caballo-adult-tiger-shorts",
      name: "Caballo Adult Tiger Shorts",
      brand: "Caballo",
      category: "shorts",
      ageGroup: "adult",
      description: "Stylish tiger print shorts. Perfect for casual wear.",
      price: 699,
      mrp: 1499,
      tags: "tiger,shorts,adult,caballo",
      sizes: "S,M,L,XL",
      stock: 30,
      image: "/products/Caballo-adult-Tiger-Shorts-A-0321-1.jpg",
      images: ["/products/Caballo-adult-Tiger-Shorts-A-0321-1.jpg"],
      sizePricing: JSON.stringify({
        S: { price: 649, mrp: 1399, stock: 8 },
        M: { price: 699, mrp: 1499, stock: 12 },
        L: { price: 749, mrp: 1599, stock: 7 },
        XL: { price: 799, mrp: 1699, stock: 3 }
      }),
      stockBySizes: JSON.stringify({
        S: 8, M: 12, L: 7, XL: 3
      })
    },
    {
      slug: "caballo-kids-cute-cub",
      name: "Caballo Kids Cute Cub",
      brand: "Caballo",
      category: "tshirt",
      ageGroup: "kids",
      description: "Adorable cub print for kids. Soft and comfortable.",
      price: 399,
      mrp: 799,
      tags: "kids,cub,cute,caballo",
      sizes: "2-3Y,4-5Y,6-7Y,8-9Y",
      stock: 25,
      image: "/products/Caballo-kids-cute-cub-A-0800-1.JPG",
      images: ["/products/Caballo-kids-cute-cub-A-0800-1.JPG"],
      sizePricing: JSON.stringify({
        "2-3Y": { price: 349, mrp: 699, stock: 8 },
        "4-5Y": { price: 399, mrp: 799, stock: 10 },
        "6-7Y": { price: 449, mrp: 899, stock: 5 },
        "8-9Y": { price: 499, mrp: 999, stock: 2 }
      }),
      stockBySizes: JSON.stringify({
        "2-3Y": 8, "4-5Y": 10, "6-7Y": 5, "8-9Y": 2
      })
    },
    {
      slug: "rc-unisex-lion",
      name: "RC Unisex Lion",
      brand: "Radhey Collection",
      category: "tshirt",
      ageGroup: "adult",
      description: "Bold lion print t-shirt. Make a statement!",
      price: 499,
      mrp: 999,
      tags: "lion,unisex,bold,premium",
      sizes: "S,M,L,XL",
      stock: 35,
      image: "/products/RC-unisex-lion-GR-691-1.jpeg",
      images: ["/products/RC-unisex-lion-GR-691-1.jpeg"],
      sizePricing: JSON.stringify({
        S: { price: 449, mrp: 899, stock: 9 },
        M: { price: 499, mrp: 999, stock: 14 },
        L: { price: 549, mrp: 1099, stock: 8 },
        XL: { price: 599, mrp: 1199, stock: 4 }
      }),
      stockBySizes: JSON.stringify({
        S: 9, M: 14, L: 8, XL: 4
      })
    },
    {
      slug: "caballo-freesize-leopard-hat",
      name: "Caballo Free Size Leopard Hat",
      brand: "Caballo",
      category: "cap",
      ageGroup: "adult",
      description: "Trendy leopard print cap. One size fits all.",
      price: 299,
      mrp: 699,
      tags: "leopard,hat,cap,freesize",
      sizes: "Free Size",
      stock: 20,
      image: "/products/Caballo-FreeSize-Leopard-Hat.png",
      images: ["/products/Caballo-FreeSize-Leopard-Hat.png"],
      sizePricing: JSON.stringify({
        "Free Size": { price: 299, mrp: 699, stock: 20 }
      }),
      stockBySizes: JSON.stringify({
        "Free Size": 20
      })
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log(`\n🎉 Added ${products.length} sample products!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
