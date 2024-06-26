
import openai

def generate_image(prompt):
        openai.api_key = "sk-proj-Ratk7EyFySvCMAJrCKNET3BlbkFJGVW4JTdUTdqniPFpankq"
        response = openai.Image.create(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            quality="hd",
            size="1024x1024"
            )
        image_url = response["data"][0]["url"]
        return image_url