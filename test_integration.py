import requests
import base64
import os

def test_integration():
    # Test submit-tryon endpoint
    # Use hardcoded base64 strings to represent images
    person_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
    garment_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="

    try:
        # Send JSON request with base64-encoded images
        data = {
            'inputs': {
                'image': person_image_base64,
                'cloth': garment_image_base64
            }
        }
        response = requests.post('http://localhost:8080/submit-tryon', json=data)

        print('Submit Try-on Response Status Code:', response.status_code)
        print('Submit Try-on Response Content:', response.json())

        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0 and 'image' in result[0]:
                print('Try-on successful!')
                # Save the result image as 'result.jpg'
                with open('result.jpg', 'wb') as f:
                    f.write(base64.b64decode(result[0]['image']))
                print('Result image saved as result.jpg')
            else:
                print('Unexpected response format:', result)
                print('Test failed')
        elif response.status_code == 400:
            print('Error: Bad Request')
            print('Response:', response.json())
            print('Test failed')
        elif response.status_code == 422:
            print('Error: Unprocessable Entity')
            print('Response:', response.json())
            print('Test failed')
        else:
            print(f'Error: API returned status code {response.status_code}')
            print('Response:', response.json())
            print('Test failed')

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        print('Test failed')

if __name__ == "__main__":
    test_integration()
