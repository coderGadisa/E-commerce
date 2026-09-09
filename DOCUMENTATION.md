# TechStore — Full-Stack E-Commerce Platform
### Internship Project Documentation

**Developer:** Gadisa Asefa  
**Project Type:** Full-Stack Web Application  
**Stack:** React · Node.js · Express · MongoDB  
**Live URL:** https://e-commerce-techstore.vercel.app  
**API URL:** https://techstore-api-nrzx.onrender.com  
**Repository:** https://github.com/coderGadisa/E-commerce  
**Date:** August 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Features](#4-features)
5. [Database Design](#5-database-design)
6. [API Reference](#6-api-reference)
7. [Security Implementation](#7-security-implementation)
8. [Deployment](#8-deployment)
9. [Testing](#9-testing)
10. [Challenges and Solutions](#10-challenges-and-solutions)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Overview

TechStore is a production-ready full-stack e-commerce platform built for the Ethiopian market, specializing in tech and electronics products. The application allows customers to browse, search, and purchase electronics online using Ethiopian Birr (ETB) as the currency.

The project was developed as a complete software engineering exercise covering every layer of a modern web application: database design, RESTful API development, authentication, payment integration, email notifications, security hardening, and cloud deployment.

### Goals

- Provide a fast, mobile-friendly shopping experience for Ethiopian customers
- Support multiple product categories: Laptops, Phones, Accessories, Monitors, and Smart Watches
- Enable secure user authentication and order management with JWT
- Integrate Chapa — Ethiopia's leading payment gateway — for card and mobile money payments
- Give administrators full control over products, orders, and users
- Deploy to cloud infrastructure at minimal cost with production-grade security

### What Makes This Project Realistic

- **Real payment gateway** — Chapa integration with live sandbox testing for Telebirr and CBE payments
- **Real email notifications** — Gmail SMTP transactional emails for order confirmation and payment receipts
- **Production security** — helmet headers, rate limiting, NoSQL injection protection, JWT hardening
- **Cloud deployment** — MongoDB Atlas, Render (API), Vercel (frontend)
- **74 automated tests** passing against the live production environment

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool and dev server |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client for API calls |
| React Hot Toast | 2.x | Toast notifications |
| React Icons (Fi) | 5.x | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | JavaScript runtime |
| Express | 5.x | Web framework |
| MongoDB | 7.x (driver) | NoSQL database |
| Mongoose | 9.x | ODM for MongoDB |
| JSON Web Token | 9.x | Authentication tokens |
| bcryptjs | 3.x | Password hashing |
| Multer | 2.x | File upload handling |
| Cloudinary | 2.x | Image storage CDN |
| Nodemailer | 9.x | Email delivery |
| Helmet | 8.x | HTTP security headers |
| express-rate-limit | 8.x | Rate limiting |
| express-validator | 7.x | Input validation |
| dotenv | 17.x | Environment variable management |

### Infrastructure

| Service | Provider | Purpose |
|---|---|---|
| Database | MongoDB Atlas (Free M0) | Cloud database |
| Backend API | Render (Free tier) | Node.js hosting |
| Frontend | Vercel (Free tier) | Static site hosting |
| Images | Cloudinary (Free tier) | Image CDN |
| Payment | Chapa | Ethiopian payment gateway |
| Email | Gmail SMTP | Transactional emails |

---

## 3. System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│         React + Vite — deployed on Vercel               │
│  https://e-commerce-techstore.vercel.app                │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS (Axios)
                      │ Authorization: Bearer <JWT>
┌─────────────────────▼───────────────────────────────────┐
│               BACKEND API (Node.js + Express)           │
│           deployed on Render                            │
│  https://techstore-api-nrzx.onrender.com                │
│                                                         │
│  Middleware Stack:                                      │
│  dotenv → DNS fix → helmet → CORS → rate limiter →     │
│  body parser (10kb) → sanitize → routes → errorHandler │
│                                                         │
│  Route Groups:                                          │
│  /api/auth    /api/products  /api/cart                  │
│  /api/orders  /api/users     /api/admin  /api/payment   │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
       ▼              ▼              ▼
  ┌────────┐   ┌──────────┐   ┌───────────┐
  │MongoDB │   │Cloudinary│   │  Chapa    │
  │ Atlas  │   │  (CDN)   │   │ Payment   │
  └────────┘   └──────────┘   └───────────┘
                                    │
                               ┌────▼─────┐
                               │  Gmail   │
                               │  SMTP    │
                               └──────────┘
```

### Folder Structure

```
E-commerce/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary SDK setup
│   │   └── multer.js           # File upload config
│   ├── controllers/            # Route handler functions
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verify + attach user
│   │   ├── adminMiddleware.js  # Admin role guard
│   │   ├── errorHandler.js     # Global error handler
│   │   ├── sanitize.js         # NoSQL injection + HPP protection
│   │   └── validate.js         # Required fields checker
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/                 # Express routers
│   ├── services/               # Business logic layer
│   ├── utils/
│   │   ├── ApiResponse.js      # Consistent response wrapper
│   │   ├── ApiError.js         # Custom error class
│   │   ├── asyncHandler.js     # Async try/catch wrapper
│   │   ├── generateToken.js    # JWT signing
│   │   └── emailTemplates.js   # HTML email templates
│   ├── validators/             # express-validator rule chains
│   └── server.js               # Entry point
│
└── tech-electronics-store/     # React + Vite frontend
    └── src/
        ├── components/         # Reusable UI components
        │   ├── Navbar/
        │   ├── ProductCard/
        │   ├── ProductSkeleton/ # Shimmer loading
        │   ├── Breadcrumb/
        │   ├── StarRating/
        │   ├── ReviewForm/
        │   └── ReviewList/
        ├── context/
        │   ├── AuthContext.jsx  # JWT + user state
        │   └── CartContext.jsx  # Cart state
        ├── hooks/
        │   └── useDocumentTitle.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── Products.jsx
        │   ├── ProductDetails.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── Orders.jsx
        │   ├── OrderDetails.jsx
        │   ├── Profile.jsx
        │   ├── Wishlist.jsx
        │   ├── PaymentSuccess.jsx
        │   ├── PaymentFailed.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx
        │       ├── Dashboard.jsx
        │       ├── AdminProducts.jsx
        │       ├── AdminOrders.jsx
        │       └── AdminUsers.jsx
        ├── routes/
        │   └── PrivateRoute.jsx # Auth + admin guards
        └── services/
            └── api.js           # Axios instance
```

### Request Flow (Typical API Call)

```
1. User action in React component
2. Axios sends HTTPS request with Authorization header
3. Express receives request
4. helmet adds security headers
5. CORS validates Origin header
6. Rate limiter checks request count
7. body-parser parses JSON (10kb limit)
8. sanitize middleware strips MongoDB operators
9. authMiddleware verifies JWT, loads user from DB
10. Route handler calls service layer
11. Service performs business logic + DB operations
12. Controller wraps result in ApiResponse
13. Response sent as { success, message, data }
```

---

## 4. Features

### 4.1 Authentication

Users register with name, email, and a strong password. Passwords must be 8–72 characters and contain at least one uppercase letter, lowercase letter, digit, and special character. Passwords are hashed using bcrypt with 10 salt rounds before storage.

On login, the backend returns a JWT token valid for 7 days. The token is stored in `localStorage` and attached to every subsequent API request as a `Bearer` token. The `authMiddleware` verifies the token signature using HS256, loads the user from the database (ensuring role changes take effect immediately), and attaches `req.user` for downstream handlers.

**Implemented endpoints:**
- `POST /api/auth/register` — validates, hashes, creates user, returns token
- `POST /api/auth/login` — validates, compares bcrypt hash, returns token

### 4.2 User Roles

Two roles exist in the system:

| Role | Description |
|---|---|
| `customer` | Default role — can shop, manage profile, and view own orders |
| `admin` | Can manage all products, orders, and users via the admin panel |

Role is stored in the database and loaded fresh on every authenticated request. It is never trusted from the JWT payload alone. Admins can promote customers to admin and demote admins to customer via `PUT /api/admin/users/:id/role`, with a last-administrator protection that prevents removing the only remaining admin.

### 4.3 Product Management

The product catalog supports 15 seeded tech products across 5 categories. All product images are served from the Unsplash CDN. Admins can create, update, and delete products with image uploads — images are streamed to Cloudinary and the resulting secure URL is stored in MongoDB.

Server-side filtering, searching, pagination, and sorting are all implemented on `GET /api/products`:

```
?keyword=laptop        — search by name (case-insensitive regex)
?category=Phone        — filter by category
?minPrice=10000        — price range filter
?page=2&limit=12       — pagination
?sort=-price           — sort by field (- = descending)
```

### 4.4 Shopping Cart

Guest carts are stored in browser `localStorage`. When a user logs in, the local cart is merged with the server-side cart stored in MongoDB. Each user has exactly one cart document (unique index on `user`). Cart operations check product stock before adding items.

### 4.5 Wishlist

Authenticated users can add and remove products from a wishlist stored as an array of product references on the User document.

### 4.6 Checkout and Orders

Checkout validates the cart, deducts stock from each product, clears the user's cart, and creates an Order document. The order flow depends on payment method:

**Cash on Delivery:**
```
POST /api/orders → order created (paymentStatus: pending)
→ navigate to /orders with success banner
→ order confirmation email sent
```

**Card / Mobile Money (Chapa):**
```
POST /api/orders → order created (paymentStatus: pending)
→ POST /api/payment/initialize → Chapa returns checkout_url
→ browser redirects to checkout.chapa.co
→ user pays via Telebirr / CBE / card
→ Chapa redirects to /payment/verify?tx_ref=TX-...
→ GET /api/payment/verify → backend calls Chapa API
→ paymentStatus = "paid" → payment confirmation email sent
→ PaymentSuccess page displayed
```

Order ownership is enforced — users can only view and cancel their own orders. Admins can view all orders and update statuses.

### 4.7 Product Reviews and Ratings

Authenticated users can submit one review per product with a 1–5 star rating and comment. Reviews are stored as a sub-document array on the Product. Average rating and review count are recomputed on every create/delete. Reviews display on the product details page. Guests see a prompt to sign in before reviewing.

### 4.8 Admin Dashboard

The admin panel is a separate section accessible only to admin-role users, protected by both `authMiddleware` and `adminMiddleware` at the router level.

**Dashboard statistics:**
- Total registered users
- Total orders placed
- Total revenue (excluding cancelled orders)
- Pending orders count
- Delivered orders count

**Product management:** Full CRUD with image upload via Cloudinary.

**Order management:** View all orders, filter by status, search by order ID or customer, update order status — triggers an email to the customer on every status change.

**User management:** View all users, search by name or email, delete users (self-deletion blocked), change role between `customer` and `admin`.

### 4.9 Email Notifications

Transactional emails sent via Gmail SMTP using Nodemailer. All emails use inline-CSS HTML templates for maximum email client compatibility.

| Trigger | Email type |
|---|---|
| User registers | Welcome email |
| COD order placed | Order confirmation |
| Chapa payment verified | Payment confirmation |
| Admin changes order status | Order status update |
| User cancels own order | Cancellation notification |

Email failures are fire-and-forget — they never break the HTTP response.

### 4.10 UI / UX Features

- Skeleton loading cards instead of a spinner while products load
- Breadcrumb navigation on product details and order details pages
- Related products section at the bottom of product details
- Styled empty states with "Clear filters" action
- Mobile-responsive navigation with click-outside dropdown (works on touch devices)
- Per-page document `<title>` tags via `useDocumentTitle` hook
- Consistent ETB currency formatting throughout
- `react-hot-toast` notifications for all user actions

---

## 5. Database Design

### Collections

#### User
```js
{
  name:      String,          // required
  email:     String,          // required, unique, lowercase
  password:  String,          // bcrypt hashed
  role:      String,          // "customer" | "admin", default "customer"
  address: {
    street, city, state, zipCode, country
  },
  wishlist:  [ObjectId],      // ref: Product
  avatar:    String,          // Cloudinary URL
}
// Pre-save hook hashes password when modified
// matchPassword() method compares bcrypt hash
```

#### Product
```js
{
  name:          String,
  category:      String,
  description:   String,
  image:         String,      // CDN URL
  price:         Number,      // ETB
  stock:         Number,
  reviews: [{
    user:        ObjectId,
    name:        String,
    rating:      Number,      // 1–5
    comment:     String,
    createdAt:   Date,
  }],
  averageRating: Number,
  numReviews:    Number,
}
```

#### Cart
```js
{
  user:  ObjectId,            // unique — one cart per user
  items: [{
    product, name, image, price, quantity
  }],
  // Virtual: total = sum(price × quantity)
}
```

#### Order
```js
{
  user:            ObjectId,
  items:           [{ product, name, image, price, quantity }],
  shippingAddress: { street, city, state, zipCode, country },
  paymentMethod:   "cash_on_delivery" | "card" | "mobile_money",
  paymentStatus:   "pending" | "paid" | "failed",
  orderStatus:     "processing" | "shipped" | "delivered" | "cancelled",
  txRef:           String,    // Chapa transaction reference
  itemsTotal:      Number,
  shippingPrice:   Number,    // 0 if order >= ETB 5,000
  totalPrice:      Number,
  deliveredAt:     Date,
}
```

---

## 6. API Reference

### Standard Response Format

All endpoints return:
```json
{
  "success": true | false,
  "message": "Human-readable string",
  "count": 15,
  "data": { } | [ ]
}
```

### Authentication

```
POST /api/auth/register    — Public
POST /api/auth/login       — Public

Protected routes require: Authorization: Bearer <token>
```

### Products

```
GET    /api/products                   — Public (supports filtering)
GET    /api/products/:id               — Public
GET    /api/products/categories/all    — Public
GET    /api/products/:id/reviews       — Public
POST   /api/products/:id/reviews       — Private (customers only)
DELETE /api/products/:id/reviews/:rid  — Private (own review or admin)
```

### Cart

```
GET    /api/cart              — Private
POST   /api/cart              — Private
PUT    /api/cart/:productId   — Private
DELETE /api/cart/:productId   — Private
DELETE /api/cart              — Private (clear all)
```

### Orders

```
POST   /api/orders              — Private
GET    /api/orders/myorders     — Private
GET    /api/orders/:id          — Private (own orders only)
PUT    /api/orders/:id/cancel   — Private (own orders only)
```

### Users

```
GET    /api/users/profile                  — Private
PUT    /api/users/profile                  — Private
POST   /api/users/avatar                   — Private (multipart/form-data)
GET    /api/users/wishlist                 — Private
POST   /api/users/wishlist/:productId      — Private
DELETE /api/users/wishlist/:productId      — Private
```

### Payment (Chapa)

```
POST   /api/payment/initialize    — Private (card/mobile_money orders)
GET    /api/payment/verify        — Private (?tx_ref=TX-...)
```

### Admin

```
GET    /api/admin/stats                 — Admin only
GET    /api/admin/users                 — Admin only
DELETE /api/admin/users/:id             — Admin only
PUT    /api/admin/users/:id/role        — Admin only
GET    /api/admin/orders                — Admin only
PUT    /api/admin/orders/:id            — Admin only
POST   /api/admin/products              — Admin only (multipart/form-data)
PUT    /api/admin/products/:id          — Admin only (multipart/form-data)
DELETE /api/admin/products/:id          — Admin only
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — no or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found |
| 409 | Conflict — duplicate (e.g. email) |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |

---

## 7. Security Implementation

Security was treated as a first-class concern throughout the project, not an afterthought.

### Authentication Security
- Passwords hashed with bcrypt (10 salt rounds) — plaintext never stored
- Passwords require 8–72 characters with uppercase, lowercase, digit, and special character
- JWT signed with HS256, algorithm pinned on both sign and verify
- `role` never trusted from JWT — always loaded fresh from database
- JWT error messages hardened: clients receive "Invalid or expired token" not raw JWT internals

### HTTP Security Headers
`helmet` middleware adds the following headers on every response:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-XSS-Protection`

### Rate Limiting
- Auth routes: 20 requests per 15 minutes per IP (brute-force protection)
- All other API routes: 300 requests per 15 minutes per IP

### Input Validation and Sanitization
- `express-validator` validates email format, password strength, and required fields on all auth routes
- Custom `sanitize` middleware (Express 5 compatible) strips MongoDB operator keys (`$`, `.`) from request body, params, and query — preventing NoSQL injection
- HTTP Parameter Pollution handled by deduplicating array query params

### CORS
Production allows only the Vercel frontend origin. Localhost entries are stripped when `NODE_ENV=production`.

### File Upload Security
- Only `image/jpeg`, `image/png`, and `image/webp` MIME types accepted
- 5 MB maximum file size
- Files stored in memory only — never written to disk
- Streamed directly to Cloudinary; invalid files rejected server-side by Cloudinary as well

### Authorization
- Every private route requires a valid JWT
- Admin routes protected by both `protect` + `adminOnly` middleware at the router level
- Order ownership verified before any order operation
- Payment ownership verified before initializing Chapa payment
- Profile update explicitly blocks `role` field with 403

### Secrets Management
- All secrets in `.env` (gitignored)
- `.env.example` documents all required variables with placeholders only
- No hardcoded secrets anywhere in source code
- Production secrets set in Render and Vercel dashboards

### Error Handling
- Global error handler never exposes stack traces
- 500 errors return generic "Internal Server Error" in production
- Mongoose `CastError` returns "Invalid resource ID" (not the raw malformed value)

---

## 8. Deployment

### Overview

| Layer | Service | URL |
|---|---|---|
| Database | MongoDB Atlas (M0 Free) | Atlas cluster |
| Backend | Render (Free) | https://techstore-api-nrzx.onrender.com |
| Frontend | Vercel (Free) | https://e-commerce-techstore.vercel.app |
| Images | Cloudinary | techstore/products, techstore/avatars |

### Backend (Render)

**Build command:** `npm install`  
**Start command:** `npm start` (`node server.js`)  
**Root directory:** `backend`

Environment variables set in Render dashboard:
```
NODE_ENV=production
PORT=(set automatically by Render)
MONGO_URI=mongodb+srv://...
JWT_SECRET=<64-char hex secret>
JWT_EXPIRE=30d
CLIENT_URL=https://e-commerce-techstore.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CHAPA_SECRET_KEY=CHASECK_TEST-...
EMAIL_USER=...
EMAIL_PASSWORD=...
```

### Frontend (Vercel)

**Framework:** Vite  
**Build command:** `npm run build`  
**Output directory:** `dist`  
**Root directory:** `tech-electronics-store`

Environment variable:
```
VITE_API_URL=https://techstore-api-nrzx.onrender.com/api
```

A `vercel.json` catch-all rewrite ensures React Router routes work on direct URL access:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### DNS Fix for Local Development

Node.js on some networks (corporate, university) fails to resolve MongoDB Atlas SRV records because the local DNS resolver at `127.0.0.1` refuses connections. The backend `server.js` applies a global DNS fix at startup: it reads a `MONGO_DNS` environment variable for network-specific DNS servers, filters out loopback addresses, and falls back to Google/Cloudflare public DNS. This runs once and covers MongoDB, Chapa, and Cloudinary outbound requests. On Render (cloud), this is a safe no-op.

---

## 9. Testing

### Automated Test Suite

A complete end-to-end test suite was written and run against the live production Render backend. All 74 tests pass.

| Category | Tests | Passed |
|---|---|---|
| Infrastructure | 2 | 2 |
| Products | 8 | 8 |
| Authentication | 11 | 11 |
| JWT / Protected Routes | 4 | 4 |
| User Profile | 6 | 6 |
| Cart | 4 | 4 |
| Wishlist | 3 | 3 |
| Orders / Checkout | 9 | 9 |
| Payment | 3 | 3 |
| Admin API | 5 | 5 |
| Security | 5 | 5 |
| Frontend Bundle | 12 | 12 |
| **Total** | **74** | **74** |

### What Each Section Tested

**Authentication:** Password strength validation (weak passwords rejected), duplicate email conflict, valid/invalid credentials, token issuance.

**JWT:** No-token requests return 401, forged tokens return hardened error message ("Invalid or expired token" — not raw JWT internals).

**Profile:** Data returned correctly, password not exposed, name update works, role change blocked with 403.

**Orders:** Full lifecycle tested — creation, listing, single fetch, cross-user ownership (403), cancellation.

**Security:** Helmet headers present, CORS allows only Vercel origin, NoSQL injection sanitized, rate limiter active.

### npm audit

```
found 0 vulnerabilities
```

---

## 10. Challenges and Solutions

### Challenge 1: express-mongo-sanitize incompatibility with Express 5

`express-mongo-sanitize` and `hpp` both do `req.query = sanitizedCopy`. In Express 5, `req.query` is a read-only getter derived from `req.url`, not a writable property. This caused `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter` on every API request with query parameters.

**Solution:** Removed both packages and wrote a custom `middleware/sanitize.js` that mutates individual properties in-place (`req.query[key] = sanitizedValue`) without ever reassigning the reference. This is Express 5 compatible and provides identical security coverage.

### Challenge 2: Node.js DNS resolution fails on certain networks

Node.js uses its own DNS stack, not the Windows system resolver. On university and corporate networks the local DNS (`127.0.0.1`) refuses or times out on SRV record lookups needed by MongoDB Atlas's `mongodb+srv://` protocol. The Windows resolver and PowerShell `Test-NetConnection` both worked, masking the problem.

**Solution:** Applied `dns.setServers()` globally in `server.js` before any other `require()` call. The function reads a `MONGO_DNS` environment variable (network-specific), skips loopback addresses from the system list, and falls back to `8.8.8.8` and `1.1.1.1`. This fixed both MongoDB Atlas and Chapa API connections simultaneously.

### Challenge 3: Chapa API validation errors returning `[object Object]`

Chapa returns validation errors as a JSON object of field→errors rather than a plain string. The original code did `throw new ApiError(502, data.message)` — when `data.message` is an object, it serializes as `[object Object]` in the error response.

**Solution:** Added a `serializeChapaError()` helper that detects when `message` is an object and flattens it to a readable string using `Object.entries().map()`.

### Challenge 4: Chapa payload validation failure (title too long, invalid description)

`customization.title` has a 16-character maximum and `customization.description` only allows letters, numbers, hyphens, underscores, spaces, and dots. The original payload "TechStore Payment" (17 chars) and "Payment for order #XXXXXXXX" (contains `#`) both failed.

**Solution:** Changed to `title: "TechStore"` (9 chars) and `description: "Order-XXXXXXXX"` (safe format).

### Challenge 5: Avatar uploads saved to wrong field

The existing `uploadAvatar` service wrote to `user.profileImage` — a field that does not exist in the Mongoose schema. Mongoose silently ignores unknown fields, so the data was discarded on every save. Additionally the path was stored as `uploads/filename` (disk-based), which would be lost on every Render redeploy since Render's filesystem is ephemeral.

**Solution:** Fixed the field to `user.avatar` (the correct schema field) and replaced the disk path with a Cloudinary buffer stream upload, consistent with the product image implementation.

### Challenge 6: JWT `role` field and cross-environment user data

Early implementation embedded `role` in the JWT payload. This created a risk of stale role data — a user promoted to admin would need to log out and back in for the change to take effect.

**Solution:** Removed `role` from the JWT entirely. The `authMiddleware` always loads a fresh user from the database using `decoded.id`, ensuring role changes take effect on the next request without requiring re-authentication.

---

## 11. Future Improvements

| Feature | Description |
|---|---|
| Refresh tokens | Replace the 7-day non-revocable JWT with short-lived access tokens + refresh token rotation |
| Password reset | "Forgot password" flow via email with time-limited reset tokens |
| Product image gallery | Multiple images per product with thumbnail carousel |
| Order tracking timeline | Visual status timeline on the order details page |
| Skeleton screens everywhere | Extend skeleton loading to order lists, admin tables |
| Push notifications | Browser push for order status updates |
| Analytics dashboard | Sales charts, revenue trends, top products |
| Production Chapa keys | Upgrade from sandbox to production Chapa credentials |
| Custom domain | Replace Vercel/Render default domains with a custom domain |
| Redis token blacklist | Enable immediate JWT revocation on logout |

---

*End of Documentation — TechStore v1.0 · Gadisa Asefa · August 2026*
