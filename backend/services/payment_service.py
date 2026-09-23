import time
import json
from config import Config
from database.db import execute, query_one

class PaymentService:
    @staticmethod
    def create_order(booking_id, payment_method='mock'):
        booking = query_one("SELECT id, grand_total, booking_status, payment_status FROM bookings WHERE id = ?", (booking_id,))
        if not booking:
            raise ValueError('Booking not found.')
        if booking['booking_status'] != 'PENDING' or booking['payment_status'] != 'PENDING':
            raise ValueError('This booking cannot accept a new payment.')
        amount = float(booking['grand_total'])
        order_id = f"order_{int(time.time() * 1000)}"
        payment_id = f"pay_{int(time.time() * 1000)}"

        execute(
            """INSERT INTO payments (id, booking_id, transaction_id, provider, amount, status, payment_method, metadata)
               VALUES (?, ?, ?, ?, ?, 'INITIATED', ?, ?)""",
            (payment_id, booking_id, order_id, Config.PAYMENT_MODE, amount, payment_method, json.dumps({'order_id': order_id}))
        )

        return {
            'orderId': order_id,
            'paymentId': payment_id,
            'amount': amount,
            'currency': 'INR',
            'mode': Config.PAYMENT_MODE,
            'autoApprove': Config.MOCK_PAYMENT_AUTO_APPROVE
        }

    @staticmethod
    def verify_payment(payment_id, transaction_id, payment_method='upi_qr'):
        """Mock verification only. A real provider must verify its signature/webhook here."""
        payment = query_one("SELECT * FROM payments WHERE id = ?", (payment_id,))
        if not payment:
            raise ValueError('Payment not found.')
        if payment['status'] == 'SUCCESSFUL':
            return {'success': True, 'payment': payment}
        if Config.PAYMENT_MODE != 'mock':
            raise ValueError('Provider verification is required in production mode.')
        if not Config.MOCK_PAYMENT_AUTO_APPROVE:
            raise ValueError('Mock auto approval is disabled. Mark payment through an approved test workflow.')
        execute(
            """UPDATE payments
               SET status = 'SUCCESSFUL',
                   transaction_id = ?,
                   payment_method = ?,
                   paid_at = CURRENT_TIMESTAMP
               WHERE id = ? AND status IN ('INITIATED', 'PENDING')""",
            (transaction_id, payment_method, payment_id)
        )

        payment = query_one("SELECT * FROM payments WHERE id = ?", (payment_id,))
        if payment:
            execute(
                """UPDATE bookings
                   SET payment_status = 'PAID',
                       booking_status = 'CONFIRMED',
                       updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (payment['booking_id'],)
            )

        return {'success': True, 'payment': payment}
