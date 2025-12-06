// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand,
        description: body.description,
        price: body.price,
        mrp: body.mrp,
        tags: body.tags,
        sizes: body.sizes,
        sizePricing: body.sizePricing ?? null,
        image: body.image,
        gallery: body.gallery ?? null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
