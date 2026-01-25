#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class BreatheEasyAPITester:
    def __init__(self, base_url="https://breatheasy-25.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = self.session.headers.copy()
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.text.strip() else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("Root endpoint", "GET", "api/", 200)
        
        # Test health endpoint
        self.run_test("Health check", "GET", "api/health", 200)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION ENDPOINTS")
        print("="*50)
        
        # Generate unique test user
        timestamp = datetime.now().strftime('%H%M%S')
        test_email = f"test_user_{timestamp}@example.com"
        test_password = "TestPass123!"
        test_name = f"Test User {timestamp}"

        # Test user registration
        register_data = {
            "email": test_email,
            "password": test_password,
            "name": test_name
        }
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data=register_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('user_id')
            print(f"   Registered user ID: {self.user_id}")

        # Test user login
        login_data = {
            "email": test_email,
            "password": test_password
        }
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Login token received")

        # Test get current user (requires auth)
        if self.token:
            self.run_test("Get Current User", "GET", "api/auth/me", 200)

    def test_courses_endpoints(self):
        """Test courses endpoints"""
        print("\n" + "="*50)
        print("TESTING COURSES ENDPOINTS")
        print("="*50)
        
        # Test get all courses
        success, courses_response = self.run_test("Get All Courses", "GET", "api/courses", 200)
        
        if success and courses_response:
            courses = courses_response if isinstance(courses_response, list) else []
            print(f"   Found {len(courses)} courses")
            
            # Test get specific course if courses exist
            if courses:
                course_id = courses[0].get('id')
                if course_id:
                    self.run_test(f"Get Course Details", "GET", f"api/courses/{course_id}", 200)
                    
                    # Test get lesson (might require premium)
                    self.run_test(
                        f"Get Lesson Content", 
                        "GET", 
                        f"api/courses/{course_id}/lessons/what-is-panic", 
                        200  # Should work for free lessons
                    )

    def test_subscription_endpoints(self):
        """Test subscription endpoints"""
        print("\n" + "="*50)
        print("TESTING SUBSCRIPTION ENDPOINTS")
        print("="*50)
        
        # Test get subscription plans
        self.run_test("Get Subscription Plans", "GET", "api/subscriptions/plans", 200)

    def test_user_settings_endpoints(self):
        """Test user settings endpoints"""
        print("\n" + "="*50)
        print("TESTING USER SETTINGS ENDPOINTS")
        print("="*50)
        
        # Test get user settings (works without auth - returns defaults)
        self.run_test("Get User Settings (Guest)", "GET", "api/users/settings", 200)
        
        # Test update user settings (requires auth)
        if self.token:
            settings_data = {
                "vibration_enabled": True,
                "sound_enabled": False,
                "voice_guidance_enabled": True,
                "default_breathing_preset": "5m"
            }
            self.run_test(
                "Update User Settings",
                "PUT",
                "api/users/settings",
                200,
                data=settings_data
            )

    def test_panic_session_endpoints(self):
        """Test panic session endpoints"""
        print("\n" + "="*50)
        print("TESTING PANIC SESSION ENDPOINTS")
        print("="*50)
        
        # Test create panic session (works without auth)
        session_data = {
            "user_id": self.user_id,
            "helpful_items": ["breathing", "grounding"],
            "duration_seconds": 120
        }
        self.run_test(
            "Create Panic Session",
            "POST",
            "api/panic-sessions",
            200,
            data=session_data
        )
        
        # Test get panic sessions (requires auth)
        if self.token:
            self.run_test("Get Panic Sessions", "GET", "api/panic-sessions", 200)

    def test_error_cases(self):
        """Test error handling"""
        print("\n" + "="*50)
        print("TESTING ERROR CASES")
        print("="*50)
        
        # Test invalid login
        invalid_login = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        self.run_test(
            "Invalid Login",
            "POST",
            "api/auth/login",
            401,
            data=invalid_login
        )
        
        # Test duplicate registration
        if hasattr(self, 'test_email'):
            duplicate_register = {
                "email": self.test_email,
                "password": "TestPass123!",
                "name": "Duplicate User"
            }
            self.run_test(
                "Duplicate Registration",
                "POST",
                "api/auth/register",
                400,
                data=duplicate_register
            )
        
        # Test invalid course
        self.run_test("Invalid Course", "GET", "api/courses/nonexistent", 404)
        
        # Test protected endpoint without auth
        old_token = self.token
        self.token = None
        self.run_test("Protected Endpoint No Auth", "GET", "api/panic-sessions", 401)
        self.token = old_token

def main():
    print("🚀 Starting BreatheEasy API Tests")
    print("=" * 60)
    
    tester = BreatheEasyAPITester()
    
    # Run all test suites
    tester.test_health_endpoints()
    tester.test_auth_endpoints()
    tester.test_courses_endpoints()
    tester.test_subscription_endpoints()
    tester.test_user_settings_endpoints()
    tester.test_panic_session_endpoints()
    tester.test_error_cases()
    
    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS")
    print("="*60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())