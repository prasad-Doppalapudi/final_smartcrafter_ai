import openai

def generate_logo(prompt):
    openai.api_key = "sk-proj-AqOybsp2SujrShtNXNdET3BlbkFJAeFXsRDH6sUyxhz7dUZr"
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
