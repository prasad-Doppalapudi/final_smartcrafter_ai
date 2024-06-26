# login.py
from flask import Blueprint, request, jsonify

login_bp = Blueprint('login', __name__)

users = []  # Temporary data store (Replace this with a database in a production scenario)

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username', '')
        password = data.get('password', '')

        # Check if the user exists and the password matches (this is a simplistic example)
        user = next((user for user in users if user['username'] == username and user['password'] == password), None)
        if user:
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': 'An error occurred during login'}), 500
