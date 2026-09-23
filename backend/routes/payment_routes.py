import time
from flask import Blueprint, request, jsonify, g
from services.payment_service import PaymentService
from database.db import query_one
from middleware.auth import jwt_required

payment_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payment_bp.route('/create-order', methods=['POST'])
@jwt_required
def create_order():
    data = request.get_json() or {}
    booking_id = data.get('bookingId') or data.get('booking_id')
    method = data.get('paymentMethod') or 'mock'

    if not booking_id:
        return jsonify({'success': False, 'message': 'Booking ID is required.'}), 400
    booking = query_one('SELECT user_id FROM bookings WHERE id = ?', (booking_id,))
    if not booking or (g.user['role'] not in ['ADMIN', 'STAFF'] and booking['user_id'] != g.user_id):
        return jsonify({'success': False, 'message': 'Booking not found.'}), 404

    try:
        order = PaymentService.create_order(booking_id, method)
        return jsonify({'success': True, 'data': order})
    except ValueError as error:
        return jsonify({'success': False, 'message': str(error)}), 400

@payment_bp.route('/verify', methods=['POST'])
@jwt_required
def verify_payment():
    data = request.get_json() or {}
    payment_id = data.get('paymentId') or data.get('payment_id')
    transaction_id = data.get('transactionId') or data.get('transaction_id') or f"TXN_{int(time.time())}"
    method = data.get('paymentMethod') or 'upi_qr'

    if not payment_id:
        return jsonify({'success': False, 'message': 'Payment ID is required.'}), 400

    payment = query_one('SELECT p.*, b.user_id FROM payments p JOIN bookings b ON b.id = p.booking_id WHERE p.id = ?', (payment_id,))
    if not payment or (g.user['role'] not in ['ADMIN', 'STAFF'] and payment['user_id'] != g.user_id):
        return jsonify({'success': False, 'message': 'Payment not found.'}), 404
    try:
        return jsonify(PaymentService.verify_payment(payment_id, transaction_id, method))
    except ValueError as error:
        return jsonify({'success': False, 'message': str(error)}), 400
