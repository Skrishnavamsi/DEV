from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.responses import PlainTextResponse, JSONResponse
import io
import base64
import time
import os
import requests
import json
from httpx import ReadTimeout

app = FastAPI()

# Environment variables
API_URL = "https://api-inference.huggingface.co/models/yisol/IDM-VTON"
API_TOKEN = os.environ.get('HUGGINGFACE_API_TOKEN')

# Constants
MAX_RETRIES = 3
RETRY_DELAY = 5
MAX_SEED = 999999

@app.get("/")
async def root():
    return {"message": "Welcome to the Virtual Try-On Chatbot"}

@app.get("/health")
async def health_check():
    try:
        # Perform a simple prediction to check if the API is responsive
        headers = {"Authorization": f"Bearer {API_TOKEN}"}
        response = requests.post(API_URL, headers=headers, json={"inputs": "test"}, timeout=10)
        if response.status_code == 200:
            return {"status": "healthy"}
        else:
            return JSONResponse(content={"status": "unhealthy", "error": "API returned non-200 status"}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"status": "unhealthy", "error": str(e)}, status_code=500)

@app.post("/webhook")
async def twilio_webhook(request: Request, Body: str = Form(...)):
    # Process the incoming message
    incoming_message = Body

    # TODO: Implement logic to handle the incoming message and interact with Hugging Face Space
    # This will be implemented in the next step

    # For now, we'll just echo the message back
    response = f"Received: {incoming_message}"

    return PlainTextResponse(content=response)

@app.post("/submit-tryon")
async def submit_tryon(request: Request):
    try:
        # Parse the JSON request body
        body = await request.json()
        person_image_base64 = body.get('person_image')
        garment_image_base64 = body.get('garment_image')

        # Check if both images are provided
        if not person_image_base64 or not garment_image_base64:
            return JSONResponse(content={"error": "Both person_image and garment_image are required"}, status_code=400)

        # Prepare the data for the API call
        headers = {"Authorization": f"Bearer {API_TOKEN}"}
        data = {
            "inputs": {
                "image": person_image_base64,
                "cloth": garment_image_base64
            }
        }

        # Submit the try-on task
        response = requests.post(API_URL, headers=headers, json=data, timeout=50)

        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0 and 'image' in result[0]:
                return JSONResponse(content={"result": result[0]['image']})
            else:
                return JSONResponse(content={"error": "Unexpected response format"}, status_code=500)
        else:
            return JSONResponse(content={"error": f"API returned non-200 status: {response.status_code}"}, status_code=response.status_code)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/query-tryon/{task_id}")
async def query_tryon(task_id: str):
    # Note: The Hugging Face Inference API doesn't support task querying.
    # The result is returned immediately in the submit-tryon response.
    # This endpoint is kept for compatibility, but it will always return an error.
    return JSONResponse(content={"error": "Task querying is not supported by the Hugging Face Inference API"}, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
