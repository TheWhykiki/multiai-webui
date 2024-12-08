from flask import Blueprint, jsonify, request
from utils.gradio_manager import GradioAppManager
import os

gradio_manager = Blueprint('gradio_manager', __name__)

# Initialisiere den App-Manager
config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'gradio_apps.json')
app_manager = GradioAppManager(config_path)

@gradio_manager.route('/api/gradio/apps', methods=['GET'])
def list_apps():
    """Liste alle verfügbaren Gradio Apps"""
    apps = app_manager.get_all_apps()
    return jsonify(apps)

@gradio_manager.route('/api/gradio/apps/<app_id>/start', methods=['POST'])
def start_app(app_id):
    """Starte eine spezifische Gradio App"""
    result = app_manager.start_app(app_id)
    return jsonify(result)

@gradio_manager.route('/api/gradio/apps/<app_id>/stop', methods=['POST'])
def stop_app(app_id):
    """Stoppe eine spezifische Gradio App"""
    result = app_manager.stop_app(app_id)
    return jsonify(result)

@gradio_manager.route('/api/gradio/apps/<app_id>/status', methods=['GET'])
def app_status(app_id):
    """Get the status of a specific Gradio App"""
    status = app_manager.get_app_status(app_id)
    return jsonify(status)
