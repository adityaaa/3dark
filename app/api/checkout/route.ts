import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/payment";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=== CHECKOUT REQUEST ===");
    console.log("Full body:", JSON.stringify(body, null, 2));
    
    const { customer, items, paymentMethod } = body;
    
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    let customerId = null;
    
    if (session?.user?.email && (session.user as any).role === "customer") {
      const customerRecord = await prisma.customer.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      customerId = customerRecord?.id || null;
      console.log("✅ Logged in customer:", customerId);
    } else {
      console.log("ℹ️ Guest checkout");
    }
    
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

    if (!customerId && customer?.email) {
      const customerRecord = await prisma.customer.findUnique({
        where: { email: customer.email },
        select: { id: true },
      });
      customerId = customerRecord?.id || null;
      if (customerId) {
        console.log("✅ Linked order to existing customer by email:", customerId);
      }
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    );
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order in database (link to customer if logged in)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId, // Link to customer account if logged in
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
        orderStatus: paymentMethod === "cod" ? "pending" : "pending_payment", // COD orders need manual confirmation, Razorpay waits for payment
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

    // Fetch product images for each order item
    const productIds = order.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, image: true },
    });
    const productImageMap = Object.fromEntries(products.map(p => [p.id, p.image]));

    // Send order confirmation email (optional - won't fail order if email fails)
    try {
      const orderEmailData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: order.items.map((item) => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: productImageMap[item.productId] || null,
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
      };
      
      // Try to send emails, but don't fail if email service is unavailable
      try {
        await sendOrderConfirmationEmail(orderEmailData);
        console.log("✅ Order confirmation email sent to customer");
      } catch (emailError: any) {
        console.error("❌ Email send error (customer):", emailError.message || emailError);
      }
      
      try {
        await sendAdminOrderNotificationEmail(orderEmailData);
        console.log("✅ Admin notification email sent");
      } catch (emailError: any) {
        console.error("❌ Email send error (admin):", emailError.message || emailError);
      }
    } catch (emailError) {
      console.error("❌ Email preparation failed:", emailError);
      // Continue with order creation even if email fails
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
    if (paymentMethod === "razorpay") {
      // Check if Razorpay credentials are configured
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("❌ Razorpay credentials not configured");
        // Fall back to COD for this order
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            paymentMethod: "cod",
            paymentStatus: "pending",
            notes: order.notes 
              ? `${order.notes}\n\nNote: Payment gateway unavailable, converted to COD`
              : "Payment gateway unavailable, converted to COD"
          },
        });
        
        return NextResponse.json({
          success: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
          method: "cod",
          message: "Payment gateway temporarily unavailable. Order converted to Cash on Delivery.",
        });
      }

      try {
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
      } catch (razorpayError: any) {
        console.error("❌ Razorpay API error:", razorpayError);
        
        // Fall back to COD if Razorpay fails
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            paymentMethod: "cod",
            paymentStatus: "pending",
            notes: order.notes 
              ? `${order.notes}\n\nNote: Payment gateway error, converted to COD`
              : "Payment gateway error, converted to COD"
          },
        });
        
        return NextResponse.json({
          success: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
          method: "cod",
          message: "Payment gateway error. Order converted to Cash on Delivery.",
        });
      }
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
