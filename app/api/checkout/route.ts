import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/payment";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=== CHECKOUT REQUEST ===");
    console.log("Full body:", JSON.stringify(body, null, 2));
    
    const { customer, items, paymentMethod } = body;
    
    console.log("Parsed values:");
    console.log("- customer:", customer);
    console.log("- items:", items);
    console.log("- paymentMethod:", paymentMethod);

    // Validate input
    if (!customer || !items || items.length === 0) {
      console.error("❌ VALIDATION FAILED");
      console.error("- hasCustomer:", !!customer);
      console.error("- hasItems:", !!items);
      console.error("- itemsLength:", items?.length);
      console.error("- customerKeys:", customer ? Object.keys(customer) : "null");
      
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          debug: { 
            hasCustomer: !!customer, 
            hasItems: !!items, 
            itemsLength: items?.length,
            receivedKeys: Object.keys(body)
          } 
        },
        { status: 400 }
      );
    }
    
    console.log("✅ Validation passed");

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    );
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        subtotal,
        shipping,
        total,
        paymentMethod: paymentMethod || "razorpay",
        paymentStatus: "pending",
        orderStatus: "pending",
        notes: customer.notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            size: item.size,
            quantity: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map((item) => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shippingAddress,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      });
      console.log("✅ Order confirmation email sent");
    } catch (emailError) {
      console.error("❌ Failed to send order confirmation email:", emailError);
      // Don't fail the order if email fails
    }

    // If COD, return success immediately
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        method: "cod",
      });
    }

    // For Razorpay, create payment order
    if (paymentMethod === "razorpay" && process.env.RAZORPAY_KEY_ID) {
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100, // Amount in paise
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderId: order.id.toString(),
          orderNumber,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        method: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Fallback if no payment gateway configured
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      method: "pending",
      message: "Payment gateway not configured. Order created as pending.",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
