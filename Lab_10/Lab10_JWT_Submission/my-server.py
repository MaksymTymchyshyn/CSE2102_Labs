#!/usr/bin/env python3
"""
Flask server for JWT token generation and verification
Lab 10: JWT
"""

from flask import Flask, request, jsonify
import jwt
import datetime
import uuid
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Secret key for JWT signing (in production, use environment variable)
SECRET_KEY = "secret"

# In-memory storage for revoked tokens (blacklist)
revoked_tokens = set()


@app.route('/')
def home():
    """Home endpoint to verify server is running"""
    return jsonify({
        "message": "JWT Token Service",
        "endpoints": {
            "/generate-token": "POST - Generate a new JWT token for a user ID",
            "/verify-token": "POST - Verify an existing JWT token",
            "/login": "POST - Login with user ID and JWT token",
            "/revoke-token": "POST - Revoke a JWT token (logout)"
        }
    })


@app.route('/generate-token', methods=['POST'])
def generate_token():
    """
    Generate a JWT token for a given user ID
    Expected JSON: {"user_id": 123} or {"user_id": 123, "expires_in": 3600}
    Returns: {"user_id": 123, "token": "eyJ..."}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'user_id' not in data:
            return jsonify({
                "error": "Missing 'user_id' field in request"
            }), 400
        
        user_id = data['user_id']
        
        # Default expiration: 1 hour
        expires_in = data.get('expires_in', 3600)
        
        # Create JWT payload
        payload = {
            "jti": str(uuid.uuid4()),  # JWT ID (unique identifier)
            "user_id": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in),
            "iat": datetime.datetime.utcnow()  # Issued at
        }
        
        # Generate JWT token
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        
        logger.info(f"Generated JWT for user: {user_id}")
        
        return jsonify({
            "user_id": user_id,
            "token": token,
            "expires_in": expires_in
        }), 201
        
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/verify-token', methods=['POST'])
def verify_token():
    """
    Verify a JWT token
    Expected JSON: {"token": "eyJ..."} or {"token": "eyJ...", "user_id": 123}
    Returns: {"valid": true/false, "user_id": 123, "jti": "..."}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'token' not in data:
            return jsonify({
                "error": "Missing 'token' field in request"
            }), 400
        
        token = data['token']
        provided_user_id = data.get('user_id')
        
        try:
            # Decode and verify JWT token
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            # Check if token is revoked
            jti = decoded.get('jti')
            if jti and jti in revoked_tokens:
                logger.warning(f"Attempted to use revoked token: {jti}")
                return jsonify({
                    "valid": False,
                    "message": "Token has been revoked"
                }), 401
            
            # If user_id was provided, verify it matches
            if provided_user_id is not None and decoded.get('user_id') != provided_user_id:
                logger.warning(f"Token user_id mismatch for {provided_user_id}")
                return jsonify({
                    "valid": False,
                    "message": "User ID does not match token"
                }), 401
            
            logger.info(f"Token verified for user: {decoded.get('user_id')}")
            
            return jsonify({
                "valid": True,
                "user_id": decoded.get('user_id'),
                "jti": decoded.get('jti'),
                "exp": decoded.get('exp')
            }), 200
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token verification failed: expired token")
            return jsonify({
                "valid": False,
                "message": "Token has expired"
            }), 401
            
        except jwt.InvalidTokenError as e:
            logger.warning(f"Token verification failed: {str(e)}")
            return jsonify({
                "valid": False,
                "message": "Invalid token"
            }), 401
            
    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/login', methods=['POST'])
def login():
    """
    Login with user ID and JWT token
    Expected: form data or JSON with 'user_id' and 'token'
    Returns: {"message": "Login successful", "user_id": 123}
    """
    try:
        # Try to get data from JSON first, then form data
        data = request.get_json(silent=True)
        if not data:
            data = request.form.to_dict()
        
        if not data or 'user_id' not in data or 'token' not in data:
            return jsonify({
                "error": "Missing 'user_id' or 'token' field"
            }), 400
        
        user_id = data['user_id']
        token = data['token']
        
        # Convert user_id to int if it's a string
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            pass
        
        try:
            # Verify the token
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            # Check if token is revoked
            jti = decoded.get('jti')
            if jti and jti in revoked_tokens:
                return jsonify({
                    "error": "Token has been revoked"
                }), 401
            
            # Check if user_id matches
            if decoded.get('user_id') != user_id:
                logger.warning(f"Login failed: user_id mismatch")
                return jsonify({
                    "error": "User ID does not match token"
                }), 401
            
            logger.info(f"Login successful for user: {user_id}")
            
            return jsonify({
                "message": "Login successful",
                "user_id": user_id
            }), 200
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                "error": "Token has expired"
            }), 401
            
        except jwt.InvalidTokenError:
            return jsonify({
                "error": "Invalid token"
            }), 401
            
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/revoke-token', methods=['POST'])
def revoke_token():
    """
    Revoke a JWT token (logout)
    Expected JSON: {"token": "eyJ..."}
    Returns: {"message": "Token revoked successfully"}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'token' not in data:
            return jsonify({
                "error": "Missing 'token' field in request"
            }), 400
        
        token = data['token']
        
        try:
            # Decode token to get jti
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            jti = decoded.get('jti')
            
            if jti:
                revoked_tokens.add(jti)
                logger.info(f"Token revoked: {jti}")
                
                return jsonify({
                    "message": "Token revoked successfully"
                }), 200
            else:
                return jsonify({
                    "error": "Token does not have a JTI"
                }), 400
                
        except jwt.ExpiredSignatureError:
            return jsonify({
                "message": "Token already expired (revocation unnecessary)"
            }), 200
            
        except jwt.InvalidTokenError:
            return jsonify({
                "error": "Invalid token"
            }), 400
            
    except Exception as e:
        logger.error(f"Error revoking token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
