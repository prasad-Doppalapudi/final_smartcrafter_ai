import openai

def generate_content(prompt):
    # Configure OpenAI API key
    openai.api_key = "sk-proj-FHgNiaD6EVenJAcmpx1jT3BlbkFJVBzhs3JHYKlKnFOoemiW"

     # Call the OpenAI API to generate content
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
           {"role": "user", "content": prompt}
        ]
    )

    # Extract and return the generated content
    return response.choices[0].message.content
    #print(completion.choices[0].message)        