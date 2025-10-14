from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# In-memory storage for subscribers
subscribers = {}  # {name: url}
published_subject = ""  # Current published subject

@app.route('/subscribers', methods=['POST'])
def add_subscriber():
    """Add a new subscriber with name and URL."""
    data = request.get_json()
    
    if not data or 'name' not in data or 'url' not in data:
        return jsonify({'error': 'Name and URL are required'}), 400
    
    name = data['name']
    url = data['url']
    
    if name in subscribers:
        return jsonify({'error': f'Subscriber {name} already exists'}), 409
    
    subscribers[name] = url
    logger.info(f"Added subscriber: {name} -> {url}")
    
    return jsonify({'message': f'Subscriber {name} added successfully'}), 201

@app.route('/subscribers/<name>', methods=['DELETE'])
def delete_subscriber(name):
    """Delete a subscriber by name."""
    if name not in subscribers:
        return jsonify({'error': f'Subscriber {name} not found'}), 404
    
    url = subscribers.pop(name)
    logger.info(f"Deleted subscriber: {name} -> {url}")
    
    return jsonify({'message': f'Subscriber {name} deleted successfully'}), 200

@app.route('/subscribers', methods=['GET'])
def list_subscribers():
    """Return a list of all subscribers and their URLs."""
    return jsonify({'subscribers': subscribers}), 200

@app.route('/publish', methods=['POST'])
def publish_subject():
    """Update the published subject and notify all subscribers."""
    data = request.get_json()
    
    if not data or 'subject' not in data:
        return jsonify({'error': 'Subject is required'}), 400
    
    global published_subject
    published_subject = data['subject']
    
    # Notify all subscribers (print statements as specified)
    logger.info(f"Publishing subject: {published_subject}")
    print(f"\n=== PUBLISHING SUBJECT: {published_subject} ===")
    
    if not subscribers:
        print("No subscribers to notify.")
        logger.info("No subscribers to notify")
    else:
        print(f"Notifying {len(subscribers)} subscriber(s):")
        for name, url in subscribers.items():
            print(f"  - Notifying {name} at {url}")
            logger.info(f"Notified subscriber: {name} at {url}")
    
    print("=== NOTIFICATION COMPLETE ===\n")
    
    return jsonify({
        'message': 'Subject published successfully',
        'subject': published_subject,
        'subscribers_notified': len(subscribers)
    }), 200

@app.route('/subject', methods=['GET'])
def get_subject():
    """Get the current published subject."""
    return jsonify({'subject': published_subject}), 200

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'message': 'Flask Pub-Sub Server is running',
        'subscribers_count': len(subscribers),
        'current_subject': published_subject
    }), 200

if __name__ == '__main__':
    print("Starting Flask Pub-Sub Server...")
    print("Available endpoints:")
    print("  POST /subscribers - Add a subscriber")
    print("  DELETE /subscribers/<name> - Delete a subscriber")
    print("  GET /subscribers - List all subscribers")
    print("  POST /publish - Publish a subject and notify subscribers")
    print("  GET /subject - Get current subject")
    print("  GET / - Health check")
    print("\nServer running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)