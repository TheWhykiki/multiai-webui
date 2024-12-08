import os
from dotenv import load_dotenv

load_dotenv()  # Dies lädt die Umgebungsvariablen aus der .env-Datei

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')
    LEONARDO_API_KEY = os.environ.get('LEONARDO_API_KEY')

    @staticmethod
    def check_config():
        missing = [key for key in ['REPLICATE_API_TOKEN', 'SECRET_KEY', 'LEONARDO_API_KEY'] if getattr(Config, key) is None]
        if missing:
            raise ValueError(f"Missing environment variables: {', '.join(missing)}")