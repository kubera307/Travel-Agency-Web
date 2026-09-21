import jwt
from functools import wraps
from flask import request, jsonify, g
from config import Config
from database.db import query_one

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization header missing.'}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'success': False, 'message': 'Invalid token format. Must be Bearer <token>.'}), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('id')
            user = query_one(
                """SELECT u.*, p.profile_image, p.date_of_birth, p.gender, p.address, p.city, p.state, p.emergency_contact
                   FROM users u
                   LEFT JOIN customer_profiles p ON u.id = p.user_id
                   WHERE u.id = ?""",
                (user_id,)
            )

            if not user:
                return jsonify({'success': False, 'message': 'User no longer exists.'}), 401

            if user.get('status') != 'ACTIVE':
                return jsonify({'success': False, 'message': 'Account is suspended.'}), 403

            g.user = user
            g.user_id = user_id
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired. Please login again.'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': 'Invalid token.'}), 401

        return f(*args, **kwargs)
    return decorated_function

def optional_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        g.user = None
        g.user_id = None
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
                try:
                    payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
                    user_id = payload.get('id')
                    user = query_one("SELECT * FROM users WHERE id = ?", (user_id,))
                    if user and user.get('status') == 'ACTIVE':
                        g.user = user
                        g.user_id = user_id
                except Exception:
                    pass
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(g, 'user') or not g.user:
            return jsonify({'success': False, 'message': 'Authentication required.'}), 401

        if g.user.get('role') not in ['ADMIN', 'STAFF']:
            return jsonify({'success': False, 'message': 'Access denied: Admin or Staff privileges required.'}), 403

        return f(*args, **kwargs)
    return decorated_function

