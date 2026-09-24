@echo off
setlocal enabledelayedexpansion

:: Ensure script runs in the directory of this batch file
cd /d "%~dp0"

TITLE NammaYatra - Live Mobile & Web Server
COLOR 0B

echo ======================================================================
echo       NAMMAYATRA - LIVE SERVER WITH INSTANT MOBILE ACCESS
echo ======================================================================
echo.

:: 1. Start Python Flask Backend
echo [1/3] Starting Python Flask Backend on Port 5000...
start "NammaYatra Backend (Port 5000)" /D "%~dp0" cmd /k "python backend/app.py"

:: 2. Start Vite Frontend
echo [2/3] Starting React Vite Frontend on Port 5173...
start "NammaYatra Frontend (Port 5173)" /D "%~dp0" cmd /k "npm --prefix frontend run dev"

:: 3. Start Cloudflare Tunnel for Instant Mobile Access Anywhere
echo [3/3] Starting Secure Mobile Tunnel (No Firewall or Hotspot Restrictions)...
start "NammaYatra Cloudflare Mobile Tunnel" /D "%~dp0" cmd /k ".\cloudflared.exe tunnel --url http://localhost:5173"

echo.
echo ======================================================================
echo   NammaYatra is running!
echo.
echo   Local PC Access   : http://localhost:5173
echo   Local Network IP  : http://10.75.34.181:5173
echo.
echo   Mobile Cloud Link : Look at the Cloudflare Tunnel window for your
echo                       https://*.trycloudflare.com link to open on
echo                       ANY phone anywhere with 4G/5G or Wi-Fi!
echo ======================================================================
echo.
pause

