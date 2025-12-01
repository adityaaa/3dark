// app/api/payment/verify/route.ts - Verify Razorpay payment

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order in database
    const order = await prisma.order.update({
      where: { id: Number.parseInt(orderId) },
      data: {
        paymentId: razorpay_payment_id,
        paymentStatus: "paid",
        orderStatus: "confirmed",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
