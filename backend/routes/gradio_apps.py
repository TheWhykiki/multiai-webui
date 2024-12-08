from flask import Blueprint, jsonify
import gradio as gr

gradio_apps = Blueprint('gradio_apps', __name__)

def example_function(text):
    return f"Processed: {text}"

# Erstelle eine Gradio-Interface
interface = gr.Interface(
    fn=example_function,
    inputs="text",
    outputs="text",
    title="Example Gradio App"
)

# Starte die Gradio-App auf einem bestimmten Port
app = interface.launch(server_name="0.0.0.0", server_port=7860, share=False)

@gradio_apps.route('/api/gradio/status')
def get_status():
    return jsonify({
        "status": "running",
        "url": "http://localhost:7860"
    })
