# Moonscents Implementation Progress

This project already includes a premium, moon-themed storefront UI in the current frontend stack.
This document tracks implementation toward the requested production architecture.

## Implemented in this phase

- Added backend scaffold with `Express + MongoDB + JWT` under `server/`.
- Added starter domain models:
  - `User` with `customer/admin` roles
  - `Product` with stock and active flags
  - `Order` with payment methods (`cod`, `jazzcash`, `easypaisa`, `stripe`)
- Added auth and RBAC middleware:
  - bearer token verification
  - route-level role checks
- Added initial API routes:
  - `GET /api/health`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/products`
  - `POST /api/products` (admin only)
  - `POST /api/orders` (authenticated)
  - `GET /api/orders/my` (authenticated)
- Added development scripts:
  - `npm run server:dev`
  - `npm run dev:full` (frontend + backend)
- Replaced Supabase runtime dependencies in primary user flows:
  - `Auth` now uses `/api/auth/register` and `/api/auth/login`
  - `Checkout` now posts orders to `/api/orders`
  - `Account` now reads user orders from `/api/orders/my`
  - `Admin` now reads/manages orders and product visibility via API endpoints
- Extended backend API for admin operations:
  - `GET /api/orders` (admin)
  - `PATCH /api/orders/:id/status` (admin)
  - `PATCH /api/products/:id/status` (admin)
  - `GET /api/products?includeInactive=true` for admin dashboard listing
- Added customer delivery fields to the order model for real checkout data capture.
- Added payment abstraction service with Stripe integration path and local gateway callbacks:
  - Stripe intent creation in provider layer
  - Stripe webhook endpoint: `POST /api/payments/webhooks/stripe`
  - Local callback-ready endpoints:
    - `POST /api/payments/callbacks/jazzcash`
    - `POST /api/payments/callbacks/easypaisa`
- Added inventory transaction logging model and write paths for:
  - order-based stock reservation
  - admin stock adjustments
- Added admin product edit endpoint and connected admin UI to create + edit products.

## Environment setup

Create `.env.server` from `.env.server.example`, then set:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`

## Next implementation slices

1. Connect frontend auth/cart/checkout flows to API endpoints.
2. Build admin APIs for product and order management operations.
3. Add Stripe + JazzCash + Easypaisa service integrations.
4. Add inventory reservation and order status transitions.
5. Add request logging, rate limits, and centralized validation/error formats.
