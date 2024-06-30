import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def generate_image(prompt):
    openai.api_key = os.getenv("IMAGE_GENERATOR_API_KEY")
    
    try:
        response = openai.Image.create(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            quality="hd",
            size="1024x1024"
        )
        image_url = response["data"][0]["url"]
        return image_url
    except Exception as e:
        return f"Error generating image: {str(e)}"