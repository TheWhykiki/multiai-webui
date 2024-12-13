@echo off
setlocal

echo Checking for processes on port 5001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5001"') do (
    echo Terminating process with PID %%a
    taskkill /F /PID %%a 2>nul
)

echo Starting Flask server...
cd backend
set PYTHONPATH=%cd%\..;%PYTHONPATH%
set FLASK_APP=app:create_app
set FLASK_ENV=development
set FLASK_DEBUG=0
set PYCHARM_DEBUG=1
start /B python -m flask run --host=0.0.0.0 --port=5001

echo Waiting for Flask server to start...
timeout /t 2 /nobreak > nul

echo Starting Next.js server...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
call npm run dev
