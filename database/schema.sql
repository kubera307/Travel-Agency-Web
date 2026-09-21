-- ============================================================================
-- TRAVEL INDIA - NORMALIZED RELATIONAL DATABASE SCHEMA
-- Compatible with PostgreSQL and SQLite
-- ============================================================================

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMIN', 'STAFF'
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    emergency_contact TEXT,
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. DESTINATIONS & CATEGORIES
CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    tag TEXT,
    short_description TEXT,
    description TEXT,
    image TEXT NOT NULL,
    landmark_highlight TEXT,
    popular_pickups TEXT, -- JSON array of strings
    total_packages INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    icon TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TOURS & MEDIA
CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    destination_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    duration_days INTEGER NOT NULL DEFAULT 1,
    duration_nights INTEGER NOT NULL DEFAULT 0,
    departure_city TEXT NOT NULL,
    vehicle_type TEXT,
    vehicle_category TEXT, -- 'auto', 'sedan', 'suv', 'ev-auto', 'tempo', 'coach'
    capacity TEXT,
    distance TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2) NOT NULL,
    saving NUMERIC(10, 2) DEFAULT 0,
    max_seats INTEGER DEFAULT 20,
    badge TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0, -- 1 for featured, 0 otherwise
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'DRAFT', 'ARCHIVED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tour_images (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_highlights (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    item TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_itineraries (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    day_number INTEGER NOT NULL DEFAULT 1,
    time_slot TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    meals TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_inclusions (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    item TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_exclusions (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    item TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 4. DEPARTURES & INVENTORY
CREATE TABLE IF NOT EXISTS departures (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL,
    departure_date TEXT NOT NULL, -- YYYY-MM-DD
    return_date TEXT NOT NULL,    -- YYYY-MM-DD
    total_seats INTEGER NOT NULL DEFAULT 20,
    available_seats INTEGER NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SOLD_OUT', 'CANCELLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 5. BOOKINGS & TRAVELLERS
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    booking_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    tour_id TEXT NOT NULL,
    departure_id TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    pickup_point TEXT,
    guide_language TEXT DEFAULT 'English & Hindi',
    traveller_count INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    add_on_total NUMERIC(10, 2) DEFAULT 0,
    grand_total NUMERIC(10, 2) NOT NULL,
    coupon_code TEXT,
    booking_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    payment_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'REFUNDED', 'FAILED'
    special_notes TEXT,
    assigned_driver TEXT, -- JSON details of Sarathi
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE RESTRICT,
    FOREIGN KEY (departure_id) REFERENCES departures(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS travellers (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    date_of_birth TEXT,
    gender TEXT,
    emergency_contact TEXT,
    special_requirements TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 6. ADDONS & SERVICE UPGRADES
CREATE TABLE IF NOT EXISTS addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    category TEXT DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS booking_addons (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    addon_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE RESTRICT
);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL DEFAULT 'mock', -- 'mock', 'razorpay', 'upi'
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'INITIATED', -- 'INITIATED', 'PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'
    payment_method TEXT NOT NULL, -- 'upi_qr', 'upi_intent', 'card', 'netbanking'
    metadata TEXT, -- JSON response from provider
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Security and inventory extensions. Existing SQLite databases receive these
-- non-destructively through backend/database/migrations.py at app startup.
CREATE TABLE IF NOT EXISTS seat_reservations (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    booking_id TEXT NOT NULL UNIQUE,
    seats INTEGER NOT NULL CHECK (seats > 0),
    expires_at DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. COUPONS & OFFERS
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL, -- 'PERCENT', 'FLAT'
    discount_value NUMERIC(10, 2) NOT NULL,
    minimum_amount NUMERIC(10, 2) DEFAULT 0,
    maximum_discount NUMERIC(10, 2),
    start_date TEXT,
    expiry_date TEXT,
    usage_limit INTEGER DEFAULT 1000,
    times_used INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    badge TEXT,
    coupon_id TEXT,
    image TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- 9. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tour_id TEXT NOT NULL,
    booking_id TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- 10. USER PREFERENCES & FAVOURITES
CREATE TABLE IF NOT EXISTS favourites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tour_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 11. ENQUIRIES & CUSTOM A-TO-Z PLANNER
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT,
    trip_type TEXT, -- 'custom_atoz', 'general', 'corporate', 'family'
    travel_date TEXT,
    travellers_count INTEGER DEFAULT 1,
    budget TEXT,
    hotel_category TEXT,
    transport_type TEXT,
    activities TEXT, -- JSON array
    food_preference TEXT,
    special_requirements TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'SYSTEM', -- 'BOOKING', 'PAYMENT', 'PROMO', 'SYSTEM'
    is_read INTEGER DEFAULT 0, -- 0 for false, 1 for true
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. FAQS
CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- 14. DRIVER PARTNERS / SARATHIS (Preserved from existing project)
CREATE TABLE IF NOT EXISTS driver_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    badge TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    trips_completed INTEGER DEFAULT 0,
    experience_years INTEGER DEFAULT 5,
    languages TEXT, -- JSON array
    vehicle_model TEXT,
    vehicle_number TEXT,
    vehicle_type TEXT,
    avatar TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_status_featured ON tours(status, featured);
CREATE INDEX IF NOT EXISTS idx_tours_price ON tours(sale_price);
CREATE INDEX IF NOT EXISTS idx_departures_tour_date ON departures(tour_id, departure_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_reviews_tour ON reviews(tour_id, status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
