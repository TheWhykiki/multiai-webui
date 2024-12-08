import os
from dotenv import load_dotenv
from app.services.replicate_massgenerate_service import ReplicateMassgenerateService

# Load environment variables
load_dotenv()

def test_replicate_service():
    # Verify API token is set
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    print(f"API Token: {'Set' if api_token else 'Not Set'}")
    
    # Create service instance
    service = ReplicateMassgenerateService()
    
    # Test parameters (adjust as needed)
    model_name = "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9ca46b56"
    input_data = "A beautiful landscape with mountains and a lake"
    output_folder = "./replicate_outputs"
    
    # Run the model
    try:
        results = service.run_model(
            model_name=model_name, 
            input_data=input_data, 
            output_folder=output_folder
        )
        print("Generated images:", results)
    except Exception as e:
        print(f"Error during model execution: {e}")

if __name__ == "__main__":
    test_replicate_service()
