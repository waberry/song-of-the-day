#!/bin/sh
echo "Waiting for database..."
while ! pg_isready -h db -p 5432 -U berry; do
  sleep 1
done
echo "Database is up - executing command"

npx prisma generate
npx prisma migrate deploy
echo "Migrations applied"

npm run dev -- --turbo
