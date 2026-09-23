/**
 * TRAVEL INDIA - DATABASE SEED RUNNER
 * Migrates data from js/data.js and generates production-quality records
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../db');

async function runSeeds() {
  console.log('🚀 Initializing Database Schema...');
  db.exec('PRAGMA foreign_keys = OFF;');

  const schemaPath = path.resolve(__dirname, '../schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('✅ Schema tables & indexes ready');

  console.log('📦 Loading initial TRAVEL_DATA from initialData.js...');
  const dataJsPath = path.resolve(__dirname, './initialData.js');
  let dataContent = fs.readFileSync(dataJsPath, 'utf8');
  dataContent = dataContent.replace('const TRAVEL_DATA', 'global.TRAVEL_DATA');
  eval(dataContent);
  const existingData = global.TRAVEL_DATA;

  console.log('🌱 Seeding Users & Customer Profiles...');
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('Admin@1234', salt);
  const customerHash = bcrypt.hashSync('Customer@1234', salt);
  const staffHash = bcrypt.hashSync('Staff@1234', salt);

  const users = [
    {
      id: 'usr_admin_01',
      name: 'Travel India Admin',
      email: 'admin@travelindia.com',
      phone: '+91 98765 43210',
      password_hash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      id: 'usr_cust_01',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98450 12345',
      password_hash: customerHash,
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr_staff_01',
      name: 'Pooja Nair',
      email: 'staff@travelindia.com',
      phone: '+91 91234 56789',
      password_hash: staffHash,
      role: 'STAFF',
      status: 'ACTIVE'
    }
  ];

  for (const u of users) {
    db.run(
      `INSERT OR REPLACE INTO users (id, name, email, phone, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.status]
    );
  }

  // Profile for Rahul
  db.run(
    `INSERT OR REPLACE INTO customer_profiles (id, user_id, date_of_birth, gender, address, city, state, pincode, emergency_contact, profile_image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'prof_cust_01',
      'usr_cust_01',
      '1992-05-15',
      'Male',
      'Flat 402, Green Glen Layout, Bellandur',
      'Bengaluru',
      'Karnataka',
      '560103',
      '+91 98450 99999 (Father)',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    ]
  );

  console.log('🌱 Seeding Categories...');
  const categories = [
    { id: 'cat_heritage', name: 'Heritage & Royal Palaces', slug: 'heritage', description: 'Ancient forts, UNESCO monuments, and cultural palaces', icon: '🏛️' },
    { id: 'cat_city', name: 'City Trails & Food Walks', slug: 'city-tour', description: 'Hidden bazaars, iconic eateries, and local urban life', icon: '🛺' },
    { id: 'cat_spiritual', name: 'Spiritual & Sacred Ghats', slug: 'spiritual', description: 'Temples, evening aartis, and historic holy pilgrimages', icon: '🪔' },
    { id: 'cat_adventure', name: 'Trekking & Mountain Adventure', slug: 'adventure', description: 'High-altitude trails, pine forests, and Himalayan treks', icon: '⛰️' },
    { id: 'cat_coastal', name: 'Coastal, Backwaters & Beaches', slug: 'coastal', description: 'Sunny coastlines, Portuguese churches, and serene backwaters', icon: '🌊' },
    { id: 'cat_family', name: 'Family Vacations & Leisure', slug: 'family', description: 'All-inclusive comfortable getaways for all generations', icon: '👨‍👩‍👧‍👦' },
    { id: 'cat_weekend', name: 'Weekend Trips & Quick Escapes', slug: 'weekend', description: 'Short 2-3 day getaways to rejuvenate from city life', icon: '🎒' },
    { id: 'cat_international', name: 'International Curated Tours', slug: 'international', description: 'Seamless Indian-friendly overseas holiday packages', icon: '✈️' }
  ];

  for (const c of categories) {
    db.run(
      `INSERT OR REPLACE INTO categories (id, name, slug, description, icon, status)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
      [c.id, c.name, c.slug, c.description, c.icon]
    );
  }

  console.log('🌱 Seeding Destinations...');
  for (const loc of existingData.locations) {
    if (loc.id === 'all') continue;
    db.run(
      `INSERT OR REPLACE INTO destinations (id, name, slug, state, country, tag, short_description, image, landmark_highlight, popular_pickups, total_packages, status)
       VALUES (?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        loc.id,
        loc.name,
        loc.id,
        loc.state,
        loc.tag || '',
        loc.shortDescription || '',
        loc.image,
        loc.landmarkHighlight || '',
        JSON.stringify(loc.popularPickups || []),
        loc.totalPackages || 3
      ]
    );
  }

  // Add extra popular destinations (Kashmir, Himachal)
  db.run(
    `INSERT OR REPLACE INTO destinations (id, name, slug, state, country, tag, short_description, image, landmark_highlight, popular_pickups, total_packages, status)
     VALUES (?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      'kashmir',
      'Kashmir Valley',
      'kashmir',
      'Jammu & Kashmir',
      'Paradise on Earth',
      'Snowy peaks, Dal Lake houseboats, saffron meadows & Gulmarg gondolas',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'Dal Lake • Gulmarg • Pahalgam • Sonamarg',
      JSON.stringify(['Srinagar Airport', 'Lal Chowk', 'Boulevard Dal Lake', 'Pahalgam Taxi Stand']),
      4
    ]
  );
  db.run(
    `INSERT OR REPLACE INTO destinations (id, name, slug, state, country, tag, short_description, image, landmark_highlight, popular_pickups, total_packages, status)
     VALUES (?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      'himachal',
      'Himachal (Manali & Shimla)',
      'himachal',
      'Himachal Pradesh',
      'Himalayan Bliss',
      'Pine valleys, Solang adventures, colonial heritage & mountain cafes',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'Solang Valley • Rohtang Pass • Mall Road • Hadimba Temple',
      JSON.stringify(['Chandigarh ISBT', 'Shimla Old Bus Stand', 'Manali Mall Road', 'Bhuntar Airport']),
      3
    ]
  );

  const { expandedDestinations, expandedTours } = require('./expandedData');
  console.log(`🌱 Seeding ${expandedDestinations.length} Expanded Destinations across India...`);
  for (const ed of expandedDestinations) {
    db.run(
      `INSERT OR REPLACE INTO destinations (id, name, slug, state, country, tag, short_description, image, landmark_highlight, popular_pickups, total_packages, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [ed.id, ed.name, ed.slug, ed.state, ed.country, ed.tag, ed.short_description, ed.image, ed.landmark_highlight, ed.popular_pickups, ed.total_packages]
    );
  }

  console.log('🌱 Seeding Tours, Highlights, Itineraries, Inclusions...');
  const baseDate = new Date();
  for (const pkg of existingData.packages) {
    // Map category string to category ID
    let categoryId = 'cat_heritage';
    if (pkg.category === 'city-tour') categoryId = 'cat_city';
    else if (pkg.category === 'spiritual') categoryId = 'cat_spiritual';
    else if (pkg.category === 'coastal') categoryId = 'cat_coastal';
    else if (pkg.category === 'adventure') categoryId = 'cat_adventure';

    const slug = pkg.id.replace('pkg-', '').toLowerCase() + '-' + pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const durationDays = pkg.duration.includes('Full Day') ? 1 : pkg.duration.includes('Days') ? parseInt(pkg.duration) || 2 : 1;
    const durationNights = durationDays > 1 ? durationDays - 1 : 0;
    const departureCity = pkg.locationName ? pkg.locationName.split(',')[0].trim() : 'Local City';

    db.run(
      `INSERT OR REPLACE INTO tours (
        id, title, slug, destination_id, category_id, tagline, description,
        duration_days, duration_nights, departure_city, vehicle_type, vehicle_category,
        capacity, distance, base_price, sale_price, saving, max_seats, badge,
        rating, reviews_count, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        pkg.id,
        pkg.title,
        slug,
        pkg.locationId,
        categoryId,
        pkg.tagline || '',
        pkg.tagline || '',
        durationDays,
        durationNights,
        departureCity,
        pkg.vehicleType || 'AC Vehicle',
        pkg.vehicleCategory || 'auto',
        pkg.capacity || 'Up to 4 Guests',
        pkg.distance || 'Approx. 50 Km',
        pkg.originalPrice || pkg.price * 1.3,
        pkg.price,
        pkg.saving || 0,
        20,
        pkg.badge || 'Verified Sarathi Tour',
        pkg.rating || 4.9,
        pkg.reviewsCount || 120,
        1
      ]
    );

    // Tour image
    db.run(
      `INSERT OR REPLACE INTO tour_images (id, tour_id, image_url, sort_order)
       VALUES (?, ?, ?, 0)`,
      [`img_${pkg.id}_0`, pkg.id, pkg.image]
    );

    // Highlights
    if (pkg.highlights && Array.isArray(pkg.highlights)) {
      pkg.highlights.forEach((h, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_highlights (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`hl_${pkg.id}_${idx}`, pkg.id, h, idx]
        );
      });
    }

    // Itinerary
    if (pkg.itinerary && Array.isArray(pkg.itinerary)) {
      pkg.itinerary.forEach((it, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_itineraries (id, tour_id, day_number, time_slot, title, description, location, meals, sort_order)
           VALUES (?, ?, 1, ?, ?, ?, ?, 'Bottled Water & Local Snacks', ?)`,
          [`itin_${pkg.id}_${idx}`, pkg.id, it.time || `Stop ${idx + 1}`, it.title, it.desc, pkg.locationName, idx]
        );
      });
    }

    // Inclusions
    if (pkg.inclusions && Array.isArray(pkg.inclusions)) {
      pkg.inclusions.forEach((inc, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_inclusions (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`inc_${pkg.id}_${idx}`, pkg.id, inc, idx]
        );
      });
    }

    // Exclusions
    if (pkg.exclusions && Array.isArray(pkg.exclusions)) {
      pkg.exclusions.forEach((exc, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_exclusions (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`exc_${pkg.id}_${idx}`, pkg.id, exc, idx]
        );
      });
    }

    // Generate upcoming departures for next 30, 60, 90 days
    for (let d = 1; d <= 5; d++) {
      const depDate = new Date();
      depDate.setDate(baseDate.getDate() + (d * 5));
      const depStr = depDate.toISOString().split('T')[0];
      const retDate = new Date(depDate);
      retDate.setDate(retDate.getDate() + durationDays);
      const retStr = retDate.toISOString().split('T')[0];

      db.run(
        `INSERT OR REPLACE INTO departures (id, tour_id, departure_date, return_date, total_seats, available_seats, status)
         VALUES (?, ?, ?, ?, 20, ?, 'ACTIVE')`,
        [`dep_${pkg.id}_${d}`, pkg.id, depStr, retStr, 15 - d]
      );
    }
  }

  // Add Kashmir Grand Package
  const kashmirPkgId = 'pkg-kashmir-01';
  db.run(
    `INSERT OR REPLACE INTO tours (
      id, title, slug, destination_id, category_id, tagline, description,
      duration_days, duration_nights, departure_city, vehicle_type, vehicle_category,
      capacity, distance, base_price, sale_price, saving, max_seats, badge,
      rating, reviews_count, featured, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      kashmirPkgId,
      'Kashmir Paradise: Dal Lake, Gulmarg & Pahalgam',
      'kashmir-paradise-dal-lake-gulmarg-pahalgam',
      'kashmir',
      'cat_adventure',
      'Deluxe Houseboat stay, world-highest Gulmarg gondola, Betaab Valley, and saffron gardens',
      'Experience the heaven on earth with verified local Kashmiri chauffeurs and premium traditional houseboats.',
      6,
      5,
      'Srinagar',
      'Deluxe Innova Crysta',
      'suv',
      'Up to 6 Guests',
      'Approx. 450 Km',
      48999,
      42999,
      6000,
      18,
      '🏔️ Kashmir Bestseller',
      4.98,
      2450,
      1
    ]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_images (id, tour_id, image_url, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`img_${kashmirPkgId}_0`, kashmirPkgId, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', 0]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_highlights (id, tour_id, item, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`hl_${kashmirPkgId}_0`, kashmirPkgId, '1 Night Deluxe Shikara Houseboat on Dal Lake with Kahwa tea', 0]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_highlights (id, tour_id, item, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`hl_${kashmirPkgId}_1`, kashmirPkgId, 'Gulmarg Gondola cable car ride to Phase 1 & 2', 1]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_itineraries (id, tour_id, day_number, time_slot, title, description, location, meals, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [`itin_${kashmirPkgId}_0`, kashmirPkgId, 1, 'Day 1', 'Arrival Srinagar & Sunset Shikara Ride', 'Pickup from Srinagar Airport by verified Sarathi. Check-in to traditional Dal Lake houseboat.', 'Srinagar', 'Dinner Included', 0]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_itineraries (id, tour_id, day_number, time_slot, title, description, location, meals, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [`itin_${kashmirPkgId}_1`, kashmirPkgId, 2, 'Day 2', 'Gulmarg Meadow of Flowers & Gondola', 'Full day excursion to Gulmarg. Ride the world-famous gondola overlooking snow-clad Pir Panjal peaks.', 'Gulmarg', 'Breakfast & Dinner', 1]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_inclusions (id, tour_id, item, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`inc_${kashmirPkgId}_0`, kashmirPkgId, 'Private AC Innova Crysta for all 6 days with verified Sarathi', 0]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_inclusions (id, tour_id, item, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`inc_${kashmirPkgId}_1`, kashmirPkgId, '5 Nights 4-Star Accommodation (1N Houseboat + 4N Resorts)', 1]
  );
  db.run(
    `INSERT OR REPLACE INTO tour_exclusions (id, tour_id, item, sort_order)
     VALUES (?, ?, ?, ?)`,
    [`exc_${kashmirPkgId}_0`, kashmirPkgId, 'Flight tickets to/from Srinagar', 0]
  );
  // Kashmir departures
  for (let d = 1; d <= 4; d++) {
    const depDate = new Date();
    depDate.setDate(baseDate.getDate() + (d * 7));
    const depStr = depDate.toISOString().split('T')[0];
    const retDate = new Date(depDate);
    retDate.setDate(retDate.getDate() + 6);
    const retStr = retDate.toISOString().split('T')[0];
    db.run(
      `INSERT OR REPLACE INTO departures (id, tour_id, departure_date, return_date, total_seats, available_seats, status)
       VALUES (?, ?, ?, ?, 18, ?, 'ACTIVE')`,
      [`dep_${kashmirPkgId}_${d}`, kashmirPkgId, depStr, retStr, 18 - (d * 3)]
    );
  }

  console.log(`🌱 Seeding ${expandedTours.length} Expanded Tours with Itineraries & Departures...`);
  for (const t of expandedTours) {
    db.run(
      `INSERT OR REPLACE INTO tours (
        id, title, slug, destination_id, category_id, tagline, description,
        duration_days, duration_nights, departure_city, vehicle_type, vehicle_category,
        capacity, distance, base_price, sale_price, saving, max_seats, badge,
        rating, reviews_count, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        t.id,
        t.title,
        t.slug,
        t.destination_id,
        t.category_id,
        t.tagline,
        t.description,
        t.duration_days,
        t.duration_nights,
        t.departure_city,
        t.vehicle_type,
        t.vehicle_category,
        t.capacity,
        t.distance,
        t.base_price,
        t.sale_price,
        t.saving,
        t.max_seats,
        t.badge,
        t.rating,
        t.reviews_count,
        t.featured
      ]
    );

    // Image
    db.run(
      `INSERT OR REPLACE INTO tour_images (id, tour_id, image_url, sort_order)
       VALUES (?, ?, ?, 0)`,
      [`img_${t.id}_0`, t.id, t.image]
    );

    // Highlights
    if (t.highlights && Array.isArray(t.highlights)) {
      t.highlights.forEach((h, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_highlights (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`hl_${t.id}_${idx}`, t.id, h, idx]
        );
      });
    }

    // Itineraries
    if (t.itinerary && Array.isArray(t.itinerary)) {
      t.itinerary.forEach((it, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_itineraries (id, tour_id, day_number, time_slot, title, description, location, meals, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`itin_${t.id}_${idx}`, t.id, it.day || idx + 1, it.time || `Day ${idx + 1}`, it.title, it.desc, it.loc || t.departure_city, it.meals || 'Breakfast', idx]
        );
      });
    }

    // Inclusions
    if (t.inclusions && Array.isArray(t.inclusions)) {
      t.inclusions.forEach((inc, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_inclusions (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`inc_${t.id}_${idx}`, t.id, inc, idx]
        );
      });
    }

    // Exclusions
    if (t.exclusions && Array.isArray(t.exclusions)) {
      t.exclusions.forEach((exc, idx) => {
        db.run(
          `INSERT OR REPLACE INTO tour_exclusions (id, tour_id, item, sort_order)
           VALUES (?, ?, ?, ?)`,
          [`exc_${t.id}_${idx}`, t.id, exc, idx]
        );
      });
    }

    // Departures
    for (let d = 1; d <= 5; d++) {
      const depDate = new Date();
      depDate.setDate(baseDate.getDate() + (d * 6));
      const depStr = depDate.toISOString().split('T')[0];
      const retDate = new Date(depDate);
      retDate.setDate(retDate.getDate() + t.duration_days);
      const retStr = retDate.toISOString().split('T')[0];

      db.run(
        `INSERT OR REPLACE INTO departures (id, tour_id, departure_date, return_date, total_seats, available_seats, status)
         VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [`dep_${t.id}_${d}`, t.id, depStr, retStr, t.max_seats, Math.max(2, t.max_seats - (d * 2))]
      );
    }
  }

  console.log('🌱 Seeding Addons...');
  const addons = [
    { id: 'addon_airport_pickup', name: 'Airport / Railway Station Doorstep Pickup', description: 'Chauffeur with name placard waiting at arrival terminal', price: 499, category: 'transport' },
    { id: 'addon_insurance', name: 'Comprehensive Travel & Medical Insurance', description: '₹5,00,000 emergency medical and travel cancellation coverage', price: 299, category: 'insurance' },
    { id: 'addon_room_upgrade', name: 'Premium Heritage Suite Room Upgrade', description: 'Upgrade to superior lake/palace view suite with breakfast', price: 1499, category: 'stay' },
    { id: 'addon_food_trail', name: 'Curated Authentic Street Food Trail', description: 'Guided culinary walk through iconic heritage food joints', price: 399, category: 'experience' },
    { id: 'addon_photographer', name: 'Personal Vacation Photographer (2 Hours)', description: 'Professional photographer capturing 50+ edited high-res vacation photos', price: 1999, category: 'service' }
  ];

  for (const a of addons) {
    db.run(
      `INSERT OR REPLACE INTO addons (id, name, description, price, category, status)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
      [a.id, a.name, a.description, a.price, a.category]
    );
  }

  console.log('🌱 Seeding Coupons...');
  const coupons = [
    { id: 'cpn_welcome', code: 'WELCOME10', discount_type: 'PERCENT', discount_value: 10, minimum_amount: 500, maximum_discount: 2000 },
    { id: 'cpn_bharat', code: 'BHARAT500', discount_type: 'FLAT', discount_value: 500, minimum_amount: 1500, maximum_discount: 500 },
    { id: 'cpn_festive', code: 'FESTIVE20', discount_type: 'PERCENT', discount_value: 20, minimum_amount: 3000, maximum_discount: 4000 },
    { id: 'cpn_earlybird', code: 'EARLYBIRD', discount_type: 'PERCENT', discount_value: 15, minimum_amount: 2000, maximum_discount: 2500 }
  ];

  for (const c of coupons) {
    db.run(
      `INSERT OR REPLACE INTO coupons (id, code, discount_type, discount_value, minimum_amount, maximum_discount, usage_limit, times_used, status)
       VALUES (?, ?, ?, ?, ?, ?, 1000, 14, 'ACTIVE')`,
      [c.id, c.code, c.discount_type, c.discount_value, c.minimum_amount, c.maximum_discount]
    );
  }

  console.log('🌱 Seeding Driver Partners (Sarathis)...');
  for (const d of existingData.driverPartners) {
    db.run(
      `INSERT OR REPLACE INTO driver_partners (
        id, name, city, state, badge, rating, trips_completed,
        experience_years, languages, vehicle_model, vehicle_number, vehicle_type, avatar, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        d.id,
        d.name,
        d.city,
        d.state || 'India',
        d.badge || 'Verified Sarathi',
        d.rating || 4.95,
        d.tripsCompleted || 1000,
        d.experience || 8,
        JSON.stringify(d.languages || ['Hindi', 'English']),
        d.vehicleModel || 'Bajaj RE / Swift Dzire',
        d.vehicleNumber || 'TS 09 UA 4521',
        d.vehicleType || 'Auto Rickshaw',
        d.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      ]
    );
  }

  console.log('🌱 Seeding FAQs...');
  const faqs = [
    { id: 'faq_1', question: 'How does Travel India guarantee 100% direct driver payments?', answer: 'Travel India operates on open mobility principles. Unlike aggregator apps that deduct 25-30% commissions, our platform transfers the entire trip fare directly to the Sarathi driver partner via direct UPI or cash settlement.', category: 'pricing', sort_order: 1 },
    { id: 'faq_2', question: 'Are the Sarathi driver guides police verified?', answer: 'Yes! Every single driver partner on the Travel India platform undergoes thorough police verification, commercial driving license validation, and local heritage storytelling training.', category: 'safety', sort_order: 2 },
    { id: 'faq_3', question: 'What is the cancellation and refund policy?', answer: 'Cancellations made 24 hours prior to departure receive a 100% full refund with zero cancellation fees. Within 24 hours, only a nominal 10% operational fee applies.', category: 'booking', sort_order: 3 },
    { id: 'faq_4', question: 'Can I customize my trip itinerary?', answer: 'Absolutely. Use our 10-step A-to-Z Custom Trip Planner to specify your desired states, hotel preferences, food requirements, and pickup spots. Our coordinators will assemble a custom itinerary within 2 hours.', category: 'custom', sort_order: 4 },
    { id: 'faq_5', question: 'Is the Mock Payment mode safe for testing?', answer: 'Yes, in development mode, mock payments simulate UPI QR codes, cards, and netbanking without charging any real money, allowing full testing of the checkout, ticket generation, and dashboard flows.', category: 'payment', sort_order: 5 }
  ];

  for (const f of faqs) {
    db.run(
      `INSERT OR REPLACE INTO faqs (id, question, answer, category, sort_order, status)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
      [f.id, f.question, f.answer, f.category, f.sort_order]
    );
  }

  console.log('🌱 Seeding Sample Confirmed Bookings for Customer...');
  const sampleBooking = {
    id: 'bkg_sample_01',
    booking_number: 'TI-2026-9842',
    user_id: 'usr_cust_01',
    tour_id: 'pkg-hyd-01',
    departure_id: 'dep_pkg-hyd-01_1',
    departure_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    pickup_point: 'Banjara Hills Road No 1, Hyderabad',
    guide_language: 'English & Telugu',
    traveller_count: 2,
    subtotal: 1798,
    discount: 180,
    tax: 90,
    add_on_total: 499,
    grand_total: 2207,
    coupon_code: 'WELCOME10',
    booking_status: 'CONFIRMED',
    payment_status: 'PAID',
    special_notes: 'Please arrange pick up at 8:45 AM sharp',
    assigned_driver: JSON.stringify({
      name: 'Mohammad Shafi',
      phone: '+91 98490 23456',
      badge: 'Heritage Master Sarathi',
      rating: 4.97,
      vehicle: 'Bajaj RE Auto (TS 09 UA 4521)'
    })
  };

  db.run(
    `INSERT OR REPLACE INTO bookings (
      id, booking_number, user_id, tour_id, departure_id, departure_date,
      pickup_point, guide_language, traveller_count, subtotal, discount, tax,
      add_on_total, grand_total, coupon_code, booking_status, payment_status,
      special_notes, assigned_driver
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sampleBooking.id,
      sampleBooking.booking_number,
      sampleBooking.user_id,
      sampleBooking.tour_id,
      sampleBooking.departure_id,
      sampleBooking.departure_date,
      sampleBooking.pickup_point,
      sampleBooking.guide_language,
      sampleBooking.traveller_count,
      sampleBooking.subtotal,
      sampleBooking.discount,
      sampleBooking.tax,
      sampleBooking.add_on_total,
      sampleBooking.grand_total,
      sampleBooking.coupon_code,
      sampleBooking.booking_status,
      sampleBooking.payment_status,
      sampleBooking.special_notes,
      sampleBooking.assigned_driver
    ]
  );

  // Add travellers for sample booking
  db.run(
    `INSERT OR REPLACE INTO travellers (id, booking_id, full_name, phone, email, date_of_birth, gender, emergency_contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['trv_01', sampleBooking.id, 'Rahul Sharma', '+91 98450 12345', 'rahul@example.com', '1992-05-15', 'Male', '+91 98450 99999']
  );
  db.run(
    `INSERT OR REPLACE INTO travellers (id, booking_id, full_name, phone, email, date_of_birth, gender, emergency_contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['trv_02', sampleBooking.id, 'Sneha Sharma', '+91 98450 67890', 'sneha@example.com', '1994-08-22', 'Female', '+91 98450 99999']
  );

  // Add payment for sample booking
  db.run(
    `INSERT OR REPLACE INTO payments (id, booking_id, transaction_id, provider, amount, status, payment_method, metadata, paid_at)
     VALUES (?, ?, ?, 'mock', ?, 'SUCCESSFUL', 'upi_qr', ?, CURRENT_TIMESTAMP)`,
    ['pay_sample_01', sampleBooking.id, 'TXN_MOCK_882910', sampleBooking.grand_total, JSON.stringify({ upi_vpa: 'driver@upi', bank_ref: 'REF99281' })]
  );

  // Add sample verified review
  db.run(
    `INSERT OR REPLACE INTO reviews (id, user_id, tour_id, booking_id, rating, title, review, status)
     VALUES (?, ?, ?, ?, 5, 'Unforgettable Charminar & Nizami food trail!', 'Mohammad Shafi was not just a driver but an incredible historian. The Irani chai at Nimrah and the secret viewpoints of Golconda were mindblowing. Zero middleman fees made it even better.', 'APPROVED')`,
    ['rev_01', 'usr_cust_01', 'pkg-hyd-01', sampleBooking.id]
  );

  // Add sample notification
  db.run(
    `INSERT OR REPLACE INTO notifications (id, user_id, title, message, type, is_read, link)
     VALUES (?, ?, 'Booking Confirmed: Hyderabad Rickshaw Safari', 'Your tour for Charminar & Nizami Heritage Rickshaw Safari is confirmed! Sarathi Mohammad Shafi is assigned.', 'BOOKING', 0, '/customer/bookings/bkg_sample_01')`,
    ['notif_01', 'usr_cust_01']
  );

  db.exec('PRAGMA foreign_keys = ON;');
  console.log('🎉 All seed records successfully inserted!');
  console.log('--------------------------------------------------');
  console.log('Admin Login    : admin@travelindia.com / Admin@1234');
  console.log('Customer Login : rahul@example.com / Customer@1234');
  console.log('Staff Login    : staff@travelindia.com / Staff@1234');
  console.log('--------------------------------------------------');
}

runSeeds().catch(err => {
  console.error('❌ Error running seeds:', err);
  process.exit(1);
});
