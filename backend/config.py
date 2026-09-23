import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

class Config:
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('FLASK_ENV', 'development').lower() == 'development'
    # A production process must explicitly provide this secret.  A predictable
    # default turns every issued token into a forgery risk.
    JWT_SECRET = os.getenv('JWT_SECRET')
    JWT_EXPIRES_MINUTES = int(os.getenv('JWT_EXPIRES_MINUTES', '30'))
    DB_PATH = BASE_DIR / 'database' / 'travel_india.sqlite'
    CLIENT_DIST = BASE_DIR / 'frontend' / 'dist'
    PAYMENT_MODE = os.getenv('PAYMENT_MODE', 'mock')
    MOCK_PAYMENT_AUTO_APPROVE = os.getenv('MOCK_PAYMENT_AUTO_APPROVE', 'false').lower() == 'true'
    CORS_ORIGINS = [origin.strip() for origin in os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',') if origin.strip()]
    SUPPORT_EMAIL = os.getenv('SUPPORT_EMAIL', '')
    HELPLINE_NUMBER = os.getenv('BUSINESS_PHONE', '')
    WHATSAPP_NUMBER = os.getenv('WHATSAPP_NUMBER', '')
