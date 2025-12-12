#!/usr/bin/env python3
"""
Client for testing the JWT Token Service
Lab 10: JWT
"""

import httpx
import sys
import json
import time

# Default URL - can be overridden with command line argument
DEFAULT_URL = "http://localhost:5000/"


def test_server_connection(url):
    """Test if server is reachable"""
    print("=" * 60)
    print("Testing server connection...")
    print("=" * 60)
    try:
        response = httpx.get(url)
        print(f"✓ Server is running at {url}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Cannot connect to server at {url}")
        print(f"Error: {str(e)}")
        return False


def generate_token(url, user_id, expires_in=3600):
    """Generate a new JWT token for a user"""
    print("\n" + "=" * 60)
    print(f"Generating JWT token for user ID: {user_id}")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "generate-token",
            json={
                "user_id": user_id,
                "expires_in": expires_in
            }
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✓ JWT token generated successfully!")
            print(f"User ID: {data['user_id']}")
            print(f"Token: {data['token'][:50]}..." if len(data['token']) > 50 else f"Token: {data['token']}")
            print(f"Expires in: {data['expires_in']} seconds")
            return data['token']
        else:
            print(f"✗ Failed to generate token")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"✗ Error generating token: {str(e)}")
        return None


def verify_token(url, token, user_id=None):
    """Verify a JWT token"""
    print("\n" + "=" * 60)
    print(f"Verifying JWT token...")
    print("=" * 60)
    try:
        payload = {"token": token}
        if user_id is not None:
            payload["user_id"] = user_id
            
        response = httpx.post(
            url + "verify-token",
            json=payload
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                print(f"✓ Token is valid!")
                print(f"User ID: {data['user_id']}")
                print(f"JTI: {data['jti']}")
                return True
            else:
                print(f"✗ Token is invalid")
                return False
        else:
            print(f"✗ Token verification failed")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error verifying token: {str(e)}")
        return False


def login(url, user_id, token):
    """Login with user ID and JWT token"""
    print("\n" + "=" * 60)
    print(f"Attempting login for user ID: {user_id}")
    print("=" * 60)
    try:
        # Using JSON data
        response = httpx.post(
            url + "login",
            json={
                "user_id": user_id,
                "token": token
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Login successful!")
            print(f"Message: {data['message']}")
            print(f"User ID: {data['user_id']}")
            return True
        else:
            print(f"✗ Login failed")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error during login: {str(e)}")
        return False


def test_invalid_token(url):
    """Test verification with an invalid token"""
    print("\n" + "=" * 60)
    print("Testing with invalid token...")
    print("=" * 60)
    try:
        invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature"
        response = httpx.post(
            url + "verify-token",
            json={"token": invalid_token}
        )
        
        if response.status_code == 401:
            print(f"✓ Invalid token correctly rejected!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"✗ Expected 401 status, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error testing invalid token: {str(e)}")
        return False


def test_expired_token(url):
    """Test with an expired token"""
    print("\n" + "=" * 60)
    print("Testing with expired token...")
    print("=" * 60)
    try:
        # Generate a token that expires in 2 seconds
        response = httpx.post(
            url + "generate-token",
            json={
                "user_id": 999,
                "expires_in": 2
            }
        )
        
        if response.status_code == 201:
            token = response.json()['token']
            print(f"✓ Generated token that expires in 2 seconds")
            
            # Wait for token to expire
            print("Waiting 3 seconds for token to expire...")
            time.sleep(3)
            
            # Try to verify expired token
            verify_response = httpx.post(
                url + "verify-token",
                json={"token": token}
            )
            
            if verify_response.status_code == 401:
                data = verify_response.json()
                if "expired" in data.get('message', '').lower():
                    print(f"✓ Expired token correctly rejected!")
                    print(f"Response: {data}")
                    return True
            
            print(f"✗ Expected 401 with expiration message")
            return False
        else:
            print(f"✗ Failed to generate token for expiration test")
            return False
            
    except Exception as e:
        print(f"✗ Error testing expired token: {str(e)}")
        return False


def revoke_token(url, token):
    """Revoke a JWT token"""
    print("\n" + "=" * 60)
    print("Revoking JWT token...")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "revoke-token",
            json={"token": token}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Token revoked successfully!")
            print(f"Message: {data['message']}")
            return True
        else:
            print(f"✗ Token revocation failed")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error revoking token: {str(e)}")
        return False


def run_full_test():
    """Run complete test workflow"""
    print("\n")
    print("#" * 60)
    print("# RUNNING FULL JWT TEST WORKFLOW")
    print("#" * 60)
    
    # Get URL from command line or use default
    url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    if not url.endswith('/'):
        url += '/'
    
    # Test 1: Server connection
    if not test_server_connection(url):
        print("\n✗ Cannot proceed - server not reachable")
        return False
    
    # Test 2: Generate token
    user_id = 123
    token = generate_token(url, user_id)
    if not token:
        print("\n✗ Test failed - could not generate token")
        return False
    
    # Test 3: Verify token
    if not verify_token(url, token, user_id):
        print("\n✗ Test failed - token verification failed")
        return False
    
    # Test 4: Login with token
    if not login(url, user_id, token):
        print("\n✗ Test failed - login failed")
        return False
    
    # Test 5: Test invalid token
    if not test_invalid_token(url):
        print("\n✗ Test failed - invalid token test")
        return False
    
    # Test 6: Test expired token
    if not test_expired_token(url):
        print("\n✗ Test failed - expired token test")
        return False
    
    # Test 7: Revoke token
    if not revoke_token(url, token):
        print("\n✗ Test failed - token revocation failed")
        return False
    
    # Test 8: Verify revoked token fails
    print("\n" + "=" * 60)
    print("Verifying that revoked token is rejected...")
    print("=" * 60)
    if verify_token(url, token, user_id):
        print("✗ Test failed - revoked token was accepted")
        return False
    else:
        print("✓ Revoked token correctly rejected!")
    
    # All tests passed
    print("\n")
    print("=" * 60)
    print("✓ ALL TESTS PASSED!")
    print("=" * 60)
    return True


def main():
    """Main function"""
    try:
        success = run_full_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)


if __name__ == "__main__":
    main()
