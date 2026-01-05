#!/bin/bash

# Export Data from Local SQLite Database
# This will create SQL dumps of your important data

echo "📦 Exporting data from local SQLite database..."
echo ""

# Create exports directory
mkdir -p exports

# Export products
echo "Exporting products..."
sqlite3 prisma/dev.db << 'EOF' > exports/products.sql
.mode insert Product
SELECT * FROM Product;
EOF

# Export brands
echo "Exporting brands..."
sqlite3 prisma/dev.db << 'EOF' > exports/brands.sql
.mode insert Brand
SELECT * FROM Brand;
EOF

# Export brand pricing
echo "Exporting brand pricing..."
sqlite3 prisma/dev.db << 'EOF' > exports/brand_pricing.sql
.mode insert BrandPricing
SELECT * FROM BrandPricing;
EOF

# Export admin
echo "Exporting admin..."
sqlite3 prisma/dev.db << 'EOF' > exports/admin.sql
.mode insert Admin
SELECT * FROM Admin;
EOF

# Export shops (if any)
echo "Exporting shops..."
sqlite3 prisma/dev.db << 'EOF' > exports/shops.sql
.mode insert Shop
SELECT * FROM Shop;
EOF

# Count records
PRODUCT_COUNT=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Product;")
BRAND_COUNT=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Brand;")
ADMIN_COUNT=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Admin;")

echo ""
echo "✅ Export complete!"
echo ""
echo "📊 Data Summary:"
echo "   Products: $PRODUCT_COUNT"
echo "   Brands: $BRAND_COUNT"
echo "   Admins: $ADMIN_COUNT"
echo ""
echo "📁 Files created in ./exports/"
echo ""
echo "Next step: Create Vercel Postgres database, then run import script"
