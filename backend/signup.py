# signup.py
from flask import Blueprint, request, jsonify

signup_bp = Blueprint('signup', __name__)

users = []  # Temporary data store (Replace this with a database in a production scenario)

@signup_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username', '')
        password = data.get('password', '')

        # Check if the username is already taken
        if any(user['username'] == username for user in users):
            return jsonify({'error': 'Username already taken'}), 400

        # Store the user data (you may hash the password in a real-world scenario)
        users.append({'username': username, 'password': password})
        return jsonify({'message': 'User signed up successfully'})

    except Exception as e:
        return jsonify({'error': 'An error occurred during signup'}), 500
