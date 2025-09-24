import httpx
import json

# Base URL for the Flask server
base_url = "http://localhost:5000"

def test_factors_endpoint():
    """Test the factors endpoint with various inputs"""
    
    print("Testing Integer Factorization Endpoint")
    print("=" * 40)
    
    # Test cases
    test_numbers = [12, 7, 360, 17, 1, 100, 13]
    
    for number in test_numbers:
        print(f"\nTesting number: {number}")
        
        # Test POST with JSON
        try:
            response = httpx.post(
                f"{base_url}/factors",
                json={"number": number},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"  Factors: {result['factors']}")
                print(f"  Is Prime: {result['is_prime']}")
            else:
                print(f"  Error: {response.status_code} - {response.text}")
        
        except Exception as e:
            print(f"  Connection error: {e}")
    
    # Test GET endpoint (browser-friendly)
    print(f"\nTesting GET endpoint for number 12:")
    try:
        response = httpx.get(f"{base_url}/factors/12")
        if response.status_code == 200:
            result = response.json()
            print(f"  GET result: {result}")
        else:
            print(f"  GET Error: {response.status_code}")
    except Exception as e:
        print(f"  GET Connection error: {e}")

def test_echo_endpoint():
    """Test the original echo endpoint"""
    print(f"\nTesting Echo Endpoint")
    print("=" * 20)
    
    try:
        mydata = {
            "text": "Hello from Lab 4!",
            "param2": "Testing the echo functionality"
        }
        
        response = httpx.post(f"{base_url}/echo", data=mydata)
        print(f"Echo response: {response.text}")
    
    except Exception as e:
        print(f"Echo error: {e}")

def test_root_endpoint():
    """Test the root endpoint"""
    print(f"Testing Root Endpoint")
    print("=" * 20)
    
    try:
        response = httpx.get(base_url)
        print(f"Root response: {response.text}")
    
    except Exception as e:
        print(f"Root error: {e}")

if __name__ == "__main__":
    print("Flask Lab 4 - HTTP Client Testing")
    print("Make sure the Flask server is running on localhost:5000")
    print()
    
    test_root_endpoint()
    test_echo_endpoint()
    test_factors_endpoint()