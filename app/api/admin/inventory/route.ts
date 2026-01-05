// app/api/admin/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/admin/inventory - Get all products with inventory status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "all", "low-stock", "out-of-stock"
    const search = searchParams.get("search") || "";

    let whereClause: any = {};

    // Search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    // Stock filter
    if (filter === "low-stock") {
      whereClause.totalStock = { gt: 0, lte: 5 }; // Between 1 and 5
    } else if (filter === "out-of-stock") {
      whereClause.totalStock = 0;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { totalStock: "asc" }, // Show low stock first
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        category: true,
        ageGroup: true,
        image: true,
        sizes: true,
        stockBySizes: true,
        totalStock: true,
        lowStockThreshold: true,
        trackInventory: true,
        createdAt: true,
      },
    });

    // Parse stockBySizes JSON
    const productsWithStock = products.map((p) => ({
      ...p,
      stockBySizes: p.stockBySizes ? JSON.parse(p.stockBySizes) : {},
      isLowStock: p.totalStock > 0 && p.totalStock <= p.lowStockThreshold,
      isOutOfStock: p.totalStock === 0,
    }));

    return NextResponse.json({ products: productsWithStock });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/inventory - Update stock for a product
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, stockBySizes, notes } = body;

    if (!productId || !stockBySizes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stockBySizes: true, totalStock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const oldStockBySizes = product.stockBySizes
      ? JSON.parse(product.stockBySizes)
      : {};

    // Calculate new total stock
    const newTotalStock = Object.values(stockBySizes as Record<string, number>).reduce(
      (sum: number, qty: number) => sum + qty,
      0
    );

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockBySizes: JSON.stringify(stockBySizes),
        totalStock: newTotalStock,
      },
    });

    // Create inventory transactions for each size that changed
    const transactions = [];
    for (const [size, newQty] of Object.entries(stockBySizes as Record<string, number>)) {
      const oldQty = oldStockBySizes[size] || 0;
      if (newQty !== oldQty) {
        transactions.push(
          prisma.inventoryTransaction.create({
            data: {
              productId,
              type: "adjustment",
              size,
              quantity: newQty - oldQty,
              previousStock: oldQty,
              newStock: newQty,
              notes: notes || "Manual stock adjustment by admin",
              createdBy: session.user.email || "admin",
            },
          })
        );
      }
    }

    await Promise.all(transactions);

    return NextResponse.json({
      success: true,
      product: {
        ...updatedProduct,
        stockBySizes: JSON.parse(updatedProduct.stockBySizes || "{}"),
      },
    });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
