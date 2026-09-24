import jwt
from functools import wraps
from flask import request, jsonify, g
from config import Config
from database.db import query_one

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({
                'success': False,
                'message': 'Authentication required. Authorization header missing.',
                'code': 'AUTH_REQUIRED'
            }), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({
                'success': False,
                'message': 'Invalid token format. Must be Bearer <token>.',
                'code': 'INVALID_FORMAT'
            }), 401

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
                return jsonify({
                    'success': False,
                    'message': 'User account no longer exists.',
                    'code': 'USER_NOT_FOUND'
                }), 401

            if user.get('status') != 'ACTIVE':
                return jsonify({
                    'success': False,
                    'message': 'Account is suspended. Please contact customer support.',
                    'code': 'ACCOUNT_SUSPENDED'
                }), 403

            g.user = user
            g.user_id = user_id
        except jwt.ExpiredSignatureError:
            return jsonify({
                'success': False,
                'message': 'Session token has expired. Please sign in again.',
                'code': 'TOKEN_EXPIRED'
            }), 401
        except Exception:
            return jsonify({
                'success': False,
                'message': 'Invalid authentication token.',
                'code': 'INVALID_TOKEN'
            }), 401

        return f(*args, **kwargs)
    return decorated_function

def optional_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

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
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

        if not hasattr(g, 'user') or not g.user:
            return jsonify({
                'success': False,
                'message': 'Authentication required to access administrative resources.',
                'code': 'AUTH_REQUIRED'
            }), 401

        if g.user.get('role') not in ['ADMIN', 'STAFF']:
            return jsonify({
                'success': False,
                'message': 'Access denied: Executive or Staff privileges required.',
                'code': 'FORBIDDEN'
            }), 403

        return f(*args, **kwargs)
    return decorated_function
