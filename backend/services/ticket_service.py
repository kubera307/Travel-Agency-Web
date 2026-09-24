import hashlib
import json

def generate_ticket(booking, tour, travellers, payment):
    qr_payload = f"TRAVELINDIA:{booking.get('booking_number')}:{booking.get('departure_date')}:{booking.get('grand_total')}"
    qr_hash = hashlib.sha256(qr_payload.encode('utf-8')).hexdigest()[:16].upper()

    driver_info = None
    if booking.get('assigned_driver'):
        try:
            driver_info = json.loads(booking['assigned_driver']) if isinstance(booking['assigned_driver'], str) else booking['assigned_driver']
        except Exception:
            driver_info = None

    assigned_driver = driver_info or {
        'name': 'Verified Sarathi Partner',
        'phone': '+91 98000 12345',
        'vehicle': booking.get('vehicle_type') or 'Clean Commercial AC Vehicle',
        'badge': 'Verified Sarathi Guide',
        'rating': 4.95
    }

    tour_title = tour.get('title') if tour else booking.get('tour_title') or 'Incredible India Expedition'
    tour_tagline = tour.get('tagline') if tour else booking.get('tagline') or 'Direct Sarathi Verified Heritage Journey'
    duration_str = f"{booking.get('duration_days') or 1} Days / {booking.get('duration_nights') or 0} Nights" if booking.get('duration_days') else (tour.get('duration') if tour else 'Flexible Duration')

    payment_info = {}
    if isinstance(payment, dict):
        payment_info = payment
    elif isinstance(payment, list) and len(payment) > 0:
        payment_info = payment[0]

    return {
        'bookingId': booking.get('id'),
        'bookingNumber': booking.get('booking_number'),
        'ticketNumber': booking.get('booking_number'),
        'qrHash': qr_hash,
        'verificationCode': f"TI-{qr_hash}",
        'tourTitle': tour_title,
        'tour': {
            'title': tour_title,
            'tagline': tour_tagline,
            'duration': duration_str,
            'vehicleType': assigned_driver.get('vehicle') or booking.get('vehicle_type') or 'Private AC Sedan'
        },
        'schedule': {
            'departureDate': booking.get('departure_date'),
            'pickupPoint': booking.get('pickup_point') or 'Doorstep / City Center',
            'guideLanguage': booking.get('guide_language', 'English & Hindi')
        },
        'driver': assigned_driver,
        'departureDate': booking.get('departure_date'),
        'pickupPoint': booking.get('pickup_point'),
        'guideLanguage': booking.get('guide_language', 'English & Hindi'),
        'travellers': travellers or [],
        'assignedDriver': assigned_driver,
        'fareBreakdown': {
            'subtotal': booking.get('subtotal'),
            'discount': booking.get('discount', 0),
            'tax': booking.get('tax', 0),
            'addOnTotal': booking.get('add_on_total', 0),
            'grandTotal': booking.get('grand_total')
        },
        'pricing': {
            'subtotal': float(booking.get('subtotal') or 0),
            'discount': float(booking.get('discount') or 0),
            'couponCode': booking.get('coupon_code') or 'DIRECT',
            'tax': float(booking.get('tax') or 0),
            'grandTotal': float(booking.get('grand_total') or 0)
        },
        'payment': {
            'status': booking.get('payment_status', 'PENDING'),
            'transactionId': payment_info.get('transaction_id') or booking.get('payment_transaction_id') or f"TXN_{qr_hash[:10]}",
            'paymentMethod': payment_info.get('payment_method') or 'ONLINE',
            'paidAt': payment_info.get('paid_at') or booking.get('updated_at')
        },
        'directDriverPayment': {
            'status': 'SETTLED' if booking.get('payment_status') == 'PAID' else 'PENDING',
            'commissionDeducted': '₹0 (0%)',
            'driverShare': f"₹{booking.get('grand_total')}"
        },
        'status': booking.get('booking_status', 'CONFIRMED'),
        'emergencyHelpline': '1800-BHARAT / +91 98765 43210'
    }

