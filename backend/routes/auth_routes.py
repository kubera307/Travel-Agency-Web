import time
import re
import hashlib
import secrets
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, g
from config import Config
from database.db import query_one, query_all, execute
from middleware.auth import jwt_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').lower().strip()
    password = (data.get('password') or '').strip()
    phone = (data.get('phone') or '').strip()

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email, and password are required.'}), 400
    if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
        return jsonify({'success': False, 'message': 'Enter a valid email address.'}), 400
    if len(password) < 10 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
        return jsonify({'success': False, 'message': 'Password must be at least 10 characters and include letters and numbers.'}), 400

    existing = query_one('SELECT id FROM users WHERE email = ?', (email,))
    if existing:
        return jsonify({'success': False, 'message': 'An account with this email already exists.'}), 400

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_id = f"usr_{int(time.time() * 1000)}"

    execute(
        """INSERT INTO users (id, name, email, phone, password_hash, role, status)
           VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 'ACTIVE')""",
        (user_id, name, email, phone, password_hash)
    )

    profile_id = f"prof_{int(time.time() * 1000)}"
    execute(
        "INSERT INTO customer_profiles (id, user_id) VALUES (?, ?)",
        (profile_id, user_id)
    )

    payload = {
        'id': user_id,
        'role': 'CUSTOMER',
        'exp': datetime.now(timezone.utc) + timedelta(minutes=Config.JWT_EXPIRES_MINUTES)
    }
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

    return jsonify({
        'success': True,
        'message': 'Account registered successfully.',
        'token': token,
        'user': {
            'id': user_id,
            'name': name,
            'email': email,
            'phone': phone,
            'role': 'CUSTOMER'
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    password = (data.get('password') or '').strip()

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    user = query_one(
        """SELECT u.*, p.profile_image, p.date_of_birth, p.gender, p.address, p.city, p.state, p.emergency_contact
           FROM users u
           LEFT JOIN customer_profiles p ON u.id = p.user_id
           WHERE u.email = ?""",
        (email,)
    )

    if not user:
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401

    if user.get('status') != 'ACTIVE':
        return jsonify({'success': False, 'message': 'Account suspended. Contact support.'}), 403

    try:
        match = bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8'))
    except Exception:
        match = False

    if not match:
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401

    payload = {
        'id': user['id'],
        'role': user['role'],
        'exp': datetime.now(timezone.utc) + timedelta(minutes=Config.JWT_EXPIRES_MINUTES)
    }
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

    user_obj = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user['phone'],
        'role': user['role'],
        'profileImage': user.get('profile_image'),
        'dateOfBirth': user.get('date_of_birth'),
        'gender': user.get('gender'),
        'address': user.get('address'),
        'city': user.get('city'),
        'state': user.get('state'),
        'emergencyContact': user.get('emergency_contact')
    }

    return jsonify({
        'success': True,
        'message': 'Login successful.',
        'token': token,
        'user': user_obj
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_me():
    user = g.user
    user_obj = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user['phone'],
        'role': user['role'],
        'status': user['status'],
        'profileImage': user.get('profile_image'),
        'dateOfBirth': user.get('date_of_birth'),
        'gender': user.get('gender'),
        'address': user.get('address'),
        'city': user.get('city'),
        'state': user.get('state'),
        'emergencyContact': user.get('emergency_contact')
    }
    return jsonify({'success': True, 'user': user_obj})

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required
def update_profile():
    data = request.get_json() or {}
    name = data.get('name')
    phone = data.get('phone')
    date_of_birth = data.get('dateOfBirth')
    gender = data.get('gender')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    pincode = data.get('pincode')
    emergency_contact = data.get('emergencyContact')
    profile_image = data.get('profileImage')

    user_id = g.user_id

    if name is not None or phone is not None:
        execute(
            """UPDATE users
               SET name = COALESCE(?, name),
                   phone = COALESCE(?, phone),
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (name, phone, user_id)
        )

    execute(
        """INSERT INTO customer_profiles (id, user_id, date_of_birth, gender, address, city, state, pincode, emergency_contact, profile_image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
               date_of_birth = COALESCE(excluded.date_of_birth, customer_profiles.date_of_birth),
               gender = COALESCE(excluded.gender, customer_profiles.gender),
               address = COALESCE(excluded.address, customer_profiles.address),
               city = COALESCE(excluded.city, customer_profiles.city),
               state = COALESCE(excluded.state, customer_profiles.state),
               pincode = COALESCE(excluded.pincode, customer_profiles.pincode),
               emergency_contact = COALESCE(excluded.emergency_contact, customer_profiles.emergency_contact),
               profile_image = COALESCE(excluded.profile_image, customer_profiles.profile_image),
               updated_at = CURRENT_TIMESTAMP""",
        (f"prof_{int(time.time()*1000)}", user_id, date_of_birth, gender, address, city, state, pincode, emergency_contact, profile_image)
    )

    updated = query_one(
        """SELECT u.*, p.profile_image, p.date_of_birth, p.gender, p.address, p.city, p.state, p.pincode, p.emergency_contact
           FROM users u
           LEFT JOIN customer_profiles p ON u.id = p.user_id
           WHERE u.id = ?""",
        (user_id,)
    )

    return jsonify({
        'success': True,
        'message': 'Profile updated successfully.',
        'user': {
            'id': updated['id'],
            'name': updated['name'],
            'email': updated['email'],
            'phone': updated['phone'],
            'role': updated['role'],
            'profileImage': updated.get('profile_image'),
            'dateOfBirth': updated.get('date_of_birth'),
            'gender': updated.get('gender'),
            'address': updated.get('address'),
            'city': updated.get('city'),
            'state': updated.get('state'),
            'pincode': updated.get('pincode'),
            'emergencyContact': updated.get('emergency_contact')
        }
    })

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    # Always return the same result to prevent account enumeration.
    user = query_one("SELECT id FROM users WHERE email = ? AND status = 'ACTIVE'", (email,))
    if user:
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        execute("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL", (user['id'],))
        execute(
            "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
            (f"rst_{secrets.token_hex(12)}", user['id'], token_hash,
             (datetime.now(timezone.utc) + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S'))
        )
        # Mail delivery belongs to the deployment integration. Tokens are never
        # returned in an API response or logged.
    return jsonify({
        'success': True,
        'message': 'If an active account exists, a password reset link has been sent.'
    })

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token = data.get('token') or ''
    password = data.get('password') or ''
    if not token or len(password) < 10 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
        return jsonify({'success': False, 'message': 'Reset token and a strong password are required.'}), 400
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    record = query_one("SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP", (token_hash,))
    if not record:
        return jsonify({'success': False, 'message': 'This reset link is invalid or has expired.'}), 400
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    execute('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (password_hash, record['user_id']))
    execute('UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?', (record['id'],))
    return jsonify({
        'success': True,
        'message': 'Password has been reset successfully. Please login with your new password.'
    })
