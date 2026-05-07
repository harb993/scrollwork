@echo off
echo Starting ScrollWork Services...

set "ROOT_DIR=%~dp0"
set "VENV_PYTHON=%ROOT_DIR%.venv\Scripts\python.exe"

if not exist "%VENV_PYTHON%" (
	set "VENV_PYTHON=python"
)

:: Start the FastAPI Backend (Port 8000)
start "Backend" /d "%ROOT_DIR%backend" "%VENV_PYTHON%" main.py

:: Start the Web Frontend (Port 8080 to avoid conflict with backend)
start "Web Frontend" /d "%ROOT_DIR%web" "%VENV_PYTHON%" -m http.server 8080

:: Start the Mobile Expo Server
start "Mobile App" /d "%ROOT_DIR%mobile" npm start

echo All services are starting up in new windows!
