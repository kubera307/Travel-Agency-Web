import time
from flask import Blueprint, request, jsonify, g
from database.db import query_all, query_one, execute
from middleware.auth import jwt_required, optional_jwt

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

VALID_CATEGORIES = [
    'Website',
    'Booking',
    'Tour',
    'Guide',
    'Transportation',
    'Hotel',
    'Customer Support',
    'Payment',
    'Other'
]

@feedback_bp.route('', methods=['POST'])
@optional_jwt
def submit_feedback():
    data = request.get_json() or {}

    customer_name = (data.get('customer_name') or (g.user.get('name') if g.user else '')).strip()
    email = (data.get('email') or (g.user.get('email') if g.user else '')).strip()
    rating = data.get('rating')
    category = (data.get('category') or 'Other').strip()
    feedback_text = (data.get('feedback') or '').strip()
    booking_id = data.get('booking_id') or None

    if not customer_name:
        return jsonify({'success': False, 'message': 'Please provide your name.'}), 400

    if not email or '@' not in email:
        return jsonify({'success': False, 'message': 'Please provide a valid email address.'}), 400

    try:
        rating = int(rating)
        if not (1 <= rating <= 5):
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({'success': False, 'message': 'Rating must be an integer between 1 and 5.'}), 400

    if category not in VALID_CATEGORIES:
        category = 'Other'

    if not feedback_text:
        return jsonify({'success': False, 'message': 'Please share your comments or suggestions.'}), 400

    feedback_id = f"fb_{int(time.time() * 1000)}"

    execute(
        """INSERT INTO feedback (id, customer_name, email, booking_id, rating, feedback, category, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')""",
        (feedback_id, customer_name, email, booking_id, rating, feedback_text, category)
    )

    return jsonify({
        'success': True,
        'message': 'Thank you! Your feedback has been received and shared with our concierge team.',
        'data': {
            'id': feedback_id,
            'rating': rating,
            'category': category,
            'status': 'PENDING'
        }
    }), 201

@feedback_bp.route('/my', methods=['GET'])
@jwt_required
def get_my_feedback():
    user_email = g.user.get('email')
    feedbacks = query_all(
        """SELECT f.*, b.booking_number, b.tour_title
           FROM feedback f
           LEFT JOIN bookings b ON f.booking_id = b.id
           WHERE f.email = ?
           ORDER BY f.created_at DESC""",
        (user_email,)
    )
    return jsonify({'success': True, 'data': feedbacks})

@feedback_bp.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({'success': True, 'data': VALID_CATEGORIES})

