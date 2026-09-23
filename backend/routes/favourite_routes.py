import time
from flask import Blueprint, request, jsonify, g
from database.db import query_all, execute
from middleware.auth import jwt_required

favourite_bp = Blueprint('favourites', __name__, url_prefix='/api/favourites')

@favourite_bp.route('', methods=['GET'])
@jwt_required
def get_favourites():
    user_id = g.user_id
    sql = """
        SELECT f.*, t.title as tour_title, t.slug as tour_slug, t.sale_price, t.base_price,
               t.duration_days, t.duration_nights, t.rating, t.reviews_count,
               d.name as destination_name,
               (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as tour_image
        FROM favourites f
        JOIN tours t ON f.tour_id = t.id
        JOIN destinations d ON t.destination_id = d.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
    """
    favourites = query_all(sql, (user_id,))
    return jsonify({'success': True, 'favourites': favourites})

@favourite_bp.route('', methods=['POST'])
@jwt_required
def add_favourite():
    data = request.get_json() or {}
    user_id = g.user_id
    tour_id = data.get('tourId') or data.get('tour_id')

    if not tour_id:
        return jsonify({'success': False, 'message': 'Tour ID is required.'}), 400

    fav_id = f"fav_{int(time.time() * 1000)}"
    execute(
        """INSERT INTO favourites (id, user_id, tour_id)
           VALUES (?, ?, ?)
           ON CONFLICT(user_id, tour_id) DO NOTHING""",
        (fav_id, user_id, tour_id)
    )
    return jsonify({'success': True, 'message': 'Tour saved to favourites.'})

@favourite_bp.route('/<tour_id>', methods=['DELETE'])
@jwt_required
def remove_favourite(tour_id):
    user_id = g.user_id
    execute("DELETE FROM favourites WHERE user_id = ? AND tour_id = ?", (user_id, tour_id))
    return jsonify({'success': True, 'message': 'Tour removed from favourites.'})

