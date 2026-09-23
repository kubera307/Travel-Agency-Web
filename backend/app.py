import os
from pathlib import Path
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from config import Config
from database.db import close_db, query_all, query_one
from database.migrations import upgrade

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.destination_routes import dest_bp
from routes.tour_routes import tour_bp
from routes.booking_routes import booking_bp
from routes.payment_routes import payment_bp
from routes.review_routes import review_bp
from routes.favourite_routes import favourite_bp
from routes.enquiry_routes import enquiry_bp
from routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__, static_folder=str(Config.CLIENT_DIST))
    if not Config.JWT_SECRET and not Config.DEBUG:
        raise RuntimeError('JWT_SECRET must be set when FLASK_ENV is not development.')
    if not Config.JWT_SECRET:
        # Only development receives an ephemeral secret; it intentionally
        # invalidates sessions at every restart and is never a production default.
        Config.JWT_SECRET = os.urandom(32).hex()
    app.config.update(MAX_CONTENT_LENGTH=1 * 1024 * 1024)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})
    with app.app_context():
        upgrade()

    # Teardown database connection after request
    app.teardown_appcontext(close_db)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dest_bp)
    app.register_blueprint(tour_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(favourite_bp)
    app.register_blueprint(enquiry_bp)
    app.register_blueprint(admin_bp)

    # Health Check API
    @app.route('/api/health', methods=['GET'])
    def health_check():
        db_ok = True
        try:
            query_one("SELECT 1")
        except Exception:
            db_ok = False

        return jsonify({
            'status': 'OK',
            'server': 'Flask / Python 3.12',
            'platform': 'Travel India Open Mobility Platform',
            'database': 'healthy' if db_ok else 'unhealthy'
        })

    # FAQs API
    @app.route('/api/faqs', methods=['GET'])
    def get_faqs():
        faqs = query_all("SELECT * FROM faqs WHERE status = 'ACTIVE' ORDER BY sort_order ASC")
        return jsonify({'success': True, 'data': faqs})

    # Serve React client build in production
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('api/'):
            return jsonify({'success': False, 'message': 'API endpoint not found'}), 404

        dist_path = Path(Config.CLIENT_DIST)
        if dist_path.exists():
            file_path = dist_path / path
            if file_path.is_file():
                return send_from_directory(str(dist_path), path)
            return send_from_directory(str(dist_path), 'index.html')

        return jsonify({
            'message': 'Travel India Flask API running. Build client assets (npm --prefix client run build) to serve UI from Flask.'
        })

    return app

if __name__ == '__main__':
    app = create_app()
    print("=" * 60)
    print(">> TRAVEL INDIA - PYTHON FLASK BACKEND")
    print(f"[*] API Port     : http://localhost:{Config.PORT}/api")
    print(f"[*] Database     : {Config.DB_PATH}")
    print(f"[*] Admin Login  : admin@travelindia.com / Admin@1234")
    print(f"[*] Cust Login   : rahul@example.com / Customer@1234")
    print("=" * 60)
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
