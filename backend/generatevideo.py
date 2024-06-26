import os
import openai
from google.cloud import texttospeech
from google.oauth2 import service_account
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
import requests
import re

# Credentials JSON as a Python dictionary
CREDENTIALS_DICT = {
    "type": "service_account",
    "project_id": "langconv-411123",
    "private_key_id": "your_private_key_id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy3fYS3MkmShkT\nOz25nkW2635v1PyZFCO8g4O86M0b22q4LHS2COGJ495YraFb3tQrfvL62RbJWOOg\nJzS7goStPmxSn29qWFhEHyQpy5Tnlf5ki0g6SXJNeWdcnjWjYtgvOxZBFRwxmqgl\nU1JBCAz+Qgg1wFnyHYf6IZP9eFBJ7ZrnS73djTIDNwBpPViiMnavbVICps/9laHn\nAd7X+RTupE4qyDCv9rGCAjQcriwosQ4+ygx4AU8zvYF0EFyUgci8OhUBY31sR8TX\nCeFhgDcRLXolBUWI6jx6AYgGAWi1iQR9iifOBrJ3Lw82g1wBY+0OAtvsXmw4rWC+\nltW4OkNtAgMBAAECggEAIsHM8mdi0wTtEHafjPU7eMsUG6kYmKp4M0afD9NxH+uo\nNje1SjY5lXDpIPREebS4J+eYUbRjoCacvN9BePpoy71okTmYDeMy67Hddh2wRrw3\n3dPO6jyhcHqZ4j6AD8rCVZM2xNjUTLNP30jsn+Rvmey86a0CDXE9nhZuSn/ZojOt\nbYk10+h35WU8Red9AA+r/Cnf/o6+7uC7KQTVt1JE262cz9l8CCh9bNOUYZmSuY++\nJS9OM+zrux5j2tg5LNaB8Lbs0Uzzc4tXcZ7onykXVIETPGfawbb1tYs8Za+2s1yn\niiHhefG5QiqiM07/7pHhBkioMLTFly0zEcxPZOlJ4QKBgQDiXt+bauWpg05pF2Lj\n4G7qAqLWdJGyxvs15QGYzQO8WaZXlyxjT7caH6VjQECV3hBIXKG9xwjrucsyDg/c\ne+l/nvVrDM0iCYppSU8H96JeBQqRtQMWouaX9diPArjtPwwcl/sXG3v9A8Vgncb2\ni1CeBaeN8ravcz+LjmjB8w7/CQKBgQDKR1v3FdZQjuwTTnsiSX/s2LymM/MxKYDf\nE8BVjvgTiExU03Jk8+2LA9zSXXbY/M2v2l5vO17gOqSEADk6YX3Lpxxjg2CHUaMQ\neR4/ysOvZ26OrA03SisifGGzs9E/whWvAxm3lqLY6cGFTuB5iCGCSig8W8Y0yBtZ\nVt5tzY7WRQKBgHDvVC99jUacs6nKeROnDK7C0eqcDXRbwUiKD9njrlFxiIN6cDK7\numXWE/UIQTCDsSvoyuibO+AeuTknutINH9kDvPzDTjQE/oC4ii03ZlHxwewfmoLY\nkqKNjJUMjqYOJkS9rg9BLwJzty0UigbGSloMCCPRS0MNBE7jpW/di0XBAoGAcCTr\n2arjrLnwLCwAnFu/bqIixMpcc88cwZCDu2uOIdYY65Zm/401DzNPA9oJf/d4WZxp\naqWxzgL1HrG5CKLwSS4W0R0PMTaTfxiHKrrRjrd7VeIRWavnCjGHQUfaJM0HlIXV\nhjEfi77dKXk3fml4mnFeqUgANVcTwo4ktx+VpzkCgYEAtyy8hXbDCjJWWQbu4SJh\nLm/UqCVUeXAFtB/Nq9EyynA9J/Gi3pYnX3yP2SZPcgYeIzEPClp8ia3yUMZYQM6p\ncOCKIZkOy74/oCwDoYTJhsPd3q+vWQy1HcqRlK7gMfdIBdWYlNc+8FPlKwsXFZ2v\n9oUalQdd6IT5/z/px7+Vk44=\n-----END PRIVATE KEY-----\n",
    "client_email": "video-lang-converter@langconv-411123.iam.gserviceaccount.com",
    "client_id": "your_client_id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/video-lang-converter@langconv-411123.iam.gserviceaccount.com"
}

def extend_text(prompt):
    openai.api_key = "sk-proj-FHgNiaD6EVenJAcmpx1jT3BlbkFJVBzhs3JHYKlKnFOoemiW"
    
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
    credentials = service_account.Credentials.from_service_account_info(CREDENTIALS_DICT)
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
    openai.api_key = "sk-proj-Ratk7EyFySvCMAJrCKNET3BlbkFJGVW4JTdUTdqniPFpankq"
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
