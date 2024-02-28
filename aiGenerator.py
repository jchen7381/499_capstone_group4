import requests
import json
import io
import base64
from io import BytesIO

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

def gemini(text, api_key):
    api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts":[{
                "text": text
            }]
        }]
    }
    params = {'key': api_key}
    response = requests.post(api_url, headers=headers, params=params, data=json.dumps(data))
    if response.status_code == 200:
        json_response = response.json()
        return json_response['candidates'][0]['content']['parts'][0]['text']
    else:
        return None

def geminiImage(text, image_base64, api_key):
    api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [
                {"text": text if text else "What is this picture?"},
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

def aiGenerator(url):
    # API keys
    ocr_space_api_key = 'K89542527488957'
    gemini_api_key = 'AIzaSyAK1WqDRa8UiHQIw3W6SDkrJt2RYaxRJik'

    response = requests.get(url)
    if response.status_code == 200:
        image_data = response.content
        byte_stream = io.BytesIO(image_data)
        byte_data = byte_stream.read()
        image_base64 = base64.b64encode(byte_data).decode('utf-8')

    text = ocr(image_base64, ocr_space_api_key)

    if text != "":
        input_text = "Please summarize the concept in the following text" + text
        response = gemini(input_text, gemini_api_key)
        return response
    else:
        input_text = "Please summarize the concept in the following image"
        response = geminiImage(input_text, image_base64, gemini_api_key)
        return response
