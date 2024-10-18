import requests
import base64
import os
import time
from dotenv import load_dotenv

load_dotenv()

# Replace with your actual Hugging Face API token
API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/ares1123/virtual-dress-try-on"

headers = {"Authorization": f"Bearer {API_TOKEN}"}

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def query(payload):
    max_retries = 5
    retry_delay = 10
    for attempt in range(max_retries):
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        if "error" in result and "is currently loading" in result["error"]:
            print(f"Model is loading. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            return result
    return {"error": "Max retries reached. Model is still loading."}

def main():
    # Encode the person and garment images
    person_image = encode_image("person.jpg")
    garment_image = encode_image("garment.jpg")

    # Prepare the payload
    payload = {
        "inputs": {
            "clothImage": garment_image,
            "humanImage": person_image
        }
    }

    # Send the request
    print("Sending request to Hugging Face API...")
    response = query(payload)

    # Check if the request was successful
    if "error" in response:
        print(f"Error: {response['error']}")
    else:
        # If successful, the response should contain the result image
        result_image = base64.b64decode(response["result"])

        # Save the result image
        with open("result.jpg", "wb") as f:
            f.write(result_image)
        print("Virtual try-on completed. Result saved as 'result.jpg'")

if __name__ == "__main__":
    main()
