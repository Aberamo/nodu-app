@echo off
REM NODU.ME - Quick Start Script for Windows

echo ========================================
echo   NODU.ME - Educational AI Platform
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo [!] Virtual environment not found!
    echo [*] Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created!
    echo.
)

REM Activate virtual environment
echo [*] Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if requirements are installed
echo [*] Installing/updating dependencies...
pip install -r requirements.txt --quiet

echo.
echo [OK] Setup complete!
echo [*] Starting Flask server...
echo.
echo ========================================
echo   Server running at: http://localhost:5000
echo   Press CTRL+C to stop
echo ========================================
echo.

REM Start Flask app
python app.py
