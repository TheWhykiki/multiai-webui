from flask import Flask
from flask_cors import CORS
from routes.image_dedup import image_dedup
from routes.gradio_manager import gradio_manager
from routes.flux_training import flux_training

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(image_dedup)
app.register_blueprint(gradio_manager)
app.register_blueprint(flux_training)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
