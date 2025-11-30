# routes/categories.py

from flask import Blueprint, request, jsonify
from db import get_db_connection

categories_bp = Blueprint("categories", __name__)

@categories_bp.get('/api/categories')
def get_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'DB failed'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories ORDER BY name")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)


@categories_bp.post('/api/categories')
def create_category():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO categories (name, color, userid) VALUES (%s,%s,%s)",
        (data['name'], data['color'], 1)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close(); conn.close()
    return jsonify({'id': new_id}), 201


@categories_bp.put('/api/categories/<int:id>')
def update_category(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE categories SET name=%s, color=%s WHERE id=%s",
        (data['name'], data['color'], id)
    )
    conn.commit()
    cursor.close(); conn.close()
    return jsonify({'message': 'Updated'})


@categories_bp.delete('/api/categories/<int:id>')
def delete_category(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM expenses WHERE category_id=%s", (id,))
    if cursor.fetchone()[0] > 0:
        return jsonify({'error': 'Category has expenses'}), 400

    cursor.execute("DELETE FROM categories WHERE id=%s", (id,))
    conn.commit()
    cursor.close(); conn.close()
    return jsonify({'message': 'Deleted'})
