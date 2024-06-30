import openai
from google.cloud import texttospeech
from google.oauth2 import service_account
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
from dotenv import load_dotenv
import os
import requests
import re
import json

# Load environment variables from .env file
load_dotenv()

def extend_text(prompt):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Add this list of words to ignore
    words_to_ignore = ['video', 'creation', 'generate', 'create', 'image']

    # Replace the words to ignore in the prompt
    for word in words_to_ignore:
        prompt = re.sub(r'\b' + word + r'\b', '', prompt, flags=re.IGNORECASE).strip()
    extended_text = ""
    while True:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            stop=None
        )
        new_text = response.choices[0].message['content'].strip()
        if new_text.endswith(".") or new_text.endswith("!") or new_text.endswith("?"):
            extended_text += new_text
            break
        else:
            extended_text += new_text + " "
            prompt = new_text

    print("Extended Text:", extended_text)  # Print the extended text to verify it
    return extended_text

def split_text_into_segments(text, segment_length=20):
    words = text.split()
    segments = [' '.join(words[i:i + segment_length]) for i in range(0, len(words), segment_length)]
    return segments

def generate_audio_segment(text, segment_index, language, accent, voice):
    credentials_dict = json.loads(os.getenv("GOOGLE_CLOUD_CREDENTIALS"))
    credentials = service_account.Credentials.from_service_account_info(credentials_dict)
    client = texttospeech.TextToSpeechClient(credentials=credentials)

    synthesis_input = texttospeech.SynthesisInput(text=text)
    valid_language_code = "en-US"  # Example for American English
    if language.lower() == "english":
        valid_language_code = "en-US"

    valid_voice_name = f"{valid_language_code}-Wavenet-D"  # Example voice

    voice_params = texttospeech.VoiceSelectionParams(
        language_code=valid_language_code,
        name=valid_voice_name,
        ssml_gender=texttospeech.SsmlVoiceGender.MALE if voice == "MALE" else texttospeech.SsmlVoiceGender.FEMALE
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice_params, audio_config=audio_config
    )

    audio_file = f"segment_audio_{segment_index}.mp3"
    with open(audio_file, "wb") as out:
        out.write(response.audio_content)

    return audio_file

def generate_images(segments):
    openai.api_key = os.getenv("IMAGE_GENERATOR_API_KEY")
    images = []
    for idx, segment in enumerate(segments):
        response = openai.Image.create(
            model="dall-e-3",
            prompt=segment,
            n=1,
            size="1024x1024"
        )
        image_data = response.data[0]
        image_url = image_data['url']
        image_path = f'segment_image_{idx}.png'
        img_response = requests.get(image_url)
        with open(image_path, 'wb') as file:
            file.write(img_response.content)
        images.append(image_path)
    return images

def create_video(images, audio_files, video_size, fps=24):
    clips = []
    for image, audio_file in zip(images, audio_files):
        image_clip = ImageClip(image).set_duration(AudioFileClip(audio_file).duration)  # Set duration to match audio segment
        image_clip.fps = fps
        audio_clip = AudioFileClip(audio_file)
        clip = image_clip.set_audio(audio_clip)
        clips.append(clip)

    final_video = concatenate_videoclips(clips, method="compose")

    # Set the video size based on user input
    if video_size == "youtube":
        final_video = final_video.resize(height=1080)
    elif video_size == "shorts":
        final_video = final_video.resize(height=720)
    elif video_size == "reel":
        final_video = final_video.resize(height=1920, width=1080)

    output_file = f"output_{video_size}.mp4"
    final_video.write_videofile(output_file, codec="libx264", audio_codec="aac", fps=fps)
    return output_file

def generate_video(prompt, language, accent, voice, video_size):
    extended_text = extend_text(prompt)
    segments = split_text_into_segments(extended_text)
    audio_files = [generate_audio_segment(segment, idx, language, accent, voice) for idx, segment in enumerate(segments)]
    images = generate_images(segments)
    video_file = create_video(images, audio_files, video_size, fps=24)
    return video_file

# For debugging: Load environment variables and print them to ensure they are loaded correctly
print("GOOGLE_CLOUD_CREDENTIALS:", os.getenv("GOOGLE_CLOUD_CREDENTIALS"))
print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
print("IMAGE_GENERATOR_API_KEY:", os.getenv("IMAGE_GENERATOR_API_KEY"))