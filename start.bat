@echo off
echo Starting ScrollWork Services...

:: Start the FastAPI Backend (Port 8000)
start "Backend" cmd /k "cd backend && python main.py"

:: Start the Web Frontend (Port 8080 to avoid conflict with backend)
start "Web Frontend" cmd /k "cd web && python -m http.server 8080"

:: Start the Mobile Expo Server
start "Mobile App" cmd /k "cd mobile && npm start"

echo All services are starting up in new windows!
