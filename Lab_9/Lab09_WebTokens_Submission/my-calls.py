#!/usr/bin/env python3
"""
Client for testing the Web Token Service
Lab 09: Web-tokens
"""

import httpx
import sys
import json

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


def generate_token(url, user_id):
    """Generate a new token for a user"""
    print("\n" + "=" * 60)
    print(f"Generating token for user: {user_id}")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "generate-token",
            json={"id": user_id}
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✓ Token generated successfully!")
            print(f"User ID: {data['id']}")
            print(f"Token: {data['uuid-token']}")
            return data['uuid-token']
        else:
            print(f"✗ Failed to generate token")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"✗ Error generating token: {str(e)}")
        return None


def verify_token(url, user_id, token):
    """Verify a token"""
    print("\n" + "=" * 60)
    print(f"Verifying token for user: {user_id}")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "verify-token",
            json={
                "id": user_id,
                "uuid-token": token
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                print(f"✓ Token is valid!")
                print(f"Verified user: {data['id']}")
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
    """Login with ID and token"""
    print("\n" + "=" * 60)
    print(f"Attempting login for user: {user_id}")
    print("=" * 60)
    try:
        # Using form data as specified in the lab
        id_data = {
            "id": user_id,
            "uuid-token": token
        }
        
        response = httpx.post(url + "login", data=id_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Login successful!")
            print(f"Message: {data['message']}")
            return True
        else:
            print(f"✗ Login failed")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error during login: {str(e)}")
        return False


def revoke_token(url, token):
    """Revoke a token (logout)"""
    print("\n" + "=" * 60)
    print("Revoking token (logout)...")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "revoke-token",
            json={"uuid-token": token}
        )
        
        if response.status_code == 200:
            print(f"✓ Token revoked successfully!")
            return True
        else:
            print(f"✗ Failed to revoke token")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error revoking token: {str(e)}")
        return False


def test_invalid_token(url, user_id):
    """Test with an invalid token"""
    print("\n" + "=" * 60)
    print("Testing with invalid token...")
    print("=" * 60)
    
    fake_token = "00000000-0000-0000-0000-000000000000"
    
    try:
        response = httpx.post(
            url + "verify-token",
            json={
                "id": user_id,
                "uuid-token": fake_token
            }
        )
        
        if response.status_code == 404:
            print(f"✓ Invalid token correctly rejected")
            return True
        else:
            print(f"✗ Invalid token not properly handled")
            return False
            
    except Exception as e:
        print(f"✗ Error testing invalid token: {str(e)}")
        return False


def run_full_test():
    """Run a complete test workflow"""
    print("\n" + "#" * 60)
    print("# RUNNING FULL TEST WORKFLOW")
    print("#" * 60)
    
    url = DEFAULT_URL
    user_id = "phillip.bradford@uconn.edu"
    
    # Test 1: Server connection
    if not test_server_connection(url):
        print("\n✗ Cannot continue - server is not reachable")
        return False
    
    # Test 2: Generate token
    token = generate_token(url, user_id)
    if not token:
        print("\n✗ Test failed - could not generate token")
        return False
    
    # Test 3: Verify token
    if not verify_token(url, user_id, token):
        print("\n✗ Test failed - token verification failed")
        return False
    
    # Test 4: Login with token
    if not login(url, user_id, token):
        print("\n✗ Test failed - login failed")
        return False
    
    # Test 5: Test invalid token
    if not test_invalid_token(url, user_id):
        print("\n✗ Test failed - invalid token handling failed")
        return False
    
    # Test 6: Revoke token
    if not revoke_token(url, token):
        print("\n✗ Test failed - token revocation failed")
        return False
    
    # Test 7: Verify token is revoked
    print("\n" + "=" * 60)
    print("Verifying token is revoked...")
    print("=" * 60)
    try:
        response = httpx.post(
            url + "verify-token",
            json={
                "id": user_id,
                "uuid-token": token
            }
        )
        if response.status_code == 404:
            print(f"✓ Revoked token correctly rejected")
        else:
            print(f"✗ Revoked token still valid!")
            return False
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False
    
    print("\n" + "#" * 60)
    print("# ALL TESTS PASSED!")
    print("#" * 60)
    return True


def main():
    """Main function"""
    if len(sys.argv) > 1:
        global DEFAULT_URL
        DEFAULT_URL = sys.argv[1]
        if not DEFAULT_URL.endswith('/'):
            DEFAULT_URL += '/'
        print(f"Using custom URL: {DEFAULT_URL}")
    
    run_full_test()


if __name__ == "__main__":
    main()
