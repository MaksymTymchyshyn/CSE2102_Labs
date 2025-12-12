#!/usr/bin/env python3
"""
Flask server for web token generation and verification
Lab 09: Web-tokens
"""

from flask import Flask, request, jsonify
import uuid
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for tokens
# In production, this would be a database
token_store = {}


@app.route('/')
def home():
    """Home endpoint to verify server is running"""
    return jsonify({
        "message": "Web Token Service",
        "endpoints": {
            "/generate-token": "POST - Generate a new UUID token for an ID",
            "/verify-token": "POST - Verify an existing token",
            "/login": "POST - Login with ID and token"
        }
    })


@app.route('/generate-token', methods=['POST'])
def generate_token():
    """
    Generate a UUID token for a given ID
    Expected JSON: {"id": "user@example.com"}
    Returns: {"id": "user@example.com", "uuid-token": "..."}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'id' not in data:
            return jsonify({
                "error": "Missing 'id' field in request"
            }), 400
        
        user_id = data['id']
        
        # Generate a new UUID token
        token = str(uuid.uuid4())
        
        # Store the token associated with the user ID
        token_store[token] = user_id
        
        logger.info(f"Generated token for user: {user_id}")
        
        return jsonify({
            "id": user_id,
            "uuid-token": token
        }), 201
        
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/verify-token', methods=['POST'])
def verify_token():
    """
    Verify a UUID token
    Expected JSON: {"id": "user@example.com", "uuid-token": "..."}
    Returns: {"valid": true/false, "id": "user@example.com"}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'uuid-token' not in data:
            return jsonify({
                "error": "Missing 'uuid-token' field in request"
            }), 400
        
        token = data['uuid-token']
        provided_id = data.get('id')
        
        # Check if token exists in our store
        if token not in token_store:
            logger.warning(f"Invalid token verification attempt")
            return jsonify({
                "valid": False,
                "message": "Token not found"
            }), 404
        
        stored_id = token_store[token]
        
        # If ID was provided, verify it matches
        if provided_id and provided_id != stored_id:
            logger.warning(f"Token ID mismatch for {provided_id}")
            return jsonify({
                "valid": False,
                "message": "Token does not match provided ID"
            }), 401
        
        logger.info(f"Token verified for user: {stored_id}")
        
        return jsonify({
            "valid": True,
            "id": stored_id
        }), 200
        
    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/login', methods=['POST'])
def login():
    """
    Login endpoint that accepts ID and token
    Expected form data or JSON: {"id": "user@example.com", "uuid-token": "..."}
    Returns: {"success": true/false, "message": "..."}
    """
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        if not data or 'id' not in data or 'uuid-token' not in data:
            return jsonify({
                "success": False,
                "message": "Missing 'id' or 'uuid-token' field"
            }), 400
        
        user_id = data['id']
        token = data['uuid-token']
        
        # Verify the token
        if token not in token_store:
            logger.warning(f"Login failed: Invalid token for {user_id}")
            return jsonify({
                "success": False,
                "message": "Invalid token"
            }), 401
        
        stored_id = token_store[token]
        
        if stored_id != user_id:
            logger.warning(f"Login failed: ID mismatch for {user_id}")
            return jsonify({
                "success": False,
                "message": "Token does not match user ID"
            }), 401
        
        logger.info(f"Successful login for user: {user_id}")
        
        return jsonify({
            "success": True,
            "message": f"Successfully authenticated as {user_id}"
        }), 200
        
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


@app.route('/revoke-token', methods=['POST'])
def revoke_token():
    """
    Revoke a token (logout)
    Expected JSON: {"uuid-token": "..."}
    Returns: {"success": true/false}
    """
    try:
        data = request.get_json(silent=True)
        
        if not data or 'uuid-token' not in data:
            return jsonify({
                "error": "Missing 'uuid-token' field"
            }), 400
        
        token = data['uuid-token']
        
        if token in token_store:
            user_id = token_store[token]
            del token_store[token]
            logger.info(f"Token revoked for user: {user_id}")
            return jsonify({
                "success": True,
                "message": "Token revoked successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Token not found"
            }), 404
            
    except Exception as e:
        logger.error(f"Error revoking token: {str(e)}")
        return jsonify({
            "error": "Internal server error"
        }), 500


if __name__ == '__main__':
    logger.info("Starting Web Token Service...")
    app.run(host='0.0.0.0', port=5000, debug=True)
