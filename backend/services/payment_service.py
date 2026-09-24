import time
import json
import hmac
import hashlib
from datetime import datetime, timezone
from config import Config
from database.db import execute, query_one, query_all
from services.ticket_service import generate_ticket

class PaymentService:
    @staticmethod
    def _compute_signature(order_id, payment_id, booking_id, amount, currency='INR'):
        secret = Config.JWT_SECRET or "travel_india_payment_hmac_secret_2026"
        payload = f"{order_id}|{payment_id}|{booking_id}|{float(amount):.2f}|{currency}"
        return hmac.new(secret.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()

    @staticmethod
    def create_order(booking_id, payment_method='online'):
        booking = query_one("SELECT id, grand_total, booking_status, payment_status FROM bookings WHERE id = ?", (booking_id,))
        if not booking:
            raise ValueError('Booking not found.')
        if booking['booking_status'] == 'CONFIRMED' or booking['payment_status'] == 'PAID':
            raise ValueError('This booking has already been paid and confirmed.')
        if booking['booking_status'] == 'CANCELLED':
            raise ValueError('This booking has been cancelled and cannot accept payment.')

        amount = float(booking['grand_total'])
        now_ts = int(time.time())

        # Check for an active initiated order created within the last 15 minutes
        existing_payment = query_one(
            """SELECT * FROM payments 
               WHERE booking_id = ? AND status = 'INITIATED' 
               ORDER BY created_at DESC LIMIT 1""",
            (booking_id,)
        )

        if existing_payment:
            try:
                meta = json.loads(existing_payment['metadata']) if existing_payment.get('metadata') else {}
                expires_at = meta.get('expires_at', 0)
                if expires_at > now_ts:
                    order_id = meta.get('order_id') or existing_payment['transaction_id']
                    signature = meta.get('signature') or PaymentService._compute_signature(
                        order_id, existing_payment['id'], booking_id, amount
                    )
                    return {
                        'orderId': order_id,
                        'paymentId': existing_payment['id'],
                        'bookingId': booking_id,
                        'amount': amount,
                        'currency': 'INR',
                        'signature': signature,
                        'expiresAt': expires_at,
                        'mode': 'secure_gateway',
                        'securityStandard': 'HMAC-SHA256 / 256-Bit SSL'
                    }
            except Exception:
                pass

        order_id = f"order_{int(now_ts * 1000)}"
        payment_id = f"pay_{int(now_ts * 1000)}"
        expires_at = now_ts + 900 # 15 minutes validity matching seat reservation
        signature = PaymentService._compute_signature(order_id, payment_id, booking_id, amount)

        metadata = json.dumps({
            'order_id': order_id,
            'signature': signature,
            'expires_at': expires_at,
            'created_at_ts': now_ts,
            'security_protocol': 'HMAC-SHA256'
        })

        execute(
            """INSERT INTO payments (id, booking_id, transaction_id, provider, amount, status, payment_method, metadata)
               VALUES (?, ?, ?, 'secure_gateway', ?, 'INITIATED', ?, ?)""",
            (payment_id, booking_id, order_id, amount, payment_method, metadata)
        )

        return {
            'orderId': order_id,
            'paymentId': payment_id,
            'bookingId': booking_id,
            'amount': amount,
            'currency': 'INR',
            'signature': signature,
            'expiresAt': expires_at,
            'mode': 'secure_gateway',
            'securityStandard': 'HMAC-SHA256 / 256-Bit SSL'
        }

    @staticmethod
    def verify_payment(payment_id, transaction_id, payment_method='upi_qr', signature=None, payment_details=None):
        payment = query_one("SELECT * FROM payments WHERE id = ?", (payment_id,))
        if not payment:
            raise ValueError('Payment record not found.')

        booking = query_one("SELECT * FROM bookings WHERE id = ?", (payment['booking_id'],))
        if not booking:
            raise ValueError('Associated booking record not found.')

        # Idempotency check: if payment already marked successful, return existing confirmed ticket
        if payment['status'] == 'SUCCESSFUL' and booking['payment_status'] == 'PAID':
            travellers = query_all("SELECT * FROM travellers WHERE booking_id = ?", (booking['id'],))
            tour = query_one("SELECT * FROM tours WHERE id = ?", (booking['tour_id'],))
            ticket = generate_ticket(booking, tour, travellers, payment)
            return {
                'success': True,
                'alreadyConfirmed': True,
                'payment': payment,
                'booking': booking,
                'ticket': ticket
            }

        if booking['booking_status'] == 'CANCELLED':
            raise ValueError('This booking has been cancelled.')

        # Metadata extraction
        meta = {}
        try:
            meta = json.loads(payment['metadata']) if payment.get('metadata') else {}
        except Exception:
            meta = {}

        order_id = meta.get('order_id') or payment['transaction_id']
        expected_sig = PaymentService._compute_signature(order_id, payment_id, booking['id'], float(payment['amount']))

        # Cryptographic Signature Verification (Constant-Time)
        if signature:
            if not hmac.compare_digest(expected_sig, signature):
                raise ValueError('Invalid cryptographic payment signature. Tampering detected.')
        elif meta.get('signature'):
            if not hmac.compare_digest(expected_sig, meta['signature']):
                raise ValueError('Stored payment signature validation failed.')

        # Session expiry verification (15-min reservation with 15-min grace period)
        expires_at = meta.get('expires_at')
        if expires_at and time.time() > (expires_at + 900):
            raise ValueError('Payment reservation window has expired. Please re-initiate booking.')

        # Normalize unique transaction ID
        final_txn = transaction_id or f"TXN_{time.strftime('%Y%m%d%H%M%S')}_{hashlib.sha256(str(time.time()).encode()).hexdigest()[:8].upper()}"

        collision = query_one("SELECT id FROM payments WHERE transaction_id = ? AND id != ?", (final_txn, payment_id))
        if collision:
            raise ValueError('Transaction ID has already been recorded for another payment.')

        # Record verified payment telemetry
        meta['verified_at'] = datetime.now(timezone.utc).isoformat()
        meta['payment_details'] = payment_details or {}
        meta_json = json.dumps(meta)

        # Atomic state updates
        execute(
            """UPDATE payments
               SET status = 'SUCCESSFUL',
                   transaction_id = ?,
                   payment_method = ?,
                   paid_at = CURRENT_TIMESTAMP,
                   metadata = ?
               WHERE id = ? AND status IN ('INITIATED', 'PENDING')""",
            (final_txn, payment_method, meta_json, payment_id)
        )

        execute(
            """UPDATE bookings
               SET payment_status = 'PAID',
                   booking_status = 'CONFIRMED',
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (booking['id'],)
        )

        execute(
            """UPDATE seat_reservations 
               SET status = 'CONSUMED' 
               WHERE booking_id = ?""",
            (booking['id'],)
        )

        # Audit notification
        execute(
            """INSERT INTO notifications (id, user_id, title, message, type, link)
               VALUES (?, ?, ?, ?, 'BOOKING', ?)""",
            (
                f"notif_{int(time.time() * 1000)}",
                booking['user_id'],
                f"Payment Confirmed: ₹{float(payment['amount']):,.0f}",
                f"Payment verified via {payment_method.upper()}. Your Boarding Pass #{booking['booking_number']} is confirmed!",
                f"/customer/bookings/{booking['id']}"
            )
        )

        # Retrieve fresh confirmed records
        updated_payment = query_one("SELECT * FROM payments WHERE id = ?", (payment_id,))
        updated_booking = query_one("SELECT * FROM bookings WHERE id = ?", (booking['id'],))
        travellers = query_all("SELECT * FROM travellers WHERE booking_id = ?", (booking['id'],))
        tour = query_one("SELECT * FROM tours WHERE id = ?", (booking['tour_id'],))

        ticket = generate_ticket(updated_booking, tour, travellers, updated_payment)

        return {
            'success': True,
            'message': 'Payment successfully verified and confirmed.',
            'payment': updated_payment,
            'booking': updated_booking,
            'ticket': ticket
        }
