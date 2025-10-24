#!/usr/bin/env python3
"""
Simple webhook receiver for testing Roaring Data Updater webhooks

This is a minimal Flask server that receives and logs webhook events from Roaring.

Usage:
    1. Install Flask:
        pip3 install flask

    2. Run the server:
        python3 webhook_receiver.py

    3. In another terminal, expose with ngrok:
        ngrok http 5000

    4. Register the ngrok URL with Roaring
    
    5. Monitor webhook events in this terminal

Author: Celestial Redovisning
Date: 2025-10-24
"""

from flask import Flask, request, jsonify
from datetime import datetime
import json

app = Flask(__name__)

# Store received events (in production, use a database)
events = []

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'events_received': len(events)
    })

@app.route('/webhooks/roaring', methods=['POST'])
def roaring_webhook():
    """
    Webhook endpoint for Roaring Data Updater events
    """
    try:
        # Get the webhook payload
        payload = request.get_json()
        
        # Log the event
        event_data = {
            'timestamp': datetime.now().isoformat(),
            'payload': payload,
            'headers': dict(request.headers)
        }
        
        events.append(event_data)
        
        # Print to console
        print("\n" + "=" * 80)
        print(f"🔔 WEBHOOK MOTTAGEN: {datetime.now().isoformat()}")
        print("=" * 80)
        
        if payload:
            event_type = payload.get('eventType', 'UNKNOWN')
            org_nr = payload.get('organizationNumber', 'N/A')
            
            print(f"Event Type: {event_type}")
            print(f"Org.nr: {org_nr}")
            print(f"\nFull payload:")
            print(json.dumps(payload, indent=2, ensure_ascii=False))
        else:
            print("⚠️  Empty payload")
        
        print("\nHeaders:")
        for key, value in request.headers:
            print(f"  {key}: {value}")
        
        print("=" * 80 + "\n")
        
        # Return 200 OK to acknowledge receipt
        return jsonify({'status': 'received', 'timestamp': datetime.now().isoformat()}), 200
        
    except Exception as e:
        print(f"\n❌ ERROR processing webhook: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/events', methods=['GET'])
def list_events():
    """
    List all received events (for debugging)
    """
    return jsonify({
        'total': len(events),
        'events': events
    })

@app.route('/events/clear', methods=['POST'])
def clear_events():
    """
    Clear all stored events
    """
    global events
    count = len(events)
    events = []
    return jsonify({
        'status': 'cleared',
        'events_cleared': count
    })

@app.route('/events/<event_type>', methods=['GET'])
def events_by_type(event_type):
    """
    Filter events by type
    """
    filtered = [e for e in events if e.get('payload', {}).get('eventType') == event_type]
    return jsonify({
        'event_type': event_type,
        'count': len(filtered),
        'events': filtered
    })

if __name__ == '__main__':
    print("\n" + "=" * 80)
    print("  ROARING WEBHOOK RECEIVER")
    print("=" * 80)
    print(f"  Started: {datetime.now().isoformat()}")
    print(f"  Webhook URL: http://localhost:5000/webhooks/roaring")
    print(f"  Health check: http://localhost:5000/health")
    print(f"  List events: http://localhost:5000/events")
    print("\n  💡 TIP: Use ngrok to expose this server:")
    print("     ngrok http 5000")
    print("=" * 80 + "\n")
    
    # Run server
    app.run(
        host='0.0.0.0',  # Listen on all interfaces
        port=5000,
        debug=True
    )
