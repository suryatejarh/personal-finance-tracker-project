# routes/auth.py

from flask import Blueprint, request, jsonify
from db import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.post('/api/login')
def login():
    data = request.json
    userID = data.get("userID")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE userName=%s", (userID,))
    user = cursor.fetchone()

    cursor.close(); conn.close()

    if user and user['password'] == password:
        return jsonify({'success': True, 'user': user})

    return jsonify({'success': False, 'message': "Invalid credentials"}), 401
