// app/api/admin/brands/pricing/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ProductCategory, AgeGroup } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brand, category, ageGroup, sizePricing } = body;

    if (!brand || !category || !ageGroup || !sizePricing) {
      return NextResponse.json(
        { error: "Brand, category, ageGroup, and sizePricing are required" },
        { status: 400 }
      );
    }

    // Validate category and ageGroup
    const validCategories: ProductCategory[] = ["tshirt", "shorts", "pants", "beanie-hat"];
    const validAgeGroups: AgeGroup[] = ["adult", "kids"];

    if (!validCategories.includes(category as ProductCategory)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (!validAgeGroups.includes(ageGroup as AgeGroup)) {
      return NextResponse.json(
        { error: "Invalid age group" },
        { status: 400 }
      );
    }

    // Upsert brand pricing for specific category+ageGroup
    const brandPricing = await prisma.brandPricing.upsert({
      where: {
        brand_category_ageGroup: {
          brand,
          category,
          ageGroup,
        },
      },
      update: {
        sizePricing,
        updatedAt: new Date(),
      },
      create: {
        brand,
        category,
        ageGroup,
        sizePricing,
      },
    });

    return NextResponse.json(brandPricing);
  } catch (err: any) {
    console.error("Brand pricing save error:", err);
    return NextResponse.json(
      { error: "Failed to save brand pricing" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const brandPricings = await prisma.brandPricing.findMany({
      orderBy: { brand: 'asc' },
    });
    return NextResponse.json(brandPricings);
  } catch (err: any) {
    console.error("Brand pricing fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch brand pricings" },
      { status: 500 }
    );
  }
}
