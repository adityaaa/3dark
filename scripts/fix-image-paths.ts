// scripts/fix-image-paths.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixImagePaths() {
  console.log("Fixing image paths in database...");

  const products = await prisma.product.findMany();
  
  let updated = 0;

  for (const product of products) {
    const updates: any = {};
    
    // Fix main image if it doesn't start with http or /
    if (product.image && !product.image.startsWith("http") && !product.image.startsWith("/")) {
      updates.image = `/products/${product.image}`;
      console.log(`Fixing ${product.slug}: ${product.image} -> ${updates.image}`);
    }

    // Fix gallery images
    if (product.gallery) {
      const galleryImages = product.gallery.split(",").map(img => img.trim());
      const fixedGallery = galleryImages.map(img => {
        if (!img.startsWith("http") && !img.startsWith("/")) {
          return `/products/${img}`;
        }
        return img;
      });
      
      if (fixedGallery.join(",") !== product.gallery) {
        updates.gallery = fixedGallery.join(",");
        console.log(`Fixing gallery for ${product.slug}`);
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: updates,
      });
      updated++;
    }
  }

  console.log(`\nFixed ${updated} products`);
  await prisma.$disconnect();
}

fixImagePaths().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
