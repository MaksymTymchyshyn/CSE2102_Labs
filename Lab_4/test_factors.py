import unittest
import json
from my_server import app, trial_division

class TestFactorization(unittest.TestCase):
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_trial_division_function(self):
        """Test the trial_division function directly"""
        # Test prime numbers
        self.assertEqual(trial_division(2), [2])
        self.assertEqual(trial_division(3), [3])
        self.assertEqual(trial_division(5), [5])
        self.assertEqual(trial_division(7), [7])
        self.assertEqual(trial_division(11), [11])
        
        # Test composite numbers
        self.assertEqual(trial_division(4), [2, 2])
        self.assertEqual(trial_division(6), [2, 3])
        self.assertEqual(trial_division(8), [2, 2, 2])
        self.assertEqual(trial_division(9), [3, 3])
        self.assertEqual(trial_division(12), [2, 2, 3])
        self.assertEqual(trial_division(15), [3, 5])
        self.assertEqual(trial_division(360), [2, 2, 2, 3, 3, 5])
        
        # Test edge cases
        self.assertEqual(trial_division(1), [1])
        self.assertEqual(trial_division(0), [])
        self.assertEqual(trial_division(-5), [])
    
    def test_factors_endpoint_prime_numbers(self):
        """Test the /factors endpoint with prime numbers"""
        # Test prime number 7
        response = self.app.post('/factors', data={'number': '7'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 7)
        self.assertEqual(data['factors'], [7])
        self.assertTrue(data['is_prime'])
        
        # Test prime number 11
        response = self.app.post('/factors', data={'number': '11'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 11)
        self.assertEqual(data['factors'], [11])
        self.assertTrue(data['is_prime'])
    
    def test_factors_endpoint_composite_numbers(self):
        """Test the /factors endpoint with composite numbers"""
        # Test 12 -> should return [1, 2, 2, 3] as per lab requirement
        response = self.app.post('/factors', data={'number': '12'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 12)
        self.assertEqual(data['factors'], [1, 2, 2, 3])
        self.assertFalse(data['is_prime'])
        
        # Test 6 -> should return [1, 2, 3]
        response = self.app.post('/factors', data={'number': '6'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 6)
        self.assertEqual(data['factors'], [1, 2, 3])
        self.assertFalse(data['is_prime'])
        
        # Test 360 -> should return [1, 2, 2, 2, 3, 3, 5]
        response = self.app.post('/factors', data={'number': '360'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 360)
        self.assertEqual(data['factors'], [1, 2, 2, 2, 3, 3, 5])
        self.assertFalse(data['is_prime'])
    
    def test_factors_endpoint_edge_cases(self):
        """Test the /factors endpoint with edge cases"""
        # Test 1
        response = self.app.post('/factors', data={'number': '1'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['number'], 1)
        self.assertEqual(data['factors'], [1])
        self.assertFalse(data['is_prime'])
    
    def test_factors_endpoint_error_cases(self):
        """Test the /factors endpoint with invalid inputs"""
        # Test missing parameter
        response = self.app.post('/factors', data={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        
        # Test invalid integer
        response = self.app.post('/factors', data={'number': 'abc'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        
        # Test negative number
        response = self.app.post('/factors', data={'number': '-5'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        
        # Test zero
        response = self.app.post('/factors', data={'number': '0'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()