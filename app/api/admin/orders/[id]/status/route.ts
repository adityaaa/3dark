import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

    // Send order confirmation email to customer and admin when confirmed
    if (orderStatus === "confirmed") {
      // Fetch order items
      const items = await prisma.orderItem.findMany({
        where: { orderId: updatedOrder.id },
        select: { name: true, size: true, quantity: true, price: true },
      });
      // Prepare order data for email
      const orderEmailData = {
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        items,
        subtotal: updatedOrder.subtotal,
        shipping: updatedOrder.shipping,
        total: updatedOrder.total,
        shippingAddress: updatedOrder.shippingAddress,
        city: updatedOrder.city,
        state: updatedOrder.state,
        pincode: updatedOrder.pincode,
        paymentMethod: updatedOrder.paymentMethod,
        paymentStatus: updatedOrder.paymentStatus,
      };
      // Send to customer
      await sendOrderConfirmationEmail(orderEmailData);
      // Send to admin
      await sendOrderConfirmationEmail({ ...orderEmailData, customerEmail: "order@3dark.in" });
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
