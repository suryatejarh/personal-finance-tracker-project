from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root@123',
    'database': 'finance_tracker'
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# ============== CATEGORY ENDPOINTS ==============

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM categories ORDER BY name')
    categories = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(categories)

@app.route('/api/categories', methods=['POST'])
def create_category():
    """Create a new category"""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = 'INSERT INTO categories (name, color) VALUES (%s, %s)'
    cursor.execute(query, (data['name'], data['color']))
    conn.commit()
    
    category_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': category_id, 'message': 'Category created successfully'}), 201

@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update a category"""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = 'UPDATE categories SET name = %s, color = %s WHERE id = %s'
    cursor.execute(query, (data['name'], data['color'], category_id))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Category updated successfully'})

@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    
    # Check if category has expenses
    cursor.execute('SELECT COUNT(*) as count FROM expenses WHERE category_id = %s', (category_id,))
    result = cursor.fetchone()
    
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Cannot delete category with existing expenses'}), 400
    
    cursor.execute('DELETE FROM categories WHERE id = %s', (category_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Category deleted successfully'})

# ============== EXPENSE ENDPOINTS ==============

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    query = '''
        SELECT e.id, e.description, e.amount, e.date, e.category_id, c.name as category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        ORDER BY e.date DESC
    '''
    cursor.execute(query)
    expenses = cursor.fetchall()
    
    # Convert date objects to strings
    for expense in expenses:
        if expense['date']:
            expense['date'] = expense['date'].strftime('%Y-%m-%d')
    
    cursor.close()
    conn.close()
    return jsonify(expenses)

@app.route('/api/expenses', methods=['POST'])
def create_expense():
    """Create a new expense"""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = '''
        INSERT INTO expenses (description, amount, category_id, date)
        VALUES (%s, %s, %s, %s)
    '''
    cursor.execute(query, (
        data['description'],
        data['amount'],
        data['category_id'],
        data['date']
    ))
    conn.commit()
    
    expense_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': expense_id, 'message': 'Expense created successfully'}), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an expense"""
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = '''
        UPDATE expenses
        SET description = %s, amount = %s, category_id = %s, date = %s
        WHERE id = %s
    '''
    cursor.execute(query, (
        data['description'],
        data['amount'],
        data['category_id'],
        data['date'],
        expense_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Expense updated successfully'})

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE id = %s', (expense_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Expense deleted successfully'})

# ============== STATISTICS ENDPOINTS ==============

@app.route('/api/statistics/total', methods=['GET'])
def get_total_spent():
    """Get total amount spent"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute('SELECT SUM(amount) as total FROM expenses')
    result = cursor.fetchone()
    total = result[0] if result[0] else 0
    cursor.close()
    conn.close()
    
    return jsonify({'total': float(total)})

@app.route('/api/statistics/by-category', methods=['GET'])
def get_spending_by_category():
    """Get spending grouped by category"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    query = '''
        SELECT c.name, c.color, SUM(e.amount) as total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        GROUP BY c.id, c.name, c.color
        ORDER BY total DESC
    '''
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Convert Decimal to float
    for result in results:
        result['total'] = float(result['total'])
    
    cursor.close()
    conn.close()
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
