from flask import Blueprint, request, jsonify
import subprocess
import os
import threading
import queue
import time
from pathlib import Path

flux_training = Blueprint('flux_training', __name__)

# Queue to store training logs
training_logs = queue.Queue()
current_process = None
training_status = "idle"
training_error = None

def run_training(args_dict):
    global current_process, training_status, training_error
    
    try:
        # Convert dictionary to command line arguments
        cmd_args = []
        for key, value in args_dict.items():
            if isinstance(value, bool):
                if value:
                    cmd_args.append(f"--{key}")
            else:
                cmd_args.append(f"--{key}")
                cmd_args.append(str(value))

        # Base command
        cmd = ["python", "train_dreambooth_flux.py"] + cmd_args
        
        # Start the training process
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        current_process = process
        
        # Read output in real-time
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                training_logs.put(output.strip())
        
        # Check if process completed successfully
        if process.returncode == 0:
            training_status = "completed"
        else:
            training_status = "failed"
            error_output = process.stderr.read()
            training_error = error_output
            training_logs.put(f"Error: {error_output}")
            
    except Exception as e:
        training_status = "failed"
        training_error = str(e)
        training_logs.put(f"Error: {str(e)}")
    
    finally:
        current_process = None

@flux_training.route('/api/train/flux', methods=['POST'])
def start_training():
    global training_status, training_error
    
    if current_process is not None:
        return jsonify({
            "success": False,
            "error": "Training is already in progress"
        })
    
    try:
        args = request.json
        
        # Clear previous logs and status
        while not training_logs.empty():
            training_logs.get()
        
        training_status = "running"
        training_error = None
        
        # Start training in a separate thread
        thread = threading.Thread(target=run_training, args=(args,))
        thread.start()
        
        return jsonify({
            "success": True,
            "message": "Training started successfully"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })

@flux_training.route('/api/train/flux/status', methods=['GET'])
def get_training_status():
    # Collect all new logs
    new_logs = []
    while not training_logs.empty():
        new_logs.append(training_logs.get())
    
    return jsonify({
        "status": training_status,
        "new_logs": new_logs,
        "error": training_error
    })
