// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteParams = { params: { id: string } };

export async function GET(_req: Request, { params }: RouteParams) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: RouteParams) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
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
    return NextResponse.json(product);
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
