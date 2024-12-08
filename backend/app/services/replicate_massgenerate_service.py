import replicate
import os
import json
import logging
from backend.config import Config

logger = logging.getLogger(__name__)

class ReplicateMassgenerateService:
    def __init__(self):
        self.api_key = os.environ.get('REPLICATE_API_TOKEN')
        if not self.api_key:
            logger.warning("REPLICATE_API_TOKEN not found in environment variables")
            self.api_key = Config.REPLICATE_API_TOKEN
            if not self.api_key:
                logger.error("REPLICATE_API_TOKEN not found in Config either")
            else:
                logger.info("Found REPLICATE_API_TOKEN in Config")
        else:
            logger.info("Found REPLICATE_API_TOKEN in environment")
        self._image_counter = 0

    def _get_next_filename(self, output_folder, output_format):
        """Get the next available filename by checking existing files."""
        while True:
            file_name = f"output_{self._image_counter}.{output_format.lower()}"
            file_path = os.path.join(output_folder, file_name)
            if not os.path.exists(file_path):
                logger.info(f"Generated new filename: {file_path}")
                return file_path
            self._image_counter += 1

    def load_prompts_from_json(self, json_file_path):
        with open(json_file_path, 'r') as file:
            return json.load(file)

    def run_model(self, model_name, prompt, output_folder, lora_scale=1.1, 
                 aspect_ratio="16:9", output_format="png", guidance_scale=3.5, 
                 output_quality=90):
        try:
            logger.info(f"Starting run_model with prompt: {prompt}")
            
            if not self.api_key:
                error_msg = "Replicate API Token is not set. Please check your .env configuration."
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            # Ensure output folder exists
            os.makedirs(output_folder, exist_ok=True)
            logger.info(f"Ensured output folder exists: {output_folder}")

            try:
                client = replicate.Client(api_token=self.api_key)
                logger.info(f"Successfully connected to Replicate with model: {model_name}")
            except Exception as e:
                logger.error(f"Failed to create Replicate client: {str(e)}")
                raise ValueError(f"Failed to connect to Replicate: {str(e)}")

            # Run the model
            logger.info("Running model with parameters: %s", {
                "prompt": prompt,
                "lora_scale": lora_scale,
                "aspect_ratio": aspect_ratio,
                "output_format": output_format,
                "guidance_scale": guidance_scale,
                "output_quality": output_quality
            })
            
            try:
                output = client.run(
                    model_name,
                    input={
                        "prompt": prompt,
                        "lora_scale": lora_scale,
                        "aspect_ratio": aspect_ratio,
                        "output_format": output_format,
                        "guidance_scale": guidance_scale,
                        "output_quality": output_quality
                    }
                )
                logger.info("Received output from model")

                # Process the result
                results = []
                for index, item in enumerate(output):
                    # Get next available filename
                    file_path = self._get_next_filename(output_folder, output_format)
                    logger.info(f"Saving output to: {file_path}")
                    
                    # Save the file
                    with open(file_path, "wb") as file:
                        file.write(item.read())
                    results.append(file_path)
                    self._image_counter += 1

                return results[0] if results else None  # Return the first image path or None

            except Exception as e:
                logger.error(f"Error during model execution: {str(e)}")
                raise ValueError(f"Model execution failed: {str(e)}")

        except Exception as e:
            logger.error(f"Error in run_model: {str(e)}")
            raise