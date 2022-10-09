#!/bin/sh

npx prisma migrate deploy
node dist/prisma/seed.js
pnpm start:prod