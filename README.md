# Auto Order Website

A production-ready, fully automatic digital product store built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma**, **PostgreSQL (Neon)**, and a custom **QRIS payment gateway** integration. Deployable to **Vercel**.

## How it works

1. Customer browses products on the storefront.
2. Adds a product to cart and checks out with name + WhatsApp number.
3. Server creates a transaction ID (`TRX-YYYYMMDD-16NNNNNN`) and calls the payment gateway to generate a QRIS code.
4. Customer scans the QRIS code to pay.
5. The order page polls `/api/payment/status` every ~4 seconds.
6. When the gateway reports the payment as `sukses`, the server atomically:
   - Picks one unsold `ProductStock` row for that product,
   - Marks it `sold`,
   - Marks the order `success`.
7. The purchased content (account/license/link/etc.) is displayed **directly on the order page** — no WhatsApp or email delivery.
8. Customers can reopen `/order/[trxid]` anytime to see their order and (if successful) their product again.

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS (with dark mode)
- Prisma ORM + PostgreSQL (Neon)
- `jose` for signed admin session cookies (JWT, HttpOnly)
- `zod` for input validation
- Deployable to Vercel, including a Vercel Cron job to auto-expire stale orders

## Project structure

```
prisma/
  schema.prisma        # Product, ProductStock, Order, Settings, Counter models
  seed.ts               # Demo product + stock seeder
src/
  app/
    page.tsx             # Landing page
    products/            # Product list + detail
    cart/                # Cart page (localStorage-based)
    checkout/             # Checkout form -> creates order + QRIS
    order/[trxid]/         # Order status page with polling + purchased item reveal
    order/                # Order lookup form
    admin/                 # Admin panel (login, dashboard, products, stock, orders, settings)
    api/
      products/            # Public product endpoints
      checkout/             # Creates order + QRIS
      payment/status/        # Polling endpoint; deducts stock on success
      orders/[trxid]/         # Order lookup endpoint
      admin/                  # Protected admin CRUD endpoints
      cron/expire-orders/      # Periodic cleanup of expired pending orders
  components/            # Reusable UI building blocks
  lib/                   # prisma client, payment gateway client, trxid generator, auth, validation
  types/                 # Shared TypeScript types
  middleware.ts           # Protects /admin and /api/admin routes
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```
DATABASE_URL=              # Neon pooled connection string
DIRECT_URL=                # Neon direct connection string (used by `prisma migrate`)

PAYMENT_GATEWAY_BASE_URL=https://payqris.web.id
PAYMENT_GATEWAY_API_KEY=   # Your API key from the payment gateway

ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_JWT_SECRET=          # Long random string, e.g. `openssl rand -hex 32`

STORE_NAME=
NEXT_PUBLIC_STORE_NAME=

NEXT_PUBLIC_APP_URL=
CRON_SECRET=                # Optional, protects /api/cron/expire-orders
```

The Payment Gateway API key and base URL can also be overridden per-store from **Admin → Settings**, which stores them in the `Settings` table. If left blank there, the app falls back to the environment variables above.

## Local setup

```bash
npm install
npx prisma db push      # create tables in your Neon database
npm run db:seed         # optional: seed a demo product
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin/login` for the admin panel.

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Set the Build Command to `npm run build` (already wired to run `prisma generate`).
5. After the first deploy, run `npx prisma db push` (locally, pointed at your Neon `DATABASE_URL`) to create the schema, or connect it via a migration step in your CI.
6. The included `vercel.json` registers a cron job that hits `/api/cron/expire-orders` every 10 minutes to clean up stale pending orders (expiry is also checked lazily whenever a customer's order page polls for status, so this is just a safety net).

## Payment gateway contract

- `POST {BASE_URL}/api/v1/qris/create` with `{ amount, trxid }`, `Authorization: Bearer {API_KEY}` → returns `qris_image` and `expired`.
- `GET {BASE_URL}/api/v1/qris/status?trxid=...` → returns `txStatus` of `pending`, `sukses`, or `gagal`.

Both are wrapped in `src/lib/payment-gateway.ts`.

## Notes & assumptions

- Cart is stored in `localStorage` (per-browser) and checkout processes **one product per order**, matching the one-stock-item-per-order model described in the spec. Multiple cart items can be purchased as separate sequential orders.
- Admin authentication is a single username/password pair from environment variables, with a signed HttpOnly JWT cookie (12h expiry) — no external admin template used.
- Stock deduction happens **only** inside the payment-status success branch, wrapped in a Prisma transaction, so a stock item can never be sold twice even under concurrent polling.
- No product delivery via WhatsApp or email — the purchased content is rendered directly on `/order/[trxid]` once the order is marked `success`.
