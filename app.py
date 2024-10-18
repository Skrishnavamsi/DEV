import os
import time
from flask import Flask, request, send_file, jsonify
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
import requests
import base64
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Twilio credentials
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')

# Check if environment variables are set
if not account_sid or not auth_token:
    raise ValueError("Twilio credentials not found in environment variables")

client = Client(account_sid, auth_token)

# Hugging Face API
HUGGINGFACE_API_TOKEN = os.environ.get('HUGGINGFACE_API_TOKEN')
if not HUGGINGFACE_API_TOKEN:
    raise ValueError("Hugging Face API token not found in environment variables")

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/ares1123/virtual-dress-try-on"

def query_huggingface(payload):
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}
    max_retries = 5
    retry_delay = 10
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1}: Sending request to Hugging Face API with payload: {payload}")
            response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            print(f"Received response from Hugging Face API: {result}")
            if "error" in result and "is currently loading" in result["error"]:
                print(f"Model is loading. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                return result
        except requests.exceptions.RequestException as e:
            print(f"Error in Hugging Face API request: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                return {"error": f"Max retries reached. Last error: {str(e)}"}

@app.route("/webhook", methods=['POST'])
def webhook():
    incoming_msg = request.values.get('Body', '').lower()
    num_media = int(request.values.get('NumMedia', '0'))
    resp = MessagingResponse()

    print(f"Received message: {incoming_msg}")
    print(f"Number of media items: {num_media}")

    if 'try on' in incoming_msg and num_media == 0:
        resp.message("Please send two images: first the person, then the garment you want to try on.")
    elif num_media == 2:
        print("Processing two images...")
        # Process the images
        person_image = request.values.get('MediaUrl0')
        garment_image = request.values.get('MediaUrl1')

        print(f"Person image URL: {person_image}")
        print(f"Garment image URL: {garment_image}")

        try:
            # Fetch images and convert to base64
            print("Fetching person image...")
            person_response = requests.get(person_image)
            person_response.raise_for_status()
            person_image_base64 = base64.b64encode(person_response.content).decode('utf-8')
            print("Successfully fetched and encoded person image")

            print("Fetching garment image...")
            garment_response = requests.get(garment_image)
            garment_response.raise_for_status()
            garment_image_base64 = base64.b64encode(garment_response.content).decode('utf-8')
            print("Successfully fetched and encoded garment image")

            # Prepare payload for Hugging Face API
            payload = {
                "inputs": {
                    "clothImage": garment_image_base64,
                    "humanImage": person_image_base64
                }
            }
            print("Payload prepared for Hugging Face API")

            print("Sending request to Hugging Face API...")
            # Query Hugging Face API
            result = query_huggingface(payload)

            print(f"Received response from Hugging Face API: {result}")

            if isinstance(result, list) and len(result) > 0 and 'image' in result[0]:
                print("Processing result image...")
                # Convert the result image to bytes
                img_data = base64.b64decode(result[0]['image'])
                img = BytesIO(img_data)
                print("Successfully processed result image")

                # Send the result image
                resp.message("Here's your virtual try-on result!")
                resp.message().media(img)
                print("Result image sent to user")
            else:
                print(f"Unexpected Hugging Face API response format: {result}")
                resp.message("Sorry, there was an error processing your request. Please try again.")
        except requests.RequestException as e:
            print(f"Error fetching images: {str(e)}")
            resp.message("Sorry, there was an error fetching your images. Please try again.")
        except ValueError as e:
            print(f"Error processing images or API response: {str(e)}")
            resp.message("Sorry, there was an error processing the images. Please try again.")
        except Exception as e:
            print(f"Unexpected error during processing: {str(e)}")
            resp.message("An unexpected error occurred. Please try again later.")
    else:
        resp.message("I'm sorry, I didn't understand that. Please send 'try on' to start the virtual try-on process.")

    return str(resp)

@app.route("/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(debug=True)
