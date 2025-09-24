import unittest
import json
from app import app, trial_division

class TestFactorizationApp(unittest.TestCase):
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_trial_division_function(self):
        """Test the trial_division function directly"""
        
        # Test prime numbers
        self.assertEqual(trial_division(7), [7])
        self.assertEqual(trial_division(17), [17])
        self.assertEqual(trial_division(2), [2])
        
        # Test composite numbers
        self.assertEqual(trial_division(12), [2, 2, 3])
        self.assertEqual(trial_division(360), [2, 2, 2, 3, 3, 5])
        self.assertEqual(trial_division(100), [2, 2, 5, 5])
        
        # Test edge cases
        self.assertEqual(trial_division(1), [])
        self.assertEqual(trial_division(4), [2, 2])
    
    def test_factors_endpoint_post_json(self):
        """Test the /factors endpoint with JSON POST requests"""
        
        # Test with prime number
        response = self.app.post('/factors', 
                                json={'number': 7},
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['factors'], [7])
        self.assertTrue(data['is_prime'])
        
        # Test with composite number (should include 1)
        response = self.app.post('/factors', 
                                json={'number': 12},
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['factors'], [1, 2, 2, 3])
        self.assertFalse(data['is_prime'])
    
    def test_factors_endpoint_post_form(self):
        """Test the /factors endpoint with form data POST requests"""
        
        response = self.app.post('/factors', data={'number': '17'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['factors'], [17])
        self.assertTrue(data['is_prime'])
    
    def test_factors_endpoint_get(self):
        """Test the /factors/<number> GET endpoint"""
        
        response = self.app.get('/factors/12')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['factors'], [1, 2, 2, 3])
        self.assertFalse(data['is_prime'])
    
    def test_factors_endpoint_error_cases(self):
        """Test error handling in the factors endpoint"""
        
        # Test missing number parameter
        response = self.app.post('/factors', json={})
        self.assertEqual(response.status_code, 400)
        
        # Test invalid number format
        response = self.app.post('/factors', json={'number': 'invalid'})
        self.assertEqual(response.status_code, 400)
        
        # Test negative number
        response = self.app.post('/factors', json={'number': -5})
        self.assertEqual(response.status_code, 400)
        
        # Test zero
        response = self.app.post('/factors', json={'number': 0})
        self.assertEqual(response.status_code, 400)
    
    def test_echo_endpoint(self):
        """Test the original echo endpoint"""
        
        response = self.app.post('/echo', data={'text': 'Hello Test!'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('Hello Test!', response.data.decode())
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Flask HTTP Lab 4', response.data.decode())

class TestFactorizationLogic(unittest.TestCase):
    """Additional tests for factorization logic"""
    
    def test_known_factorizations(self):
        """Test factorization of well-known numbers"""
        
        test_cases = [
            (1, []),
            (2, [2]),
            (3, [3]),
            (4, [2, 2]),
            (6, [2, 3]),
            (8, [2, 2, 2]),
            (9, [3, 3]),
            (10, [2, 5]),
            (15, [3, 5]),
            (24, [2, 2, 2, 3]),
            (30, [2, 3, 5]),
            (36, [2, 2, 3, 3]),
            (60, [2, 2, 3, 5]),
            (72, [2, 2, 2, 3, 3]),
            (100, [2, 2, 5, 5]),
            (120, [2, 2, 2, 3, 5])
        ]
        
        for number, expected_factors in test_cases:
            with self.subTest(number=number):
                result = trial_division(number)
                self.assertEqual(result, expected_factors, 
                               f"Failed for {number}: expected {expected_factors}, got {result}")
    
    def test_large_primes(self):
        """Test with some larger prime numbers"""
        
        large_primes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149]
        
        for prime in large_primes:
            with self.subTest(prime=prime):
                result = trial_division(prime)
                self.assertEqual(result, [prime], f"Failed for prime {prime}")

if __name__ == '__main__':
    unittest.main()