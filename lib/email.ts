// lib/email.ts - Email service using Resend
import { Resend } from "resend";

// Lazy-load Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not configured. Email sending will be disabled.");
    return null;
  }
  
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  
  return resend;
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return false;
    }
    console.log("✅ Email service (Resend) is configured");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error);
    return false;
  }
}

// Send email with HTML template
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const client = getResendClient();
    
    if (!client) {
      console.warn("⚠️ Email not sent: RESEND_API_KEY not configured");
      return null;
    }

    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM || "3Dark <order@3dark.in>",
      to: [to],
      subject,
      html,
      text: text || html.replaceAll(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    if (error) {
      console.error("❌ Email send error:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error };
  }
}

// Order confirmation email template
export function generateOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Size: ${item.size}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ₹${item.price}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <strong>₹${item.price * item.quantity}</strong>
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center;">
              <img src="https://3dark.in/logos/logo.png" alt="3Dark Logo" width="80" height="80" style="margin: 0 auto 20px; display: block;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">3DARK</h1>
              <p style="margin: 10px 0 0 0; color: #a0a0a0; font-size: 14px;">Wild Animal Fashion</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 30px;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Order Confirmed!</h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">
                Thank you for your order, ${order.customerName}!
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                Order #<strong>${order.orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 18px;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right;">₹${order.subtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: bold;">
                    ${order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #111827;">Total</td>
                  <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #111827;">
                    ₹${order.total}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb;">
              <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Shipping Address</h3>
              <p style="margin: 0; color: #374151; line-height: 1.6;">
                ${order.customerName}<br/>
                ${order.shippingAddress}<br/>
                ${order.city}, ${order.state} - ${order.pincode}
              </p>
            </td>
          </tr>

          <!-- Payment Info -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Payment Information</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Payment Method</td>
                  <td style="padding: 8px 0; text-align: right; text-transform: capitalize; font-weight: bold;">
                    ${order.paymentMethod}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Payment Status</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="padding: 4px 12px; background-color: ${
                      order.paymentStatus === "paid" ? "#d1fae5" : "#fef3c7"
                    }; color: ${
    order.paymentStatus === "paid" ? "#065f46" : "#92400e"
  }; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                      ${order.paymentStatus}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #111827; color: #9ca3af;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@3dark.com" style="color: #60a5fa; text-decoration: none;">support@3dark.com</a>
              </p>
              <p style="margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} 3Dark. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
}) {
  const html = generateOrderConfirmationEmail(order);

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.orderNumber} | 3Dark`,
    html,
  });
}

// Send order status update email
export async function sendOrderStatusEmail(
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    orderStatus: string;
    total: number;
  },
  newStatus: string
) {
  const statusMessages: Record<string, { title: string; message: string }> = {
    processing: {
      title: "Your order is being processed",
      message: "We've started preparing your order and it will be shipped soon!",
    },
    shipped: {
      title: "Your order has been shipped!",
      message: "Your order is on its way! You'll receive it within 3-5 business days.",
    },
    delivered: {
      title: "Your order has been delivered",
      message: "We hope you love your new items! Thank you for shopping with us.",
    },
    cancelled: {
      title: "Your order has been cancelled",
      message: "Your order has been cancelled. If you have any questions, please contact us.",
    },
  };

  const statusInfo = statusMessages[newStatus] || {
    title: `Order status updated to ${newStatus}`,
    message: `Your order status has been updated.`,
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center;">
              <img src="https://3dark.in/logos/logo.png" alt="3Dark Logo" width="80" height="80" style="margin: 0 auto 20px; display: block;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">3DARK</h1>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">${statusInfo.title}</h2>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">
                ${statusInfo.message}
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Order #<strong>${order.orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}" 
                 style="display: inline-block; padding: 12px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visit Our Store
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #111827; color: #9ca3af;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@3dark.com" style="color: #60a5fa; text-decoration: none;">support@3dark.com</a>
              </p>
              <p style="margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} 3Dark. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Update: ${statusInfo.title} - ${order.orderNumber} | 3Dark`,
    html,
  });
}
