#!/bin/bash
# Test admin login API directly

echo "🧪 Testing Admin Login API..."
echo ""

# Test login
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "csrfToken": "test",
    "email": "admin@3dark.com",
    "password": "admin123",
    "callbackUrl": "http://localhost:3000/admin",
    "json": true
  }')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

echo ""
echo "If you see an error above, that's the issue."
echo "If you see success, the API works but browser redirect might be the issue."
