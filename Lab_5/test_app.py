import pytest
import json
from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            # Clear subscribers before each test
            from app import subscribers
            subscribers.clear()
            yield client

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert data['message'] == 'Flask Pub-Sub Server is running'

def test_add_subscriber_success(client):
    """Test adding a subscriber successfully."""
    subscriber_data = {
        'name': 'test_subscriber',
        'url': 'http://example.com/webhook'
    }
    response = client.post('/subscribers', 
                          data=json.dumps(subscriber_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'message' in data
    assert 'test_subscriber added successfully' in data['message']

def test_add_subscriber_missing_data(client):
    """Test adding a subscriber with missing data."""
    # Test missing name
    subscriber_data = {'url': 'http://example.com/webhook'}
    response = client.post('/subscribers',
                          data=json.dumps(subscriber_data),
                          content_type='application/json')
    assert response.status_code == 400
    
    # Test missing url
    subscriber_data = {'name': 'test_subscriber'}
    response = client.post('/subscribers',
                          data=json.dumps(subscriber_data),
                          content_type='application/json')
    assert response.status_code == 400

def test_add_duplicate_subscriber(client):
    """Test adding a duplicate subscriber."""
    subscriber_data = {
        'name': 'duplicate_subscriber',
        'url': 'http://example.com/webhook'
    }
    
    # Add first subscriber
    response = client.post('/subscribers',
                          data=json.dumps(subscriber_data),
                          content_type='application/json')
    assert response.status_code == 201
    
    # Try to add duplicate
    response = client.post('/subscribers',
                          data=json.dumps(subscriber_data),
                          content_type='application/json')
    assert response.status_code == 409

def test_list_subscribers_empty(client):
    """Test listing subscribers when none exist."""
    response = client.get('/subscribers')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'subscribers' in data
    assert data['subscribers'] == {}

def test_list_subscribers_with_data(client):
    """Test listing subscribers with data."""
    # Add some subscribers first
    subscribers_to_add = [
        {'name': 'subscriber1', 'url': 'http://example1.com'},
        {'name': 'subscriber2', 'url': 'http://example2.com'}
    ]
    
    for subscriber in subscribers_to_add:
        client.post('/subscribers',
                   data=json.dumps(subscriber),
                   content_type='application/json')
    
    # List subscribers
    response = client.get('/subscribers')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'subscribers' in data
    assert len(data['subscribers']) == 2
    assert 'subscriber1' in data['subscribers']
    assert 'subscriber2' in data['subscribers']

def test_delete_subscriber_success(client):
    """Test deleting a subscriber successfully."""
    # Add a subscriber first
    subscriber_data = {
        'name': 'to_delete',
        'url': 'http://example.com/webhook'
    }
    client.post('/subscribers',
               data=json.dumps(subscriber_data),
               content_type='application/json')
    
    # Delete the subscriber
    response = client.delete('/subscribers/to_delete')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'to_delete deleted successfully' in data['message']

def test_delete_nonexistent_subscriber(client):
    """Test deleting a subscriber that doesn't exist."""
    response = client.delete('/subscribers/nonexistent')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
    assert 'not found' in data['error']

def test_publish_subject_success(client):
    """Test publishing a subject successfully."""
    # Add some subscribers first
    subscribers_to_add = [
        {'name': 'subscriber1', 'url': 'http://example1.com'},
        {'name': 'subscriber2', 'url': 'http://example2.com'}
    ]
    
    for subscriber in subscribers_to_add:
        client.post('/subscribers',
                   data=json.dumps(subscriber),
                   content_type='application/json')
    
    # Publish a subject
    subject_data = {'subject': 'Test Subject'}
    response = client.post('/publish',
                          data=json.dumps(subject_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert data['subject'] == 'Test Subject'
    assert data['subscribers_notified'] == 2

def test_publish_subject_no_subscribers(client):
    """Test publishing a subject with no subscribers."""
    subject_data = {'subject': 'Test Subject'}
    response = client.post('/publish',
                          data=json.dumps(subject_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['subscribers_notified'] == 0

def test_publish_subject_missing_data(client):
    """Test publishing without subject data."""
    response = client.post('/publish',
                          data=json.dumps({}),
                          content_type='application/json')
    assert response.status_code == 400

def test_get_subject(client):
    """Test getting the current subject."""
    # Publish a subject first
    subject_data = {'subject': 'Current Subject'}
    client.post('/publish',
               data=json.dumps(subject_data),
               content_type='application/json')
    
    # Get the subject
    response = client.get('/subject')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'subject' in data
    assert data['subject'] == 'Current Subject'

def test_integration_workflow(client):
    """Test a complete workflow of adding subscribers, publishing, and deleting."""
    # Add subscribers
    subscribers_to_add = [
        {'name': 'alice', 'url': 'http://alice.com/webhook'},
        {'name': 'bob', 'url': 'http://bob.com/webhook'},
        {'name': 'charlie', 'url': 'http://charlie.com/webhook'}
    ]
    
    for subscriber in subscribers_to_add:
        response = client.post('/subscribers',
                              data=json.dumps(subscriber),
                              content_type='application/json')
        assert response.status_code == 201
    
    # Verify all subscribers were added
    response = client.get('/subscribers')
    data = json.loads(response.data)
    assert len(data['subscribers']) == 3
    
    # Publish a subject
    subject_data = {'subject': 'Important News'}
    response = client.post('/publish',
                          data=json.dumps(subject_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['subscribers_notified'] == 3
    
    # Delete one subscriber
    response = client.delete('/subscribers/bob')
    assert response.status_code == 200
    
    # Verify subscriber was deleted
    response = client.get('/subscribers')
    data = json.loads(response.data)
    assert len(data['subscribers']) == 2
    assert 'bob' not in data['subscribers']
    
    # Publish another subject
    subject_data = {'subject': 'Updated News'}
    response = client.post('/publish',
                          data=json.dumps(subject_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['subscribers_notified'] == 2