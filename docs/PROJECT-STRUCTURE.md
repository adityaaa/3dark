# 3Dark Project Structure Overview

**Last Updated:** December 14, 2025

---

## 📁 Root Directory (Clean!)

```
3dark-web/
├── README.md                 # Project overview
├── package.json              # Dependencies
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── prisma/                  # Database
├── app/                     # Next.js app
├── components/              # React components
├── lib/                     # Utilities
├── public/                  # Static assets
├── scripts/                 # Helper scripts
├── types/                   # TypeScript types
└── docs/                    # Documentation (organized!)
```

---

## 📚 Documentation Structure

### `/docs/ACTIVE/` - Current Work
Files you need **right now** for ongoing development:

- `DAY-1-COMPLETE-SUMMARY.md` - Today's progress summary
- `IMPLEMENTATION-PLAN-PHASE-1.md` - Current implementation plan
- `ON-DEMAND-RELIABILITY-STRATEGY.md` - Business strategy
- `PHASE-1-PROGRESS.md` - Development progress tracking
- `SUCCESSFUL-ONDEMAND-BRANDS.md` - Market research & validation

**Purpose:** Quick reference for current tasks

---

### `/docs/ARCHIVE/` - Historical Reference
Old planning docs, strategies, and analysis that are no longer active but kept for reference:

- Marketing plans
- Security fix documentation
- Old launch strategies
- Email strategy docs
- Video generation guides
- etc.

**Purpose:** Historical context, learning from past decisions

---

### `/docs/COMPLETED/` - Done Tasks
Completed features and implemented changes:

- `INVENTORY-SYSTEM-COMPLETE.md`
- `SIZE-GUIDE-FEATURE.md`
- `HOMEPAGE-STRATEGY-FINAL.md`
- `SECURITY-FIX-COMPLETE.md`
- etc.

**Purpose:** Reference for what's been built, helpful for onboarding

---

## 🎯 Quick Navigation

### Working on current features?
→ Check `/docs/ACTIVE/`

### Need to understand a past decision?
→ Check `/docs/ARCHIVE/`

### Want to see what's been completed?
→ Check `/docs/COMPLETED/`

### Need to understand codebase?
→ Check `/app/`, `/components/`, `/lib/`

---

## 🏗️ Code Structure

### `/app/` - Next.js App Router
```
app/
├── layout.tsx               # Root layout
├── page.tsx                 # Homepage
├── globals.css              # Global styles
├── about/                   # About page
├── shop/                    # Shop page
├── product/[slug]/          # Product pages
├── checkout/                # Checkout flow
├── account/                 # Customer dashboard
├── admin/                   # Admin panel
│   ├── products/            # Product management
│   ├── orders/              # Order management
│   ├── inventory/           # Inventory management
│   └── shops/               # Shop management (new!)
└── api/                     # API routes
    ├── checkout/            # Order creation
    ├── payment/             # Payment verification
    ├── admin/               # Admin APIs
    └── customer/            # Customer APIs
```

### `/components/` - Reusable React Components
```
components/
├── NavbarClient.tsx         # Navigation
├── CartContext.tsx          # Shopping cart
├── StylistWidget.tsx        # AI stylist
├── SizeGuide.tsx            # Size guide modal
├── ProductReviews.tsx       # Reviews display
└── ...
```

### `/lib/` - Utilities & Config
```
lib/
├── db.ts                    # Prisma client
├── auth.ts                  # NextAuth config
├── utils.ts                 # Helper functions
├── payment.ts               # Razorpay integration
└── storeProducts.ts         # Product seeding
```

### `/prisma/` - Database
```
prisma/
├── schema.prisma            # Database schema
├── migrations/              # Migration history
└── dev.db                   # Local database
```

---

## 🚀 Development Workflow

### 1. Starting Development
```bash
npm run dev                  # Start dev server
```

### 2. Database Changes
```bash
npx prisma migrate dev       # Create & run migration
npx prisma generate          # Generate Prisma client
npx prisma studio            # Browse database
```

### 3. Building for Production
```bash
npm run build                # Build Next.js app
npm run start                # Start production server
```

### 4. Deployment (Vercel)
```bash
git push origin main         # Auto-deploys to Vercel
```

---

## 📝 Current Status

### ✅ Completed
- Homepage redesign
- Product management
- Inventory system
- Size guide
- Customer accounts
- Admin panel
- Payment integration
- Email notifications

### 🟡 In Progress (Day 1)
- On-demand sourcing workflow
- Shop management system
- Order status tracking
- Refund automation

### ⏳ Todo (Day 2)
- Shop management UI
- Enhanced email templates
- End-to-end testing
- Production deployment

---

## 🎓 Key Files to Know

### Configuration
- `package.json` - Dependencies and scripts
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Styling configuration
- `.env.local` - Environment variables (not in git)

### Database
- `prisma/schema.prisma` - Single source of truth for DB schema
- `lib/db.ts` - Prisma client instance

### Authentication
- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth routes

### Payment
- `lib/payment.ts` - Razorpay utilities
- `app/api/checkout/route.ts` - Order creation
- `app/api/payment/verify/route.ts` - Payment verification

---

## 🔍 Finding Things

### "Where is the checkout page?"
→ `/app/checkout/CheckoutClient.tsx`

### "Where are order management APIs?"
→ `/app/api/admin/orders/[id]/`

### "Where is the product card component?"
→ Search in `/components/` or `/app/shop/`

### "How do I add a new page?"
→ Create folder in `/app/` with `page.tsx`

### "How do I add an API endpoint?"
→ Create `route.ts` in `/app/api/your-endpoint/`

---

## 🧹 Maintenance

### Keeping it Clean
1. ✅ Root directory has only config files
2. ✅ Documentation in `/docs/` organized by status
3. ✅ Code follows Next.js conventions
4. ✅ No unused files or commented code

### When Adding New Features
1. Create feature branch
2. Update relevant docs in `/docs/ACTIVE/`
3. When complete, move doc to `/docs/COMPLETED/`
4. Update this overview if structure changes

---

## 📞 Need Help?

### Understanding a Feature
1. Check `/docs/COMPLETED/` for implementation details
2. Check `/docs/ARCHIVE/` for original planning
3. Read the code (it's well-commented!)

### Starting a New Feature
1. Check `/docs/ACTIVE/` for current priorities
2. Create implementation plan
3. Follow existing patterns in codebase

### Debugging
1. Check `npm run dev` console output
2. Check Vercel deployment logs
3. Check Prisma Studio for database state
4. Check browser console for client errors

---

**Structure Status:** ✅ Clean, organized, and maintainable!

---

*This overview is maintained as the project evolves.*
