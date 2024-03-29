from flask import Flask, request, jsonify
import requests
import json
import io
import base64
from io import BytesIO

app = Flask(__name__)

# OCR function
def ocr(image_base64, api_key):
    api_url = 'https://api.ocr.space/parse/image'
    params = {'apikey': api_key, 'base64Image': image_base64, 'language': 'eng'}
    response = requests.post(api_url, data=params)
    if response.status_code == 200:
        json_response = response.json()
        if 'ParsedResults' in json_response:
            return json_response['ParsedResults'][0]['ParsedText']
        else:
            return ""
    else:
        return None

# Gemini function
def gemini(text, image_base64, api_key):
    api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [
                {"text": text if text else "Can you describe what is going on in the image, highlighting the key elements and ideas? Also include a concise summary."},
                {
                    "inline_data": {
                        "mime_type":"image/jpeg",
                        "data": image_base64
                    }
                }
            ]
        }]
    }
    params = {'key': api_key}
    response = requests.post(api_url, headers=headers, params=params, data=json.dumps(data))
    if response.status_code == 200:
        json_response = response.json()
        return json_response['candidates'][0]['content']['parts'][0]['text']
    else:
        return None

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    url = data['url']
    user_input = data['input']
    
    # API keys
    ocr_space_api_key = 'K89542527488957'
    gemini_api_key = 'AIzaSyAK1WqDRa8UiHQIw3W6SDkrJt2RYaxRJik'

    # Downloads the image from the URL and resizes it and encodes it to base64
    response = requests.get(url)
    if response.status_code == 200:
        image_data = response.content
        byte_stream = io.BytesIO(image_data)
        byte_data = byte_stream.read()
        image_base64 = base64.b64encode(byte_data).decode('utf-8')

    text = ocr(image_base64, ocr_space_api_key) # Call OCR

    input_text = user_input # AI query (change if needed)
    response = gemini(input_text, image_base64, gemini_api_key)

    return jsonify({'result': response})

if __name__ == '__main__':
    app.run(debug=True)
