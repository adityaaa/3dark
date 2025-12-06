# 3Dark.in - Wildlife-Inspired Streetwear E-commerce

Modern e-commerce platform for 3Dark's wildlife-inspired clothing line, built with Next.js 14, TypeScript, Prisma, and Vercel.

🌐 **Live Site:** [https://3dark.in](https://3dark.in)

---

## 🎯 Project Overview

3Dark is a premium streetwear brand specializing in wildlife-themed t-shirts, shorts, pants, and beanies for adults and kids. This Next.js application provides a complete e-commerce solution with:

- 🛍️ Product catalog with categories and filtering
- 🛒 Shopping cart and checkout
- 💳 Payment processing (Razorpay + Cash on Delivery)
- 📧 Transactional email notifications
- 🔐 Secure admin panel for product & order management
- 📊 Brand-level pricing system
- 🖼️ Cloud image storage with Vercel Blob

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Database:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Image Storage:** Vercel Blob
- **Email:** Resend API

### Payment & Services
- **Payment Gateway:** Razorpay (Indian market)
- **Deployment:** Vercel
- **Domain:** 3dark.in

---

## 📁 Project Structure

```
3dark-web/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   ├── brands/          # Brand pricing management
│   │   └── login/           # Admin authentication
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin APIs
│   │   ├── checkout/        # Checkout & payment
│   │   └── webhooks/        # Payment webhooks
│   ├── shop/                # Product listing page
│   ├── product/[slug]/      # Product detail pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── about/               # About page
│   ├── lookbook/            # Lookbook gallery
│   └── support/             # Customer support
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── CartContext.tsx     # Cart state management
│   └── NavbarClient.tsx    # Navigation
├── lib/                    # Utilities and configurations
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # Authentication config
│   ├── utils.ts           # Helper functions
│   └── types.ts           # TypeScript types
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration history
├── public/                # Static assets
│   ├── products/         # Product images
│   └── logos/            # Brand logos
└── scripts/              # Utility scripts
    ├── create-admin.ts   # Create admin users
    └── archive/          # Historical migration scripts
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Vercel Postgres recommended)
- Razorpay account (for payments)
- Resend account (for emails)
- Vercel account (for deployment)

### 1. Clone Repository
```bash
git clone <repository-url>
cd 3dark-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://..."

# Vercel Blob (image storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="3Dark <orders@3dark.in>"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_NAME="3Dark"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Create admin user
npx tsx scripts/create-admin.ts
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

---

## 🗄️ Database Schema

### Core Models

#### Product
- Categories: `tshirt`, `shorts`, `pants`, `beanie-hat`
- Age Groups: `adult`, `kids`
- Size-specific pricing (S, M, L, XL, XXL, XXXL, or Free Size)
- Multiple images per product
- Brand association for pricing

#### Brand
- Brand-level pricing management
- Category and age group specific
- Bulk pricing updates

#### Order
- Customer information
- Order items with size/quantity
- Payment method (Razorpay/COD)
- Order status tracking

---

## 🎨 Features

### Customer Features
- ✅ Browse products by category and age group
- ✅ View product details with multiple images
- ✅ Add to cart with size selection
- ✅ Secure checkout (Razorpay + COD)
- ✅ Order confirmation email
- ✅ Responsive mobile design

### Admin Features
- ✅ Product CRUD operations
- ✅ Bulk product actions (edit, delete, discount)
- ✅ Multiple image upload per product
- ✅ Brand-level pricing management
- ✅ Order management and tracking
- ✅ Category and age group filtering
- ✅ Free Size support for hats

### Technical Features
- ✅ Server-side rendering (SSR)
- ✅ Optimistic UI updates
- ✅ Image optimization with Next.js Image
- ✅ Type-safe API routes
- ✅ Secure authentication
- ✅ Payment webhook handling
- ✅ Transactional email delivery

---

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import project from GitHub
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables** (Vercel Dashboard)
   - Copy all variables from `.env.local`
   - Add production URLs and API keys
   - Redeploy after adding variables

4. **Database Migration**
   ```bash
   # Vercel automatically runs migrations via build script
   # Manual migration if needed:
   npx prisma migrate deploy
   ```

### Post-Deployment
- ✅ Verify DNS configuration (3dark.in)
- ✅ Test payment flows
- ✅ Test email delivery
- ✅ Create admin user in production
- ✅ Monitor error logs

---

## 📧 Email Configuration

Uses Resend for transactional emails:

1. **Domain Setup**
   - Add domain in Resend dashboard
   - Configure DNS records (SPF, DKIM, DMARC)
   - Verify domain

2. **Email Templates**
   - Order confirmation (customer)
   - Order notification (admin)
   - Branded HTML templates with logo

---

## 💳 Payment Integration

### Razorpay Setup
1. Create account at [razorpay.com](https://razorpay.com)
2. Generate API keys (Live mode)
3. Configure webhook URL: `https://3dark.in/api/webhooks/razorpay`
4. Add webhook secret to environment variables

### Supported Payment Methods
- ✅ Credit/Debit Cards
- ✅ Net Banking
- ✅ UPI
- ✅ Wallets
- ✅ Cash on Delivery (COD)

---

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ NextAuth.js session management
- ✅ Bcrypt password hashing
- ✅ HTTPS enforced in production
- ✅ Payment webhook verification
- ✅ Admin route protection

---

## 📊 Admin Access

**Default Credentials:**
- Email: `admin@3dark.com`
- Password: `admin123`

⚠️ **Change admin password immediately after first login!**

Access admin panel: [https://3dark.in/admin](https://3dark.in/admin)

---

## 🧪 Testing

### Test Razorpay Payment
Use Razorpay test cards:
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Email Delivery
1. Place test order
2. Check Resend dashboard for delivery logs
3. Verify email in inbox

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create new migration
npx prisma migrate deploy # Apply migrations
npx prisma studio        # Open database GUI

# Utilities
npx tsx scripts/create-admin.ts  # Create admin user
```

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues
```bash
# Reset Prisma client
npx prisma generate
```

### Image Upload Errors
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob dashboard for storage quota
- Ensure image size < 4.5MB per file

---

## 📚 Documentation

- [CLEANUP_AND_COMPLETION_PLAN.md](./CLEANUP_AND_COMPLETION_PLAN.md) - Detailed launch checklist
- [FINAL_DEPLOYMENT_GUIDE.md](./FINAL_DEPLOYMENT_GUIDE.md) - Deployment procedures
- [FREE_SIZE_FEATURE.md](./FREE_SIZE_FEATURE.md) - Free Size implementation
- [FINAL_TESTING_CHECKLIST.md](./FINAL_TESTING_CHECKLIST.md) - QA checklist

---

## 🎯 Roadmap

### Completed ✅
- Product catalog with categories
- Shopping cart and checkout
- Payment integration (Razorpay + COD)
- Admin panel for management
- Email notifications
- Brand-level pricing
- Multiple image upload
- Free Size support
- Production deployment

### Planned 🔜
- Customer order tracking
- Product reviews and ratings
- Admin dashboard analytics
- Advanced search and filters
- Wishlist functionality
- Customer accounts
- Discount codes/coupons

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create pull request to `dev` branch

---

## 📄 License

Proprietary - All rights reserved by 3Dark

---

## 📞 Support

For technical issues or questions:
- Email: support@3dark.in
- Website: [https://3dark.in/support](https://3dark.in/support)

---

## 🎉 Credits

Built with ❤️ by the 3Dark team

**Technologies:**
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Vercel](https://vercel.com/)
- [Razorpay](https://razorpay.com/)
- [Resend](https://resend.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** 🟢 Production Ready
