from flask import Blueprint, jsonify, request, send_from_directory, current_app, send_file
from backend.app.services.replicate_massgenerate_service import ReplicateMassgenerateService
from backend.app.services.leonardo_service import LeonardoService
from backend.config import Config
import os
import logging

api_routes = Blueprint('api', __name__)

replicate_service = ReplicateMassgenerateService()
leonardo_service = LeonardoService(Config.LEONARDO_API_KEY)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test route to verify API is working
@api_routes.route('/', methods=['GET'])
def index():
    return jsonify({"status": "API is running"})

# Route to serve static files from a directory
@api_routes.route('/images/<path:filename>')
def serve_image(filename):
    try:
        logger.info(f"Received request for image: {filename}")
        
        # Clean up the path - remove query parameters and clean slashes
        clean_filename = filename.split('?')[0].strip('/')
        
        # If the path starts with Users, add the root slash
        if clean_filename.startswith('Users'):
            full_path = '/' + clean_filename
        else:
            full_path = clean_filename

        logger.info(f"Attempting to serve image from: {full_path}")
        
        if not os.path.isfile(full_path):
            logger.error(f"File not found: {full_path}")
            # Try to list the directory contents if the directory exists
            dir_path = os.path.dirname(full_path)
            if os.path.isdir(dir_path):
                logger.info(f"Directory contents of {dir_path}:")
                for f in os.listdir(dir_path):
                    logger.info(f"  - {f}")
            return jsonify({"error": "Image file not found"}), 404

        logger.info(f"File exists, attempting to send: {full_path}")
        try:
            return send_file(
                full_path,
                mimetype='image/png',
                as_attachment=False,
                download_name=os.path.basename(full_path)
            )
        except Exception as e:
            logger.error(f"Error sending file {full_path}: {str(e)}")
            return jsonify({"error": f"Error sending file: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Error serving image {filename}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api_routes.route('/replicate_massgenerate', methods=['POST'])
def run_replicate_model():
    try:
        data = request.json
        logger.info("Received request data: %s", data)
        
        # Validate required fields
        required_fields = ['model', 'prompt', 'outputFolder']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        model_name = data['model']
        prompt = data['prompt']
        output_folder = data['outputFolder']
        
        # Ensure output folder exists
        os.makedirs(output_folder, exist_ok=True)
        logger.info(f"Ensured output folder exists: {output_folder}")
        
        lora_scale = float(data.get('loraScale', 1.1))
        aspect_ratio = data.get('aspectRatio', '16:9')
        output_format = data.get('outputFormat', 'png')
        guidance_scale = float(data.get('guidanceScale', 3.5))
        output_quality = int(data.get('outputQuality', 90))
        
        logger.info("Processing request with parameters: %s", {
            'model_name': model_name,
            'prompt': prompt,
            'output_folder': output_folder,
            'lora_scale': lora_scale,
            'aspect_ratio': aspect_ratio,
            'output_format': output_format,
            'guidance_scale': guidance_scale,
            'output_quality': output_quality
        })
        
        result = replicate_service.run_model(
            model_name=model_name,
            prompt=prompt,
            output_folder=output_folder,
            lora_scale=lora_scale,
            aspect_ratio=aspect_ratio,
            output_format=output_format,
            guidance_scale=guidance_scale,
            output_quality=output_quality
        )
        
        if not result:
            logger.error("No result from model")
            return jsonify({"error": "No result from model"}), 500
            
        # Convert file path to URL
        if isinstance(result, list):
            result = result[0]  # Take first result if multiple
        
        # Ensure the path starts with /api/images
        image_url = f"/api/images{result}" if not result.startswith('/api/images') else result
        logger.info("Returning image URL: %s", image_url)
        
        # Verify the file exists
        full_path = result.lstrip('/')
        if not os.path.isfile('/' + full_path):
            logger.error(f"Generated image file not found: /{full_path}")
            return jsonify({"error": "Generated image file not found"}), 500
        
        return jsonify({"result": image_url})
        
    except Exception as e:
        logger.error("Error in run_replicate_model: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

@api_routes.route('/leonardo', methods=['POST'])
def generate_leonardo_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
            
        result = leonardo_service.generate_image(prompt)
        return jsonify(result)
        
    except Exception as e:
        logger.error("Error in generate_leonardo_image: %s", str(e))
        return jsonify({"error": str(e)}), 500