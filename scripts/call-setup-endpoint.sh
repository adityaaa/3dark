#!/bin/bash

# Setup Admin Account in Production
# Domain: www.3dark.in

DOMAIN="www.3dark.in"
SECRET="setup123secret"  # Must match ADMIN_SETUP_SECRET in Vercel
EMAIL="admin@3dark.in"   # Admin email
PASSWORD="Admin@3dark2026"  # New secure password

echo "🚀 Setting up admin account in production..."
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

curl -X POST "https://$DOMAIN/api/admin/setup" \
  -H "Content-Type: application/json" \
  -d "{\"secret\": \"$SECRET\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ If successful, you can now login at:"
echo "   https://$DOMAIN/admin/login"
echo ""
echo "   Email: $EMAIL"
echo "   Password: $PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Delete /app/api/admin/setup after this works!"
