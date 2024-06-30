import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def generate_logo(prompt):
    openai.api_key = os.getenv("LOGO_GENERATOR_API_KEY")
    
    try:
        response = openai.Image.create(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response["data"][0]["url"]
        return image_url
    except Exception as e:
        return f"Error generating logo: {str(e)}"