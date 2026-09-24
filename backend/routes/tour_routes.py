import json
import math
from flask import Blueprint, request, jsonify
from database.db import query_all, query_one

tour_bp = Blueprint('tours', __name__, url_prefix='/api/tours')

@tour_bp.route('', methods=['GET'])
def get_tours():
    destination = request.args.get('destination')
    category = request.args.get('category')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    duration = request.args.get('duration')
    search = request.args.get('search')
    departure_city = request.args.get('departureCity')
    sort = request.args.get('sort', 'recommended')
    page = int(request.args.get('page', 1) or 1)
    limit = int(request.args.get('limit', 12) or 12)

    query = """
        SELECT t.*, d.name as destination_name, d.state as destination_state, c.name as category_name, c.slug as category_slug,
               (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as primary_image
        FROM tours t
        JOIN destinations d ON t.destination_id = d.id
        JOIN categories c ON t.category_id = c.id
        WHERE t.status = 'ACTIVE'
    """
    params = []

    # Semantic category aliases for intuitive traveler search
    CATEGORY_ALIASES = {
        'wellness': ['coastal', 'adventure'],
        'relaxation': ['coastal'],
        'beach': ['coastal'],
        'wildlife': ['adventure'],
        'nature': ['adventure'],
        'culture': ['heritage', 'city-tour'],
        'culinary': ['city-tour', 'heritage'],
    }

    if destination and destination != 'all':
        query += " AND (t.destination_id = ? OR d.slug = ?)"
        params.extend([destination, destination])

    if category and category != 'all':
        cat_lower = category.lower().strip()
        if cat_lower in CATEGORY_ALIASES:
            slugs = CATEGORY_ALIASES[cat_lower]
            placeholders = ','.join(['?'] * len(slugs))
            query += f" AND (c.slug IN ({placeholders}) OR LOWER(t.title) LIKE ? OR LOWER(t.tagline) LIKE ?)"
            params.extend(slugs)
            params.extend([f"%{cat_lower}%", f"%{cat_lower}%"])
        else:
            query += " AND (t.category_id = ? OR c.slug = ?)"
            params.extend([category, category])

    if departure_city:
        query += " AND LOWER(t.departure_city) LIKE LOWER(?)"
        params.append(f"%{departure_city}%")

    if min_price:
        query += " AND t.sale_price >= ?"
        params.append(float(min_price))

    if max_price:
        query += " AND t.sale_price <= ?"
        params.append(float(max_price))

    if duration and duration != 'all':
        if duration == '1':
            query += " AND t.duration_days = 1"
        elif duration in ('2-3', '1-3'):
            query += " AND t.duration_days BETWEEN 1 AND 3"
        elif duration in ('4-7',):
            query += " AND t.duration_days BETWEEN 4 AND 7"
        elif duration in ('4+', '8+'):
            query += " AND t.duration_days >= 4"

    if search:
        query += " AND (LOWER(t.title) LIKE LOWER(?) OR LOWER(t.tagline) LIKE LOWER(?) OR LOWER(d.name) LIKE LOWER(?))"
        s = f"%{search.strip()}%"
        params.extend([s, s, s])

    # Sorting
    if sort == 'price_asc':
        query += " ORDER BY t.sale_price ASC"
    elif sort == 'price_desc':
        query += " ORDER BY t.sale_price DESC"
    elif sort == 'rating':
        query += " ORDER BY t.rating DESC"
    elif sort == 'newest':
        query += " ORDER BY t.created_at DESC"
    else:
        query += " ORDER BY t.featured DESC, t.rating DESC"

    # Count total
    count_sql = f"SELECT COUNT(*) as total FROM ({query})"
    count_res = query_one(count_sql, tuple(params))
    total = count_res['total'] if count_res else 0

    offset = (page - 1) * limit
    query += " LIMIT ? OFFSET ?"
    paginated_params = tuple(params + [limit, offset])

    tours = query_all(query, paginated_params)

    # Attach upcoming departures for each tour if available
    for t in tours:
        t['departures'] = query_all(
            """SELECT * FROM departures
               WHERE tour_id = ? AND departure_date >= date('now') AND status = 'ACTIVE'
               ORDER BY departure_date ASC LIMIT 3""",
            (t['id'],)
        )

    return jsonify({
        'success': True,
        'data': tours,
        'pagination': {
            'total': total,
            'page': page,
            'limit': limit,
            'totalPages': math.ceil(total / limit) if limit > 0 else 1
        }
    })

@tour_bp.route('/featured', methods=['GET'])
def get_featured_tours():
    limit = int(request.args.get('limit', 12) or 12)
    query = """
        SELECT t.*, d.name as destination_name, d.state as destination_state, c.name as category_name, c.slug as category_slug,
               (SELECT image_url FROM tour_images WHERE tour_id = t.id ORDER BY sort_order ASC LIMIT 1) as primary_image
        FROM tours t
        JOIN destinations d ON t.destination_id = d.id
        JOIN categories c ON t.category_id = c.id
        WHERE t.status = 'ACTIVE' AND t.featured = 1
        ORDER BY t.rating DESC, t.sale_price DESC
        LIMIT ?
    """
    tours = query_all(query, (limit,))
    for t in tours:
        t['departures'] = query_all(
            """SELECT * FROM departures
               WHERE tour_id = ? AND departure_date >= date('now') AND status = 'ACTIVE'
               ORDER BY departure_date ASC LIMIT 2""",
            (t['id'],)
        )
    return jsonify({'success': True, 'data': tours})

@tour_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = query_all("SELECT * FROM categories WHERE status = 'ACTIVE' ORDER BY name ASC")
    return jsonify({'success': True, 'data': categories})

@tour_bp.route('/<slug_or_id>', methods=['GET'])
def get_tour_by_slug(slug_or_id):
    tour = query_one(
        """SELECT t.*, d.name as destination_name, d.state as destination_state, d.landmark_highlight,
                  d.popular_pickups, c.name as category_name, c.slug as category_slug
           FROM tours t
           JOIN destinations d ON t.destination_id = d.id
           JOIN categories c ON t.category_id = c.id
           WHERE (t.slug = ? OR t.id = ?) AND t.status = 'ACTIVE'""",
        (slug_or_id, slug_or_id)
    )
    if not tour:
        return jsonify({'success': False, 'message': 'Tour package not found.'}), 404

    # Related assets
    images = query_all("SELECT * FROM tour_images WHERE tour_id = ? ORDER BY sort_order ASC", (tour['id'],))
    highlights = [h['item'] for h in query_all("SELECT item FROM tour_highlights WHERE tour_id = ? ORDER BY sort_order ASC", (tour['id'],))]
    itinerary = query_all("SELECT * FROM tour_itineraries WHERE tour_id = ? ORDER BY day_number ASC, sort_order ASC", (tour['id'],))
    inclusions = [i['item'] for i in query_all("SELECT item FROM tour_inclusions WHERE tour_id = ? ORDER BY sort_order ASC", (tour['id'],))]
    exclusions = [e['item'] for e in query_all("SELECT item FROM tour_exclusions WHERE tour_id = ? ORDER BY sort_order ASC", (tour['id'],))]
    departures = query_all(
        "SELECT * FROM departures WHERE tour_id = ? AND departure_date >= date('now') AND status = 'ACTIVE' ORDER BY departure_date ASC",
        (tour['id'],)
    )
    reviews = query_all(
        """SELECT r.*, u.name as customer_name
           FROM reviews r
           JOIN users u ON r.user_id = u.id
           WHERE r.tour_id = ? AND r.status = 'APPROVED'
           ORDER BY r.created_at DESC""",
        (tour['id'],)
    )

    tour['images'] = images
    tour['highlights'] = highlights
    tour['itinerary'] = itinerary
    tour['inclusions'] = inclusions
    tour['exclusions'] = exclusions
    tour['departures'] = departures
    tour['reviews'] = reviews

    return jsonify({'success': True, 'data': tour})

