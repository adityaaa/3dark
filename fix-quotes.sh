#!/bin/bash

# Fix admin products pages - quotes around Free Size and One Size
perl -pi -e 's/"Free Size"/"Free Size"/g; s/"One Size"/"One Size"/g' app/admin/products/\[id\]/page.tsx
perl -pi -e 's/"Free Size", "One Size"/"Free Size", "One Size"/g' app/admin/products/page.tsx

# Fix remaining apostrophes in all files
files=(
  "app/admin/settings/SettingsForm.tsx"
  "app/cart/page.tsx"
  "app/support/page.tsx"
  "components/admin/BrandPricingForm.tsx"
  "components/admin/ProductForm.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    perl -pi -e "s/([a-zA-Z])'([a-zA-Z])/\$1\&apos;\$2/g" "$file"
  fi
done

echo "Fixed all quotes and apostrophes"
