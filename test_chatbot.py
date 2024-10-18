import requests
import base64
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time

# Create a simple HTTP server to serve image files
class ImageServer(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

def start_image_server():
    server = HTTPServer(('localhost', 8000), ImageServer)
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    return server

def test_chatbot():
    base_url = "http://localhost:5000/webhook"
    image_server = start_image_server()
    time.sleep(1)  # Give the server a moment to start

    try:
        # Test 1: Send 'try on' message
        payload = {
            "Body": "try on",
            "From": "whatsapp:+1234567890",
            "NumMedia": "0"
        }
        response = requests.post(base_url, data=payload)
        print("Test 1 - 'try on' message:")
        print(response.text)
        print()

        # Test 2: Send two images
        payload = {
            "Body": "try on",
            "From": "whatsapp:+1234567890",
            "NumMedia": "2",
            "MediaUrl0": "http://localhost:8000/person.jpg",
            "MediaUrl1": "http://localhost:8000/garment.jpg"
        }
        response = requests.post(base_url, data=payload)
        print("Test 2 - Send two images:")
        print(response.text)

    except Exception as e:
        print(f"An error occurred during testing: {str(e)}")
    finally:
        image_server.shutdown()
        image_server.server_close()

if __name__ == "__main__":
    test_chatbot()
