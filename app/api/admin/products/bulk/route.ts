// app/api/admin/products/bulk/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Bulk DELETE products
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No product IDs provided" },
        { status: 400 }
      );
    }

    // Delete products
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(
      {
        message: `${result.count} product(s) deleted successfully`,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Bulk delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 }
    );
  }
}

// Bulk UPDATE products
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, updates } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No product IDs provided" },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No updates provided" },
        { status: 400 }
      );
    }

    // Handle discount application separately
    if (updates.applyDiscount) {
      const discountPercent = Number(updates.applyDiscount);
      
      if (discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json(
          { error: "Discount must be between 0 and 100" },
          { status: 400 }
        );
      }

      // Get all products to update
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
      });

      // Update each product's price based on MRP
      const updatePromises = products.map((product) => {
        const newPrice = Math.round(product.mrp * (1 - discountPercent / 100));
        return prisma.product.update({
          where: { id: product.id },
          data: { price: newPrice },
        });
      });

      await Promise.all(updatePromises);

      // Also apply other updates if provided
      const otherUpdates: any = { ...updates };
      delete otherUpdates.applyDiscount;

      if (Object.keys(otherUpdates).length > 0) {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: otherUpdates,
        });
      }

      return NextResponse.json(
        {
          message: `${products.length} product(s) updated with ${discountPercent}% discount`,
          count: products.length,
        },
        { status: 200 }
      );
    }

    // Regular bulk update
    const result = await prisma.product.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: updates,
    });

    return NextResponse.json(
      {
        message: `${result.count} product(s) updated successfully`,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Bulk update error:", err);
    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 }
    );
  }
}
