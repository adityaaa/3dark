// app/api/payment/webhook/route.ts - Razorpay Webhook Handler

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const crypto = require("node:crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse the event
    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    console.log("Webhook event:", eventType);

    // Handle different event types
    switch (eventType) {
      case "payment.captured":
      case "payment.authorized":
      case "order.paid": {
        const paymentEntity = payload.payment?.entity || payload.order?.entity;
        if (!paymentEntity) break;

        const orderNumber = paymentEntity.notes?.orderNumber;
        if (!orderNumber) break;

        // Update order status
        await prisma.order.update({
          where: { orderNumber },
          data: {
            razorpayPaymentId: paymentEntity.id,
            paymentStatus: "paid",
            orderStatus: "confirmed",
          },
        });

        console.log(`Order ${orderNumber} marked as paid`);
        break;
      }

      case "payment.failed": {
        const paymentEntity = payload.payment.entity;
        const orderNumber = paymentEntity.notes?.orderNumber;
        if (!orderNumber) break;

        await prisma.order.update({
          where: { orderNumber },
          data: {
            razorpayPaymentId: paymentEntity.id,
            paymentStatus: "failed",
          },
        });

        console.log(`Order ${orderNumber} payment failed`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
