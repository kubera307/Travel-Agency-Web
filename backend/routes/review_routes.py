import time
from flask import Blueprint, request, jsonify, g
from database.db import query_all, execute
from middleware.auth import jwt_required

review_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

@review_bp.route('/tour/<tour_id>', methods=['GET'])
def get_tour_reviews(tour_id):
    sql = """
        SELECT r.*, u.name as customer_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.tour_id = ? AND r.status = 'APPROVED'
        ORDER BY r.created_at DESC
    """
    reviews = query_all(sql, (tour_id,))
    return jsonify({'success': True, 'data': reviews})

@review_bp.route('', methods=['POST'])
@jwt_required
def create_review():
    data = request.get_json() or {}
    user_id = g.user_id

    tour_id = data.get('tourId') or data.get('tour_id')
    rating = int(data.get('rating') or 5)
    title = (data.get('title') or '').strip()
    review_text = (data.get('review') or '').strip()

    if not tour_id or not review_text:
        return jsonify({'success': False, 'message': 'Tour ID and review text are required.'}), 400

    review_id = f"rev_{int(time.time() * 1000)}"
    execute(
        """INSERT INTO reviews (id, user_id, tour_id, rating, title, review, status)
           VALUES (?, ?, ?, ?, ?, ?, 'APPROVED')""",
        (review_id, user_id, tour_id, rating, title, review_text)
    )

    # Update tour reviews count and average rating
    execute(
        """UPDATE tours
           SET reviews_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = ? AND status = 'APPROVED'),
               rating = ROUND((SELECT AVG(rating) FROM reviews WHERE tour_id = ? AND status = 'APPROVED'), 2)
           WHERE id = ?""",
        (tour_id, tour_id, tour_id)
    )

    return jsonify({'success': True, 'message': 'Review submitted and published successfully!'}), 201

