import json
import unittest
import sys
from app import create_app

class TestTravelIndiaFlaskAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'OK')
        self.assertEqual(data.get('database'), 'healthy')
        print("  [PASS] Flask Health Check API returns OK & healthy DB")

    def test_02_tours_search(self):
        res = self.client.get('/api/tours?search=kashmir')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertGreater(len(data.get('data', [])), 0)
        print("  [PASS] Tours Search returns matching Kashmir packages")

    def test_03_destinations_listing(self):
        res = self.client.get('/api/destinations')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertGreaterEqual(len(data.get('data', [])), 20)
        print(f"  [PASS] Destinations listing returns {len(data.get('data', []))} active destinations")

    def test_04_customer_login(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'rahul@example.com',
            'password': 'Customer@1234'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], 'CUSTOMER')
        TestTravelIndiaFlaskAPI.customer_token = data['token']
        print("  [PASS] Customer Login successful with JWT issued")

    def test_05_admin_login(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'admin@travelindia.com',
            'password': 'Admin@1234'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], 'ADMIN')
        TestTravelIndiaFlaskAPI.admin_token = data['token']
        print("  [PASS] Admin Login successful with ADMIN role")

    def test_06_rbac_protection(self):
        res = self.client.get('/api/admin/dashboard', headers={
            'Authorization': f"Bearer {self.customer_token}"
        })
        self.assertEqual(res.status_code, 403)
        print("  [PASS] Customer is rejected (403) from Admin Dashboard")

    def test_07_admin_dashboard_access(self):
        res = self.client.get('/api/admin/dashboard', headers={
            'Authorization': f"Bearer {self.admin_token}"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn('totalRevenue', data['data'])
        print("  [PASS] Admin successfully accesses Admin Dashboard stats")

    def test_08_get_me_profile(self):
        res = self.client.get('/api/auth/me', headers={
            'Authorization': f"Bearer {self.customer_token}"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertEqual(data['user']['email'], 'rahul@example.com')
        print("  [PASS] Customer fetches profile via /api/auth/me")

    def test_09_validate_coupon(self):
        res = self.client.post('/api/bookings/validate-coupon', json={
            'code': 'WELCOME10',
            'amount': 2000
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertEqual(data['coupon']['calculatedDiscount'], 200.0)
        print("  [PASS] Coupon validation for WELCOME10 calculated 200 INR discount")

    def test_10_custom_trip_enquiry(self):
        res = self.client.post('/api/enquiries', json={
            'name': 'Anita Roy',
            'email': 'anita@example.com',
            'phone': '+91 99887 76655',
            'destination': 'Rajasthan Heritage',
            'budget': '40,000 - 60,000 INR',
            'message': 'Looking for private palace tours in Udaipur and Jaipur'
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        print("  [PASS] Custom A-to-Z Trip enquiry submitted successfully")

if __name__ == '__main__':
    print("=" * 60)
    print("[*] Starting Travel India Flask API Integration Tests...")
    print("=" * 60)
    unittest.main()

