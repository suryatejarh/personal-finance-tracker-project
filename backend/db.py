# db.py

import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG

def get_db_connection():
    """Create and return a database connection."""
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        print("DB Connection Error:", e)
        return None
