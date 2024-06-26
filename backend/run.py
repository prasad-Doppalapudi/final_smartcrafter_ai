import os
import requests
from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from text_to_speech import text_to_speech
from speech_to_text import speech_to_text
from detach_audio_video import detach_audio
from utils import create_directory
from signup import signup_bp
from login import login_bp
from contentwriter import generate_content
from imagegenerator import generate_image
from PIL import Image
from create_logo import generate_logo
#from translatevideo import handle_translation_request
import openai
import logging
from generatevideo import generate_video
from image_variant import modify_image  
from werkzeug.utils import secure_filename

logger = logging.getLogger(__name__)

app = Flask(__name__)

CORS(app, origins="http://localhost:3000", allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST"])
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
CORS(app, supports_credentials=True, resources={r"/translate-video": {"origins": "http://localhost:3000"}})

AUDIO_UPLOAD_FOLDER = 'uploads/audio'
IMAGE_UPLOAD_FOLDER = 'uploads/images'
OUTPUT_FOLDER = 'outputs/images'
create_directory(AUDIO_UPLOAD_FOLDER)
create_directory(IMAGE_UPLOAD_FOLDER)
create_directory(OUTPUT_FOLDER)

app.config['UPLOAD_FOLDER'] = IMAGE_UPLOAD_FOLDER

# Routes for signup and login
app.register_blueprint(signup_bp, url_prefix='/signup')
app.register_blueprint(login_bp, url_prefix='/login')

@app.route('/')
def home():
    return 'Welcome to the backend!'

@app.route('/generate_content', methods=['POST'])
def generate_content_route():
    data = request.get_json()
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    content = generate_content(prompt)
    return jsonify({'content': content})

@app.route('/detach_audio', methods=['POST'])
def detach_audio_route():
    if 'videoFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['videoFile']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    video_path = os.path.join(AUDIO_UPLOAD_FOLDER, file.filename)
    audio_path = os.path.join(AUDIO_UPLOAD_FOLDER, 'extracted_audio.mp3')
    file.save(video_path)
    
    try:
        detached_audio_path = detach_audio(video_path, audio_path)
        return send_file(detached_audio_path, mimetype='audio/mp3')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_image', methods=['POST'])
def generate_image_route():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    image_url = generate_image(prompt)
    return jsonify({"image_url": image_url})

@app.route('/translate-video', methods=['POST'])
def translate_video():
    if 'file' not in request.files or 'target_language' not in request.form:
        return jsonify({'error': 'File or target language missing'}), 400
 
    file = request.files['file']
    target_language = request.form['target_language']
 
    files = {'file': (file.filename, file.stream, file.content_type)}
    data = {'target_language': target_language}
    headers = {'api-key': 'djvhkjw443vkjwegwruwvn9282'}
 
    try:
        logger.info("Start Processing file")
        response = requests.post('https://video-translation-i5kchl7iya-uc.a.run.app/translate-video', files=files, params=data, headers=headers)
        response.raise_for_status()
        translated_video_url = response.json().get('url')
        if translated_video_url:
            return jsonify({'translated_video_url': translated_video_url})
        else:
            logger.error("error", response.json())
            return jsonify({'error': 'Translation failed'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_logo', methods=['POST'])
def generate_logo_route():
    data = request.get_json()

    business_name = data.get('businessName')
    tagline = data.get('tagline')
    industry = data.get('industry')
    color_scheme = data.get('colorScheme')
    style = data.get('style')
    symbol = data.get('symbol')
    keywords = data.get('keywords')
    audience = data.get('audience')

    if len(business_name) > 50:
        return jsonify({'error': 'Business name cannot exceed 50 characters.'}), 400
    if len(tagline) > 100:
        return jsonify({'error': 'Tagline cannot exceed 100 characters.'}), 400
    if len(symbol) > 30:
        return jsonify({'error': 'Symbol cannot exceed 30 characters.'}), 400

    prompt = f"Create a logo for {business_name} with tagline '{tagline}' in the {industry} industry. " \
             f"Preferred colors are {color_scheme}. Style should be {style}. Include a {symbol}. " \
             f"Keywords: {keywords}. Target audience: {audience}."

    try:
        image_url = generate_logo(prompt)
        return jsonify({"image_url": image_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download_logo', methods=['POST'])
def download_logo_route():
    data = request.get_json()
    image_url = data['image_url']
    response = requests.get(image_url)

    if response.status_code == 200:
        file_path = 'generated_logo.png'
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return send_file(file_path, mimetype='image/png', as_attachment=True)
    else:
        return jsonify({'error': 'Failed to download image'}), 500

@app.route('/download_image', methods=['POST'])
def download_image_route():
    data = request.get_json()
    image_url = data.get('image_url')

    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400

    response = requests.get(image_url)

    if response.status_code == 200:
        file_path = 'downloaded_image.png'
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return send_file(file_path, mimetype='image/png', as_attachment=True)
    else:
        return jsonify({'error': 'Failed to download image'}), 500

@app.route('/generate_video', methods=['POST'])
def generate_video_route():
    data = request.get_json()
    prompt = data.get('prompt')
    language = data.get('language', 'en')  # Default to English if not specified
    accent = data.get('accent', 'default')  # Default accent
    voice = data.get('voice', 'default')  # Default voice
    video_size = data.get('video_size', '720p')  # Default video size

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    try:
        video_path = generate_video(prompt, language, accent, voice, video_size)
        return send_file(video_path, mimetype='video/mp4', as_attachment=True)
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/modifyImage', methods=['POST'])
def modify_image_route():
    try:
        # Check for file part in the request
        if 'image_file' not in request.files:
            app.logger.error('No image file part in the request')
            return jsonify({'error': 'No image file part in the request'}), 400
        
        file = request.files['image_file']
        prompt = request.form['prompt']
        
        # If the user does not select a file, the browser submits an empty file without a filename.
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Now handle image modification using file_path and prompt
            modified_image_url = modify_image(file_path, prompt)
            return jsonify({'modified_image_url': modified_image_url})
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred during image modification'}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

if __name__ == '__main__':
    logger.info("Starting Server")
    app.run(debug=True)