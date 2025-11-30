# routes/expenses.py

from flask import Blueprint, request, jsonify
from db import get_db_connection

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.get('/api/expenses')
def get_expenses():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT e.id, e.description, e.amount, e.date,
               e.category_id, c.name as category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        ORDER BY e.date DESC
    """)
    data = cursor.fetchall()

    for row in data:
        row['date'] = row['date'].strftime("%Y-%m-%d")

    cursor.close(); conn.close()
    return jsonify(data)


@expenses_bp.post('/api/expenses')
def create_expense():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
      INSERT INTO expenses (description, amount, category_id, userid, date)
      VALUES (%s,%s,%s,%s,%s)
    """, (data['description'], data['amount'], data['category_id'],
          request.headers.get("userid"), data['date']))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close(); conn.close()
    return jsonify({'id': new_id}), 201


@expenses_bp.put('/api/expenses/<int:id>')
def update_expense(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
       UPDATE expenses SET description=%s, amount=%s,
       category_id=%s, date=%s WHERE id=%s
    """, (data['description'], data['amount'], data['category_id'], data['date'], id))
    conn.commit()
    cursor.close(); conn.close()
    return jsonify({'message': 'Updated'})


@expenses_bp.delete('/api/expenses/<int:id>')
def delete_expense(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id=%s", (id,))
    conn.commit()
    cursor.close(); conn.close()
    return jsonify({'message': 'Deleted'})
