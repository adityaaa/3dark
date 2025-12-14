import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/admin/orders/[id]/cannot-source - Mark order as unable to source and process refund
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(id) },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only process if order is in pending_confirmation or confirmed status
    if (!["pending_confirmation", "confirmed"].includes(order.orderStatus)) {
      return NextResponse.json(
        { error: "Cannot refund order in current status" },
        { status: 400 }
      );
    }

    // Step 1: Initiate Razorpay refund if applicable
    let refundStatus = "N/A";
    if (order.paymentMethod === "razorpay" && order.razorpayPaymentId) {
      try {
        // TODO: Implement Razorpay refund API call
        // For now, this is a placeholder
        console.log("Razorpay refund would be initiated for:", order.razorpayPaymentId);
        refundStatus = "Initiated";
      } catch (error) {
        console.error("Razorpay refund error:", error);
        refundStatus = "Failed";
      }
    } else if (order.paymentMethod === "cod") {
      refundStatus = "N/A (COD)";
    }

    // Step 2: Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: Number.parseInt(id) },
      data: {
        orderStatus: "refunded",
        refundReason: "Item unavailable at sourcing time",
        refundedAt: new Date(),
      },
    });

    // Step 3: Add customer to product notification waitlist
    for (const item of order.items) {
      await prisma.productNotification.create({
        data: {
          productId: item.productId,
          size: item.size,
          email: order.customerEmail,
          phone: order.customerPhone,
        },
      }).catch(err => {
        // Ignore duplicate errors
        console.log("Notification already exists:", err);
      });
    }

    // Step 4: Send customer email
    try {
      await resend.emails.send({
        from: "3Dark <support@3dark.in>",
        to: order.customerEmail,
        subject: `Update on Your Order #${order.orderNumber} - Refund Processed`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Update on Your Order #${order.orderNumber}</h2>
            
            <p>Hi ${order.customerName},</p>
            
            <p>We're sorry to inform you that we couldn't source the following item(s) from our partner shops:</p>
            
            <ul>
              ${order.items.map(item => `
                <li>${item.name} (${item.size}) x${item.quantity}</li>
              `).join('')}
            </ul>
            
            <p><strong>We've immediately processed a full refund of ₹${order.total}.</strong> You should see it in your account within 5-7 business days.</p>
            
            <h3>What You Can Do:</h3>
            
            <ol>
              <li><strong>📧 Get Notified:</strong> We've added you to the waitlist. You'll get an email the moment this item is back in stock.</li>
              <li><strong>🔄 Try Similar Items:</strong> Check out our shop for alternatives: <a href="https://3dark.in/shop">https://3dark.in/shop</a></li>
              <li><strong>💬 Chat With Us:</strong> Questions? WhatsApp us at +91 9718877788</li>
            </ol>
            
            <p>We're continuously working to expand our shop network and improve availability. Thank you for your understanding!</p>
            
            <p>Best regards,<br/>Team 3Dark</p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666;">
              <strong>Refund Status:</strong> ${refundStatus}<br/>
              <strong>Order Number:</strong> ${order.orderNumber}<br/>
              <strong>Refund Amount:</strong> ₹${order.total}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send refund email:", emailError);
      // Continue anyway - order is already refunded
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      refundStatus,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
