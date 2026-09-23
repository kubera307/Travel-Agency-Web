import time
import json
import uuid
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, g
from database.db import get_db, query_all, query_one, execute
from middleware.auth import jwt_required
from services.ticket_service import generate_ticket
from services.payment_service import PaymentService

booking_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')

@booking_bp.route('', methods=['POST'])
@jwt_required
def create_booking():
    data = request.get_json() or {}
    user_id = g.user_id

    tour_id = data.get('tourId') or data.get('tour_id')
    departure_id = data.get('departureId') or data.get('departure_id')
    departure_date = data.get('departureDate') or data.get('departure_date')
    traveller_count = int(data.get('travellerCount') or data.get('traveller_count') or 1)
    pickup_point = (data.get('pickupPoint') or data.get('pickup_point') or 'City Center').strip()
    guide_language = data.get('guideLanguage') or data.get('guide_language') or 'English'
    special_notes = data.get('specialNotes') or data.get('special_notes') or ''
    coupon_code = data.get('couponCode') or data.get('coupon_code')
    selected_addons = data.get('addons') or data.get('selected_addons') or []
    travellers = data.get('travellers') or []

    if not tour_id or not departure_date or traveller_count < 1 or traveller_count > 20:
        return jsonify({'success': False, 'message': 'A tour, departure date, and 1–20 travellers are required.'}), 400

    tour = query_one("SELECT * FROM tours WHERE id = ? OR slug = ?", (tour_id, tour_id))
    if not tour:
        return jsonify({'success': False, 'message': 'Tour not found.'}), 404

    # Departure & seat verification
    departure = None
    if departure_id:
        departure = query_one("SELECT * FROM departures WHERE id = ?", (departure_id,))
    else:
        departure = query_one(
            "SELECT * FROM departures WHERE tour_id = ? AND departure_date = ? AND status = 'ACTIVE'",
            (tour['id'], departure_date)
        )

    if departure and departure['available_seats'] < traveller_count:
        return jsonify({
            'success': False,
            'message': f"Only {departure['available_seats']} seats available for this departure."
        }), 400

    # Pricing calculations
    subtotal = float(tour['sale_price']) * traveller_count
    discount = 0.0

    if coupon_code:
        coupon = query_one(
            "SELECT * FROM coupons WHERE code = ? AND status = 'ACTIVE'",
            (coupon_code.upper().strip(),)
        )
        if coupon and subtotal >= float(coupon['minimum_amount'] or 0):
            if coupon['discount_type'] == 'PERCENT':
                discount = (subtotal * float(coupon['discount_value'])) / 100.0
                if coupon['maximum_discount']:
                    discount = min(discount, float(coupon['maximum_discount']))
            else:
                discount = float(coupon['discount_value'])

    tax = round((subtotal - discount) * 0.05, 2)

    # Calculate add-ons
    addon_total = 0.0
    valid_addons = []
    if selected_addons:
        for addon_item in selected_addons:
            addon_id = addon_item.get('id') if isinstance(addon_item, dict) else addon_item
            qty = addon_item.get('quantity', 1) if isinstance(addon_item, dict) else 1
            ad = query_one("SELECT * FROM addons WHERE id = ? AND status = 'ACTIVE'", (addon_id,))
            if ad:
                cost = float(ad['price']) * qty
                addon_total += cost
                valid_addons.append({'addon': ad, 'quantity': qty, 'price': ad['price']})

    grand_total = round((subtotal - discount) + tax + addon_total, 2)

    # Generate booking ID and number
    timestamp = int(time.time())
    booking_id = f"bkg_{uuid.uuid4().hex}"
    booking_number = f"NY-{time.strftime('%Y')}-{uuid.uuid4().hex[:8].upper()}"

    # Auto assign a verified driver if available
    driver = query_one(
        "SELECT * FROM driver_partners WHERE city = ? AND status = 'ACTIVE' LIMIT 1",
        (tour.get('departure_city'),)
    ) or query_one("SELECT * FROM driver_partners WHERE status = 'ACTIVE' LIMIT 1")

    assigned_driver_json = None
    if driver:
        assigned_driver_json = json.dumps({
            'id': driver['id'],
            'name': driver['name'],
            'phone': '+91 98490 23456',
            'badge': driver['badge'],
            'rating': driver['rating'],
            'vehicle': f"{driver['vehicle_model']} ({driver['vehicle_number']})"
        })

    # SQLite serializes writers using BEGIN IMMEDIATE.  The conditional update
    # is the final inventory guard, so concurrent requests cannot overbook.
    db = get_db()
    try:
        db.execute('BEGIN IMMEDIATE')
        if not departure:
            raise ValueError('An active departure is required for booking.')
        seat_update = db.execute(
            "UPDATE departures SET available_seats = available_seats - ? "
            "WHERE id = ? AND status = 'ACTIVE' AND available_seats >= ?",
            (traveller_count, departure['id'], traveller_count)
        )
        if seat_update.rowcount != 1:
            raise ValueError('This departure no longer has enough seats.')
        db.execute(
            """INSERT INTO bookings (
            id, booking_number, user_id, tour_id, departure_id, departure_date,
            pickup_point, guide_language, traveller_count, subtotal, discount, tax,
            add_on_total, grand_total, coupon_code, booking_status, payment_status,
            special_notes, assigned_driver
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING', ?, ?)""",
            (
                booking_id, booking_number, user_id, tour['id'], departure['id'], departure_date,
                pickup_point, guide_language, traveller_count, subtotal, discount, tax,
                addon_total, grand_total, coupon_code, special_notes, assigned_driver_json
            )
        )
        if travellers and isinstance(travellers, list):
            for idx, traveller in enumerate(travellers):
                db.execute(
                    """INSERT INTO travellers (id, booking_id, full_name, phone, email, date_of_birth, gender, emergency_contact)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (f"trv_{booking_id}_{idx}", booking_id,
                     traveller.get('fullName') or traveller.get('full_name') or f"Guest {idx + 1}",
                     traveller.get('phone') or '', traveller.get('email') or '',
                     traveller.get('dateOfBirth') or traveller.get('date_of_birth') or '',
                     traveller.get('gender') or '', traveller.get('emergencyContact') or traveller.get('emergency_contact') or '')
                )
        for addon in valid_addons:
            db.execute(
                "INSERT INTO booking_addons (id, booking_id, addon_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
                (f"ba_{booking_id}_{addon['addon']['id']}", booking_id, addon['addon']['id'], addon['quantity'], addon['price'])
            )
        db.execute(
            """INSERT INTO seat_reservations (id, departure_id, user_id, booking_id, seats, expires_at, status)
               VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')""",
            (f"res_{uuid.uuid4().hex}", departure['id'], user_id, booking_id, traveller_count,
             (datetime.now(timezone.utc) + timedelta(minutes=15)).strftime('%Y-%m-%d %H:%M:%S'))
        )
        db.commit()
    except ValueError as error:
        db.rollback()
        return jsonify({'success': False, 'message': str(error)}), 400
    except Exception:
        db.rollback()
        return jsonify({'success': False, 'message': 'Unable to reserve seats. Please try again.'}), 500

    # Price is stored server-side and the order is deliberately not verified
    # here. Confirmation is exclusively the payment-verification transition.
    payment_order = PaymentService.create_order(booking_id, 'mock')

    # Notification
    execute(
        """INSERT INTO notifications (id, user_id, title, message, type, link)
           VALUES (?, ?, ?, ?, 'BOOKING', ?)""",
        (
            f"notif_{int(time.time()*1000)}",
            user_id,
            f"Payment pending: {tour['title']}",
            f"Your booking #{booking_number} is reserved for 15 minutes while payment is completed.",
            f"/customer/bookings/{booking_id}"
        )
    )

    created_booking = query_one("SELECT * FROM bookings WHERE id = ?", (booking_id,))
    ticket = generate_ticket(created_booking, tour, travellers, payment_order)

    return jsonify({
        'success': True,
        'message': 'Seats reserved. Complete payment to confirm your booking.',
        'booking': created_booking,
        'ticket': ticket
    }), 201

@booking_bp.route('', methods=['GET'])
@jwt_required
def get_bookings():
    user = g.user
    if user.get('role') in ['ADMIN', 'STAFF']:
        sql = """
            SELECT b.*, t.title as tour_title, t.slug as tour_slug,
                   (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as tour_image,
                   u.name as customer_name, u.email as customer_email
            FROM bookings b
            JOIN tours t ON b.tour_id = t.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        """
        bookings = query_all(sql)
    else:
        sql = """
            SELECT b.*, t.title as tour_title, t.slug as tour_slug,
                   (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as tour_image
            FROM bookings b
            JOIN tours t ON b.tour_id = t.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        """
        bookings = query_all(sql, (user['id'],))

    return jsonify({'success': True, 'data': bookings})

@booking_bp.route('/<booking_id>', methods=['GET'])
@jwt_required
def get_booking_details(booking_id):
    user = g.user
    booking = query_one(
        """SELECT b.*, t.title as tour_title, t.slug as tour_slug, t.vehicle_type, t.vehicle_category,
                  t.duration_days, t.duration_nights, d.name as destination_name,
                  (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as tour_image
           FROM bookings b
           JOIN tours t ON b.tour_id = t.id
           JOIN destinations d ON t.destination_id = d.id
           WHERE b.id = ? OR b.booking_number = ?""",
        (booking_id, booking_id)
    )

    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found.'}), 404

    if user.get('role') not in ['ADMIN', 'STAFF'] and booking['user_id'] != user['id']:
        return jsonify({'success': False, 'message': 'Access denied.'}), 403

    travellers = query_all("SELECT * FROM travellers WHERE booking_id = ?", (booking['id'],))
    addons = query_all(
        """SELECT ba.*, a.name, a.description, a.category
           FROM booking_addons ba
           JOIN addons a ON ba.addon_id = a.id
           WHERE ba.booking_id = ?""",
        (booking['id'],)
    )
    payments = query_all("SELECT * FROM payments WHERE booking_id = ?", (booking['id'],))

    booking['travellers'] = travellers
    booking['addons'] = addons
    booking['payments'] = payments
    booking['ticket'] = generate_ticket(booking, {'title': booking['tour_title']}, travellers, payments)

    return jsonify({'success': True, 'data': booking})

@booking_bp.route('/validate-coupon', methods=['POST'])
def validate_coupon():
    data = request.get_json() or {}
    code = (data.get('code') or '').upper().strip()
    amount = float(data.get('amount') or 0)

    coupon = query_one("SELECT * FROM coupons WHERE code = ? AND status = 'ACTIVE'", (code,))
    if not coupon:
        return jsonify({'success': False, 'message': 'Invalid coupon code.'}), 400

    min_amount = float(coupon.get('minimum_amount') or 0)
    if amount < min_amount:
        return jsonify({
            'success': False,
            'message': f"Coupon requires minimum booking amount of ₹{min_amount:,.0f}."
        }), 400

    discount = 0.0
    if coupon['discount_type'] == 'PERCENT':
        discount = (amount * float(coupon['discount_value'])) / 100.0
        if coupon.get('maximum_discount'):
            discount = min(discount, float(coupon['maximum_discount']))
    else:
        discount = float(coupon['discount_value'])

    return jsonify({
        'success': True,
        'coupon': {
            'code': coupon['code'],
            'discountType': coupon['discount_type'],
            'discountValue': coupon['discount_value'],
            'calculatedDiscount': round(discount, 2)
        }
    })

@booking_bp.route('/<booking_id>/cancel', methods=['PUT'])
@jwt_required
def cancel_booking(booking_id):
    user = g.user
    booking = query_one("SELECT * FROM bookings WHERE id = ?", (booking_id,))

    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found.'}), 404

    if user.get('role') not in ['ADMIN', 'STAFF'] and booking['user_id'] != user['id']:
        return jsonify({'success': False, 'message': 'Access denied.'}), 403

    execute(
        "UPDATE bookings SET booking_status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (booking_id,)
    )

    # Return seats to departure
    if booking.get('departure_id'):
        execute(
            "UPDATE departures SET available_seats = available_seats + ? WHERE id = ?",
            (booking['traveller_count'], booking['departure_id'])
        )

    return jsonify({
        'success': True,
        'message': 'Booking cancelled successfully. 100% refund initiated to original payment method.'
    })

@booking_bp.route('/addons', methods=['GET'])
def get_addons():
    addons = query_all("SELECT * FROM addons WHERE status = 'ACTIVE' ORDER BY price ASC")
    return jsonify({'success': True, 'data': addons})
