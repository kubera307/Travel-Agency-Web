# 🛺 Travel India — Professional Travel & Tour Booking Platform

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-SQLite-4169E1?logo=sqlite&logoColor=white)](https://sqlite.org/)

A full-stack Indian travel discovery and booking platform. The authoritative runtime is **React/Vite + Flask REST API + SQLite for local development**, with a PostgreSQL-ready relational schema for production.

> Booking safety: checkout creates a pending booking and a time-limited seat reservation. It is not confirmed or paid until server-side payment verification succeeds. Configure contact details and a production `JWT_SECRET` through `.env`; see `.env.example`.

---

## 📂 Project Organization

The project is cleanly separated into dedicated modules:

```
Travel-Agency-main/
│
├── frontend/                   # React 18 + Vite + Tailwind CSS Client
│   ├── public/                 # Static assets & icons
│   ├── src/                    # Components, pages, hooks, contexts
│   │   ├── components/         # Reusable UI (HeroSearch, TourCard, Header, Footer)
│   │   ├── context/            # Auth, Language, Currency, Toast, Wishlist
│   │   ├── pages/              # Public, Customer, and Admin Views
│   │   └── utils/              # API client and helper functions
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS theme configuration
│   └── vite.config.js          # Vite build & proxy settings
│
├── backend/                    # Python Flask 3.0 REST API Server
│   ├── database/               # Database connection helper (db.py)
│   ├── middleware/             # JWT auth & role authorization
│   ├── routes/                 # Blueprints (auth, tours, bookings, admin, etc.)
│   ├── services/               # Ticket & payment services
│   ├── app.py                  # Main Flask application factory
│   ├── config.py               # Environment configuration
│   ├── requirements.txt        # Python dependencies
│   └── test_api.py             # Automated integration tests (10/10 PASS)
│
├── database/                   # Database Layer
│   ├── seeds/                  # Initial seed data & runner scripts
│   ├── schema.sql              # Unified SQL DDL Schema (14 tables)
│   └── travel_india.sqlite     # Production SQLite database (22 dests, 33 tours)
│
├── assets/                     # Branding logos, SVG icons, and media
├── docs/                       # Technical documentation (Architecture, API, DB)
├── package.json                # Root automation scripts
├── README.md                   # Project documentation
└── run.bat                     # One-click Windows runner (Backend + Frontend)
```

---

## 🚀 How to Run

### Method 1: Instant 1-Click Launch (Windows)
Double-click:
```cmd
run.bat
```
This automatically starts:
1. **Python Flask Backend** on `http://localhost:5000/api`
2. **React + Vite Frontend** on `http://localhost:5173`

---

### Method 2: Manual Terminal Commands

#### Terminal 1 — Start Python Flask Backend:
```bash
python backend/app.py
```
> Running on `http://127.0.0.1:5000`

#### Terminal 2 — Start React Frontend:
```bash
npm --prefix frontend run dev
```
> Running on `http://localhost:5173`

---

## 🧪 Testing Backend APIs

Run the automated integration tests:
```bash
python backend/test_api.py
```
Output:
```
Ran 10 tests in 0.22s
OK
  [PASS] Flask Health Check API returns OK & healthy DB
  [PASS] Tours Search returns matching Kashmir packages
  [PASS] Destinations listing returns 22 active destinations
  [PASS] Customer Login successful with JWT issued
  [PASS] Admin Login successful with ADMIN role
  [PASS] Customer is rejected (403) from Admin Dashboard
  [PASS] Admin successfully accesses Admin Dashboard stats
  [PASS] Customer fetches profile via /api/auth/me
  [PASS] Coupon validation for WELCOME10 calculated 200 INR discount
  [PASS] Custom A-to-Z Trip enquiry submitted successfully
```

---

## 🔑 Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `rahul@example.com` | `Customer@1234` | Customer Dashboard, My Bookings, Pass Download, Favourites |
| **Admin** | `admin@travelindia.com` | `Admin@1234` | Full Admin Console, Tour Management, Customer Leads, Direct WhatsApp |

---

## 📄 License
Built with pride for Bharat 🇮🇳.
