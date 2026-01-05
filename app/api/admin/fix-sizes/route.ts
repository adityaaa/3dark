// app/api/admin/fix-sizes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * API endpoint to fix product sizes in the database
 * 
 * POST /api/admin/fix-sizes
 * 
 * This fixes:
 * 1. Kids products: S, M, L → 2-4 Years, 4-6 Years, etc.
 * 2. Adult RockChang tshirts: Old sizes → XS, S, M, L, XL, 2XL, 3XL  
 * 3. Adult Caballo shorts/pants: Multiple sizes → Free Size
 */

export async function POST() {
  try {
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    // Simple auth check - in production, you'd want proper admin auth
    if (authHeader !== 'Bearer fix-sizes-secret-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = {
      kidsUpdated: 0,
      adultTshirtsUpdated: 0,
      caballoBottomsUpdated: 0,
      details: [] as string[],
    };

    // 1. Fix kids products
    const kidsProducts = await prisma.product.findMany({
      where: { ageGroup: 'kids' }
    });

    const correctKidsSizes = "2-4 Years, 4-6 Years, 6-8 Years, 8-10 Years, 10-12 Years, 12-14 Years";

    for (const product of kidsProducts) {
      if (product.sizes !== correctKidsSizes) {
        await prisma.product.update({
          where: { id: product.id },
          data: { sizes: correctKidsSizes }
        });
        results.kidsUpdated++;
        results.details.push(`Updated kids product: ${product.name} (${product.sizes} → ${correctKidsSizes})`);
      }
    }

    // 2. Fix adult RockChang t-shirts
    const adultTshirts = await prisma.product.findMany({
      where: {
        ageGroup: 'adult',
        category: 'tshirt',
        OR: [
          { brand: { contains: 'RC', mode: 'insensitive' } },
          { brand: { contains: 'RockChang', mode: 'insensitive' } }
        ]
      }
    });

    const correctAdultSizes = "XS, S, M, L, XL, 2XL, 3XL";

    for (const product of adultTshirts) {
      if (product.sizes !== correctAdultSizes && product.sizes !== "Free Size") {
        await prisma.product.update({
          where: { id: product.id },
          data: { sizes: correctAdultSizes }
        });
        results.adultTshirtsUpdated++;
        results.details.push(`Updated adult tshirt: ${product.name} (${product.sizes} → ${correctAdultSizes})`);
      }
    }

    // 3. Fix adult Caballo shorts/pants
    const caballoBottoms = await prisma.product.findMany({
      where: {
        ageGroup: 'adult',
        brand: { contains: 'Caballo', mode: 'insensitive' },
        OR: [
          { category: 'shorts' },
          { category: 'pants' }
        ]
      }
    });

    for (const product of caballoBottoms) {
      if (product.sizes !== "Free Size") {
        await prisma.product.update({
          where: { id: product.id },
          data: { sizes: "Free Size" }
        });
        results.caballoBottomsUpdated++;
        results.details.push(`Updated Caballo bottom: ${product.name} (${product.sizes} → Free Size)`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product sizes updated successfully',
      results
    });

  } catch (error) {
    console.error('Error fixing sizes:', error);
    return NextResponse.json(
      { error: 'Failed to fix sizes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
