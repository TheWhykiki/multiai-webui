#!/bin/bash

# Überprüfen und Beenden von Prozessen auf Port 5001
echo "Überprüfe, ob ein Prozess den Port 5001 verwendet..."
lsof -ti:5001 | xargs echo
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Flask-Server starten
echo "Starte Flask-Server..."
cd backend
export PYTHONPATH=/Users/whykiki/Daten/KI_WebGUI/multiai-webui:$PYTHONPATH
export FLASK_APP=app:create_app
export FLASK_ENV=development
export FLASK_DEBUG=0
export PYCHARM_DEBUG=1
python3 -m flask run --host=0.0.0.0 --port=5001 &

# Warten Sie einen Moment
sleep 2

echo "Flask-Server gestartet mit PID $! auf Port 5001."

# Next.js-Server starten
echo "Starte Next.js-Server..."
cd ../frontend || {
    echo "Fehler: Konnte nicht ins Frontend-Verzeichnis wechseln"
    echo "Aktuelles Verzeichnis: $(pwd)"
    echo "Verzeichnisinhalt:"
    ls -la
    exit 1
}

npm run dev