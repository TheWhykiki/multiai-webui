from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from .routes.api_routes import api_routes
from .routes.mochi_routes import mochi_routes
from dotenv import load_dotenv

def create_app():
    # Load environment variables
    load_dotenv()
    
    app = Flask(__name__)

    # Debug-Modus für PyCharm, aber ohne Flask Debugger
    if os.environ.get('PYCHARM_DEBUG') == '1':
        try:
            import pydevd_pycharm
            pydevd_pycharm.settrace('127.0.0.1', port=5678, stdoutToServer=True, stderrToServer=True, suspend=False)
        except Exception as e:
            print(f"Fehler beim Verbinden des Debuggers: {e}")

    # Flask Debug-Modus deaktiviert lassen
    app.debug = False

    CORS(app,
         resources={r"/api/*": {  # Nur für /api/ Routen
             "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }})

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
        
    app.register_blueprint(api_routes, url_prefix='/api')
    app.register_blueprint(mochi_routes, url_prefix='/api/mochi')
    
    # Print environment variables for debugging
    print("Environment variables loaded:")
    print(f"REPLICATE_API_TOKEN set: {'Yes' if os.environ.get('REPLICATE_API_TOKEN') else 'No'}")
        
    return app