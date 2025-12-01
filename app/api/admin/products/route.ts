// app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/products  -> list all products
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

// POST /api/admin/products  -> create new product
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic shaping – we mostly pass through what the form sends
    const product = await prisma.product.create({
      data: {
        slug: body.slug ?? "",
        name: body.name ?? "",
        brand: body.brand ?? "",
        description: body.description ?? "",
        price: Number(body.price ?? 0),
        mrp: Number(body.mrp ?? 0),
        glowLevel: Number(body.glowLevel ?? 0),
        tags: body.tags ?? "",
        sizes: body.sizes ?? "",
        image: body.image ?? "",
        gallery: body.gallery ?? null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
