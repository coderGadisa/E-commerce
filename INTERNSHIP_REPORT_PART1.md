---

# HARAMAYA UNIVERSITY
## College of Computing and Informatics
## Department of Computer Science

---

# INDUSTRIAL PRACTICE REPORT

**Title:** Development of a Full-Stack E-Commerce Platform for Tech and Electronics Products

**Submitted by:** Gadisa Asefa

**Student ID:** [Your Student ID]

**Advisor:** [Advisor Name]

**Submission Date:** August 2026

---
---

# ACKNOWLEDGEMENT

I would like to express my sincere gratitude to all those who supported me throughout this internship and the preparation of this report.

First and foremost, I thank **Almighty God** for granting me the strength, knowledge, and perseverance to complete this work.

I extend my deepest appreciation to my **academic advisor** at Haramaya University, College of Computing and Informatics, for providing consistent guidance, constructive feedback, and encouragement throughout the duration of this industrial practice program.

I am grateful to the **Department of Computer Science** at Haramaya University for organizing this industrial practice opportunity and for providing the academic foundation that made this project possible.

I also thank my **family and friends** for their unconditional moral support and encouragement throughout my studies and during the completion of this project.

Finally, I acknowledge the open-source communities behind **React**, **Node.js**, **MongoDB**, **Express**, **Cloudinary**, and **Chapa** whose tools and documentation made this project achievable.

---
---

# LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| API | Application Programming Interface |
| bcrypt | Blowfish Crypt (password hashing algorithm) |
| CDN | Content Delivery Network |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| DNS | Domain Name System |
| ETB | Ethiopian Birr |
| HPP | HTTP Parameter Pollution |
| HTTPS | Hypertext Transfer Protocol Secure |
| IDE | Integrated Development Environment |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MERN | MongoDB, Express, React, Node.js |
| MVC | Model-View-Controller |
| NoSQL | Not Only Structured Query Language |
| ODM | Object Document Mapper |
| REST | Representational State Transfer |
| SPA | Single-Page Application |
| SRV | Service Record (DNS) |
| UI | User Interface |
| UX | User Experience |
| URL | Uniform Resource Locator |

---
---

# TABLE OF CONTENTS

- Acknowledgement
- List of Abbreviations
- Table of Contents
- List of Tables
- List of Figures
- Organization of the Document

**Chapter 1: Introduction**
1. Background of the Organization
2. Structure of the Organization
3. Team/Department Overview
4. Project Context
5. Objectives

**Chapter 2: Software Development Plan**
1. Project Schedule
2. Resources
3. Risk Management
4. Development Methodology
5. Quality Assurance
6. Required Documents

**Chapter 3: System Requirements**
1. Existing System Analysis
2. Proposed System

**Chapter 4: System Analysis and Design**
1. System Models
2. User Interface Design
3. Software Architecture
4. Security and Access Control

**Chapter 5: Implementation**
1. Development Process
2. Challenges and Solutions
3. Testing

**Chapter 6: Internship Reflection and Conclusion**
1. Learning Outcomes
2. Challenges Faced
3. Recommendations

- Appendices
- References

---
---

# LIST OF TABLES

| Table No. | Title |
|---|---|
| Table 2.1 | Project Milestones and Timeline |
| Table 2.2 | Development Tools and Resources |
| Table 2.3 | Risk Register |
| Table 3.1 | Functional Requirements |
| Table 3.2 | Non-Functional Requirements |
| Table 5.1 | System Test Results |
| Table 5.2 | Security Test Results |

---

# LIST OF FIGURES

| Figure No. | Title |
|---|---|
| Figure 4.1 | Use Case Diagram |
| Figure 4.2 | System Architecture Diagram |
| Figure 4.3 | Entity-Relationship Diagram |
| Figure 4.4 | Sequence Diagram — User Registration |
| Figure 4.5 | Sequence Diagram — Chapa Payment Flow |
| Figure 4.6 | Activity Diagram — Order Lifecycle |
| Figure 4.7 | Deployment Diagram |

---
---

# ORGANIZATION OF THE DOCUMENT

This report is organized into six chapters following the Haramaya University Industrial Practice Report Guideline for Software Development.

**Chapter 1** provides background on the host organization, the team structure, the project context and problem statement, and the objectives of the industrial practice.

**Chapter 2** describes the project schedule with milestones, the tools and resources used, identified risks and mitigation strategies, the development methodology chosen, and quality assurance practices.

**Chapter 3** analyses the existing situation in the target domain, then specifies the functional and non-functional requirements of the proposed system.

**Chapter 4** presents system models including use case, class, sequence, and activity diagrams, describes the user interface design, software architecture, and security mechanisms.

**Chapter 5** describes the development process, tools used, technical challenges encountered and resolved, and testing results at unit, integration, and system levels.

**Chapter 6** reflects on the learning outcomes, challenges faced during the internship, and offers recommendations for the organization and future internship programs.

The report ends with **Appendices** containing selected code snippets and a **References** section citing all sources in APA format.

---
---

# CHAPTER 1: INTRODUCTION

## 1.1 Background of the Organization

TechStore is a software development project focused on building a modern, production-ready e-commerce platform for the Ethiopian market. The platform specializes in technology and electronics products, targeting the growing community of technology consumers in Ethiopia who increasingly seek to purchase electronics online. The project was designed and developed as part of an industrial practice program, simulating the environment of a real software development company.

Ethiopia's digital economy has been growing rapidly in recent years, driven by increasing smartphone penetration, expanding internet connectivity, and government initiatives supporting digital commerce. Despite this growth, few localized e-commerce platforms exist that cater specifically to the Ethiopian market with Ethiopian Birr (ETB) support and integration with local payment providers such as Chapa, which supports Telebirr and CBE Birr mobile money. TechStore was created to address this gap.

The host organization's mission during this internship was to design, develop, test, and deploy a complete MERN stack web application supporting the full customer journey from product discovery through to payment, with a comprehensive administration system for managing the catalog, orders, and users. The live application is accessible at:

- **Frontend:** https://e-commerce-techstore.vercel.app
- **Backend API:** https://techstore-api-nrzx.onrender.com
- **Repository:** https://github.com/coderGadisa/E-commerce

## 1.2 Structure of the Organization

The TechStore project operates under a flat software development team structure typical of modern startup environments. The hierarchy relevant to this internship is as follows:

```
Academic Advisor (Haramaya University)
        |
        |-- supervises
        |
Full-Stack Developer (Intern: Gadisa Asefa)
        |
        |-- Frontend Development (React / Vite)
        |-- Backend Development (Node.js / Express)
        |-- Database Design (MongoDB / Mongoose)
        |-- DevOps / Deployment (Render, Vercel, Atlas)
        |-- Security Implementation
        |-- Payment Integration (Chapa)
        |-- Email Notification System (Gmail SMTP)
```

The intern served as the primary developer responsible for the entire software stack, from initial design through to cloud deployment. The academic advisor provided oversight, guidance, and review throughout the project lifecycle.

## 1.3 Team/Department Overview

**Team Composition:**
The development team consisted of one intern developer under academic supervision. This structure mirrors the individual contributor model common in early-stage software startups and freelance software development.

**Workflow:**
Development followed an iterative, feature-driven approach:
- Features were planned, designed, implemented, tested locally, and deployed to production in sequential phases
- Version control was managed using Git with GitHub as the remote repository
- The Kiro AI-powered IDE was used as the primary development environment
- Every major feature was deployed to the live environment and verified before the next was started

**Collaboration Methods:**
- Weekly progress reviews with the academic advisor
- Regular commits to GitHub tracking all code changes with descriptive commit messages
- Testing against the live production environment after each deployment
- Issue tracking and debugging through IDE-integrated tools

## 1.4 Project Context

### Problem Statement

Ethiopian technology consumers face limited options when purchasing electronics online. Most available platforms are either international (not supporting ETB or local payment methods) or general marketplaces lacking specialized product information, category filtering, and a professional purchasing experience. Physical stores remain the dominant channel, which is slow, geographically limited, and lacks the convenience of online comparison and purchase.

There is also a need for electronics business owners to have a professional, manageable online storefront with real-time inventory control, order tracking, and customer management — without the complexity or cost of enterprise platforms.

### Purpose

TechStore provides a complete, locally adapted e-commerce solution that:
- Accepts Ethiopian Birr (ETB) and integrates with Chapa for Telebirr and CBE payments
- Offers a smooth, mobile-responsive shopping experience
- Provides administrators with full control over products, orders, and users
- Applies production-grade security practices throughout the stack
- Sends transactional email notifications to customers for every significant event

### Scope

The project covers:
- Full customer-facing storefront (product browsing, search, cart, checkout, orders)
- Chapa payment gateway integration (card and mobile money)
- User account management with profile, wishlist, and avatar upload
- Product reviews and star ratings
- Complete admin panel for store management
- Email notification system for five transactional events
- Cloud deployment on MongoDB Atlas, Render, and Vercel
- 74-test automated end-to-end test suite

### Out of Scope

- Native mobile application (iOS/Android)
- Multiple vendor marketplace functionality
- Inventory restocking automation
- Live chat or customer support system

## 1.5 Objectives

### General Objective

To design, develop, and deploy a production-ready full-stack e-commerce web application for tech and electronics products targeting the Ethiopian market, integrating local payment methods, transactional email notifications, and a comprehensive administrative management system.

### Specific Objectives

1. Design and implement a secure RESTful API using Node.js and Express with JWT-based authentication, role-based authorization, and input validation using express-validator
2. Build a responsive React single-page application supporting product browsing, cart management, checkout, and complete order history
3. Integrate the Chapa payment gateway to process card and mobile money payments with server-side verification ensuring payment status is only updated after Chapa confirms success
4. Implement a transactional email notification system using Gmail SMTP covering five events: registration welcome, COD order confirmation, Chapa payment confirmation, order status updates, and order cancellation
5. Build a full-featured administration panel for product CRUD with Cloudinary image upload, order status management, and user role management with last-administrator protection
6. Apply production-grade security including bcrypt password hashing, HTTP security headers via helmet, rate limiting, NoSQL injection sanitization, and hardened JWT error handling
7. Deploy the complete application to cloud infrastructure and validate with an automated end-to-end test suite achieving 74/74 passing tests

---

# CHAPTER 2: SOFTWARE DEVELOPMENT PLAN

## 2.1 Project Schedule

The project was executed across twelve development phases over approximately ten weeks.

**Table 2.1 — Project Milestones and Timeline**

| Phase | Milestone | Key Deliverable | Week |
|---|---|---|---|
| 1 | Foundation | React/Vite setup, Express server, MongoDB connection, product listing | 1 |
| 2 | Backend Architecture | Controllers→Services→Models pattern, ApiResponse/ApiError, error handler | 2 |
| 3 | Authentication | User model, bcrypt, JWT, login/register, AuthContext, PrivateRoute | 2–3 |
| 4 | Shopping Features | Cart, wishlist, checkout, order creation, order history, cancellation | 3–4 |
| 5 | Admin Panel | Dashboard stats, product CRUD + image upload, order and user management | 4–5 |
| 6 | Reviews and Notifications | Product reviews, star ratings, toast notifications, Order Details page | 5–6 |
| 7 | UI Polish | Skeleton loading, breadcrumbs, related products, responsive fixes, page titles | 6 |
| 8 | Deployment | MongoDB Atlas, Render, Vercel, CORS, env variables, production testing | 7 |
| 9 | Payment Integration | Chapa gateway, initialization, verification, PaymentSuccess/Failed pages | 8 |
| 10 | Email Notifications | Gmail SMTP, five email templates, fire-and-forget email service | 8 |
| 11 | Security Hardening | helmet, rate limiting, sanitization, JWT hardening, input validation | 9 |
| 12 | Testing and Documentation | 74-test E2E suite, bug fixes, final deployment, report writing | 10 |

## 2.2 Resources

**Table 2.2 — Development Tools and Resources**

| Category | Tool / Resource | Purpose |
|---|---|---|
| IDE | Kiro (AI-powered VS Code) | Primary development environment |
| Version Control | Git + GitHub | Source code management |
| Frontend | React 19 + Vite 8 | UI development and production builds |
| Backend | Node.js 22 + Express 5 | RESTful API |
| Database | MongoDB Atlas + Mongoose 9 | Cloud NoSQL database |
| Authentication | JSON Web Token + bcryptjs | Secure user authentication |
| Image Storage | Cloudinary | Product and avatar image CDN |
| Payment | Chapa API | Ethiopian payment gateway |
| Email | Gmail SMTP + Nodemailer | Transactional email delivery |
| Security | helmet, express-rate-limit | HTTP headers and rate limiting |
| Deployment | Render (backend), Vercel (frontend) | Cloud hosting |
| Testing | Custom Node.js HTTPS scripts | Automated API test suite |
| Package Manager | npm | Dependency management |

## 2.3 Risk Management

**Table 2.3 — Risk Register**

| Risk | Likelihood | Impact | Mitigation Strategy | Outcome |
|---|---|---|---|---|
| MongoDB Atlas connection failure | Medium | High | Global DNS fix in server.js; MONGO_DNS env var for network-specific resolver | Resolved |
| Chapa API validation errors | Medium | High | serializeChapaError() helper; sandbox testing before production | Resolved |
| Express 5 package incompatibility | Medium | High | Test all packages; write custom Express 5-compatible replacements | Resolved |
| Render free tier cold start | High | Low | Documented expected 30–60s delay; acceptable for this scale | Accepted |
| JWT secret compromise | Low | Critical | 64-char randomly generated secret; stored only in Render env vars | Mitigated |
| Email delivery failure | Medium | Low | Fire-and-forget — never blocks API response; errors logged | Mitigated |
| Data loss in development | Low | High | MongoDB Atlas automated backups; Git version control | Mitigated |

## 2.4 Development Methodology

The project used an **Incremental and Iterative** development methodology — a hybrid of Agile principles adapted for a single-developer project under academic supervision.

Pure Waterfall was rejected because requirements evolved throughout the project. For example, the decision to use Cloudinary instead of local file storage was made after discovering that Render's filesystem is ephemeral. A formal Scrum process was impractical for a solo developer, but Agile values were applied throughout.

**Development Cycle per Feature:**
```
Plan → Design → Implement → Test Locally →
Deploy to Render/Vercel → Test Live → Fix Bugs → Verify → Next Feature
```

This ensured that every feature was working in production before moving to the next, preventing the accumulation of integration problems that commonly occurs when all features are integrated at the end.

## 2.5 Quality Assurance

**Testing Protocols:**
- Unit-level: Service functions tested directly via Node.js scripts
- Integration-level: API endpoints tested verifying the controller→service→database chain
- System-level: 74-test automated suite against live production environment
- Security testing: JWT hardening, CORS validation, NoSQL injection verification, rate limiter confirmation

**Code Standards:**
- Consistent three-layer architecture: Routes → Controllers → Services → Models
- All async functions wrapped in `asyncHandler` to eliminate unhandled promise rejections
- Consistent API response format: `{ success, message, count, data }`
- All secrets stored in `.env` (gitignored); `.env.example` documents required variables
- No hardcoded secrets in source code

## 2.6 Required Documents

| Document | Status |
|---|---|
| Technical Specification (SPECIFICATION.md) | Completed |
| API Reference and Architecture Documentation (DOCUMENTATION.md) | Completed |
| Database Design (Chapter 4 of this report) | Completed |
| Deployment Configuration | Completed |
| Automated Test Report (Chapter 5 of this report) | Completed |
| Industrial Practice Report (this document) | Completed |

---

# CHAPTER 3: SYSTEM REQUIREMENTS

## 3.1 Existing System Analysis

### Overview of the Existing Situation

Before TechStore was developed, technology product consumers in Ethiopia relied primarily on:

1. **Physical retail stores** — Customers visit stores in Merkato, Piassa, or Bole to purchase electronics. This is geographically restricting, time-consuming, and lacks online price transparency.

2. **Social media marketplaces** — Sellers use Facebook groups and Telegram channels to advertise products with no formal checkout, no order tracking, and no authentication.

3. **International platforms** — Amazon and similar platforms do not support ETB, do not integrate with Telebirr or CBE, and have unreliable or costly international shipping.

4. **Simple listing websites** — A few local sites function only as catalogs with no cart, no checkout, and no account management.

### Limitations of Existing Systems

| Limitation | Impact |
|---|---|
| No ETB support on international platforms | Cannot pay in local currency |
| No Telebirr or CBE integration | Most Ethiopians use mobile money; unavailable on existing platforms |
| No product reviews or ratings | Cannot make informed decisions from peer experience |
| No order tracking | No visibility into delivery after social media purchase |
| No inventory management | Sellers cannot track stock levels |
| No admin dashboard | No centralized revenue, customer, or order management |
| Mobile-unfriendly design | Most Ethiopian internet users are on mobile devices |

## 3.2 Proposed System

### Functional Requirements

**Table 3.1 — Functional Requirements**

| ID | Requirement | Priority |
|---|---|---|
| FR01 | Customers can register with name, email, and strong password | High |
| FR02 | Customers can log in and receive a 7-day JWT token | High |
| FR03 | Customers can browse all products without an account | High |
| FR04 | Customers can search products by keyword | High |
| FR05 | Customers can filter products by category | High |
| FR06 | Customers can sort products by price and name | Medium |
| FR07 | Customers can view product details with images and reviews | High |
| FR08 | Customers can manage a persistent shopping cart | High |
| FR09 | Customers can add/remove products from a wishlist | Medium |
| FR10 | Logged-in customers can place orders with shipping address | High |
| FR11 | Customers can pay via Cash on Delivery | High |
| FR12 | Customers can pay via Card or Mobile Money through Chapa | High |
| FR13 | Chapa payment verification updates paymentStatus to "paid" | High |
| FR14 | Customers can view order history and individual order details | High |
| FR15 | Customers can cancel orders not yet delivered | Medium |
| FR16 | Customers can edit profile, address, and password | Medium |
| FR17 | Customers can upload a profile avatar image | Low |
| FR18 | Customers can submit product reviews with star ratings | Medium |
| FR19 | Admins can create, update, and delete products with image upload | High |
| FR20 | Admins can view and update order statuses | High |
| FR21 | Admins can view, delete, and change roles of users | Medium |
| FR22 | Admins can view dashboard statistics | Medium |
| FR23 | System sends welcome email after registration | Medium |
| FR24 | System sends order and payment confirmation emails | Medium |
| FR25 | System sends order status update emails | Medium |
| FR26 | Last administrator cannot be demoted | High |

### Non-Functional Requirements

**Table 3.2 — Non-Functional Requirements**

| Category | Requirement |
|---|---|
| Performance | API response under 500ms for standard queries on a warm server |
| Availability | Frontend 24/7 via Vercel CDN; backend auto-restarts on Render |
| Security | Passwords hashed with bcrypt (10 rounds); JWT signed with HS256 |
| Security | HTTP security headers via helmet; rate limiting on auth routes |
| Security | NoSQL injection sanitization; input validation on all endpoints |
| Usability | Fully responsive design on mobile (320px), tablet, and desktop |
| Usability | Clear error messages; success/error toast notifications for all actions |
| Reliability | Email failures never interrupt API operations (fire-and-forget) |
| Reliability | Stock restored on order cancellation |
| Maintainability | Three-layer architecture separating concerns |
| Legal/Compliance | No plaintext passwords stored; no secrets committed to Git |
| File Upload | Images limited to 5 MB; JPEG, PNG, WebP only; stored on Cloudinary |

---

# CHAPTER 4: SYSTEM ANALYSIS AND DESIGN

## 4.1 System Models

### Use Case Diagram

```
+------------------------------------------------------------------+
|                        TechStore System                          |
|                                                                  |
|  Guest ----+--- Browse Products                                  |
|            |--- Search / Filter Products                         |
|            |--- View Product Details                             |
|            |--- View Product Reviews                             |
|            |--- Register / Login                                 |
|                                                                  |
|  Customer -+--- [All Guest actions]                              |
|  (logged   |--- Manage Cart (add, update, remove, clear)         |
|   in)      |--- Manage Wishlist (add, remove)                    |
|            |--- Checkout (COD or Chapa payment)                  |
|            |--- View Order History and Order Details             |
|            |--- Cancel Own Orders                                |
|            |--- Edit Profile, Address, Password                  |
|            |--- Upload Avatar                                     |
|            |--- Submit Product Reviews                           |
|                                                                  |
|  Admin ----+--- [All Customer actions]                           |
|            |--- Manage Products (CRUD + image upload)            |
|            |--- View and Update All Orders                       |
|            |--- Manage Users (view, delete, change role)         |
|            |--- View Dashboard Statistics                        |
+------------------------------------------------------------------+
```

### Sequence Diagram — User Registration

```
Customer        Frontend        Backend API        MongoDB
   |                |                |                |
   |---fill form--->|                |                |
   |                |--POST /auth/register----------->|
   |                |                |--validate      |
   |                |                |--check exists  |
   |                |                |--bcrypt hash   |
   |                |                |--User.create-->|
   |                |                |<--user saved---|
   |                |                |--generateToken |
   |                |<--201 + token--|                |
   |<--store token  |                |                |
   |   in localStorage               |                |
```

### Sequence Diagram — Chapa Payment Flow

```
Customer   Frontend   Backend API   Chapa API   MongoDB
   |           |            |            |           |
   |--checkout>|            |            |           |
   |           |--POST /orders---------->|           |
   |           |            |--create order-------->|
   |           |            |<--orderId-------------|
   |           |--POST /payment/initialize---------->|
   |           |            |--POST /transaction/initialize->|
   |           |            |<--checkout_url---------|
   |           |<--checkoutUrl-|            |           |
   |<--redirect|            |            |           |
   |                                                 |
   |---pays on Chapa hosted page------------------->|
   |<--redirected to /payment/verify----------------|
   |           |            |            |           |
   |           |--GET /payment/verify--->|           |
   |           |            |--GET /transaction/verify->|
   |           |            |<--status: paid---------|
   |           |            |--order.paymentStatus = "paid"->|
   |           |<--200 + order-|            |           |
   |<--PaymentSuccess page--|            |           |
```

### Activity Diagram — Order Lifecycle

```
        [Order Placed] --> paymentStatus: pending
                |
                |-- paymentMethod = cash_on_delivery
                |       |
                |       v
                |   [processing]
                |
                |-- paymentMethod = card / mobile_money
                        |
                        v
                   [Chapa verify] --> paymentStatus: paid
                        |
                        v
                   [processing]
                        |
                        v
                    [shipped]
                        |
                        v
                   [delivered] --> paymentStatus: paid (auto)

         At any pre-delivered stage:
                        |
                        v
                  [cancelled] --> stock restored
```

### Entity-Relationship Diagram

```
+----------+          +----------+
|   USER   |          | PRODUCT  |
|----------|          |----------|
| _id (PK) |          | _id (PK) |
| name     |          | name     |
| email    |          | category |
| password |          | image    |
| role     |          | price    |
| avatar   |          | stock    |
| address  |          | reviews[]|
| wishlist |----M:M-->| avgRating|
+----+-----+          +----------+
     |                     ^
     | 1:1            (ref)|
     |                     |
+----v-----+          +----+-----+
|   CART   |          |  ORDER   |
|----------|          |----------|
| _id (PK) |          | _id (PK) |
| user(FK) |          | user(FK) |
| items[]  |--product>| items[]  |
|          |          | shipping |
|          |          | payment  |
|          |          | status   |
|          |          | txRef    |
|          |          | total    |
+----------+          +----------+
```

## 4.2 User Interface Design

### Customer Navigation Flow

```
Home (/)
  |-- Products (/products) -- Product Details (/products/:id)
  |-- Cart (/cart)
  |       |-- Checkout (/checkout)
  |               |-- /orders (COD success)
  |               |-- Chapa --> /payment/verify --> PaymentSuccess/Failed
  |-- [Logged In]
          |-- My Orders (/orders) -- Order Details (/orders/:id)
          |-- Wishlist (/wishlist)
          |-- Profile (/profile)
```

### Admin Navigation Flow

```
Admin (/admin)
  |-- Dashboard     -- statistics cards
  |-- Products      -- CRUD with image upload
  |-- Orders        -- filter, search, update status
  |-- Users         -- search, delete, change role
```

### Key UI Design Decisions

- **Skeleton loading** cards replace a spinner while products load — improves perceived performance
- **Breadcrumb navigation** on Product Details and Order Details pages for user orientation
- **Toast notifications** (react-hot-toast) replace browser alerts for all user feedback
- **Consistent card design** — white background, rounded corners, consistent border color across all pages
- **Mobile-first responsive** — hamburger menu, fluid product grid using CSS `auto-fill minmax`
- **ETB currency** displayed consistently as `ETB X,XXX` throughout the application

## 4.3 Software Architecture

### Three-Layer Backend Architecture

```
HTTP Request
     |
     v
ROUTES LAYER (/routes/*.js)
  Maps HTTP methods/paths to controller functions
  Applies middleware: protect, adminOnly, multer, validate
     |
     v
CONTROLLERS LAYER (/controllers/*.js)
  Handles HTTP req/res lifecycle
  Calls service layer, wraps result in ApiResponse
  Uses asyncHandler to catch all async errors
     |
     v
SERVICES LAYER (/services/*.js)
  All business logic: validation, calculations, DB operations
  Independent of HTTP — fully testable in isolation
     |
     v
MODELS LAYER (/models/*.js)
  Mongoose schemas with validation, hooks, and methods
  Direct interface to MongoDB Atlas
```

### Middleware Stack (server.js)

```
dotenv.config() -- env vars first
dns.setServers() -- DNS fix for all outbound connections
helmet()         -- HTTP security headers
cors()           -- origin whitelist
authLimiter      -- 20 req/15min on /api/auth
apiLimiter       -- 300 req/15min on all other routes
express.json({ limit: "10kb" })
express.urlencoded({ limit: "10kb" })
sanitize()       -- NoSQL injection + HPP protection
routes           -- /api/auth, products, cart, orders, users, admin, payment
notFound         -- 404 handler
errorHandler     -- global error handler (last)
```

### Deployment Diagram

```
[Browser / Mobile]
       |
       | HTTPS
       |
+------+-------+           +-------------------+
|   VERCEL     |           |      RENDER       |
| (Frontend)   |<-- REST ->| (Backend API)     |
| React + Vite |   HTTPS   | Node.js + Express |
+--------------+           +--------+----------+
                                    |
               +--------------------+------------------+
               |                    |                  |
        +------+------+    +--------+-----+   +--------+-----+
        | MongoDB     |    | Cloudinary   |   |  Chapa API   |
        | Atlas       |    | (Images CDN) |   | (Payments)   |
        +-------------+    +--------------+   +------+-------+
                                                      |
                                              +-------+------+
                                              | Gmail SMTP   |
                                              | (Emails)     |
                                              +--------------+
```

## 4.4 Security and Access Control

### Authentication Flow

1. User submits email and password to `POST /api/auth/login`
2. Backend retrieves user from MongoDB by email
3. `bcrypt.compare()` verifies submitted password against stored hash
4. On success, a JWT is signed with HS256 algorithm and a 64-character random secret
5. Token is returned to the client and stored in `localStorage`
6. Every subsequent protected request includes `Authorization: Bearer <token>`
7. `authMiddleware` verifies token signature and algorithm, loads fresh user from DB

### Password Security Rules

Passwords must be 8–72 characters (72 = bcrypt truncation limit) and contain at least one uppercase letter, one lowercase letter, one digit, and one special character. Validated by `express-validator` on the register endpoint. Stored only as bcrypt hash — never as plaintext.

### Authorization Levels

| Level | Mechanism |
|---|---|
| Route | `protect` middleware verifies JWT; `adminOnly` checks `role === "admin"` |
| Resource | Order and payment services verify `order.user === req.user._id` |
| Profile | `updateUserProfile` throws 403 if `role` is in update payload |
| Role management | Only valid roles (`"customer"`, `"admin"`) accepted; last admin protected |

### HTTP Security Headers (helmet)

- `Content-Security-Policy` — restricts resource origins
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- `Strict-Transport-Security` — enforces HTTPS

---

# CHAPTER 5: IMPLEMENTATION

## 5.1 Development Process

Development was performed using **Kiro** (AI-powered VS Code) as the primary IDE with Git for version control. The project is a MERN stack application with the frontend and backend in separate directories within the same repository.

### Backend Implementation Highlights

The backend follows a clean three-layer architecture. The `asyncHandler` utility wraps all async controller functions eliminating repetitive try/catch blocks:

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

All API responses use a consistent `ApiResponse` class:

```javascript
// utils/ApiResponse.js
class ApiResponse {
  constructor(success, message, data, count) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (count !== undefined) this.count = count;
  }
}
```

The `authMiddleware` verifies the JWT with algorithm pinning and returns a hardened error message:

```javascript
// middleware/authMiddleware.js
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ success: false, message: "User not found" });
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
```

The email service uses a fire-and-forget pattern — email failures never block API responses:

```javascript
// services/emailService.js
const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) return; // disabled if credentials not set
  try {
    await transporter.sendMail({ from: `"TechStore" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
    // Never throw -- email failure must not break the HTTP response
  }
};
```

### Frontend Implementation Highlights

The React frontend uses Context API for global state. `AuthContext` stores the user and token from `localStorage` and provides login/logout functions to all components:

```javascript
// context/AuthContext.jsx
const login = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};
const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
};
```

The `PrivateRoute` component redirects unauthenticated users to login:

```javascript
// routes/PrivateRoute.jsx
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
```

The Checkout page handles the COD vs. Chapa payment split:

```javascript
// After order is created:
if (form.paymentMethod === "cash_on_delivery") {
  toast.success("Order placed successfully!");
  navigate("/orders", { state: { newOrder: createdOrder } });
  return;
}
// Card / Mobile Money:
toast.success("Order created — redirecting to payment...");
const payRes = await api.post("/payment/initialize", { orderId: createdOrder._id });
window.location.href = payRes.data.data.checkoutUrl;
```

## 5.2 Challenges and Solutions

### Challenge 1: express-mongo-sanitize Incompatibility with Express 5

**Problem:** After adding `express-mongo-sanitize` and `hpp` as security middleware, every API request with query parameters crashed with `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`. In Express 5, `req.query` is a read-only getter — not a writable property. Both packages performed `req.query = sanitizedCopy`, which is impossible in Express 5.

**Solution:** Removed both incompatible packages and wrote a custom `middleware/sanitize.js` that mutates individual properties in-place (`req.query[key] = sanitizedValue`) without reassigning the reference. This provides identical security coverage and is fully compatible with both Express 5 and Node.js 24.

### Challenge 2: MongoDB Atlas DNS Resolution Failure on Restricted Networks

**Problem:** Node.js maintains its own DNS resolver stack, independent of the Windows system resolver. On university/institutional networks, the local DNS at `127.0.0.1` refused SRV record lookups required by MongoDB Atlas's `mongodb+srv://` connection string. PowerShell tools worked correctly because they use the OS resolver — this masked the problem during initial diagnosis.

**Solution:** Applied `dns.setServers()` globally in `server.js` before any other module loads. The function reads a `MONGO_DNS` environment variable for network-specific resolver overrides, skips loopback addresses, and falls back to Google and Cloudflare public DNS. This fixed MongoDB Atlas, Chapa API, and Cloudinary connections simultaneously. On Render (cloud), standard DNS works and the fix is a safe no-op.

### Challenge 3: Chapa API Returning `[object Object]` Error

**Problem:** Chapa's API returns validation errors as a JSON object mapping field names to error arrays — not a plain string. The original code did `throw new ApiError(502, data.message)`. When `data.message` is an object, JavaScript serializes it as `[object Object]`, which appeared as a useless error message on the frontend.

**Solution:** Added a `serializeChapaError()` function that detects when `message` is an object and flattens it to a readable string: `field: error text | field2: error text`. Additionally fixed the payload: `customization.title` was `"TechStore Payment"` (17 chars — exceeds Chapa's 16-char limit) and description contained `#` (not allowed). Changed to `title: "TechStore"` and `description: "Order-XXXXXXXX"`.

### Challenge 4: Avatar Upload Saving to Non-Existent Schema Field

**Problem:** The original `uploadAvatar` service wrote to `user.profileImage`. The User model schema defines `avatar` as the field — `profileImage` does not exist. Mongoose silently ignores writes to undefined schema fields, so every avatar upload was discarded. Additionally the implementation stored a local disk path (`uploads/filename`) which would be lost on every Render redeploy since Render's filesystem is ephemeral.

**Solution:** Corrected the field to `user.avatar` (correct schema field) and replaced disk-based storage with a Cloudinary buffer stream upload — fully consistent with the existing product image upload implementation.

### Challenge 5: JWT Error Message Information Leakage

**Problem:** The original `authMiddleware.js` catch block returned `error.message` directly to the client. The `jsonwebtoken` library produces specific messages like `"invalid signature"`, `"jwt malformed"`, and `"invalid algorithm"` that reveal information about why a forged token failed.

**Solution:** Replaced the raw error return with a single hardened message: `"Invalid or expired token"`. Algorithm verification was also explicitly pinned to `algorithms: ["HS256"]` to prevent algorithm confusion attacks.

## 5.3 Testing

### Test Strategy

Testing was performed at three levels against the live production Render backend.

**Unit Testing:** Service functions tested by loading them directly in Node.js scripts with controlled inputs.

**Integration Testing:** HTTP requests against API endpoints verifying the full Controller→Service→Database chain.

**System Testing:** 74-test automated suite covering all major application features.

### System Test Results

**Table 5.1 — System Test Results**

| Category | Tests | Passed | Failed |
|---|---|---|---|
| Infrastructure | 2 | 2 | 0 |
| Products (public) | 8 | 8 | 0 |
| Authentication | 11 | 11 | 0 |
| JWT / Protected Routes | 4 | 4 | 0 |
| User Profile | 6 | 6 | 0 |
| Cart | 4 | 4 | 0 |
| Wishlist | 3 | 3 | 0 |
| Orders / Checkout | 9 | 9 | 0 |
| Payment | 3 | 3 | 0 |
| Admin API | 5 | 5 | 0 |
| Security | 5 | 5 | 0 |
| Frontend Bundle | 12 | 12 | 0 |
| **Total** | **74** | **74** | **0** |

**Table 5.2 — Security Test Results**

| Test | Expected | Result |
|---|---|---|
| Weak password (no uppercase/special) | HTTP 400 with validation message | PASS |
| Invalid JWT signature | HTTP 401 "Invalid or expired token" | PASS |
| Customer accessing admin route | HTTP 403 "Access denied. Admin only." | PASS |
| Role change via profile update | HTTP 403 "Role cannot be changed via profile update" | PASS |
| NoSQL injection `$gt` in body | Sanitized, 200 returned, no crash | PASS |
| Helmet X-Content-Type-Options header | nosniff present | PASS |
| CORS — Vercel origin allowed | Correct Allow-Origin header returned | PASS |
| Cross-user order access attempt | HTTP 403 | PASS |
| npm audit | 0 vulnerabilities | PASS |

---

# CHAPTER 6: INTERNSHIP REFLECTION AND CONCLUSION

## 6.1 Learning Outcomes

### Practical Skills Acquired

**Full-Stack MERN Development:** This internship provided genuine production-level experience with every layer of a modern web application. Before this project, knowledge of React and Node.js was primarily theoretical from coursework. The internship required applying that knowledge to real deployment constraints, real error debugging, and real security requirements — experience that no classroom exercise can fully replicate.

**RESTful API Design:** Designing and implementing a complete RESTful API with consistent response formats, HTTP status codes, middleware chains, and clean separation of concerns through the Controller→Service→Model pattern deepened understanding of API architecture significantly.

**Authentication and Security:** Implementing JWT authentication, bcrypt hashing, role-based authorization, rate limiting, and input sanitization from first principles — rather than using a pre-built authentication library — provided deep understanding of how authentication systems work at the protocol level and why each security measure exists. Understanding the difference between authentication (who are you?) and authorization (what can you do?) became concrete rather than abstract.

**Payment Gateway Integration:** Integrating Chapa required understanding the OAuth-style redirect flow, server-side transaction verification, idempotency via unique transaction references, and graceful handling of payment failures. This is directly applicable to real commercial software development in Ethiopia.

**Cloud Deployment and DevOps:** Deploying to MongoDB Atlas, Render, and Vercel, configuring CORS between different domains, managing environment variables across environments, and debugging production-only issues provided practical DevOps experience that goes far beyond what is taught in courses.

**Debugging Distributed Systems:** The DNS resolution failure was completely invisible to standard diagnostic tools — `nslookup` and `Test-NetConnection` both succeeded — but failed silently in Node.js. Diagnosing this required understanding how Node.js manages DNS independently from the OS network stack. This kind of multi-layer debugging skill only develops through real-world work.

### Theoretical Knowledge Applied

- **Database design:** ER diagrams, indexing, Mongoose schema design with validation and lifecycle hooks
- **Software architecture:** Three-tier separation of concerns, MVC pattern, middleware chains
- **Security principles:** Principle of least privilege, defense in depth, secure-by-default design
- **Software engineering:** Incremental development, multi-level testing, technical documentation
- **Networking:** HTTP/HTTPS protocols, CORS policy, DNS and SRV record resolution, JWT token structure

### Personal Growth

Managing the complete software lifecycle independently — from requirements analysis through deployment and testing — developed self-direction, problem-solving persistence, and confidence in tackling unfamiliar technical challenges. Learning to diagnose complex issues by forming hypotheses, testing them systematically, and interpreting real system behavior (rather than guessing) is a transferable skill that will benefit every future project.

## 6.2 Challenges Faced

**Technical Challenge — Network Environment:** Working from institutional networks introduced DNS resolution issues that are not encountered in typical development environments. This required learning how Node.js interacts with the operating system's network stack at a deeper level than most developers ever encounter. The investigation process — ruling out Atlas, ruling out credentials, testing Node DNS directly, comparing with system tools — taught a systematic debugging methodology.

**Technical Challenge — Express 5 Ecosystem Maturity:** Express 5 was released relatively recently. Several security packages that are standard recommendations for Express 4 projects were incompatible with Express 5's architectural changes. Writing custom replacements required understanding the source of the incompatibility, which produced better understanding of how Express processes requests than simply installing a package would have.

**Technical Challenge — Third-Party API Constraints:** Chapa's API has specific validation constraints (title length limits, character restrictions in description fields) that are not prominently documented. Discovering these required iterative testing and careful analysis of error responses, which taught the importance of testing all integration assumptions rather than trusting documentation alone.

**Scope Management Challenge:** The project's scope expanded significantly as features were built and new requirements emerged. Maintaining code quality and documentation while continuously adding features required discipline to complete and verify each feature fully before starting the next.

## 6.3 Recommendations

### For the Organization (TechStore Project)

1. **Upgrade the Render plan** to a paid tier to eliminate the 30–60 second cold start delay. The free tier is acceptable for development and demonstration but creates a poor first impression for real users.

2. **Implement a password reset flow** with email-based time-limited tokens. Users currently have no way to recover a forgotten password — this is a significant usability gap for a production application.

3. **Add Redis for JWT blacklisting** to enable immediate token revocation on logout. Currently tokens remain valid for their full 7-day lifetime after logout — acceptable for this scale but not for production with sensitive user data.

4. **Upgrade Chapa to production credentials** to accept real payments, replacing the sandbox test environment used during development.

5. **Add product image gallery** support with multiple images per product and a thumbnail carousel on the product details page.

### For the Department and Future Internship Programs

1. **Include cloud deployment topics in the curriculum.** The challenges encountered with MongoDB Atlas SRV resolution, Render's ephemeral filesystem, and CORS configuration between different cloud providers are common real-world problems that most computer science courses do not address. A practical module on cloud deployment would significantly reduce the learning curve for future interns.

2. **Encourage API integration projects.** Working with real-world third-party APIs (Chapa for payments, Cloudinary for images, Gmail SMTP for email) provided invaluable experience that no mock project can replicate. Future internship programs should encourage projects that involve at least one real external service integration.

3. **Emphasize security from day one.** Security was treated as a retrospective concern in the initial project phases and required a dedicated refactoring phase later. Incorporating security considerations (input validation, authentication, authorization) from the start of development would save significant time and produce better code.

4. **Provide clear network access policies.** The DNS issue consumed significant debugging time because it was not immediately clear whether the problem was with the code, the cloud service, or the network. Clear documentation of what network access is available on institutional networks would help future students avoid this class of problem.

---

# APPENDICES

## Appendix A: Selected Code Snippets

### A.1 Custom NoSQL Sanitization Middleware (Express 5 Compatible)

```javascript
// middleware/sanitize.js
const sanitizeValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === "object" && value !== null && !(value instanceof Date)) {
    const cleaned = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof k === "string" && (k.startsWith("$") || k.includes("."))) continue;
      cleaned[k] = sanitizeValue(v);
    }
    return cleaned;
  }
  return value;
};

const sanitize = (req, res, next) => {
  if (req.body && typeof req.body === "object") req.body = sanitizeValue(req.body);
  if (req.params) {
    for (const key of Object.keys(req.params))
      req.params[key] = sanitizeValue(req.params[key]);
  }
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      let val = req.query[key];
      if (Array.isArray(val)) val = val[val.length - 1]; // HPP dedup
      req.query[key] = sanitizeValue(val);
    }
  }
  next();
};
module.exports = sanitize;
```

### A.2 Strong Password Validator

```javascript
// validators/authValidator.js
const strongPasswordRules = body("password")
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be between 8 and 72 characters")
  .matches(/[A-Z]/).withMessage("Password must contain at least 1 uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase letter")
  .matches(/\d/).withMessage("Password must contain at least 1 number")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least 1 special character");
```

### A.3 Chapa Payment Verification

```javascript
// services/paymentService.js
const verifyPayment = async (txRef) => {
  if (!txRef) throw new ApiError(400, "Transaction reference is required");
  const order = await Order.findOne({ txRef });
  if (!order) throw new ApiError(404, "Order not found for this transaction");
  if (order.paymentStatus === "paid") return { order, alreadyVerified: true };

  const { status, data } = await chapaRequest("GET",
    `/transaction/verify/${encodeURIComponent(txRef)}`);
  const chapaStatus = data?.data?.status;

  if (status === 200 && chapaStatus === "success") {
    order.paymentStatus = "paid";
    await order.save();
    // Send confirmation email (fire-and-forget)
    try {
      const user = await User.findById(order.user, "name email").lean();
      if (user) emailService.sendPaymentConfirmationEmail(user, order);
    } catch { /* non-critical */ }
    return { order, alreadyVerified: false };
  }
  order.paymentStatus = "failed";
  await order.save();
  throw new ApiError(402, serializeChapaError(data?.message) || "Payment was not completed");
};
```

---

# REFERENCES

Banks, A., & Porcello, E. (2020). *Learning React: Modern Patterns for Developing React Apps* (2nd ed.). O'Reilly Media.

Brown, E. (2019). *Web Development with Node and Express: Leveraging the JavaScript Stack* (2nd ed.). O'Reilly Media.

Chapa Financial Technologies. (2024). *Chapa API Documentation*. https://developer.chapa.co/docs

Cloudinary. (2024). *Cloudinary Node.js SDK Documentation*. https://cloudinary.com/documentation/node_integration

Express.js. (2024). *Express 5.x API Reference*. https://expressjs.com/en/5x/api.html

Jones, R., & Jones, C. (2019). *Node.js Design Patterns* (3rd ed.). Packt Publishing.

MongoDB. (2024). *MongoDB Atlas Documentation*. https://www.mongodb.com/docs/atlas

Mongoose. (2024). *Mongoose v9.x Documentation*. https://mongoosejs.com/docs

OWASP Foundation. (2023). *OWASP Top Ten*. https://owasp.org/www-project-top-ten

Render. (2024). *Render Documentation — Node.js Services*. https://render.com/docs/node-express

Vercel. (2024). *Vercel Documentation — Vite Projects*. https://vercel.com/docs/frameworks/vite

Wieruch, R. (2022). *The Road to React* (2022 ed.). Self-published. https://www.roadtoreact.com

---

*End of Report*

*Gadisa Asefa | Haramaya University | College of Computing and Informatics | August 2026*
