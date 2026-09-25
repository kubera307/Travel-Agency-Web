@echo off
setlocal enabledelayedexpansion

:: Ensure script runs in the directory of this batch file
cd /d "%~dp0"

TITLE NammaYatra - Professional Tour Booking Platform
COLOR 0A

echo ======================================================================
echo    NAMMAYATRA - TOUR BOOKING & EXPERIENCES PLATFORM
echo ======================================================================
echo.
echo Project Directory: %~dp0
echo.

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found in your PATH!
    echo Please install Python 3.10+ from python.org and add it to PATH.
    pause
    exit /b 1
)

:: Check for Node / npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm was not found in your PATH!
    echo Please install Node.js from nodejs.org.
    pause
    exit /b 1
)

:: Ensure frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend npm packages...
    call npm --prefix frontend install
)

echo [1/2] Starting Python Flask Backend on Port 5000...
start "NammaYatra Backend (Port 5000)" /D "%~dp0" cmd /k "python backend/app.py"

echo.
echo [2/2] Starting React Vite Frontend on Port 5173...
start "NammaYatra Frontend (Port 5173)" /D "%~dp0" cmd /k "npm --prefix frontend run dev"

echo.
echo ======================================================================
echo   NammaYatra is running successfully!
echo   Frontend : http://localhost:5173
echo   Local IP : http://10.75.34.181:5173
echo   Backend  : http://localhost:5000/api
echo.
echo   Demo Accounts:
echo   - Customer : rahul@example.com / Customer@1234
echo   - Admin    : admin@travelindia.com / Admin@1234 (or admin / Admin@1234)
echo ======================================================================
echo.
timeout /t 3 >nul
start "" "http://localhost:5173"
