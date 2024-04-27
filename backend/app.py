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
        if 'candidates' in json_response and json_response['candidates']:
            if 'content' in json_response['candidates'][0]:
                return json_response['candidates'][0]['content']['parts'][0]['text']
            else:
                return "No AI Output, please try again."
        else:
            return "No AI Output, please try again."
    else:
        return None

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    image = data['image']
    subject = data['subject']  
    custom_query = data.get('customQuery') # Custom query/user input
    
    # API keys
    ocr_space_api_key = 'K89542527488957'
    gemini_api_key = 'AIzaSyAK1WqDRa8UiHQIw3W6SDkrJt2RYaxRJik'

    text = ocr(image, ocr_space_api_key) # Call OCR
    
    # Mapping subjects to their queries
    subject_queries = {
        'Math': 'The provided image is a math-related image, please summarize the concepts shown and solve any problems shown, if there are any text in the provided image, it is shown here: ',
        'CS': 'The provided image is a Computer Science related image, please summarize the concepts shown and please give some relevant code examples/samples if possible, if there are any text in the provided image, it is shown here: ',
        'English': 'The provided image is a English-subject related image, please summarize the concepts shown (from a literary stance if possible), if there are any text in the provided image, it is shown here: ',
        'Other': 'Please summarize the concepts in the provided image, if there are any text in the provided image, it is shown here: '
    }

    if subject == "Custom":
        input_text = custom_query + " " + text
    else:
        input_text = "Important Note: This is for a study guide. " + subject_queries.get(subject) + " " + text
    
    response = gemini(input_text, image, gemini_api_key) 
    
    return jsonify({'result': response})


supabase_url = "https://rrzufyvihrhlnprspyvh.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyenVmeXZpaHJobG5wcnNweXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTkyNzksImV4cCI6MjAyNTQzNTI3OX0.SoZusxJyuRrcdf-lNlRUxlDAV15A7bLb7ICyK63Mztk"
supabase = create_client(supabase_url, supabase_key)

@app.route('/signup', methods=['POST'])
def signup():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        response = supabase.auth.sign_up({'email': email, 'password': password})
        if response.user is not None:
            return jsonify({'message': 'Sign up successful'})
        else:
            return jsonify({'error': response.error_description})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        response = supabase.auth.sign_in_with_password({'email': email, 'password': password})
        if response.user is not None:
            session = supabase.auth.get_session()
            session_data = {
                'access_token': session.access_token,
                'refresh_token': session.refresh_token,
            }
            return {'message': 'Login successful', 'session': session_data}
        else:
            return {'error': response.error_description}
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create-workspace', methods=["POST"])
def create_workspace():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        response = supabase.auth.set_session(access_token, refresh_token)
        data, count = supabase.rpc('create_workspace').execute()
        return jsonify(data[1])
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/get-workspaces', methods=['POST'])
def get_workspaces():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        response = supabase.auth.set_session(access_token, refresh_token)
        result = supabase.rpc('get_workspaces').execute()
        return result.data
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/get-workspace', methods=["POST"] )
def get_workspace():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        response = supabase.auth.set_session(access_token, refresh_token)
        result = supabase.rpc('get_workspace', {'workspace_id'}).execute()
        return result.data
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/workspace/delete', methods=["POST"])
def deleteWorkspace():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        workspace_id = request.json.get('workspace_id')
        response = supabase.auth.set_session(access_token, refresh_token)
        print('WorkspaceID' , workspace_id)
        result = supabase.rpc('delete_workspace', {'id': workspace_id}).execute()

        return jsonify('a')
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/workspace/save', methods=["POST"])
def workspaceSave():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        workspace_id = request.json.get('workspace_id')
        workspace_title = request.json.get('workspace_title')
        response = supabase.auth.set_session(access_token, refresh_token)
        result = supabase.table('workspaces').update({'title': workspace_title}).eq('workspace_id', workspace_id).execute()
        return jsonify({'message': 'saved'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/editor/save', methods=["POST"])
def editorSave():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        editor_id = request.json.get('editor_id')
        editor_data = request.json.get('data')
        response = supabase.auth.set_session(access_token, refresh_token)
        result = supabase.table('editor').update({'data': editor_data}).eq('id', editor_id).execute()
        return jsonify({'message': 'saved'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/editor/get', methods=["POST"])
def editorGet():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        editor_id = request.json.get('editor_id')
        response = supabase.auth.set_session(access_token, refresh_token)
        result = supabase.table('editor').select('data').eq('id', editor_id).execute()
        print(result.data)
        return result.data
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload():
    try:
        req = request.form
        file = request.files['file']
        session = supabase.auth.set_session(req['access_token'], req['refresh_token'])
        path = "/" + session.user.id        
        pdf = supabase.table('pdf').insert({'name': file.filename, "path": session.user.id}).execute()  #Insert into pdf table, returning the row
        path += "/" + pdf.data[0]['id']
        res = supabase.table('workspaces').update({"pdf_id": pdf.data[0]['id']}).eq('workspace_id', req['workspace_id']).execute() #use the row id from pdf
        result = supabase.storage.from_('user buckets').upload(path, file.read(), file_options={"content-type": file.content_type})
        link = supabase.storage.from_('user buckets').get_public_url(path)
        return jsonify({'link': link})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/get-file', methods=['POST'])
def get_file():
    try:
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        workspace = request.json.get('workspace_id')
        response = supabase.auth.set_session(access_token, refresh_token)
        pdf = supabase.rpc('get_file', {'workspaceid': workspace}).execute()
        print(pdf)
        if pdf.data == None:
            return jsonify({'link': ""})
        
        link = supabase.storage.from_('user buckets').get_public_url(pdf.data)
        print(link)
        return jsonify({'link': link})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert():
    convertapi_secret = 'vOlz7wkiOEGA54hD'
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Check mime types
    mime_to_endpoint = {
        'application/msword': 'doc/to/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx/to/pdf',
        'application/vnd.ms-powerpoint': 'ppt/to/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx/to/pdf',
        'image/jpeg': 'jpg/to/pdf',
        'image/png': 'png/to/pdf'
    }

    if file.mimetype in mime_to_endpoint:
        file_data = base64.b64encode(file.read()).decode('utf-8')

        # ConvertAPI request
        payload = {
            "Parameters": [
                {
                    "Name": "File",
                    "FileValue": {
                        "Name": file.filename,
                        "Data": file_data
                    }
                }
            ]
        }

        # Make request
        response = requests.post(f'https://v2.convertapi.com/convert/{mime_to_endpoint[file.mimetype]}?Secret={convertapi_secret}', json=payload)

        if response.status_code == 200:
            pdf_data = response.json()["Files"][0]["FileData"]
            pdf_content = base64.b64decode(pdf_data)
            return pdf_content, 200, {'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="converted_file.pdf"'}
        else:
            return jsonify({'error': 'Conversion failed'}), response.status_code
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
