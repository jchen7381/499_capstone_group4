from flask import Flask, request, jsonify, send_file
import requests
import json
import io
import base64
from io import BytesIO
from supabase import create_client
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/get_pdf/*": {"origins": "*"}})

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

supabase_url = "https://rrzufyvihrhlnprspyvh.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyenVmeXZpaHJobG5wcnNweXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTkyNzksImV4cCI6MjAyNTQzNTI3OX0.SoZusxJyuRrcdf-lNlRUxlDAV15A7bLb7ICyK63Mztk"
supabase = create_client(supabase_url, supabase_key)
supabase_bucket_name = "uploaded-pdfs"

@app.route('/get_pdf/<file_name>', methods=['GET'])
def get_pdf(file_name):
    try:
        res = supabase.storage.from_(supabase_bucket_name).download(file_name)
        pdf_data = io.BytesIO(res)
        return send_file(pdf_data, mimetype='application/pdf')
    except Exception as e:
        print("Error:", e)
        return "Error downloading file", 500
   
if __name__ == '__main__':
    app.run(debug=True)
