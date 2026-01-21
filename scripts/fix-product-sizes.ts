/**
 * Script to fix product sizes in the database
 * 
 * Run with: npx tsx scripts/fix-product-sizes.ts
 * 
 * This script updates:
 * 1. Kids products: S, M, L → 2-4 Years, 4-6 Years, etc.
 * 2. Adult RockChang tshirts: S, M, L, XL, XXL, XXXL → XS, S, M, L, XL, 2XL, 3XL
 * 3. Adult Caballo shorts/pants: Multiple sizes → Free Size
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Starting product size fix...\n');

  // 1. Fix kids products
  console.log('📦 Updating kids products to age-based sizes...');
  const kidsProducts = await prisma.product.findMany({
    where: { ageGroup: 'kids' }
  });

  for (const product of kidsProducts) {
    const correctSizes = "2-4 Years, 4-6 Years, 6-8 Years, 8-10 Years, 10-12 Years, 12-14 Years";
    
    if (product.sizes !== correctSizes) {
      console.log(`  ✓ Updating "${product.name}"`);
      console.log(`    Old sizes: ${product.sizes}`);
      console.log(`    New sizes: ${correctSizes}`);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { sizes: correctSizes }
      });
    } else {
      console.log(`  ✓ "${product.name}" - already correct`);
    }
  }

  // 2. Fix adult RockChang t-shirts (brand contains "RC" or "RockChang")
  console.log('\n👕 Updating adult RockChang t-shirts to XS-3XL...');
  const adultTshirts = await prisma.product.findMany({
    where: {
      ageGroup: 'adult',
      category: 'tshirt',
      OR: [
        // { brand: { contains: 'RC', mode: 'insensitive' } },
        // { brand: { contains: 'RockChang', mode: 'insensitive' } }
        // TEMPORARY FIX: 'mode' is not supported here in some Prisma versions. Use case-sensitive for now.
        { brand: { contains: 'RC' } },
        { brand: { contains: 'RockChang' } }
      ]
    }
  });

  const correctAdultSizes = "XS, S, M, L, XL, 2XL, 3XL";

  for (const product of adultTshirts) {
    if (product.sizes !== correctAdultSizes && product.sizes !== "Free Size") {
      console.log(`  ✓ Updating "${product.name}"`);
      console.log(`    Old sizes: ${product.sizes}`);
      console.log(`    New sizes: ${correctAdultSizes}`);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { sizes: correctAdultSizes }
      });
    } else {
      console.log(`  ✓ "${product.name}" - already correct`);
    }
  }

  // 3. Fix adult Caballo shorts/pants to Free Size
  console.log('\n🩳 Updating adult Caballo shorts/pants to Free Size...');
  const caballoBottoms = await prisma.product.findMany({
    where: {
      ageGroup: 'adult',
      brand: { contains: 'Caballo' /*, mode: 'insensitive' */ }, // TEMPORARY FIX
      OR: [
        { category: 'shorts' },
        { category: 'pants' }
      ]
    }
  });

  for (const product of caballoBottoms) {
    if (product.sizes !== "Free Size") {
      console.log(`  ✓ Updating "${product.name}"`);
      console.log(`    Old sizes: ${product.sizes}`);
      console.log(`    New sizes: Free Size`);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { sizes: "Free Size" }
      });
    } else {
      console.log(`  ✓ "${product.name}" - already correct`);
    }
  }

  console.log('\n✅ Product size fix complete!\n');
  
  // Summary
  console.log('📊 Summary:');
  const totalKids = await prisma.product.count({ where: { ageGroup: 'kids' } });
  const totalAdultTshirts = await prisma.product.count({ 
    where: { 
      ageGroup: 'adult', 
      category: 'tshirt',
      OR: [
        // { brand: { contains: 'RC', mode: 'insensitive' } },
        // { brand: { contains: 'RockChang', mode: 'insensitive' } }
        { brand: { contains: 'RC' } },
        { brand: { contains: 'RockChang' } }
      ]
    } 
  });
  const totalCaballoBottoms = await prisma.product.count({
    where: {
      ageGroup: 'adult',
      brand: { contains: 'Caballo' /*, mode: 'insensitive' */ }, // TEMPORARY FIX
      OR: [{ category: 'shorts' }, { category: 'pants' }]
    }
  });

  console.log(`  Kids products: ${totalKids}`);
  console.log(`  Adult RC t-shirts: ${totalAdultTshirts}`);
  console.log(`  Adult Caballo shorts/pants: ${totalCaballoBottoms}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
