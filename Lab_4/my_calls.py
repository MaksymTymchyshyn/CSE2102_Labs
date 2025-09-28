import httpx
import json

# Update this URL to match your codespace when running
url = "http://localhost:5000/"

print("=== Testing basic GET endpoint ===")
response = httpx.get(url)
print(f"Status code: {response.status_code}")
print(f"Response: {response.text}")

print("\n=== Testing echo endpoint ===")
mydata = {
    "text": "Hello Phil!",
    "param2": "Making a POST request",
    "body": "my own value"
}

# A POST request to the echo API
response = httpx.post(url + "echo", data=mydata)
print(f"Status code: {response.status_code}")
print(f"Response: {response.text}")

print("\n=== Testing factors endpoint ===")

# Test cases for the factors endpoint
test_cases = [12, 7, 360, 2, 15, 1, 23]

for number in test_cases:
    print(f"\nTesting number: {number}")
    factor_data = {"number": str(number)}
    
    try:
        response = httpx.post(url + "factors", data=factor_data)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Number: {result['number']}")
            print(f"Factors: {result['factors']}")
            print(f"Is Prime: {result['is_prime']}")
        else:
            print(f"Error response: {response.text}")
    except Exception as e:
        print(f"Error making request: {e}") 