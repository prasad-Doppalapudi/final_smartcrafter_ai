# speech_to_text.py
from google.cloud import speech_v1p1beta1 as speech

def speech_to_text(audio_content, language_code='en-US'):
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=language_code,
    )

    response = client.recognize(config=config, audio=audio)

    return response.results[0].alternatives[0].transcript
