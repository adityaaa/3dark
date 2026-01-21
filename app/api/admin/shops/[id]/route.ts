import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/admin/shops/[id] - Update shop
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopId = Number.parseInt(params.id);
    if (Number.isNaN(shopId)) {
      return NextResponse.json({ error: "Invalid shop ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, location, address, contact, whatsapp, email, ownerName, notes } = body;

    if (!name || !location || !contact) {
      return NextResponse.json(
        { error: "Name, location, and contact are required" },
        { status: 400 }
      );
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!existingShop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Update shop
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        name,
        location,
        address,
        contact,
        whatsapp,
        email,
        ownerName,
        notes,
      },
    });

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/shops/[id] - Toggle shop status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopId = Number.parseInt(params.id);
    if (Number.isNaN(shopId)) {
      return NextResponse.json({ error: "Invalid shop ID" }, { status: 400 });
    }

    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!existingShop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Update shop status
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { isActive },
    });

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error("Error updating shop status:", error);
    return NextResponse.json(
      { error: "Failed to update shop status" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/shops/[id] - Delete shop (soft delete by setting isActive to false)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopId = Number.parseInt(params.id);
    if (Number.isNaN(shopId)) {
      return NextResponse.json({ error: "Invalid shop ID" }, { status: 400 });
    }

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!existingShop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { error: "Failed to delete shop" },
      { status: 500 }
    );
  }
}
