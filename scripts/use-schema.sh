#!/bin/sh
# Usage: ./scripts/use-schema.sh [local|prod]
if [ "$1" = "local" ]; then
  cp prisma/schema.local.prisma prisma/schema.prisma
  echo "Switched to local (SQLite) schema."
elif [ "$1" = "prod" ]; then
  cp prisma/schema.prod.prisma prisma/schema.prisma
  echo "Switched to production (PostgreSQL) schema."
else
  echo "Usage: ./scripts/use-schema.sh [local|prod]"
fi
