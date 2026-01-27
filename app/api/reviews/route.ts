import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminReviewNotificationEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

// GET /api/reviews?productId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Count ratings by star
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
      }
    });

    return NextResponse.json({
      success: true,
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        customerName: r.customerName,
        isVerified: r.isVerified,
        createdAt: r.createdAt,
      })),
      stats: {
        average: Math.round(avgRating * 10) / 10,
        total: reviews.length,
        counts: ratingCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Customer submits review (only after delivery)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, productId, rating, title, comment, customerId, customerName } = body;
    const parsedOrderId = orderId ? parseInt(orderId) : null;
    const parsedProductId = parseInt(productId);
    const parsedCustomerId = customerId ? parseInt(customerId) : null;

    // Validate input
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // If orderId is provided, verify the order is delivered
    if (parsedOrderId) {
      const order = await prisma.order.findUnique({
        where: { id: parsedOrderId },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      if (order.orderStatus !== "delivered") {
        return NextResponse.json(
          { error: "You can only review products after delivery" },
          { status: 403 }
        );
      }

      // Check if review already exists for this order-product combination
      const existingReview = await prisma.review.findFirst({
        where: {
          orderId: parsedOrderId,
          productId: parsedProductId,
        },
      });

      if (existingReview) {
        if (
          (existingReview.customerId && parsedCustomerId && existingReview.customerId !== parsedCustomerId) ||
          (existingReview.customerId && !parsedCustomerId)
        ) {
          return NextResponse.json(
            { error: "You are not allowed to update this review" },
            { status: 403 }
          );
        }

        const updatedReview = await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            rating,
            title: title || null,
            comment,
            customerName: customerName || existingReview.customerName,
          },
        });

        const [product, orderRecord] = await Promise.all([
          prisma.product.findUnique({
            where: { id: parsedProductId },
            select: { name: true },
          }),
          prisma.order.findUnique({
            where: { id: parsedOrderId },
            select: { orderNumber: true, customerEmail: true, customerName: true },
          }),
        ]);

        if (product) {
          await sendAdminReviewNotificationEmail({
            productName: product.name,
            rating: updatedReview.rating,
            title: updatedReview.title,
            comment: updatedReview.comment,
            customerName: customerName || orderRecord?.customerName || "Customer",
            customerEmail: orderRecord?.customerEmail,
            orderNumber: orderRecord?.orderNumber,
          });
        }

        return NextResponse.json(
          {
            success: true,
            review: {
              id: updatedReview.id,
              rating: updatedReview.rating,
              title: updatedReview.title,
              comment: updatedReview.comment,
              customerName: updatedReview.customerName,
              isVerified: updatedReview.isVerified,
            },
          }
        );
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: parsedProductId,
        customerId: parsedCustomerId,
        orderId: parsedOrderId,
        rating,
        title: title || null,
        comment,
        customerName,
        isVerified: !!parsedOrderId, // Verified if from an order
        isFake: false,
      },
    });

    const [product, orderRecord] = await Promise.all([
      prisma.product.findUnique({
        where: { id: parsedProductId },
        select: { name: true },
      }),
      parsedOrderId
        ? prisma.order.findUnique({
            where: { id: parsedOrderId },
            select: { orderNumber: true, customerEmail: true, customerName: true },
          })
        : Promise.resolve(null),
    ]);

    if (product) {
      await sendAdminReviewNotificationEmail({
        productName: product.name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        customerName: customerName || orderRecord?.customerName || "Customer",
        customerEmail: orderRecord?.customerEmail,
        orderNumber: orderRecord?.orderNumber,
      });
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        customerName: review.customerName,
        isVerified: review.isVerified,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
