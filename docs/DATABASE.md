# Travel India — Database Schema & Data Dictionary

## 1. Overview
The database uses a normalized relational model supporting both **SQLite** (for local development) and **PostgreSQL** (for production deployment).

## 2. Table Schemas

### `users`
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `phone` (TEXT)
- `password_hash` (TEXT, NOT NULL)
- `role` (TEXT, DEFAULT 'CUSTOMER') — `CUSTOMER`, `ADMIN`, `STAFF`
- `status` (TEXT, DEFAULT 'ACTIVE') — `ACTIVE`, `SUSPENDED`
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### `customer_profiles`
- `id` (TEXT, PK)
- `user_id` (TEXT, FK -> users.id)
- `date_of_birth` (TEXT)
- `gender` (TEXT)
- `address` (TEXT)
- `city` (TEXT)
- `state` (TEXT)
- `pincode` (TEXT)
- `emergency_contact` (TEXT)
- `profile_image` (TEXT)

### `destinations`
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `state` (TEXT, NOT NULL)
- `country` (TEXT, DEFAULT 'India')
- `tag` (TEXT)
- `short_description` (TEXT)
- `image` (TEXT, NOT NULL)
- `landmark_highlight` (TEXT)
- `popular_pickups` (JSON TEXT)
- `total_packages` (INTEGER)

### `categories`
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `description` (TEXT)
- `icon` (TEXT)

### `tours`
- `id` (TEXT, PK)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `destination_id` (TEXT, FK -> destinations.id)
- `category_id` (TEXT, FK -> categories.id)
- `tagline` (TEXT)
- `description` (TEXT)
- `duration_days` (INTEGER)
- `duration_nights` (INTEGER)
- `departure_city` (TEXT)
- `vehicle_type` (TEXT)
- `vehicle_category` (TEXT)
- `base_price` (NUMERIC)
- `sale_price` (NUMERIC)
- `saving` (NUMERIC)
- `max_seats` (INTEGER)
- `badge` (TEXT)
- `rating` (NUMERIC)
- `reviews_count` (INTEGER)
- `featured` (INTEGER)
- `status` (TEXT, DEFAULT 'ACTIVE')

### `departures`
- `id` (TEXT, PK)
- `tour_id` (TEXT, FK -> tours.id)
- `departure_date` (TEXT, YYYY-MM-DD)
- `return_date` (TEXT, YYYY-MM-DD)
- `total_seats` (INTEGER)
- `available_seats` (INTEGER)
- `status` (TEXT, DEFAULT 'ACTIVE')

### `bookings`
- `id` (TEXT, PK)
- `booking_number` (TEXT, UNIQUE, NOT NULL)
- `user_id` (TEXT, FK -> users.id)
- `tour_id` (TEXT, FK -> tours.id)
- `departure_id` (TEXT, FK -> departures.id)
- `departure_date` (TEXT)
- `pickup_point` (TEXT)
- `guide_language` (TEXT)
- `traveller_count` (INTEGER)
- `subtotal` (NUMERIC)
- `discount` (NUMERIC)
- `tax` (NUMERIC)
- `add_on_total` (NUMERIC)
- `grand_total` (NUMERIC)
- `coupon_code` (TEXT)
- `booking_status` (TEXT) — `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- `payment_status` (TEXT) — `PENDING`, `PAID`, `REFUNDED`, `FAILED`
- `assigned_driver` (JSON TEXT)

### `travellers`
- `id` (TEXT, PK)
- `booking_id` (TEXT, FK -> bookings.id)
- `full_name` (TEXT, NOT NULL)
- `phone` (TEXT)
- `email` (TEXT)
- `date_of_birth` (TEXT)
- `gender` (TEXT)
- `emergency_contact` (TEXT)

### `payments`
- `id` (TEXT, PK)
- `booking_id` (TEXT, FK -> bookings.id)
- `transaction_id` (TEXT, UNIQUE)
- `provider` (TEXT)
- `amount` (NUMERIC)
- `status` (TEXT) — `INITIATED`, `PENDING`, `SUCCESSFUL`, `FAILED`, `REFUNDED`
- `payment_method` (TEXT)
- `metadata` (JSON TEXT)
- `paid_at` (DATETIME)

### `coupons`
- `id` (TEXT, PK)
- `code` (TEXT, UNIQUE, NOT NULL)
- `discount_type` (TEXT) — `PERCENT`, `FLAT`
- `discount_value` (NUMERIC)
- `minimum_amount` (NUMERIC)
- `maximum_discount` (NUMERIC)
- `times_used` (INTEGER)
- `status` (TEXT)

### `enquiries`
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, NOT NULL)
- `phone` (TEXT, NOT NULL)
- `destination` (TEXT)
- `trip_type` (TEXT)
- `budget` (TEXT)
- `hotel_category` (TEXT)
- `transport_type` (TEXT)
- `activities` (JSON TEXT)
- `message` (TEXT)
- `status` (TEXT) — `NEW`, `CONTACTED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

### `driver_partners`
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `city` (TEXT)
- `state` (TEXT)
- `badge` (TEXT)
- `rating` (NUMERIC)
- `trips_completed` (INTEGER)
- `vehicle_model` (TEXT)
- `vehicle_number` (TEXT)
- `languages` (JSON TEXT)

