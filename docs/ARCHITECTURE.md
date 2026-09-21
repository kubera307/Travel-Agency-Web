# Travel India — System Architecture & Design

## 1. Overview
Travel India is an Indian open-mobility and curated tour booking platform inspired by the principles of **Mana Yatri** and **Namma Yatri**. It eliminates the standard 25–30% aggregator commission fee by facilitating **100% direct-to-driver payments** and police-verified **Sarathi** chauffeurs.

## 2. High-Level Architecture

```
[ Web Browser Client (React 18 + Vite) ]
                    │
                    ▼ HTTP / REST (JWT Bearer)
[ Express.js REST API Server (Port 5000) ]
       │            │             │
       ▼            ▼             ▼
 [ Auth / RBAC ] [ Payment ] [ Notifications ]
       │            │
       └─────┬──────┘
             ▼
[ Database Abstraction Layer (db.js) ]
       ├── SQLite (Node v24 native node:sqlite for dev)
       └── PostgreSQL (pg for production staging)
```

## 3. Frontend Architecture
- **Framework**: React 18 with Vite for instantaneous HMR and optimized production bundles.
- **Routing**: React Router v6 with public layout, customer authenticated portal, and role-protected admin console.
- **State Management**:
  - `AuthContext`: JWT token persistence, user profile, role flags (`isAdmin`, `isStaff`).
  - `LanguageContext`: Multi-language dictionary support (English, Kannada, Hindi, Telugu).
  - `ToastContext`: Global notification toasts for feedback.
- **Styling**: Tailwind CSS with custom Indian travel theme tokens (`--primary-amber`, `--primary-orange`, `--primary-navy`, `--primary-dark`).

## 4. Backend Architecture
- **Runtime**: Node.js v24.19.0 with Express.js.
- **Database Abstraction**:
  - Automatically loads native `node:sqlite` for local development with zero external dependencies.
  - Switches to PostgreSQL via connection pool when `DB_CLIENT=postgres` is set in `.env`.
- **Authentication**: JWT token issuance with bcrypt password hashing (10 salt rounds).
- **Payment Abstraction**:
  - `PaymentService` manages transaction lifecycle: `INITIATED` -> `PENDING` -> `SUCCESSFUL` / `FAILED` -> `REFUNDED`.
  - Development mock gateway provides simulated UPI QR, Card, and Net Banking flows with instant settlement.
  - Production extension points for Razorpay and UPI intent.

## 5. Security Principles
- **No Card Data Stored**: Card numbers, expiry, and CVV are never stored in database or logs.
- **Role-Based Authorization**: Role enforcement middleware (`roleAuth(['ADMIN', 'STAFF'])`).
- **Verified Reviews**: Only customers who have completed a booking can submit a review.
- **Helmet & CORS**: Secure HTTP headers and controlled CORS policies.

