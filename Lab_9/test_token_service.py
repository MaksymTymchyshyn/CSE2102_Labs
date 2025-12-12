#!/usr/bin/env python3
"""
Unit and functional tests for the Web Token Service
Lab 09: Web-tokens
"""

import unittest
import json
import uuid
import sys
import os

# Add the parent directory to the path to import the server
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app - handle both dash and underscore naming
try:
    import my_server
    from my_server import app, token_store
except ModuleNotFoundError:
    # Try with underscore instead of dash
    import importlib.util
    spec = importlib.util.spec_from_file_location("my_server", 
                                                   os.path.join(os.path.dirname(__file__), "my-server.py"))
    my_server = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(my_server)
    app = my_server.app
    token_store = my_server.token_store


class TestWebTokenService(unittest.TestCase):
    """Unit and functional tests for the web token service"""
    
    def setUp(self):
        """Set up test client and clear token store before each test"""
        self.app = app
        self.client = self.app.test_client()
        self.app.testing = True
        
        # Clear token store before each test
        token_store.clear()
    
    def tearDown(self):
        """Clean up after each test"""
        token_store.clear()
    
    # ========== Unit Tests for Token Generation ==========
    
    def test_generate_token_success(self):
        """Test successful token generation"""
        user_id = "test.user@uconn.edu"
        response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        
        # Verify response structure
        self.assertIn('id', data)
        self.assertIn('uuid-token', data)
        self.assertEqual(data['id'], user_id)
        
        # Verify UUID format
        try:
            uuid.UUID(data['uuid-token'])
            uuid_valid = True
        except ValueError:
            uuid_valid = False
        self.assertTrue(uuid_valid, "Generated token is not a valid UUID")
    
    def test_generate_token_missing_id(self):
        """Test token generation with missing ID field"""
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
    
    def test_generate_multiple_tokens_different_users(self):
        """Test generating tokens for different users"""
        user1 = "user1@uconn.edu"
        user2 = "user2@uconn.edu"
        
        response1 = self.client.post(
            '/generate-token',
            json={'id': user1},
            content_type='application/json'
        )
        response2 = self.client.post(
            '/generate-token',
            json={'id': user2},
            content_type='application/json'
        )
        
        self.assertEqual(response1.status_code, 201)
        self.assertEqual(response2.status_code, 201)
        
        token1 = json.loads(response1.data)['uuid-token']
        token2 = json.loads(response2.data)['uuid-token']
        
        # Tokens should be different
        self.assertNotEqual(token1, token2)
    
    def test_generate_multiple_tokens_same_user(self):
        """Test generating multiple tokens for the same user"""
        user_id = "test.user@uconn.edu"
        
        response1 = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        response2 = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        
        token1 = json.loads(response1.data)['uuid-token']
        token2 = json.loads(response2.data)['uuid-token']
        
        # Each token should be unique even for the same user
        self.assertNotEqual(token1, token2)
    
    # ========== Unit Tests for Token Verification ==========
    
    def test_verify_token_success(self):
        """Test successful token verification"""
        user_id = "test.user@uconn.edu"
        
        # Generate a token first
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Verify the token
        verify_response = self.client.post(
            '/verify-token',
            json={'id': user_id, 'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 200)
        data = json.loads(verify_response.data)
        self.assertTrue(data['valid'])
        self.assertEqual(data['id'], user_id)
    
    def test_verify_token_without_id(self):
        """Test token verification without providing ID"""
        user_id = "test.user@uconn.edu"
        
        # Generate a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Verify without ID
        verify_response = self.client.post(
            '/verify-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 200)
        data = json.loads(verify_response.data)
        self.assertTrue(data['valid'])
        self.assertEqual(data['id'], user_id)
    
    def test_verify_invalid_token(self):
        """Test verification of non-existent token"""
        fake_token = str(uuid.uuid4())
        
        response = self.client.post(
            '/verify-token',
            json={'uuid-token': fake_token},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertFalse(data['valid'])
    
    def test_verify_token_wrong_id(self):
        """Test verification with mismatched user ID"""
        user_id = "test.user@uconn.edu"
        wrong_id = "wrong.user@uconn.edu"
        
        # Generate a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Verify with wrong ID
        verify_response = self.client.post(
            '/verify-token',
            json={'id': wrong_id, 'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 401)
        data = json.loads(verify_response.data)
        self.assertFalse(data['valid'])
    
    def test_verify_token_missing_token_field(self):
        """Test verification without token field"""
        response = self.client.post(
            '/verify-token',
            json={'id': 'test@uconn.edu'},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
    
    # ========== Unit Tests for Login ==========
    
    def test_login_success_with_form_data(self):
        """Test successful login with form data"""
        user_id = "phillip.bradford@uconn.edu"
        
        # Generate a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Login with form data
        login_response = self.client.post(
            '/login',
            data={'id': user_id, 'uuid-token': token}
        )
        
        self.assertEqual(login_response.status_code, 200)
        data = json.loads(login_response.data)
        self.assertTrue(data['success'])
        self.assertIn(user_id, data['message'])
    
    def test_login_success_with_json(self):
        """Test successful login with JSON data"""
        user_id = "test.user@uconn.edu"
        
        # Generate a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Login with JSON
        login_response = self.client.post(
            '/login',
            json={'id': user_id, 'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        data = json.loads(login_response.data)
        self.assertTrue(data['success'])
    
    def test_login_invalid_token(self):
        """Test login with invalid token"""
        user_id = "test.user@uconn.edu"
        fake_token = str(uuid.uuid4())
        
        response = self.client.post(
            '/login',
            json={'id': user_id, 'uuid-token': fake_token},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    def test_login_mismatched_id(self):
        """Test login with token that doesn't match ID"""
        user_id = "test.user@uconn.edu"
        wrong_id = "wrong.user@uconn.edu"
        
        # Generate token for user_id
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Try to login with wrong_id
        login_response = self.client.post(
            '/login',
            json={'id': wrong_id, 'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 401)
        data = json.loads(login_response.data)
        self.assertFalse(data['success'])
    
    def test_login_missing_fields(self):
        """Test login with missing required fields"""
        # Missing token
        response1 = self.client.post(
            '/login',
            json={'id': 'test@uconn.edu'},
            content_type='application/json'
        )
        self.assertEqual(response1.status_code, 400)
        
        # Missing ID
        response2 = self.client.post(
            '/login',
            json={'uuid-token': str(uuid.uuid4())},
            content_type='application/json'
        )
        self.assertEqual(response2.status_code, 400)
    
    # ========== Unit Tests for Token Revocation ==========
    
    def test_revoke_token_success(self):
        """Test successful token revocation"""
        user_id = "test.user@uconn.edu"
        
        # Generate a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        # Revoke the token
        revoke_response = self.client.post(
            '/revoke-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(revoke_response.status_code, 200)
        data = json.loads(revoke_response.data)
        self.assertTrue(data['success'])
    
    def test_revoke_nonexistent_token(self):
        """Test revoking a token that doesn't exist"""
        fake_token = str(uuid.uuid4())
        
        response = self.client.post(
            '/revoke-token',
            json={'uuid-token': fake_token},
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    def test_revoke_token_then_verify(self):
        """Test that revoked token cannot be verified"""
        user_id = "test.user@uconn.edu"
        
        # Generate and revoke a token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        token = json.loads(gen_response.data)['uuid-token']
        
        self.client.post(
            '/revoke-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        
        # Try to verify revoked token
        verify_response = self.client.post(
            '/verify-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        
        self.assertEqual(verify_response.status_code, 404)
    
    # ========== Functional Tests ==========
    
    def test_complete_workflow(self):
        """Test complete workflow: generate, verify, login, revoke"""
        user_id = "phillip.bradford@uconn.edu"
        
        # Step 1: Generate token
        gen_response = self.client.post(
            '/generate-token',
            json={'id': user_id},
            content_type='application/json'
        )
        self.assertEqual(gen_response.status_code, 201)
        token = json.loads(gen_response.data)['uuid-token']
        
        # Step 2: Verify token
        verify_response = self.client.post(
            '/verify-token',
            json={'id': user_id, 'uuid-token': token},
            content_type='application/json'
        )
        self.assertEqual(verify_response.status_code, 200)
        self.assertTrue(json.loads(verify_response.data)['valid'])
        
        # Step 3: Login
        login_response = self.client.post(
            '/login',
            data={'id': user_id, 'uuid-token': token}
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertTrue(json.loads(login_response.data)['success'])
        
        # Step 4: Revoke token
        revoke_response = self.client.post(
            '/revoke-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        self.assertEqual(revoke_response.status_code, 200)
        
        # Step 5: Verify token is revoked
        verify_after_revoke = self.client.post(
            '/verify-token',
            json={'uuid-token': token},
            content_type='application/json'
        )
        self.assertEqual(verify_after_revoke.status_code, 404)
    
    def test_home_endpoint(self):
        """Test home endpoint returns service info"""
        response = self.client.get('/')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('endpoints', data)
    
    def test_uuid_uniqueness(self):
        """Test that generated UUIDs are unique"""
        user_id = "test.user@uconn.edu"
        tokens = set()
        
        # Generate 100 tokens
        for _ in range(100):
            response = self.client.post(
                '/generate-token',
                json={'id': user_id},
                content_type='application/json'
            )
            token = json.loads(response.data)['uuid-token']
            tokens.add(token)
        
        # All tokens should be unique
        self.assertEqual(len(tokens), 100)
    
    def test_concurrent_users(self):
        """Test multiple users can have tokens simultaneously"""
        users = [
            "user1@uconn.edu",
            "user2@uconn.edu",
            "user3@uconn.edu"
        ]
        
        tokens = {}
        
        # Generate tokens for all users
        for user in users:
            response = self.client.post(
                '/generate-token',
                json={'id': user},
                content_type='application/json'
            )
            tokens[user] = json.loads(response.data)['uuid-token']
        
        # Verify all tokens work
        for user, token in tokens.items():
            verify_response = self.client.post(
                '/verify-token',
                json={'id': user, 'uuid-token': token},
                content_type='application/json'
            )
            self.assertEqual(verify_response.status_code, 200)
            self.assertTrue(json.loads(verify_response.data)['valid'])


def run_tests():
    """Run all tests and display results"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestWebTokenService)
    
    # Run tests with verbose output
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
        return 0
    else:
        print("\n✗ SOME TESTS FAILED")
        return 1


if __name__ == '__main__':
    sys.exit(run_tests())
