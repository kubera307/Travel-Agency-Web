import time
from flask import Blueprint, request, jsonify, g
from services.payment_service import PaymentService
from database.db import query_one, query_all
from middleware.auth import jwt_required

payment_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payment_bp.route('/create-order', methods=['POST'])
@jwt_required
def create_order():
    data = request.get_json() or {}
    booking_id = data.get('bookingId') or data.get('booking_id')
    method = data.get('paymentMethod') or 'online'

    if not booking_id:
        return jsonify({'success': False, 'message': 'Booking ID is required.'}), 400

    booking = query_one('SELECT user_id, grand_total, booking_status, payment_status FROM bookings WHERE id = ?', (booking_id,))
    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found.'}), 404

    if g.user['role'] not in ['ADMIN', 'STAFF'] and booking['user_id'] != g.user_id:
        return jsonify({'success': False, 'message': 'Access denied to this booking.'}), 403

    try:
        order = PaymentService.create_order(booking_id, method)
        return jsonify({'success': True, 'data': order})
    except ValueError as error:
        return jsonify({'success': False, 'message': str(error)}), 400
    except Exception as exc:
        return jsonify({'success': False, 'message': 'Internal payment order error.'}), 500

@payment_bp.route('/order/<booking_id>', methods=['GET'])
@jwt_required
def get_or_create_order(booking_id):
    booking = query_one('SELECT * FROM bookings WHERE id = ?', (booking_id,))
    if not booking:
        return jsonify({'success': False, 'message': 'Booking not found.'}), 404

    if g.user['role'] not in ['ADMIN', 'STAFF'] and booking['user_id'] != g.user_id:
        return jsonify({'success': False, 'message': 'Access denied to this booking.'}), 403

    if booking['payment_status'] == 'PAID':
        return jsonify({
            'success': True,
            'alreadyPaid': True,
            'message': 'Booking is already paid.',
            'booking': booking
        })

    try:
        order = PaymentService.create_order(booking_id, 'online')
        return jsonify({'success': True, 'data': order})
    except ValueError as error:
        return jsonify({'success': False, 'message': str(error)}), 400

@payment_bp.route('/verify', methods=['POST'])
@jwt_required
def verify_payment():
    data = request.get_json() or {}
    payment_id = data.get('paymentId') or data.get('payment_id')
    transaction_id = data.get('transactionId') or data.get('transaction_id')
    method = data.get('paymentMethod') or 'upi_qr'
    signature = data.get('signature')
    payment_details = data.get('paymentDetails') or data.get('payment_details')

    if not payment_id:
        return jsonify({'success': False, 'message': 'Payment ID is required.'}), 400

    payment = query_one(
        """SELECT p.*, b.user_id, b.booking_status, b.payment_status 
           FROM payments p 
           JOIN bookings b ON b.id = p.booking_id 
           WHERE p.id = ?""",
        (payment_id,)
    )

    if not payment:
        return jsonify({'success': False, 'message': 'Payment not found.'}), 404

    if g.user['role'] not in ['ADMIN', 'STAFF'] and payment['user_id'] != g.user_id:
        return jsonify({'success': False, 'message': 'Unauthorized payment attempt.'}), 403

    try:
        res = PaymentService.verify_payment(
            payment_id=payment_id,
            transaction_id=transaction_id,
            payment_method=method,
            signature=signature,
            payment_details=payment_details
        )
        return jsonify(res)
    except ValueError as error:
        return jsonify({'success': False, 'message': str(error)}), 400
    except Exception as exc:
        print("ERROR in verify_payment:", str(exc))
        return jsonify({'success': False, 'message': f'Payment verification failed: {str(exc)}'}), 500
