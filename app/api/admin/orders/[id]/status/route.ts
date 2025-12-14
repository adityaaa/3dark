import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH /api/admin/orders/[id]/status - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { orderStatus, shopId, shopNotes, trackingNumber, trackingUrl } = body;

    if (!orderStatus) {
      return NextResponse.json(
        { error: "Order status is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Prepare update data based on status
    const updateData: any = {
      orderStatus,
    };

    // Set timestamps based on status
    switch (orderStatus) {
      case "confirmed":
        updateData.confirmedAt = new Date();
        if (shopNotes) updateData.shopNotes = shopNotes;
        break;
      case "sourcing":
        updateData.sourcedAt = new Date();
        break;
      case "packing":
        updateData.packedAt = new Date();
        break;
      case "shipped":
        updateData.shippedAt = new Date();
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (trackingUrl) updateData.trackingUrl = trackingUrl;
        break;
      case "delivered":
        updateData.deliveredAt = new Date();
        break;
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // If confirmed, create OrderSource record
    if (orderStatus === "confirmed" && shopId) {
      await prisma.orderSource.create({
        data: {
          orderId: updatedOrder.id,
          shopId: parseInt(shopId),
          notes: shopNotes || null,
        },
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
