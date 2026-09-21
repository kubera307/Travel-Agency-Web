import time
from flask import Blueprint, request, jsonify, g
from database.db import query_all, execute
from middleware.auth import optional_jwt, admin_required

enquiry_bp = Blueprint('enquiries', __name__, url_prefix='/api/enquiries')

@enquiry_bp.route('', methods=['POST'])
@optional_jwt
def create_enquiry():
    data = request.get_json() or {}
    name = (data.get('name') or data.get('fullName') or '').strip()
    email = (data.get('email') or '').lower().strip()
    phone = (data.get('phone') or '').strip()
    destination = (data.get('destination') or data.get('destinationState') or '').strip()
    travel_dates = (data.get('travelDates') or data.get('dates') or '').strip()
    traveller_count = int(data.get('travellerCount') or data.get('guests') or 1)
    budget = (data.get('budget') or data.get('budgetRange') or '').strip()
    message = (data.get('message') or data.get('specialRequests') or '').strip()

    if not name or not email:
        return jsonify({'success': False, 'message': 'Name and email are required.'}), 400

    enquiry_id = f"enq_{int(time.time() * 1000)}"
    user_id = g.user_id if hasattr(g, 'user_id') and g.user_id else None

    execute(
        """INSERT INTO enquiries (id, name, email, phone, destination, trip_type, travel_date, travellers_count, budget, message, status)
           VALUES (?, ?, ?, ?, ?, 'custom_atoz', ?, ?, ?, ?, 'NEW')""",
        (enquiry_id, name, email, phone, destination, travel_dates, traveller_count, budget, message)
    )

    print(f"\n======================================================")
    print(f"[MAIL] [CUSTOM TRIP ACKNOWLEDGEMENT - FLASK]")
    print(f"To      : {email} ({name})")
    print(f"Subject : Custom Trip Enquiry Received - Travel India")
    print(f"Destination: {destination}, Budget: {budget}")
    print(f"======================================================\n")

    return jsonify({
        'success': True,
        'message': 'Your custom trip enquiry has been submitted. Our trip coordinator will contact you within 2 hours!'
    }), 201

@enquiry_bp.route('', methods=['GET'])
@admin_required
def get_enquiries():
    enquiries = query_all("SELECT * FROM enquiries ORDER BY created_at DESC")
    return jsonify({'success': True, 'data': enquiries})
