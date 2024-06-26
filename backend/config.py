
# config.py

import os

class Config:
    DEBUG = False
    SECRET_KEY = 'your_secret_key'
    DATABASE_URI = 'sqlite:///your_database.db'
    # Add more configuration variables as needed

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = 'sqlite:///dev_database.db'
    # Add development-specific configuration variables if needed

class ProductionConfig(Config):
    DATABASE_URI = 'postgresql://user:password@localhost/production_db'
    # Add production-specific configuration variables if needed

# You can also use environment variables to configure sensitive information
SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback_secret_key')
