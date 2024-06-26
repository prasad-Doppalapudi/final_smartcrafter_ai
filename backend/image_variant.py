import openai
from io import BytesIO
from PIL import Image

openai.api_key = 'sk-proj-Ratk7EyFySvCMAJrCKNET3BlbkFJGVW4JTdUTdqniPFpankq'

def modify_image(file_path, prompt):
    with open(file_path, 'rb') as image_file:
        image = BytesIO(image_file.read())
    
    response = openai.Image.create_edit(
        model="dalle-2",
        image=image,
        instruction=prompt
    )
    modified_image_url = response['data'][0]['url']
    return modified_image_url