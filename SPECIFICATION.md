# Tech Electronics Store — Complete Development Specification

> **Stack:** React + Vite · Node.js + Express · MongoDB  
> **Version:** 1.0  
> **Date:** August 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Requirements](#2-system-requirements)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Main Modules](#4-main-modules)
5. [Database Design](#5-database-design)
6. [API Requirements](#6-api-requirements)
7. [Development Roadmap](#7-development-roadmap)

---

## 1. Project Overview

### 1.1 Description

TechStore is a full-stack e-commerce platform specializing in tech and electronics products for the Ethiopian market. It allows customers to browse, search, filter, and purchase electronics online using Ethiopian Birr (ETB) as the currency.

### 1.2 Goals

- Provide a fast, mobile-friendly shopping experience
- Support multiple product categories (Laptops, Phones, Accessories, Monitors, Smart Watches)
- Enable secure user authentication and order management
- Give admins full control over products, orders, and users
- Be deployable to cloud infrastructure with minimal cost

### 1.3 Tech Stack

| Layer       | Technology              | Version  |
|-------------|-------------------------|----------|
| Frontend    | React + Vite            | 19 / 8   |
| Routing     | React Router DOM        | v7       |
| HTTP Client | Axios                   | 1.x      |
| Icons       | React Icons (Fi)        | 5.x      |
| Backend     | Node.js + Express       | 22 / 5.x |
| Database    | MongoDB + Mongoose      | 9.x      |
| Auth        | JWT + bcryptjs          |          |
| File Upload | Multer (local storage)  |          |
| Environment | dotenv                  |          |

### 1.4 Currency & Region

- Currency: **ETB (Ethiopian Birr)**
- Language: **English**
- Free shipping threshold: **ETB 5,000**
- Default shipping fee: **ETB 200**

---

## 2. System Requirements

### 2.1 Functional Requirements

| ID   | Requirement                                                         |
|------|---------------------------------------------------------------------|
| FR01 | Users can register with name, email, and password                   |
| FR02 | Users can login and receive a JWT token (30-day expiry)             |
| FR03 | Users can browse all products without logging in                    |
| FR04 | Users can search products by name and filter by category            |
| FR05 | Users can sort products by price, name, or newest                   |
| FR06 | Users can view full product details                                 |
| FR07 | Users can add products to a persistent cart                         |
| FR08 | Users can manage cart (increase/decrease quantity, remove, clear)   |
| FR09 | Logged-in users can place an order with shipping address            |
| FR10 | Users can choose payment method (Cash, Card, Mobile Money)         |
| FR11 | Users can view their order history                                  |
| FR12 | Users can cancel orders that are not yet delivered                  |
| FR13 | Users can add/remove products from their wishlist                   |
| FR14 | Users can edit their profile and shipping address                   |
| FR15 | Users can change their password                                     |
| FR16 | Admins can add, edit, and delete products                           |
| FR17 | Admins can upload product images                                    |
| FR18 | Admins can view and update order statuses                           |
| FR19 | Admins can view all registered users and delete them                |
| FR20 | Admins can view dashboard statistics (revenue, orders, users)       |

### 2.2 Non-Functional Requirements

| ID    | Requirement                                                         |
|-------|---------------------------------------------------------------------|
| NFR01 | API response time < 500ms for standard queries                      |
| NFR02 | Passwords must be hashed (bcrypt, 10 salt rounds)                   |
| NFR03 | All private routes require valid JWT in Authorization header        |
| NFR04 | Uploaded images limited to 5MB, JPEG/PNG/WebP only                 |
| NFR05 | Frontend must be responsive (mobile, tablet, desktop)               |
| NFR06 | API must return consistent JSON format for all responses            |
| NFR07 | Global error handler must catch all unhandled errors                |
| NFR08 | Stock must be deducted on order and restored on cancellation        |

### 2.3 Environment Variables

#### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/techstore
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

#### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 3. User Roles & Permissions

### 3.1 Role Definitions

| Role      | Description                                                   |
|-----------|---------------------------------------------------------------|
| **Guest** | Unauthenticated visitor — can browse and view products only   |
| **User**  | Registered customer — can shop, order, and manage profile     |
| **Admin** | Store manager — full control over products, orders, and users |

### 3.2 Permission Matrix

| Feature                   | Guest | User | Admin |
|---------------------------|:-----:|:----:|:-----:|
| Browse products            |  ✅   |  ✅  |  ✅   |
| View product details       |  ✅   |  ✅  |  ✅   |
| Search & filter            |  ✅   |  ✅  |  ✅   |
| Add to cart (local)        |  ✅   |  ✅  |  ✅   |
| Register / Login           |  ✅   |  —   |  —    |
| Place order                |  ❌   |  ✅  |  ✅   |
| View own orders            |  ❌   |  ✅  |  ✅   |
| Cancel own order           |  ❌   |  ✅  |  ✅   |
| Manage wishlist            |  ❌   |  ✅  |  ✅   |
| Edit profile               |  ❌   |  ✅  |  ✅   |
| Add/Edit/Delete products   |  ❌   |  ❌  |  ✅   |
| Upload product images      |  ❌   |  ❌  |  ✅   |
| View all orders            |  ❌   |  ❌  |  ✅   |
| Update order status        |  ❌   |  ❌  |  ✅   |
| View all users             |  ❌   |  ❌  |  ✅   |
| Delete users               |  ❌   |  ❌  |  ✅   |
| View dashboard stats       |  ❌   |  ❌  |  ✅   |

---

## 4. Main Modules

### 4.1 Authentication Module

Handles user registration, login, and JWT token management.

**Components:**
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — authenticate and return token
- `AuthContext` — React context storing user + token in localStorage
- `PrivateRoute` / `AdminRoute` — route guards

**Flow:**
```
User submits form
  → validate fields (backend middleware)
  → hash password (bcrypt)
  → save User to DB
  → generate JWT (30 days)
  → return token + user data
  → store in localStorage
  → update AuthContext
  → redirect to home / admin
```

---

### 4.2 Product Module

Manages all product data, search, filtering, and pagination.

**Features:**
- Get all products with optional filters (keyword, category, price range)
- Server-side pagination (default 12 per page)
- Sort by newest, price asc/desc, name
- Get single product by ID
- Admin: create, update, delete with image upload

**Product Categories:**
- Laptop
- Phone
- Accessories
- Monitor
- Smart Watch

---

### 4.3 Cart Module

Manages shopping cart. Guest cart stored in localStorage, logged-in user cart persisted to MongoDB.

**Features:**
- Add item to cart (checks stock)
- Update item quantity
- Remove single item
- Clear entire cart
- Virtual `total` computed on cart document

---

### 4.4 Order Module

Handles the full order lifecycle from placement to delivery.

**Order Statuses:**
```
processing → shipped → delivered
         ↘ cancelled (from any non-delivered state)
```

**Payment Statuses:**
```
pending → paid (auto on delivery)
        → failed
```

**Payment Methods:**
- Cash on Delivery
- Credit/Debit Card
- Mobile Money (Telebirr / CBE)

**Order Flow:**
```
User fills checkout form
  → validate cart is not empty
  → verify stock for each item
  → calculate totals + shipping
  → deduct stock from products
  → clear user's DB cart
  → create Order document
  → redirect to /orders with success banner
```

---

### 4.5 User Profile Module

Manages user account information and preferences.

**Features:**
- View profile (name, email, address, role, wishlist)
- Update name, email, shipping address
- Change password (requires current password verification)
- View wishlist (populated product details)
- Add / remove products from wishlist

---

### 4.6 Admin Module

Full store management panel accessible only to admin role users.

**Dashboard:**
- Total users count
- Total orders count
- Total revenue (excluding cancelled orders)
- Pending orders count
- Completed (delivered) orders count

**Product Management:**
- Table of all products with image, name, category, price, stock
- Add new product (with image upload, live preview)
- Edit existing product
- Delete product (with confirmation dialog)
- Stock color coding (red = 0, orange = < 5, green = OK)

**Order Management:**
- Table of all orders with customer, total, status, payment
- Filter by status
- Search by order ID or customer name/email
- Update order status via dropdown (optimistic update)
- Delivered orders auto-set payment to paid and lock the select

**User Management:**
- Table of all users with avatar initial, name, email, role, join date
- Search by name or email
- Delete user (with confirmation, cannot delete self)

---

### 4.7 UI Component Module

Reusable components used across the application.

| Component    | Purpose                                              |
|--------------|------------------------------------------------------|
| `Navbar`     | Sticky nav with cart badge, auth dropdown, mobile menu |
| `Footer`     | Links to pages, social media, copyright              |
| `Hero`       | Homepage banner with CTA button                      |
| `ProductCard`| Product image, name, price, Add to Cart button       |
| `CategoryCard`| Pill button for filtering by category               |
| `SearchBar`  | Input with search icon and clear button              |
| `Loader`     | Spinner with size variants (small, medium, large)    |
| `Button`     | Reusable button (variant, size, loading state)       |
| `Rating`     | Star rating display                                  |

---

## 5. Database Design

### 5.1 User Collection

```js
{
  _id: ObjectId,
  name: String,           // required
  email: String,          // required, unique, lowercase
  password: String,       // bcrypt hashed, required
  role: String,           // enum: ["user", "admin"], default: "user"
  address: {
    street:  String,
    city:    String,
    state:   String,
    zipCode: String,
    country: String,
  },
  wishlist: [ObjectId],   // ref: Product
  avatar: String,         // URL or empty string
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:** `email` (unique)  
**Hooks:** `pre('save')` hashes password when modified  
**Methods:** `matchPassword(plain)` → bcrypt.compare

---

### 5.2 Product Collection

```js
{
  _id: ObjectId,
  name: String,           // required
  category: String,       // required
  description: String,    // required
  image: String,          // URL or local path, required
  price: Number,          // required, ETB
  stock: Number,          // default: 0
  createdAt: Date,
  updatedAt: Date,
}
```

---

### 5.3 Cart Collection

```js
{
  _id: ObjectId,
  user: ObjectId,         // ref: User, required, unique (one cart per user)
  items: [
    {
      product:  ObjectId, // ref: Product
      name:     String,
      image:    String,
      price:    Number,
      quantity: Number,   // min: 1
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  // Virtual:
  total: Number,          // sum of price * quantity
}
```

---

### 5.4 Order Collection

```js
{
  _id: ObjectId,
  user: ObjectId,          // ref: User, required
  items: [
    {
      product:  ObjectId,  // ref: Product
      name:     String,
      image:    String,
      price:    Number,
      quantity: Number,
    }
  ],
  shippingAddress: {
    street:  String,       // required
    city:    String,       // required
    state:   String,
    zipCode: String,
    country: String,       // required
  },
  paymentMethod: String,   // enum: cash_on_delivery | card | mobile_money
  paymentStatus: String,   // enum: pending | paid | failed
  orderStatus:   String,   // enum: processing | shipped | delivered | cancelled
  itemsTotal:    Number,
  shippingPrice: Number,
  totalPrice:    Number,
  deliveredAt:   Date,
  createdAt:     Date,
  updatedAt:     Date,
}
```

---

### 5.5 Entity Relationship Diagram

```
User ─────────────┬──── has one ──── Cart
                  │                    │
                  │                    └── contains many ── Product
                  │
                  └──── places many ── Order
                                         │
                                         └── contains many ── Product

User ──── wishlist (many-to-many) ──── Product
```

---

## 6. API Requirements

### 6.1 Standard Response Format

All API endpoints return a consistent JSON envelope:

```json
// Success
{
  "success": true,
  "message": "Human-readable message",
  "count": 15,
  "data": { ... } | [ ... ]
}

// Error
{
  "success": false,
  "message": "Error description"
}
```

### 6.2 Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

### 6.3 Auth Endpoints

| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| POST   | `/api/auth/register` | Public  | Register new user  |
| POST   | `/api/auth/login`    | Public  | Login, get token   |

**Register body:**
```json
{ "name": "John", "email": "john@example.com", "password": "123456" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "123456" }
```

**Response data:**
```json
{
  "_id": "...",
  "name": "John",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJ..."
}
```

---

### 6.4 Product Endpoints

| Method | Endpoint                        | Access       | Description              |
|--------|---------------------------------|--------------|--------------------------|
| GET    | `/api/products`                 | Public       | Get all (with filters)   |
| GET    | `/api/products/:id`             | Public       | Get single product       |
| GET    | `/api/products/categories/all`  | Public       | Get distinct categories  |

**Query parameters for GET /api/products:**

| Param      | Type   | Example              | Description                    |
|------------|--------|----------------------|--------------------------------|
| `keyword`  | string | `?keyword=laptop`    | Search by name (regex, i)      |
| `category` | string | `?category=Phone`    | Filter by category             |
| `minPrice` | number | `?minPrice=10000`    | Minimum price filter           |
| `maxPrice` | number | `?maxPrice=50000`    | Maximum price filter           |
| `page`     | number | `?page=2`            | Pagination page (default: 1)   |
| `limit`    | number | `?limit=12`          | Items per page (default: 12)   |
| `sort`     | string | `?sort=-price`       | Sort field (- = descending)    |

---

### 6.5 Cart Endpoints

| Method | Endpoint               | Access  | Description            |
|--------|------------------------|---------|------------------------|
| GET    | `/api/cart`            | Private | Get user's cart        |
| POST   | `/api/cart`            | Private | Add item to cart       |
| PUT    | `/api/cart/:productId` | Private | Update item quantity   |
| DELETE | `/api/cart/:productId` | Private | Remove item from cart  |
| DELETE | `/api/cart`            | Private | Clear entire cart      |

**Add to cart body:**
```json
{ "productId": "...", "quantity": 1 }
```

---

### 6.6 Order Endpoints

| Method | Endpoint               | Access  | Description           |
|--------|------------------------|---------|-----------------------|
| POST   | `/api/orders`          | Private | Create order          |
| GET    | `/api/orders/myorders` | Private | Get my order history  |
| GET    | `/api/orders/:id`      | Private | Get single order      |
| PUT    | `/api/orders/:id/cancel` | Private | Cancel order         |

**Create order body:**
```json
{
  "items": [
    { "product": "...", "quantity": 2 }
  ],
  "shippingAddress": {
    "street": "Bole Road",
    "city": "Addis Ababa",
    "country": "Ethiopia"
  },
  "paymentMethod": "cash_on_delivery"
}
```

---

### 6.7 User Endpoints

| Method | Endpoint                        | Access  | Description              |
|--------|---------------------------------|---------|--------------------------|
| GET    | `/api/users/profile`            | Private | Get own profile          |
| PUT    | `/api/users/profile`            | Private | Update own profile       |
| POST   | `/api/users/wishlist/:productId` | Private | Add to wishlist         |
| DELETE | `/api/users/wishlist/:productId` | Private | Remove from wishlist    |

---

### 6.8 Admin Endpoints

| Method | Endpoint                   | Access | Description             |
|--------|----------------------------|--------|-------------------------|
| GET    | `/api/admin/stats`         | Admin  | Dashboard statistics    |
| GET    | `/api/admin/users`         | Admin  | Get all users           |
| DELETE | `/api/admin/users/:id`     | Admin  | Delete user             |
| GET    | `/api/admin/orders`        | Admin  | Get all orders          |
| PUT    | `/api/admin/orders/:id`    | Admin  | Update order status     |
| POST   | `/api/admin/products`      | Admin  | Create product (upload) |
| PUT    | `/api/admin/products/:id`  | Admin  | Update product (upload) |
| DELETE | `/api/admin/products/:id`  | Admin  | Delete product          |

---

### 6.9 HTTP Status Codes Used

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | OK — successful GET/PUT/DELETE       |
| 201  | Created — successful POST            |
| 400  | Bad Request — validation error       |
| 401  | Unauthorized — no/invalid token      |
| 403  | Forbidden — insufficient permissions |
| 404  | Not Found — resource doesn't exist   |
| 409  | Conflict — duplicate (email, etc.)   |
| 500  | Internal Server Error                |

---

## 7. Development Roadmap

### Phase 1 ✅ — Foundation (Completed)
- React + Vite project setup
- Express server + MongoDB connection
- Product model and basic CRUD API
- Home page with product grid
- Product details page
- Local cart with Context API

### Phase 2 ✅ — Backend Architecture (Completed)
- Clean folder structure: Controllers → Services → Models
- Unified `ApiResponse` and `ApiError` classes
- `asyncHandler` wrapper
- Global error handler with Mongoose/JWT error mapping
- Request validation middleware

### Phase 3 ✅ — Authentication (Completed)
- User model with bcrypt password hashing
- JWT token generation and verification
- Register and Login endpoints
- `protect` middleware for private routes
- `adminOnly` middleware for admin routes
- `AuthContext` with localStorage persistence
- `PrivateRoute` and `AdminRoute` components
- Login and Register pages
- Navbar updates based on auth state

### Phase 4 ✅ — Shopping Features (Completed)
- Persistent cart (localStorage + MongoDB)
- Full cart page with quantity controls and totals
- Wishlist API and page
- Checkout page with address form and payment selection
- Order creation with stock validation and deduction
- Order history page
- Order cancellation with stock restoration
- Free shipping threshold logic
- Shipping address management in profile

### Phase 5 ✅ — Admin Panel (Completed)
- Admin sidebar layout
- Dashboard with 5 stat cards
- Products table with Add/Edit/Delete + image upload
- Orders table with filter, search, status update
- Users table with search and delete
- Delete confirmation dialogs (no browser `confirm()`)

### Phase 6 — Reviews & Notifications (Next)

**6.1 Product Reviews**
- Add `reviews[]` array to Product model
  ```js
  reviews: [{
    user: ObjectId,        // ref: User
    name: String,
    rating: Number,        // 1–5
    comment: String,
    createdAt: Date,
  }]
  averageRating: Number,
  numReviews: Number,
  ```
- `POST /api/products/:id/reviews` — add review (one per user)
- `GET /api/products/:id/reviews` — get all reviews
- Star rating UI on ProductDetails
- Average rating displayed on ProductCard

**6.2 Toast Notifications**
- Install `react-hot-toast`
- Replace all silent failures with toast feedback
- Toasts for: add to cart, login, register, order placed, errors

**6.3 Order Detail Page**
- Route: `/orders/:id`
- Full receipt: items table, address, totals, status timeline
- Print / download invoice button

### Phase 7 — Polish & Performance (Future)

- Replace hardcoded `http://localhost:5000` with `import.meta.env.VITE_API_URL`
- Skeleton loading screens instead of spinner
- Breadcrumb navigation
- Related products section on ProductDetails
- Product image gallery (multiple images support)
- Low-stock warning badge on product cards
- SEO: `<title>` and `<meta>` tags per page

### Phase 8 — Deployment (Final)

| Service       | Platform          | Plan   |
|---------------|-------------------|--------|
| Database      | MongoDB Atlas     | Free M0 |
| Backend API   | Render or Railway | Free   |
| Frontend      | Vercel            | Free   |

**Deployment Checklist:**
- [ ] Create MongoDB Atlas cluster, whitelist `0.0.0.0/0`
- [ ] Set all environment variables on hosting platform
- [ ] Update `CLIENT_URL` in backend `.env` to production domain
- [ ] Update `VITE_API_URL` in frontend `.env.production`
- [ ] Set CORS origin to production frontend URL
- [ ] Run `npm run build` for frontend, deploy `dist/` to Vercel
- [ ] Push backend to GitHub, connect to Render for auto-deploy
- [ ] Test all API endpoints on production URL
- [ ] Create first admin user via direct DB insert or seed script

---

*End of Specification — TechStore v1.0*
