import json
from flask import Blueprint, jsonify
from database.db import query_all, query_one

dest_bp = Blueprint('destinations', __name__, url_prefix='/api/destinations')

@dest_bp.route('', methods=['GET'])
def get_destinations():
    sql = """
        SELECT d.*, COUNT(t.id) as active_tours_count
        FROM destinations d
        LEFT JOIN tours t ON d.id = t.destination_id AND t.status = 'ACTIVE'
        WHERE d.status = 'ACTIVE'
        GROUP BY d.id
        ORDER BY d.name ASC
    """
    destinations = query_all(sql)
    for d in destinations:
        if d.get('popular_pickups') and isinstance(d['popular_pickups'], str):
            try:
                d['popular_pickups'] = json.loads(d['popular_pickups'])
            except Exception:
                d['popular_pickups'] = []
    return jsonify({'success': True, 'data': destinations})

@dest_bp.route('/<slug_or_id>', methods=['GET'])
def get_destination(slug_or_id):
    destination = query_one(
        "SELECT * FROM destinations WHERE (slug = ? OR id = ?) AND status = 'ACTIVE'",
        (slug_or_id, slug_or_id)
    )
    if not destination:
        return jsonify({'success': False, 'message': 'Destination not found.'}), 404

    if destination.get('popular_pickups') and isinstance(destination['popular_pickups'], str):
        try:
            destination['popular_pickups'] = json.loads(destination['popular_pickups'])
        except Exception:
            destination['popular_pickups'] = []

    # Associated tours
    tours_sql = """
        SELECT t.*, d.name as destination_name, d.state as destination_state, c.name as category_name, c.slug as category_slug,
               (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as primary_image
        FROM tours t
        JOIN destinations d ON t.destination_id = d.id
        JOIN categories c ON t.category_id = c.id
        WHERE t.destination_id = ? AND t.status = 'ACTIVE'
        ORDER BY t.featured DESC, t.rating DESC
    """
    tours = query_all(tours_sql, (destination['id'],))
    destination['tours'] = tours

    return jsonify({'success': True, 'data': destination})

