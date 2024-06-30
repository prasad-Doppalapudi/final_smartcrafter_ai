import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def generate_content(prompt):
    # Configure OpenAI API key from environment variable
    openai.api_key = os.getenv("CONTENT_WRITER_API")

    # Call the OpenAI API to generate content
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    # Extract and return the generated content
    return response.choices[0].message.content