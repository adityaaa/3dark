// app/api/admin/brands/pricing/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brand, sizePricing } = body;

    if (!brand || !sizePricing) {
      return NextResponse.json(
        { error: "Brand and sizePricing are required" },
        { status: 400 }
      );
    }

    // Upsert brand pricing
    const brandPricing = await prisma.brandPricing.upsert({
      where: { brand },
      update: {
        sizePricing,
        updatedAt: new Date(),
      },
      create: {
        brand,
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
