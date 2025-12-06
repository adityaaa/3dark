# Product Categorization & Brand Management Update

## Overview
This update adds comprehensive product categorization, brand management, and category-specific pricing.

## New Features

### 1. Product Categories
- **T-shirts** (adults & kids)
- **Pants** (adults & kids)
- **Hats/Mossa** (winter hats)

### 2. Age Groups
- **Adult** - Standard adult sizing (S, M, L, XL, XXL, XXXL)
- **Unisex** - Same as adult
- **Men** - Same as adult
- **Women** - Same as adult
- **Kids** - Kids sizing (2-4, 4-6, 6-8, 8-10, 10-12, 12-14)

### 3. Brand Management
- Dropdown to select from existing brands
- Ability to add new brands on-the-fly
- Brands stored in dedicated `Brand` table

### 4. Category-Specific Pricing
- Set different prices for T-shirts vs Pants vs Hats
- Age-specific pricing (Adult T-shirt vs Kids T-shirt)
- Brand + Category + AgeGroup = unique pricing configuration

## Database Changes

### Product Table
```sql
- Added: category (tshirt/pants/hat)
- Added: ageGroup (adult/unisex/men/women/kids)
```

### New Brand Table
```sql
- id
- name (unique)
- createdAt
- updatedAt
```

### Updated BrandPricing Table
```sql
- brand + category + ageGroup = unique key
- Allows: Rock Chang T-shirts (adult), Rock Chang Pants (adult), Rock Chang T-shirts (kids)
```

## Migration Steps

### Step 1: Apply Database Migration (Production)
```bash
npx tsx scripts/apply-category-migration.ts
```

This will:
- Add category and ageGroup columns to Product table
- Create Brand table and migrate existing brands
- Update BrandPricing table structure

### Step 2: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 3: Update Application Code
The following files need to be updated:
- `/components/admin/ProductForm.tsx` - Add category, ageGroup, brand dropdown
- `/components/admin/BrandPricingForm.tsx` - Add category and ageGroup selectors
- `/app/api/admin/products/route.ts` - Handle new fields
- `/app/api/admin/brands/route.ts` - New API for brand CRUD
- `/app/api/admin/brands/pricing/route.ts` - Update for category-specific pricing
- `/lib/utils.ts` - Update applyBrandPricing to match category+ageGroup
- `/lib/types.ts` - Add new fields to types

## Size Configurations

### Adult/Unisex/Men/Women Sizes
`S, M, L, XL, XXL, XXXL`

### Kids Sizes
`2-4, 4-6, 6-8, 8-10, 10-12, 12-14`

## UI Flow

### Creating a New Product
1. Enter product name
2. **Select Brand** from dropdown (or add new)
3. **Select Category** (T-shirt/Pants/Hat)
4. **Select Age Group** (Adult/Kids/etc)
5. Sizes auto-populate based on age group
6. If brand pricing exists for this brand+category+ageGroup, it's applied automatically
7. Upload images and set other details

### Managing Brand Pricing
1. Go to `/admin/brands`
2. Select brand
3. Select category (T-shirt/Pants/Hat)
4. Select age group (Adult/Kids)
5. Set pricing for each size
6. All products matching brand+category+ageGroup will use this pricing

## Testing Checklist
- [ ] Apply migration to production
- [ ] Verify existing products have default category='tshirt', ageGroup='adult'
- [ ] Create new product with brand dropdown
- [ ] Add new brand via the form
- [ ] Set brand pricing for Rock Chang T-shirts (Adult)
- [ ] Set different pricing for Rock Chang Pants (Adult)
- [ ] Verify products show correct pricing based on category
- [ ] Create kids product with kids sizes
- [ ] Set brand pricing for kids category
- [ ] Verify shop/homepage show correct prices

## Deployment Notes
1. Run migration script BEFORE deploying code changes
2. Existing products will default to 'tshirt' category and 'adult' age group
3. Existing brand pricing will default to 'tshirt' + 'adult' combination
4. You may need to reconfigure brand pricing after migration for other categories
