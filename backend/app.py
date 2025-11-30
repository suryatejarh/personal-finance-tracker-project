# app.py

from flask import Flask
from flask_cors import CORS
from config import CORS_CONFIG
from routes import categories_bp, expenses_bp, stats_bp, auth_bp

def create_app():
    app = Flask(__name__)

    # CORS
    CORS(app, resources={r"/api/*": CORS_CONFIG}, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(categories_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(auth_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
