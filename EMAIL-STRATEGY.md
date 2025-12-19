# 📧 Email Strategy - 3Dark.in

## Email Addresses & Their Use Cases

### 1. `order@3dark.in` (Primary Order Communications)

**Use For:**
- ✅ Order confirmations
- ✅ Payment confirmations
- ✅ Order status updates
- ✅ Shipping notifications
- ✅ Delivery confirmations
- ✅ Invoice/receipt emails

**Why Use This:**
- Professional and trustworthy
- Clearly indicates it's about orders
- Customers can reply with order-related questions
- Can be monitored for order issues

**Current Status:** ✅ Set as default in code

---

### 2. `support@3dark.in` (Customer Service)

**Use For:**
- ✅ Contact form submissions
- ✅ Customer inquiry responses
- ✅ Support ticket replies
- ✅ Return/refund communications
- ✅ Product questions
- ✅ General customer service

**Why Use This:**
- Dedicated support channel
- Easy for customers to remember
- Shows you have a support system
- Can forward to your personal email

**Where It's Used:**
- `/app/support/page.tsx` - Support page contact info
- `/app/about/page.tsx` - About page contact info

---

### 3. `no-reply@3dark.in` (Automated/System Emails)

**Use For:**
- ✅ Password reset emails
- ✅ Account verification emails
- ✅ Bulk marketing emails
- ✅ Newsletter subscriptions
- ✅ Automated system notifications
- ✅ Promotional campaigns

**Why Use This:**
- Indicates no human monitoring
- Prevents inbox overload
- Standard for automated emails
- Can still include "Reply to: support@3dark.in" in footer

**Best Practice:** 
Always include in the email body:
> "This is an automated email. For support, contact support@3dark.in"

---

## 📋 Email Flow Matrix

### Customer Journey Emails

| Event | From Address | Subject Line | When to Send |
|-------|-------------|--------------|--------------|
| **Order Placed** | `order@3dark.in` | "Order Confirmation #12345" | Immediately after checkout |
| **Payment Success** | `order@3dark.in` | "Payment Received - Order #12345" | After Razorpay confirmation |
| **Payment Failed** | `order@3dark.in` | "Payment Issue - Order #12345" | If payment fails |
| **Order Processing** | `order@3dark.in` | "We're Preparing Your Order #12345" | When you start packing |
| **Shipped** | `order@3dark.in` | "Your Order is On Its Way! #12345" | When shipped with courier |
| **Out for Delivery** | `order@3dark.in` | "Arriving Today! Order #12345" | Day of delivery |
| **Delivered** | `order@3dark.in` | "Order Delivered #12345" | After delivery confirmation |
| **Return Request** | `support@3dark.in` | "Return Request Received #12345" | Customer initiates return |
| **Refund Processed** | `order@3dark.in` | "Refund Processed - Order #12345" | After refund issued |

### Account Management Emails

| Event | From Address | Subject Line | When to Send |
|-------|-------------|--------------|--------------|
| **Welcome/Registration** | `no-reply@3dark.in` | "Welcome to 3Dark!" | After account creation |
| **Email Verification** | `no-reply@3dark.in` | "Verify Your Email" | During registration |
| **Password Reset** | `no-reply@3dark.in` | "Reset Your Password" | When requested |
| **Password Changed** | `no-reply@3dark.in` | "Password Updated" | After password change |
| **Profile Updated** | `no-reply@3dark.in` | "Profile Changes Saved" | After profile edit |

### Marketing Emails

| Event | From Address | Subject Line | When to Send |
|-------|-------------|--------------|--------------|
| **Newsletter** | `no-reply@3dark.in` | "New Arrivals This Week!" | Weekly/monthly |
| **Sale Announcement** | `no-reply@3dark.in` | "Flash Sale - 30% Off!" | During promotions |
| **Abandoned Cart** | `order@3dark.in` | "You Left Something Behind..." | 1-24 hours after abandonment |
| **Product Back in Stock** | `no-reply@3dark.in` | "It's Back! [Product Name]" | When item restocked |
| **Birthday Discount** | `no-reply@3dark.in` | "Happy Birthday! Here's a Gift 🎂" | Customer birthday |

### Support/Service Emails

| Event | From Address | Subject Line | When to Send |
|-------|-------------|--------------|--------------|
| **Contact Form Reply** | `support@3dark.in` | "Re: Your Inquiry" | Response to contact form |
| **Product Question** | `support@3dark.in` | "Re: Question About [Product]" | Answer to product query |
| **Review Request** | `order@3dark.in` | "How Was Your Order?" | 3-7 days after delivery |
| **Feedback Survey** | `no-reply@3dark.in` | "Tell Us What You Think" | After order completion |

---

## 🔧 Implementation in Your Code

### Current Setup (Already Done ✅)

**File:** `/lib/email.ts`
```typescript
// Default from address
from: process.env.EMAIL_FROM || "3Dark <order@3dark.in>"
```

**Environment Variable:**
```bash
EMAIL_FROM="3Dark <order@3dark.in>"
```

---

### Recommended: Support Multiple "From" Addresses

**Option 1: Environment Variables (Simple)**

Update `.env.example` and Vercel:
```bash
# Primary email addresses
EMAIL_ORDER="3Dark <order@3dark.in>"       # Order-related
EMAIL_SUPPORT="3Dark Support <support@3dark.in>"  # Customer service
EMAIL_NOREPLY="3Dark <no-reply@3dark.in>"  # Automated

# Default fallback
EMAIL_FROM="3Dark <order@3dark.in>"
```

**Option 2: Email Config Object (Recommended)**

Create `/lib/email-config.ts`:
```typescript
export const EMAIL_CONFIG = {
  order: process.env.EMAIL_ORDER || "3Dark <order@3dark.in>",
  support: process.env.EMAIL_SUPPORT || "3Dark Support <support@3dark.in>",
  noreply: process.env.EMAIL_NOREPLY || "3Dark <no-reply@3dark.in>",
  default: process.env.EMAIL_FROM || "3Dark <order@3dark.in>",
};

export type EmailType = 'order' | 'support' | 'noreply' | 'default';

export function getEmailFrom(type: EmailType = 'default'): string {
  return EMAIL_CONFIG[type];
}
```

Then update `/lib/email.ts`:
```typescript
import { getEmailFrom, type EmailType } from './email-config';

export async function sendEmail({
  to,
  subject,
  html,
  text,
  emailType = 'default',
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  emailType?: EmailType;
}) {
  // ...existing code...
  
  const { data, error } = await client.emails.send({
    from: getEmailFrom(emailType),  // Dynamic based on email type
    to: [to],
    subject,
    html,
    text: text || html.replaceAll(/<[^>]*>/g, ""),
  });
  
  // ...rest of code...
}
```

**Usage Example:**
```typescript
// Order confirmation
await sendOrderConfirmationEmail({
  to: customer.email,
  orderNumber: "12345",
  emailType: 'order',  // Uses order@3dark.in
});

// Support reply
await sendSupportEmail({
  to: customer.email,
  subject: "Re: Your Question",
  emailType: 'support',  // Uses support@3dark.in
});

// Welcome email
await sendWelcomeEmail({
  to: customer.email,
  emailType: 'noreply',  // Uses no-reply@3dark.in
});
```

---

## 📊 Current Implementation Status

### ✅ What's Already Working

**Order Confirmation Email:**
- **From:** `order@3dark.in` (after you update Vercel)
- **To:** Customer email
- **When:** After successful checkout
- **File:** `/app/api/checkout/route.ts` calls `sendOrderConfirmationEmail()`

### 🔧 What to Add (Future)

1. **Shipping Notifications** (when you add shipping tracking)
2. **Welcome Email** (after account registration)
3. **Password Reset** (when implementing forgot password)
4. **Review Requests** (3-7 days after delivery)
5. **Abandoned Cart** (optional, for marketing)

---

## 💡 Best Practices

### 1. Always Include Reply-To Header
```typescript
const { data, error } = await client.emails.send({
  from: "3Dark <no-reply@3dark.in>",
  replyTo: "support@3dark.in",  // Replies go to support
  to: [to],
  subject,
  html,
});
```

### 2. Email Footer Template
Every email should include:
```html
<footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
  <p style="font-size: 12px; color: #666;">
    Questions? Contact us at 
    <a href="mailto:support@3dark.in">support@3dark.in</a>
  </p>
  <p style="font-size: 12px; color: #666;">
    3Dark - Premium Wildlife Apparel<br>
    <a href="https://3dark.in">3dark.in</a>
  </p>
  <p style="font-size: 10px; color: #999;">
    This email was sent to {{customer.email}}. 
    If you didn't request this, please ignore it.
  </p>
</footer>
```

### 3. Email Subject Line Best Practices
- ✅ Include order number for order emails
- ✅ Keep under 50 characters
- ✅ Use action words (Confirmed, Shipped, Delivered)
- ✅ Add emoji for engagement (optional): 📦 🎉 ✅
- ❌ Avoid spammy words (FREE, URGENT, ACT NOW)

### 4. Email Sending Limits (Resend Free Tier)
- **Limit:** 3,000 emails/month
- **Per day:** ~100 emails/day
- **Rate limit:** 10 emails/second

**Recommendation:** Upgrade to paid plan if you exceed 100 orders/day

---

## 🎯 Recommended Email Strategy for Launch

### Phase 1: Essential (Launch Day) ✅
1. **Order Confirmation** - `order@3dark.in`
2. **Support Contact** - Display `support@3dark.in` on website

### Phase 2: Growth (Week 2-4)
3. **Welcome Email** - `no-reply@3dark.in` after registration
4. **Shipping Notifications** - `order@3dark.in` when shipped
5. **Contact Form Replies** - `support@3dark.in`

### Phase 3: Optimization (Month 2+)
6. **Review Requests** - `order@3dark.in` after delivery
7. **Abandoned Cart** - `order@3dark.in` (1 hour after)
8. **Newsletter** - `no-reply@3dark.in` (monthly)

---

## 🔍 Email Monitoring Strategy

### For `order@3dark.in`
- **Check:** Daily (or after each order)
- **Purpose:** Customer replies about orders
- **Forward to:** Your personal email for convenience
- **Response time:** Within 24 hours

### For `support@3dark.in`
- **Check:** Daily
- **Purpose:** Customer support inquiries
- **Forward to:** Your personal email
- **Response time:** Within 24 hours
- **Consider:** Helpdesk software later (Freshdesk, Zendesk)

### For `no-reply@3dark.in`
- **Check:** Weekly (for bounces/errors only)
- **Purpose:** Catch email delivery issues
- **Don't reply to:** Customer replies (they shouldn't reply)
- **Always include:** "Reply to: support@3dark.in" in footer

---

## 📧 Email Templates to Create

### Priority Order:
1. ✅ **Order Confirmation** (already exists)
2. ⏳ **Shipping Notification**
3. ⏳ **Welcome Email** (account creation)
4. ⏳ **Password Reset**
5. ⏳ **Review Request**
6. ⏳ **Contact Form Auto-reply**
7. ⏳ **Abandoned Cart**

---

## 🚀 Quick Setup Guide

### For Your Current Setup:

**You're already 90% there!** Just need to:

1. **Update Vercel env variable:**
   ```bash
   EMAIL_FROM="3Dark <order@3dark.in>"
   ```

2. **Set up email forwarding** (optional but recommended):
   - `order@3dark.in` → your-personal@gmail.com
   - `support@3dark.in` → your-personal@gmail.com
   - Keep `no-reply@3dark.in` without forwarding

3. **Test the flow:**
   - Place test order
   - Check order confirmation sent from `order@3dark.in`
   - Verify customer receives it

**That's it for launch!** 🎉

Add more email types later as you grow.

---

## 📊 Summary Table

| Email Address | Use Case | Reply Expected? | Check Frequency | Forward to Personal? |
|---------------|----------|-----------------|-----------------|---------------------|
| `order@3dark.in` | Orders, shipping, invoices | ✅ Yes | Daily | ✅ Recommended |
| `support@3dark.in` | Customer service, inquiries | ✅ Yes | Daily | ✅ Recommended |
| `no-reply@3dark.in` | Automated, marketing | ❌ No | Weekly | ❌ No |

---

**Current Status:** Order confirmations are ready to go from `order@3dark.in`! 🚀

Just update that Vercel env variable and you're set! 💯
