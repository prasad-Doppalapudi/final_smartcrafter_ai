# app/__init__.py

from flask import Flask
from config import Config

def create_app():
    app = Flask(__name__)

    # Add your configurations, routes, and other setup here
    app.config.from_object(Config)

    @app.route('/')
    def index():
        return 'Heloo, Samrt Crafter.ai!'
    return app
