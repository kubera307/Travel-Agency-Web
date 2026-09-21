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

    return {
        'bookingNumber': booking.get('booking_number'),
        'qrHash': qr_hash,
        'tourTitle': tour.get('title') if tour else booking.get('tour_title'),
        'departureDate': booking.get('departure_date'),
        'pickupPoint': booking.get('pickup_point'),
        'guideLanguage': booking.get('guide_language', 'English & Hindi'),
        'travellers': travellers,
        'assignedDriver': driver_info or {
            'name': 'Verified Sarathi Partner',
            'phone': '+91 98000 12345',
            'vehicle': 'Clean Commercial AC Vehicle',
            'badge': 'Verified Sarathi Guide',
            'rating': 4.95
        },
        'fareBreakdown': {
            'subtotal': booking.get('subtotal'),
            'discount': booking.get('discount', 0),
            'tax': booking.get('tax', 0),
            'addOnTotal': booking.get('add_on_total', 0),
            'grandTotal': booking.get('grand_total')
        },
        'directDriverPayment': {
            'status': 'SETTLED',
            'commissionDeducted': '₹0 (0%)',
            'driverShare': f"₹{booking.get('grand_total')}"
        },
        'status': booking.get('booking_status', 'CONFIRMED'),
        'emergencyHelpline': '1800-BHARAT / +91 98765 43210'
    }

