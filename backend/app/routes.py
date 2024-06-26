from flask import Flask, render_template

app = Flask(__name__)

# Your existing routes
# ...

# Add a route to render the React App
@app.route('/')
def index():
    return render_template('index.html')  # Assuming you have an 'index.html' in the 'templates' folder
