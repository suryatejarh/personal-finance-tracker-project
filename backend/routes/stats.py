# routes/stats.py

from flask import Blueprint, request, jsonify
from db import get_db_connection

stats_bp = Blueprint("stats", __name__)

@stats_bp.get('/api/statistics/total')
def total_spent():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) FROM expenses")
    result = cursor.fetchone()[0] or 0
    cursor.close(); conn.close()
    return jsonify({'total': float(result)})


@stats_bp.get('/api/statistics/by-category')
def by_category():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.name, c.color, SUM(e.amount) total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        GROUP BY c.id
        ORDER BY total DESC
    """)
    data = cursor.fetchall()
    for row in data:
        row['total'] = float(row['total'])
    cursor.close(); conn.close()
    return jsonify(data)


@stats_bp.get('/api/expenses/pie-data-range') 
def pie_data_range():
    start=request.args.get('start')
    end=request.args.get('end')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT c.name AS category, SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.date BETWEEN %s AND %s
        GROUP BY c.id, c.name
    """, (start, end))

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': data})

@stats_bp.get('/api/expenses/monthly-data-range')
def monthly_data_range():
    start=request.args.get('start')
    end=request.args.get('end')
    
    conn= get_db_connection()
    cursor= conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT DATE_FORMAT(e.date, '%Y-%m') AS month, c.name AS category, SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.date BETWEEN %s AND %s
        GROUP BY month, category
        ORDER BY month
    """, (start, end))  

    data= cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': data})

@stats_bp.get('/api/expenses/summary-range')
def summary_range():
    start=request.args.get('start')
    end=request.args.get('end')

    conn= get_db_connection()
    cursor= conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT SUM(amount) AS total_spend
        FROM expenses
        WHERE date BETWEEN %s AND %s
    """, (start, end))
    total=cursor.fetchone()['total_spend'] or 0

    cursor.execute("""
        SELECT AVG(amount) AS avg_spend
        FROM expenses
        WHERE date BETWEEN %s AND %s
    """, (start, end))
    avg=cursor.fetchone()['avg_spend'] or 0

    #Highest category
    cursor.execute("""
        SELECT c.name AS category, SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.date BETWEEN %s AND %s
        GROUP BY c.id, c.name
        ORDER BY total DESC
        LIMIT 1
    """, (start, end))
    highest=cursor.fetchone()
 
    cursor.close()
    conn.close()

    return jsonify({
        'success': True,
        'total_spend': float(total),
        'avg_spend': float(avg),
        'highest_category': highest['category'] if highest else None,
        'highest_category_total': float(highest['total']) if highest else None
    })
