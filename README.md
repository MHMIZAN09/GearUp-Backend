# 🎒 GearUp - Sports & Outdoor Gear Rental Platform

A comprehensive backend API for a sports and outdoor gear rental platform. Built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, featuring complete user authentication, gear management, rental ordering, payment processing, and review system.


## 🎯 Overview

**GearUp** is a full-featured gear rental platform that connects customers with outdoor equipment providers. The platform enables users to:

- Browse and search available gear by category
- Create rental orders with flexible date ranges
- Process secure payments
- Leave reviews and ratings
- Track rental history and analytics
- Manage inventory (for providers)
- Monitor platform activity (for admins)

**Current Version:** 1.0.0
**Node Runtime:** v24.16.0+
**Package Manager:** Bun v1.3.14+

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with role-based access (ADMIN, CUSTOMER, PROVIDER)
- JWT-based authentication with access & refresh tokens
- Secure password hashing with bcryptjs
- Role-based middleware protection

### 👥 User Management
- User profile management
- Multi-role support (Customer, Provider, Admin)
- User activity tracking and analytics
- Account status management

### 🎽 Gear Management
- Comprehensive gear catalog with categories
- Dynamic pricing and stock management
- Gear status tracking (AVAILABLE/UNAVAILABLE)
- Provider inventory management

### 🏆 Rental System
- Create and manage rental orders
- Flexible rental date selection
- Real-time rental order tracking
- Rental status management (PENDING, ACTIVE, COMPLETED, CANCELLED)
- Automatic price calculation

### 💳 Payment Integration
- SSLCommerz payment gateway integration
- Multiple payment status tracking
- Transaction verification and validation
- Payment history and receipts

### ⭐ Review System
- Rate and review rented gear (1-5 stars)
- User review management
- Gear rating aggregation

### 📊 Analytics & Reporting
- Customer analytics (rentals, spending)
- Provider analytics (inventory, revenue)
- Admin system analytics and statistics

### 🛡️ Admin Features
- User management and status control
- Gear and inventory oversight
- Rental order management
- Category management
- Payment monitoring
- System-wide analytics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js / Bun |
| **Framework** | Express.js 5.x |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma 7.x |
| **Authentication** | JWT (jsonwebtoken) |
| **Security** | bcryptjs, cors, cookie-parser |
| **Payment** | SSLCommerz LTS |
| **API Docs** | Swagger/OpenAPI 3.0 |
| **Validation** | Custom middleware |
| **Utilities** | axios, chalk, http-status |

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v24.16.0 or higher
- **Bun** v1.3.14 or higher (recommended) or npm/yarn
- **PostgreSQL** 12 or higher
- **.env** file with configuration

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GearUp_Backend
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080

APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/gearup_db

BCRYPT_SALT_ROUNDS=10

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRATION=1d
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Payment Gateway (SSLCommerz)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password


# admin
SUPPER_ADMIN_EMAIL=admin@example.com
SUPPER_ADMIN_PASSWORD=admin123
SUPPER_ADMIN_NAME=Admin
```

### 4. Setup Database

```bash
# Create and migrate database
bunx --bun prisma migrate dev --name init

# Generate Prisma Client
bunx --bun prisma generate

# Seed the development/demo dataset (PowerShell)
$env:SEED_DEMO_DATA="true"; bun prisma db seed
```

The seed is idempotent and creates categories, gear with real Unsplash image URLs,
provider/customer accounts, rental orders, payments, and a review. It is guarded by
`SEED_DEMO_DATA=true` so demo records cannot be inserted accidentally into a
production environment. Override the demo passwords before running the seed:

```env
SEED_ADMIN_EMAIL=admin.seed@gearup.example
SEED_ADMIN_PASSWORD=ChangeMe_Admin_123!
SEED_PROVIDER_PASSWORD=ChangeMe_Provider_123!
SEED_CUSTOMER_PASSWORD=ChangeMe_Customer_123!
```

Change all development seed passwords before sharing seeded credentials. For a
production catalog, replace the external Unsplash URLs with images hosted in the
project's managed object storage/CDN.

### 5. Start Development Server

```bash
bun run dev
# or
npm run dev
```

The server will start at: `http://localhost:8080/`
server deplot link : `https://gear-up-backend-woad.vercel.app/`

---

## 📁 Project Structure

```
GearUp_Backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── index.ts             # Configuration variables
│   ├── lib/
│   │   └── prisma.ts            # Prisma client instance
│   ├── middlewares/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── logger.ts            # Request logging middleware
│   │   └── notFound.ts          # 404 handler middleware
│   ├── modules/                 # Feature modules (MVC pattern)
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.route.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.interface.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.interface.ts
│   │   ├── category/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.route.ts
│   │   │   ├── category.service.ts
│   │   │   └── category.interface.ts
│   │   ├── gear/
│   │   │   ├── gear.controller.ts
│   │   │   ├── gear.route.ts
│   │   │   ├── gear.service.ts
│   │   │   └── gear.interface.ts
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.route.ts
│   │   │   └── payment.service.ts
│   │   ├── provider/
│   │   │   ├── provider.controller.ts
│   │   │   ├── provider.route.ts
│   │   │   └── provider.service.ts
│   │   ├── rental/
│   │   │   ├── rental.controller.ts
│   │   │   ├── rental.route.ts
│   │   │   ├── rental.service.ts
│   │   │   ├── rental.interface.ts
│   │   │   └── rental.utils.ts
│   │   ├── review/
│   │   │   ├── review.controller.ts
│   │   │   ├── review.route.ts
│   │   │   ├── review.service.ts
│   │   │   └── review.interface.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       └── user.interface.ts
│   ├── routes/
│   │   └── index.ts             # Main route aggregator
│   ├── types/
│   │   └── express.d.ts         # Express type extensions
│   └── utils/
│       ├── catchAsync.ts        # Async error wrapper
│       ├── hash.ts              # Password hashing utilities
│       ├── jwt.ts               # JWT token utilities
│       └── sendResponse.ts      # Standardized response formatter
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma        # Main Prisma schema
│   │   ├── user.prisma          # User model
│   │   ├── category.prisma      # Category model
│   │   ├── gearitem.prisma      # GearItem model
│   │   ├── rental.prisma        # Rental models
│   │   ├── payment.prisma       # Payment model
│   │   ├── review.prisma        # Review model
│   │   └── enums.prisma         # Enums
│   └── migrations/              # Database migrations
├── generated/
│   └── prisma/                  # Auto-generated Prisma types
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── README.md
```

### Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://gear-up-backend-woad.vercel.app/api`



## 🔐 Authentication

### JWT Token Structure

The API uses **JWT (JSON Web Tokens)** for authentication.

```json
{
  "iat": 1234567890,
  "exp": 1234654290,
  "sub": "user_id",
  "role": "CUSTOMER"
}
```

### How to Authenticate

1. **Register User**
   ```bash
   POST /api/auth/register
   Content-Type: application/json

   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securePassword123",
     "role": "CUSTOMER"
   }
   ```

2. **Login**
   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

3. **Response with Tokens**
   ```json
   {
     "success": true,
     "statusCode": 200,
     "message": "User logged in successfully",
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..."
     }
   }
   ```

4. **Use Token in Requests**
   ```bash
   GET /api/user/my-profile
   Authorization: Bearer eyJhbGc...
   ```

### Token Expiration

- **Access Token**: Expires in 1 day
- **Refresh Token**: Expires in 7 days
- Tokens are stored as HTTP-only cookies

### Role-Based Access

| Endpoint | ADMIN | CUSTOMER | PROVIDER | Public |
|----------|-------|----------|----------|--------|
| /auth/* | ✅ | ✅ | ✅ | ✅ |
| /gear | ✅ | ✅ | ✅ | ✅ |
| /category | ✅ | ✅ | ✅ | ✅ |
| /rental | ✅ | ✅ | ❌ | ❌ |
| /payment | ✅ | ✅ | ❌ | ❌ |
| /review | ✅ | ✅ | ❌ | ❌ |
| /admin/* | ✅ | ❌ | ❌ | ❌ |
| /provider/* | ✅ | ❌ | ✅ | ❌ |

---

## 📤 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "error": {
    "details": "Detailed error information"
  }
}
```

### Pagination Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## ⚠️ Error Handling

The API uses standard HTTP status codes:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Error Response Example

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Gear not found",
  "error": {
    "details": "No gear item exists with ID: invalid-id"
  }
}
```



### Code Structure Guidelines

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and database operations
- **Routes**: Define API endpoints
- **Interfaces**: TypeScript type definitions
- **Middlewares**: Request processing and validation
- **Utils**: Helper functions and utilities



## 🚀 Deployment

### Build for Production

```bash


# Build TypeScript
bun run build

# Start server
bun run start
```


Last Updated: 2026-07-08
Version: 1.0.0
