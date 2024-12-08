import os
import sys

# Print Python and environment details
print("Python Executable:", sys.executable)
print("Current Working Directory:", os.getcwd())
print("PYTHONPATH:", sys.path)

# Import and run app with more verbose logging
from backend.app import create_app

app = create_app()

# Explicitly set host and port
if __name__ == '__main__':
    print("Starting Flask development server...")
    app.run(
        host='0.0.0.0',  # Listen on all available interfaces
        port=5001,        # Specify a port
        debug=True        # Enable debug mode
    )