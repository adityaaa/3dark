// app/api/admin/brands/pricing/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ProductCategory, AgeGroup } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brand, category, ageGroup, sizePricing } = body;

    console.log("Brand pricing request:", { brand, category, ageGroup, sizePricing: sizePricing?.substring(0, 100) });

    if (!brand || !category || !ageGroup || !sizePricing) {
      console.error("Missing required fields:", { brand, category, ageGroup, hasSizePricing: !!sizePricing });
      return NextResponse.json(
        { error: "Brand, category, ageGroup, and sizePricing are required" },
        { status: 400 }
      );
    }

    // Validate category and ageGroup
    const validCategories: ProductCategory[] = ["tshirt", "shorts", "pants", "beanie-hat"];
    const validAgeGroups: AgeGroup[] = ["adult", "kids"];

    if (!validCategories.includes(category as ProductCategory)) {
      console.error("Invalid category:", category);
      return NextResponse.json(
        { error: `Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validAgeGroups.includes(ageGroup as AgeGroup)) {
      console.error("Invalid age group:", ageGroup);
      return NextResponse.json(
        { error: `Invalid age group: ${ageGroup}. Must be one of: ${validAgeGroups.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate sizePricing is valid JSON
    try {
      JSON.parse(sizePricing);
    } catch (jsonErr) {
      console.error("Invalid sizePricing JSON:", jsonErr);
      return NextResponse.json(
        { error: "Invalid sizePricing format. Must be valid JSON." },
        { status: 400 }
      );
    }

    console.log("Attempting upsert for:", { brand, category, ageGroup });

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

    console.log("Brand pricing saved successfully:", brandPricing.id);
    return NextResponse.json(brandPricing);
  } catch (err: any) {
    console.error("Brand pricing save error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack?.split('\n').slice(0, 3),
    });
    return NextResponse.json(
      { error: `Failed to save brand pricing: ${err.message || 'Unknown error'}` },
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
