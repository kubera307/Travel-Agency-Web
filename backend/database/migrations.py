"""Database migrations and schema initialization for NammaYatra Platform."""
import time
from database.db import get_db


def add_column_if_not_exists(cursor, table, col_def):
    col_name = col_def.split()[0]
    cursor.execute(f"PRAGMA table_info({table});")
    existing_cols = [c[1] for c in cursor.fetchall()]
    if col_name not in existing_cols:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col_def};")


def upgrade():
    db = get_db()
    cursor = db.cursor()

    # 1. Base required tables
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS seat_reservations (
            id TEXT PRIMARY KEY,
            departure_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            booking_id TEXT NOT NULL UNIQUE,
            seats INTEGER NOT NULL CHECK (seats > 0),
            expires_at DATETIME NOT NULL,
            status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','CONSUMED','RELEASED','EXPIRED')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (departure_id) REFERENCES departures(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (booking_id) REFERENCES bookings(id)
        );
        CREATE INDEX IF NOT EXISTS idx_reservation_expiry ON seat_reservations(status, expires_at);

        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token_hash TEXT NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Recent Highlights for Homepage and Seasonal Campaigns
        CREATE TABLE IF NOT EXISTS highlights (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            short_description TEXT NOT NULL,
            destination TEXT NOT NULL,
            image TEXT NOT NULL,
            event_date TEXT,
            cta_text TEXT DEFAULT 'Explore Trip →',
            cta_link TEXT DEFAULT '/tours',
            status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Services Provided
        CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            icon TEXT,
            image TEXT,
            featured BOOLEAN DEFAULT 1,
            status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Customer Feedback
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            email TEXT NOT NULL,
            booking_id TEXT,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            feedback TEXT NOT NULL,
            category TEXT NOT NULL CHECK (category IN (
                'Website', 'Booking', 'Tour', 'Guide', 'Transportation',
                'Hotel', 'Customer Support', 'Payment', 'Other'
            )),
            status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED')),
            admin_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (booking_id) REFERENCES bookings(id)
        );

        -- Contact Us Messages
        CREATE TABLE IF NOT EXISTS contact_messages (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied', 'Closed')),
            admin_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    # 2. Add columns to existing tables safely
    add_column_if_not_exists(cursor, 'destinations', 'city TEXT')
    add_column_if_not_exists(cursor, 'destinations', 'latitude NUMERIC')
    add_column_if_not_exists(cursor, 'destinations', 'longitude NUMERIC')
    add_column_if_not_exists(cursor, 'destinations', 'category TEXT')
    add_column_if_not_exists(cursor, 'destinations', 'featured BOOLEAN DEFAULT 0')
    add_column_if_not_exists(cursor, 'destinations', 'updated_at DATETIME')

    add_column_if_not_exists(cursor, 'bookings', 'special_requirements TEXT')
    add_column_if_not_exists(cursor, 'bookings', 'terms_version TEXT')
    add_column_if_not_exists(cursor, 'bookings', 'accepted_at DATETIME')

    add_column_if_not_exists(cursor, 'customer_profiles', 'country TEXT DEFAULT "India"')

    add_column_if_not_exists(cursor, 'enquiries', 'preferred_contact_method TEXT DEFAULT "WhatsApp"')
    add_column_if_not_exists(cursor, 'enquiries', 'trip_id TEXT')

    add_column_if_not_exists(cursor, 'reviews', 'photos TEXT')

    add_column_if_not_exists(cursor, 'tours', 'overview TEXT')
    add_column_if_not_exists(cursor, 'tours', 'highlights TEXT')
    add_column_if_not_exists(cursor, 'tours', 'inclusions TEXT')
    add_column_if_not_exists(cursor, 'tours', 'exclusions TEXT')
    add_column_if_not_exists(cursor, 'tours', 'accommodation TEXT')
    add_column_if_not_exists(cursor, 'tours', 'transportation TEXT')
    add_column_if_not_exists(cursor, 'tours', 'meeting_point TEXT')
    add_column_if_not_exists(cursor, 'tours', 'cancellation_policy TEXT')
    add_column_if_not_exists(cursor, 'tours', 'important_info TEXT')
    add_column_if_not_exists(cursor, 'tours', 'terms_conditions TEXT')

    # 3. Seed Mangalore & Coastal Karnataka Destinations
    MANGALORE_DESTINATIONS = [
        ('dest_mangalore', 'Mangalore', 'mangalore', 'Mangalore', 'Karnataka', 'Coastal Port & Heritage',
         'Historic port city of red-tile roofs, ancient coastal temples, and aromatic cashew groves.',
         'Mangalore is the gateway to Coastal Karnataka, renowned for its pristine beaches, sacred temples, St. Aloysius chapel frescoes, and world-famed coastal seafood cuisine.',
         'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
         12.9141, 74.8560, 'Coastal & Heritage', 1),

        ('dest_panambur', 'Panambur Beach', 'panambur-beach', 'Mangalore', 'Karnataka', 'Golden Sands & Kites',
         'Golden sand retreat famous for peaceful sunsets and international kite festivals.',
         'Located 10 km north of Mangalore, Panambur Beach offers pristine shoreline walks, jet-ski safaris, and clear views of the Arabian Sea.',
         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
         12.9535, 74.8037, 'Beach & Coast', 1),

        ('dest_tannirbhavi', 'Tannirbhavi Beach', 'tannirbhavi-beach', 'Mangalore', 'Karnataka', 'Pine Groves & Ferries',
         'Secluded pine-tree fringed beach accessible via quiet Gurupura river ferries.',
         'A tranquil oasis lined with towering casuarina trees, quiet walking trails, and picturesque views where the river converges with the ocean.',
         'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
         12.8943, 74.8115, 'Beach & Nature', 0),

        ('dest_st_aloysius', 'St. Aloysius Chapel', 'st-aloysius-chapel', 'Mangalore', 'Karnataka', 'Italian Frescoes',
         'The Sistine Chapel of India, boasting Italian fresco murals painted in 1899.',
         'Built in 1880 atop Lighthouse Hill, this chapel features magnificent ceiling paintings by Italian Jesuit painter Antony Moscheni that depict the life of Aloysius Gonzaga.',
         'https://images.unsplash.com/photo-1548625361-195fe61a55c3?auto=format&fit=crop&w=1200&q=80',
         12.8732, 74.8458, 'Heritage & Culture', 0),

        ('dest_sultan_battery', 'Sultan Battery', 'sultan-battery', 'Mangalore', 'Karnataka', 'Tipu Sultan Watchtower',
         'Watchtower fortress built in 1784 by Tipu Sultan from black stones.',
         'A historic miniature fort built to prevent English warships from entering the Gurupura River, offering panoramic backwater views.',
         'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
         12.8911, 74.8258, 'Historic Fort', 0),

        ('dest_kadri', 'Kadri Manjunath Temple', 'kadri-manjunath-temple', 'Mangalore', 'Karnataka', '10th Century Shrines',
         'Historic 10th-century Vijayanagara rock-cut cave shrines and natural mountain spring ponds.',
         'One of the oldest temples in Southern India, blending Buddhist bronze sculptural heritage with classical Shaivite spirituality.',
         'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
         12.8906, 74.8569, 'Spiritual Heritage', 0),

        ('dest_pilikula', 'Pilikula Heritage Village', 'pilikula', 'Mangalore', 'Karnataka', 'Artisanal Guthu Living',
         'Living museum village preserving traditional Tuluva Guthu house architecture and artisanal crafts.',
         'An integrated eco-heritage park featuring a biological park, golf course, lake, science centre, and an authentic ancestral manor house.',
         'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
         12.9292, 74.8988, 'Eco & Heritage', 0),

        ('dest_udupi', 'Udupi', 'udupi', 'Udupi', 'Karnataka', 'Temples & Culinary Origin',
         'World-renowned Krishna temple heritage town, vegetarian cuisine origin, and wood-carved chariot streets.',
         'Famed for its 13th-century Sri Krishna Matha founded by saint Madhvacharya, with devout pilgrims observing the deity through a sacred silver nine-hole window.',
         'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=80',
         13.3409, 74.7421, 'Spiritual & Food', 1),

        ('dest_malpe', 'Malpe Beach & St. Mary\'s Island', 'malpe', 'Udupi', 'Karnataka', 'Volcanic Basalt Pillars',
         'Natural harbor beach and ferry gateway to the unique hexagonal columnar basalt formations of St. Mary\'s.',
         'Geological marvel declared a National Geological Monument, featuring distinct columns formed millions of years ago by sub-aerial sub-volcanic activity.',
         'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
         13.3512, 74.7011, 'Island & Coast', 1),

        ('dest_kapu', 'Kapu Beach & Lighthouse', 'kapu', 'Udupi', 'Karnataka', 'Lighthouse Sea Cliffs',
         'Majestic 1901 stone lighthouse perched on granite sea cliffs overlooking roaring Arabian breakers.',
         'Ascend the spiral stairs of the 120-year-old lighthouse for panoramic views of coastal palm canopies and golden hour sunsets.',
         'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
         13.2269, 74.7391, 'Coast & Heritage', 1),

        ('dest_murudeshwar', 'Murudeshwar', 'murudeshwar', 'Bhatkal', 'Karnataka', 'Gigantic Shiva Sanctuary',
         'Towering 123-foot Lord Shiva statue and 20-tier Raja Gopuram perched on Kanduka hill surrounded on three sides by the Arabian Sea.',
         'An awe-inspiring coastal pilgrimage landmark with modern elevator access to the 18th floor of the gopuram for breathtaking coastal vistas.',
         'https://images.unsplash.com/photo-1621665421557-8be0d6f7e5d1?auto=format&fit=crop&w=1200&q=80',
         14.0944, 74.4849, 'Spiritual Landmark', 1),

        ('dest_kudremukh', 'Kudremukh', 'kudremukh', 'Chikkamagaluru', 'Karnataka', 'Shola Grasslands & Peaks',
         'UNESCO heritage rolling green shola grasslands and cloud-capped horse-faced mountain ridges.',
         'Trek across paradise valleys of the Western Ghats teeming with endangered lion-tailed macaques, orchids, and pristine mountain rivers.',
         'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
         13.2185, 75.2536, 'Mountain Trek', 1),

        ('dest_coorg', 'Coorg', 'coorg', 'Kodagu', 'Karnataka', 'Coffee Valleys & Mist',
         'Misty Western Ghats coffee plantations, fragrant cardamom valleys, and Kodava warrior culture.',
         'Known as the Scotland of India, offering private plantation bungalows, Abbey waterfalls, and sunset views from Raja’s Seat.',
         'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=80',
         12.3375, 75.8069, 'Hills & Estates', 1),
    ]

    for d in MANGALORE_DESTINATIONS:
        cursor.execute('''
            INSERT INTO destinations (
                id, name, slug, city, state, country, tag, short_description, description,
                image, latitude, longitude, category, featured, status
            ) VALUES (?, ?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                slug=excluded.slug,
                city=excluded.city,
                state=excluded.state,
                country=excluded.country,
                tag=excluded.tag,
                short_description=excluded.short_description,
                description=excluded.description,
                image=excluded.image,
                latitude=excluded.latitude,
                longitude=excluded.longitude,
                category=excluded.category,
                featured=excluded.featured,
                status=excluded.status
        ''', d)

    # 4. Seed Recent Highlights
    SAMPLE_HIGHLIGHTS = [
        ('hl_coastal_escape', 'New: Coastal Karnataka Sanctuary',
         'Explore Mangalore, Udupi, Malpe islands and Kapu lighthouse in one unhurried luxury journey.',
         'Mangalore & Udupi',
         'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
         'Departing Every Friday', 'Explore Journey →', '/tours/coastal-karnataka-mangalore-udupi-malpe'),

        ('hl_kudremukh_trek', 'Western Ghats: Kudremukh Shola Trails',
         'Private boutique estate stay with guided trek through protected cloud-forest sanctuaries.',
         'Kudremukh & Coorg',
         'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
         'Limited to 8 Guests', 'View Trail →', '/tours/kudremukh-shola-rainforest-expedition'),

        ('hl_kashmir_autumn', 'Seasonal: Kashmir Alpine Stillness',
         'Witness chinar leaves turning bronze across Dal Lake with private cedar houseboat stays.',
         'Kashmir Valley',
         'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
         'Autumn Departures', 'Discover Kashmir →', '/tours/kashmir-great-escape'),

        ('hl_rajasthan_nights', 'Signature: Rajasthan Desert Havens',
         'Private Mewar palace access, starry Thar desert dunes, and royal haveli sanctuaries.',
         'Jaipur & Jaisalmer',
         'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
         'Winter Pacing', 'View Itinerary →', '/tours/rajasthan-royal-trail')
    ]

    for hl in SAMPLE_HIGHLIGHTS:
        cursor.execute('''
            INSERT INTO highlights (
                id, title, short_description, destination, image, event_date, cta_text, cta_link, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                short_description=excluded.short_description,
                destination=excluded.destination,
                image=excluded.image,
                event_date=excluded.event_date,
                cta_text=excluded.cta_text,
                cta_link=excluded.cta_link,
                status=excluded.status
        ''', hl)

    # 5. Seed Services Provided
    SAMPLE_SERVICES = [
        ('srv_tours', 'Tour Packages', 'tour-packages',
         'Curated small-group and private departures across India with seasoned local historians and custodians.',
         'Compass', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_hotels', 'Hotel & Sanctuary Booking', 'hotel-booking',
         'Direct reservations at handpicked 300-year-old havelis, luxury tea bungalows, and secluded eco-retreats.',
         'Home', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_transport', 'Private Transportation', 'transportation',
         'Comfortable, sanitized SUVs and executive luxury vans with verified professional chauffeurs.',
         'Car', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_pickup', 'Airport & Station Pickup', 'airport-pickup',
         'Punctual airport meet-and-greet transfers with luggage assistance across all major domestic terminals.',
         'Plane', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', 0),

        ('srv_sightseeing', 'Local Sightseeing & Guided Walks', 'local-sightseeing',
         'Exclusive early-morning temple aartis, spice garden walks, and ASI-certified architectural insights.',
         'MapPin', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_custom', 'Custom Trip Planning', 'custom-trip-planning',
         'End-to-end bespoke journey design matched precisely to your schedule, dietary preferences, and pace.',
         'Sparkles', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_group', 'Group Tours & Expeditions', 'group-tours',
         'Mindfully paced departures for like-minded travelers with maximum group sizes capped at 8 to 12 guests.',
         'Users', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 0),

        ('srv_family', 'Family Holidays', 'family-trips',
         'Kid-friendly itineraries with multi-generational comfort, private villas, and educational wildlife trails.',
         'Smile', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', 0),

        ('srv_corporate', 'Corporate Retreats', 'corporate-trips',
         'High-end strategic offsites in tranquil natural sanctuaries with audiovisual gear and team bonding sessions.',
         'Briefcase', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', 0),

        ('srv_adventure', 'Adventure & Mountain Treks', 'adventure-trips',
         'Certified mountaineering leaders, safety equipment, oxygen meters, and hearty warm campsite dining.',
         'Mountain', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_honeymoon', 'Honeymoon Packages', 'honeymoon-packages',
         'Romantic candlelit lake dinners, private plunge pool villas, and curated sunset catamaran cruises.',
         'Heart', 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80', 1),

        ('srv_assistance', '24/7 Travel Assistance', 'travel-assistance',
         'Dedicated human travel coordinator reachable via WhatsApp or phone throughout your trip in India.',
         'Headphones', 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=800&q=80', 1)
    ]

    for s in SAMPLE_SERVICES:
        cursor.execute('''
            INSERT INTO services (
                id, name, slug, description, icon, image, featured, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                slug=excluded.slug,
                description=excluded.description,
                icon=excluded.icon,
                image=excluded.image,
                featured=excluded.featured,
                status=excluded.status
        ''', s)

    # 6. Seed Coastal Karnataka Signature Tours into `tours`
    cursor.execute("SELECT id FROM categories WHERE slug = 'heritage' LIMIT 1")
    heritage_cat = cursor.fetchone()
    heritage_cat_id = heritage_cat[0] if heritage_cat else 'cat_heritage'

    cursor.execute("SELECT id FROM categories WHERE slug = 'adventure' LIMIT 1")
    adv_cat = cursor.fetchone()
    adv_cat_id = adv_cat[0] if adv_cat else 'cat_adventure'

    COASTAL_TOURS = [
        ('tour_coastal_karnataka', 'Coastal Karnataka: Mangalore, Udupi & St. Mary\'s Islands',
         'coastal-karnataka-mangalore-udupi-malpe', 'dest_mangalore', heritage_cat_id, 'Mangalore',
         5, 4, 38000.0, 32999.0, 12, 1, 4.92, 28,
         'A slow experiential journey along the Kanara coast—from historic Mangalore temples and St. Aloysius frescos to Udupi temple feasts, Kapu lighthouse cliffs, and secluded island catamaran cruises.',
         'Explore the untouched beaches of Panambur and Tannirbhavi, climb the Kapu lighthouse at dusk, savor authentic Neer Dosa and Ghee Roast, and marvel at the prehistoric basalt columns of St. Mary’s Island.',
         'Boutique coastal resort & heritage manor', 'Private AC Innova Crysta throughout',
         'Mangalore International Airport / Railway Station',
         '100% refund up to 14 days prior to departure. 50% between 7-13 days. Non-refundable within 7 days.',
         'Modest clothing recommended when visiting active temples in Kadri and Udupi.',
         'Valid photo ID required for island ferry check-ins.', 'ACTIVE'),

        ('tour_kudremukh_shola', 'Kudremukh Cloud Forests & Coffee Sanctuaries',
         'kudremukh-shola-rainforest-expedition', 'dest_kudremukh', adv_cat_id, 'Mangalore',
         4, 3, 31000.0, 26500.0, 10, 1, 4.88, 19,
         'Trek through misty UNESCO shola grasslands, stay in private coffee planters’ bungalows, and discover hidden Western Ghat waterfalls.',
         'Guided hike to Kudremukh peak, bean-to-cup organic coffee tasting, birdwatching with naturalists, and campfire Kodava cuisine.',
         'Heritage Coffee Estate Bungalow', 'Private 4x4 Hill Vehicle',
         'Mangalore Airport or Udupi Station',
         'Flexible rescheduling permitted up to 10 days before departure.',
         'Forest permits are secured in advance by our team. Moderate physical fitness required.',
         'Leech socks provided during monsoon season.', 'ACTIVE')
    ]

    for t in COASTAL_TOURS:
        cursor.execute('''
            INSERT INTO tours (
                id, title, slug, destination_id, category_id, departure_city,
                duration_days, duration_nights, base_price, sale_price,
                max_seats, featured, rating, reviews_count,
                overview, description, accommodation, transportation,
                meeting_point, cancellation_policy, important_info,
                terms_conditions, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                slug=excluded.slug,
                destination_id=excluded.destination_id,
                category_id=excluded.category_id,
                departure_city=excluded.departure_city,
                duration_days=excluded.duration_days,
                duration_nights=excluded.duration_nights,
                base_price=excluded.base_price,
                sale_price=excluded.sale_price,
                max_seats=excluded.max_seats,
                featured=excluded.featured,
                rating=excluded.rating,
                reviews_count=excluded.reviews_count,
                overview=excluded.overview,
                description=excluded.description,
                accommodation=excluded.accommodation,
                transportation=excluded.transportation,
                meeting_point=excluded.meeting_point,
                cancellation_policy=excluded.cancellation_policy,
                important_info=excluded.important_info,
                terms_conditions=excluded.terms_conditions,
                status=excluded.status
        ''', t)

    # Add images for new coastal tours
    cursor.execute('''
        INSERT INTO tour_images (id, tour_id, image_url, caption, sort_order)
        VALUES ('img_ck_1', 'tour_coastal_karnataka', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 'Coastal Karnataka Haven', 1)
        ON CONFLICT(id) DO UPDATE SET
            tour_id=excluded.tour_id,
            image_url=excluded.image_url,
            caption=excluded.caption,
            sort_order=excluded.sort_order
    ''')
    cursor.execute('''
        INSERT INTO tour_images (id, tour_id, image_url, caption, sort_order)
        VALUES ('img_km_1', 'tour_kudremukh_shola', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Kudremukh Rolling Grasslands', 1)
        ON CONFLICT(id) DO UPDATE SET
            tour_id=excluded.tour_id,
            image_url=excluded.image_url,
            caption=excluded.caption,
            sort_order=excluded.sort_order
    ''')

    # Add upcoming departures for coastal tours
    cursor.execute('''
        INSERT INTO departures (id, tour_id, departure_date, return_date, available_seats, total_seats, status)
        VALUES ('dep_ck_1', 'tour_coastal_karnataka', '2026-10-15', '2026-10-19', 8, 12, 'ACTIVE')
        ON CONFLICT(id) DO UPDATE SET
            tour_id=excluded.tour_id,
            departure_date=excluded.departure_date,
            return_date=excluded.return_date,
            available_seats=excluded.available_seats,
            total_seats=excluded.total_seats,
            status=excluded.status
    ''')
    cursor.execute('''
        INSERT INTO departures (id, tour_id, departure_date, return_date, available_seats, total_seats, status)
        VALUES ('dep_km_1', 'tour_kudremukh_shola', '2026-10-22', '2026-10-25', 6, 10, 'ACTIVE')
        ON CONFLICT(id) DO UPDATE SET
            tour_id=excluded.tour_id,
            departure_date=excluded.departure_date,
            return_date=excluded.return_date,
            available_seats=excluded.available_seats,
            total_seats=excluded.total_seats,
            status=excluded.status
    ''')

    db.commit()
