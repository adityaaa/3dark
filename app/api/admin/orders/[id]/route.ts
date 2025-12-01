import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderStatusEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { orderStatus, paymentStatus } = await req.json();
    const orderId = Number.parseInt(params.id);

    // Get old order status before update
    const oldOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        paymentStatus,
      },
    });

    // Send status update email if status changed
    if (oldOrder && oldOrder.orderStatus !== orderStatus) {
      try {
        await sendOrderStatusEmail(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            orderStatus: order.orderStatus,
            total: order.total,
          },
          orderStatus
        );
        console.log("✅ Order status email sent");
      } catch (emailError) {
        console.error("❌ Failed to send status update email:", emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
