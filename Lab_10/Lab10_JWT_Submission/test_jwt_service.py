#!/usr/bin/env python3
"""
Unit and functional tests for the JWT Token Service
Lab 10: JWT
"""

import unittest
import json
import jwt
import time
import sys
import os

# Add the parent directory to the path to import the server
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app
try:
    import my_server
    from my_server import app, revoked_tokens, SECRET_KEY
except ModuleNotFoundError:
    import importlib.util
    spec = importlib.util.spec_from_file_location("my_server", 
                                                   os.path.join(os.path.dirname(__file__), "my-server.py"))
    my_server = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(my_server)
    app = my_server.app
    revoked_tokens = my_server.revoked_tokens
    SECRET_KEY = my_server.SECRET_KEY


class TestJWTTokenService(unittest.TestCase):
    """Unit and functional tests for the JWT token service"""
    
    def setUp(self):
        """Set up test client and clear revoked tokens before each test"""
        self.app = app
        self.client = self.app.test_client()
        self.app.testing = True
        
        # Clear revoked tokens before each test
        revoked_tokens.clear()
    
    def tearDown(self):
        """Clean up after each test"""
        revoked_tokens.clear()
    
    # ========== Unit Tests for Token Generation ==========
    
    def test_generate_token_success(self):
        """Test successful JWT token generation"""
        user_id = 123
        response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        
        # Verify response structure
        self.assertIn('user_id', data)
        self.assertIn('token', data)
        self.assertIn('expires_in', data)
        self.assertEqual(data['user_id'], user_id)
        
        # Verify JWT can be decoded
        try:
            decoded = jwt.decode(data['token'], SECRET_KEY, algorithms=["HS256"])
            self.assertEqual(decoded['user_id'], user_id)
            self.assertIn('jti', decoded)
            self.assertIn('exp', decoded)
            jwt_valid = True
        except Exception:
            jwt_valid = False
        self.assertTrue(jwt_valid, "Generated token is not a valid JWT")
    
    def test_generate_token_custom_expiration(self):
        """Test token generation with custom expiration"""
        user_id = 456
        expires_in = 7200  # 2 hours
        response = self.client.post(
            '/generate-token',
            json={'user_id': user_id, 'expires_in': expires_in},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['expires_in'], expires_in)
    
    def test_generate_token_missing_user_id(self):
        """Test token generation with missing user_id field"""
        response = self.client.post(
            '/generate-token',
            json={},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
    
    def test_generate_token_no_json(self):
        """Test token generation with no JSON data"""
        response = self.client.post('/generate-token')
        
        self.assertEqual(response.status_code, 400)
    
    def test_generate_multiple_tokens_unique_jti(self):
        """Test that multiple tokens have unique JTI values"""
        user_id = 789
        tokens = []
        jtis = []
        
        for _ in range(5):
            response = self.client.post(
                '/generate-token',
                json={'user_id': user_id},
                content_type='application/json'
            )
            data = json.loads(response.data)
            token = data['token']
            tokens.append(token)
            
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            jtis.append(decoded['jti'])
        
        # All JTIs should be unique
        self.assertEqual(len(jtis), len(set(jtis)), "JTI values are not unique")
    
    # ========== Unit Tests for Token Verification ==========
    
    def test_verify_token_success(self):
        """Test successful token verification"""
        user_id = 111
        
        # Generate token
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        # Verify token
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 200)
        data = json.loads(verify_response.data)
        self.assertTrue(data['valid'])
        self.assertEqual(data['user_id'], user_id)
        self.assertIn('jti', data)
    
    def test_verify_token_with_user_id_match(self):
        """Test token verification with matching user_id"""
        user_id = 222
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token, 'user_id': user_id},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 200)
        data = json.loads(verify_response.data)
        self.assertTrue(data['valid'])
    
    def test_verify_token_with_user_id_mismatch(self):
        """Test token verification with mismatched user_id"""
        user_id = 333
        wrong_id = 999
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token, 'user_id': wrong_id},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 401)
        data = json.loads(verify_response.data)
        self.assertFalse(data['valid'])
    
    def test_verify_invalid_token(self):
        """Test verification of invalid token"""
        invalid_token = "invalid.token.here"
        
        response = self.client.post(
            '/verify-token',
            json={'token': invalid_token},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['valid'])
    
    def test_verify_token_missing_token_field(self):
        """Test verification without token field"""
        response = self.client.post(
            '/verify-token',
            json={},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
    
    def test_verify_expired_token(self):
        """Test verification of expired token"""
        user_id = 444
        
        # Generate token that expires in 1 second
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id, 'expires_in': 1},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        # Wait for token to expire
        time.sleep(2)
        
        # Try to verify expired token
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 401)
        data = json.loads(verify_response.data)
        self.assertFalse(data['valid'])
        self.assertIn('expired', data['message'].lower())
    
    # ========== Unit Tests for Login ==========
    
    def test_login_success_json(self):
        """Test successful login with JSON data"""
        user_id = 555
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        login_response = self.client.post(
            '/login',
            json={'user_id': user_id, 'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        data = json.loads(login_response.data)
        self.assertIn('Login successful', data['message'])
    
    def test_login_success_form_data(self):
        """Test successful login with form data"""
        user_id = 666
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        login_response = self.client.post(
            '/login',
            data={'user_id': str(user_id), 'token': token}
        )
        
        self.assertEqual(login_response.status_code, 200)
    
    def test_login_invalid_token(self):
        """Test login with invalid token"""
        response = self.client.post(
            '/login',
            json={'user_id': 777, 'token': 'invalid.token'},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
    
    def test_login_user_id_mismatch(self):
        """Test login with mismatched user_id"""
        user_id = 888
        wrong_id = 999
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        login_response = self.client.post(
            '/login',
            json={'user_id': wrong_id, 'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 401)
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = self.client.post(
            '/login',
            json={'user_id': 123},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
    
    # ========== Unit Tests for Token Revocation ==========
    
    def test_revoke_token_success(self):
        """Test successful token revocation"""
        user_id = 1111
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        revoke_response = self.client.post(
            '/revoke-token',
            json={'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(revoke_response.status_code, 200)
        data = json.loads(revoke_response.data)
        self.assertIn('revoked', data['message'].lower())
    
    def test_revoke_token_then_verify(self):
        """Test that revoked token fails verification"""
        user_id = 2222
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        # Revoke token
        self.client.post(
            '/revoke-token',
            json={'token': token},
            content_type='application/json'
        )
        
        # Try to verify revoked token
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 401)
        data = json.loads(verify_response.data)
        self.assertFalse(data['valid'])
        self.assertIn('revoked', data['message'].lower())
    
    def test_revoke_invalid_token(self):
        """Test revoking an invalid token"""
        response = self.client.post(
            '/revoke-token',
            json={'token': 'invalid.token'},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
    
    # ========== Functional Tests ==========
    
    def test_home_endpoint(self):
        """Test home endpoint"""
        response = self.client.get('/')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('endpoints', data)
    
    def test_complete_workflow(self):
        """Test complete workflow: generate → verify → login → revoke"""
        user_id = 3333
        
        # Step 1: Generate token
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        self.assertEqual(gen_response.status_code, 201)
        token = json.loads(gen_response.data)['token']
        
        # Step 2: Verify token
        verify_response = self.client.post(
            '/verify-token',
            json={'token': token, 'user_id': user_id},
            content_type='application/json'
        )
        self.assertEqual(verify_response.status_code, 200)
        
        # Step 3: Login
        login_response = self.client.post(
            '/login',
            json={'user_id': user_id, 'token': token},
            content_type='application/json'
        )
        self.assertEqual(login_response.status_code, 200)
        
        # Step 4: Revoke token
        revoke_response = self.client.post(
            '/revoke-token',
            json={'token': token},
            content_type='application/json'
        )
        self.assertEqual(revoke_response.status_code, 200)
        
        # Step 5: Verify revoked token fails
        verify_again = self.client.post(
            '/verify-token',
            json={'token': token},
            content_type='application/json'
        )
        self.assertEqual(verify_again.status_code, 401)
    
    def test_jwt_payload_structure(self):
        """Test that JWT contains required claims"""
        user_id = 4444
        
        gen_response = self.client.post(
            '/generate-token',
            json={'user_id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['token']
        
        # Decode without verification to check structure
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        # Required claims
        self.assertIn('jti', decoded)
        self.assertIn('user_id', decoded)
        self.assertIn('exp', decoded)
        self.assertIn('iat', decoded)


def run_tests():
    """Run all tests and print summary"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestJWTTokenService)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.wasSuccessful():
        print("\n✓ ALL TESTS PASSED!")
    else:
        print("\n✗ SOME TESTS FAILED")
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
