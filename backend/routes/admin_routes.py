import time
import json
from flask import Blueprint, request, jsonify
from database.db import query_all, query_one, execute
from middleware.auth import jwt_required, admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.before_request
@jwt_required
@admin_required
def admin_auth_check():
    pass

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    total_rev_row = query_one("SELECT SUM(grand_total) as total FROM bookings WHERE payment_status = 'PAID'")
    total_revenue = total_rev_row['total'] if total_rev_row and total_rev_row['total'] else 0

    total_bookings = query_one("SELECT COUNT(*) as count FROM bookings")['count']
    confirmed_bookings = query_one("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'CONFIRMED'")['count']
    total_customers = query_one("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'")['count']
    active_enquiries = query_one("SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'")['count']

    recent_bookings = query_all(
        """SELECT b.id, b.booking_number, b.departure_date, b.grand_total, b.booking_status, b.created_at,
                  t.title as tour_title, u.name as customer_name, u.phone as customer_phone, u.email as customer_email
           FROM bookings b
           JOIN tours t ON b.tour_id = t.id
           JOIN users u ON b.user_id = u.id
           ORDER BY b.created_at DESC
           LIMIT 5"""
    )

    return jsonify({
        'success': True,
        'data': {
            'totalRevenue': total_revenue,
            'totalBookings': total_bookings,
            'confirmedBookings': confirmed_bookings,
            'totalCustomers': total_customers,
            'activeEnquiries': active_enquiries,
            'recentBookings': recent_bookings
        }
    })

@admin_bp.route('/reports', methods=['GET'])
def get_reports():
    popular_tours = query_all(
        """SELECT t.id, t.title, COUNT(b.id) as bookings_count, COALESCE(SUM(b.grand_total), 0) as total_revenue
           FROM tours t
           LEFT JOIN bookings b ON t.id = b.tour_id AND b.booking_status = 'CONFIRMED'
           GROUP BY t.id
           ORDER BY bookings_count DESC
           LIMIT 5"""
    )

    popular_destinations = query_all(
        """SELECT d.id, d.name, COUNT(b.id) as bookings_count, COALESCE(SUM(b.grand_total), 0) as total_revenue
           FROM destinations d
           JOIN tours t ON d.id = t.destination_id
           LEFT JOIN bookings b ON t.id = b.tour_id AND b.booking_status = 'CONFIRMED'
           GROUP BY d.id
           ORDER BY total_revenue DESC
           LIMIT 5"""
    )

    return jsonify({
        'success': True,
        'data': {
            'popularTours': popular_tours,
            'popularDestinations': popular_destinations
        }
    })

@admin_bp.route('/tours', methods=['GET'])
def list_tours():
    tours = query_all(
        """SELECT t.*, d.name as destination_name, c.name as category_name
           FROM tours t
           JOIN destinations d ON t.destination_id = d.id
           JOIN categories c ON t.category_id = c.id
           ORDER BY t.created_at DESC"""
    )
    return jsonify({'success': True, 'data': tours})

@admin_bp.route('/tours', methods=['POST'])
def create_tour():
    data = request.get_json() or {}
    title = data.get('title')
    destination_id = data.get('destination_id')
    category_id = data.get('category_id')
    sale_price = float(data.get('sale_price') or 0)
    base_price = float(data.get('base_price') or sale_price * 1.2)

    if not title or not destination_id or not category_id or sale_price <= 0:
        return jsonify({'success': False, 'message': 'Title, destination, category, and sale price are required.'}), 400

    tour_id = f"pkg_{int(time.time() * 1000)}"
    slug = title.lower().replace(' ', '-').replace('/', '-')

    execute(
        """INSERT INTO tours (
            id, title, slug, destination_id, category_id, tagline, description,
            duration_days, duration_nights, departure_city, vehicle_type, vehicle_category,
            capacity, distance, base_price, sale_price, max_seats, badge, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')""",
        (
            tour_id, title, slug, destination_id, category_id,
            data.get('tagline', ''), data.get('description', ''),
            int(data.get('duration_days', 1)), int(data.get('duration_nights', 0)),
            data.get('departure_city', 'Local City'), data.get('vehicle_type', 'AC Vehicle'),
            data.get('vehicle_category', 'sedan'), data.get('capacity', 'Up to 4 Guests'),
            data.get('distance', 'Approx. 50 Km'), base_price, sale_price,
            int(data.get('max_seats', 20)), data.get('badge', 'Verified Sarathi Tour')
        )
    )

    if data.get('primary_image'):
        execute(
            "INSERT INTO tour_images (id, tour_id, image_url, sort_order) VALUES (?, ?, ?, 0)",
            (f"img_{tour_id}_0", tour_id, data['primary_image'])
        )

    return jsonify({'success': True, 'message': 'Tour package created successfully.', 'id': tour_id}), 201

@admin_bp.route('/tours/<tour_id>', methods=['PUT'])
def update_tour(tour_id):
    data = request.get_json() or {}
    execute(
        """UPDATE tours
           SET title = COALESCE(?, title),
               tagline = COALESCE(?, tagline),
               description = COALESCE(?, description),
               sale_price = COALESCE(?, sale_price),
               base_price = COALESCE(?, base_price),
               status = COALESCE(?, status),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?""",
        (data.get('title'), data.get('tagline'), data.get('description'), data.get('sale_price'), data.get('base_price'), data.get('status'), tour_id)
    )
    return jsonify({'success': True, 'message': 'Tour updated successfully.'})

@admin_bp.route('/tours/<tour_id>', methods=['DELETE'])
def delete_tour(tour_id):
    execute("UPDATE tours SET status = 'INACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (tour_id,))
    return jsonify({'success': True, 'message': 'Tour archived successfully.'})

@admin_bp.route('/bookings', methods=['GET'])
def list_bookings():
    bookings = query_all(
        """SELECT b.*, t.title as tour_title, u.name as customer_name, u.email as customer_email
           FROM bookings b
           JOIN tours t ON b.tour_id = t.id
           JOIN users u ON b.user_id = u.id
           ORDER BY b.created_at DESC"""
    )
    return jsonify({'success': True, 'data': bookings})

@admin_bp.route('/bookings/<booking_id>/assign-driver', methods=['PUT'])
def assign_driver(booking_id):
    data = request.get_json() or {}
    driver_data = data.get('driver') or data

    execute(
        "UPDATE bookings SET assigned_driver = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (json.dumps(driver_data), booking_id)
    )
    return jsonify({'success': True, 'message': 'Driver assigned successfully.'})

@admin_bp.route('/bookings/<booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    data = request.get_json() or {}
    status = (data.get('bookingStatus') or data.get('status') or '').upper().strip()
    valid_statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    if status not in valid_statuses:
        return jsonify({'success': False, 'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400

    execute("UPDATE bookings SET booking_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (status, booking_id))
    return jsonify({'success': True, 'message': f'Booking status updated to {status}.'})

@admin_bp.route('/customers', methods=['GET'])
def list_customers():
    customers = query_all(
        """SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at,
                  p.city, p.state, p.emergency_contact, COUNT(b.id) as total_bookings
           FROM users u
           LEFT JOIN customer_profiles p ON u.id = p.user_id
           LEFT JOIN bookings b ON u.id = b.user_id
           WHERE u.role = 'CUSTOMER'
           GROUP BY u.id
           ORDER BY u.created_at DESC"""
    )
    return jsonify({'success': True, 'data': customers})

@admin_bp.route('/payments', methods=['GET'])
def list_payments():
    payments = query_all(
        """SELECT p.*, b.booking_number, u.name as customer_name
           FROM payments p
           JOIN bookings b ON p.booking_id = b.id
           JOIN users u ON b.user_id = u.id
           ORDER BY p.created_at DESC"""
    )
    return jsonify({'success': True, 'data': payments})

@admin_bp.route('/coupons', methods=['GET'])
def list_coupons():
    coupons = query_all("SELECT * FROM coupons ORDER BY created_at DESC")
    return jsonify({'success': True, 'data': coupons})

@admin_bp.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.get_json() or {}
    code = (data.get('code') or '').upper().strip()
    discount_type = data.get('discount_type') or 'PERCENT'
    discount_value = float(data.get('discount_value') or 10)
    min_amt = float(data.get('minimum_amount') or 500)
    max_disc = float(data.get('maximum_discount') or 2000)

    if not code:
        return jsonify({'success': False, 'message': 'Coupon code is required.'}), 400

    execute(
        """INSERT INTO coupons (id, code, discount_type, discount_value, minimum_amount, maximum_discount, status)
           VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')""",
        (f"cpn_{int(time.time()*1000)}", code, discount_type, discount_value, min_amt, max_disc)
    )
    return jsonify({'success': True, 'message': 'Coupon created successfully.'}), 201

@admin_bp.route('/reviews', methods=['GET'])
def list_reviews():
    reviews = query_all(
        """SELECT r.*, u.name as customer_name, t.title as tour_title
           FROM reviews r
           JOIN users u ON r.user_id = u.id
           JOIN tours t ON r.tour_id = t.id
           ORDER BY r.created_at DESC"""
    )
    return jsonify({'success': True, 'data': reviews})

@admin_bp.route('/reviews/<review_id>/moderate', methods=['PUT'])
@admin_bp.route('/reviews/<review_id>/status', methods=['PUT'])
def update_review_status(review_id):
    data = request.get_json() or {}
    status = (data.get('status') or 'APPROVED').upper().strip()
    execute("UPDATE reviews SET status = ? WHERE id = ?", (status, review_id))
    return jsonify({'success': True, 'message': f'Review status updated to {status}.'})

@admin_bp.route('/enquiries', methods=['GET'])
def list_enquiries():
    enquiries = query_all("SELECT * FROM enquiries ORDER BY created_at DESC")
    return jsonify({'success': True, 'data': enquiries})

@admin_bp.route('/enquiries/<enquiry_id>', methods=['PUT'])
def update_enquiry_status(enquiry_id):
    data = request.get_json() or {}
    status = (data.get('status') or '').upper().strip()
    valid_statuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
    if status not in valid_statuses:
        return jsonify({'success': False, 'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400

    execute("UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (status, enquiry_id))
    return jsonify({'success': True, 'message': f'Enquiry status updated to {status}.'})

@admin_bp.route('/feedback', methods=['GET'])
def list_feedback():
    feedbacks = query_all(
        """SELECT f.*, b.booking_number, b.tour_title
           FROM feedback f
           LEFT JOIN bookings b ON f.booking_id = b.id
           ORDER BY f.created_at DESC"""
    )
    return jsonify({'success': True, 'data': feedbacks})

@admin_bp.route('/feedback/<feedback_id>/status', methods=['PUT'])
def update_feedback_status(feedback_id):
    data = request.get_json() or {}
    status = (data.get('status') or 'REVIEWED').upper().strip()
    admin_notes = (data.get('admin_notes') or '').strip()

    if status not in ['PENDING', 'REVIEWED']:
        return jsonify({'success': False, 'message': 'Status must be PENDING or REVIEWED.'}), 400

    execute(
        "UPDATE feedback SET status = ?, admin_notes = ? WHERE id = ?",
        (status, admin_notes, feedback_id)
    )
    return jsonify({'success': True, 'message': f'Feedback marked as {status}.'})


