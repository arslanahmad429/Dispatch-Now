@echo off
title Launching Dispatch Now Portal
color 0F

echo ===================================================
echo             DISPATCH NOW LAUNCHER
echo ===================================================
echo.
echo Checking system dependencies...
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js [LTS version recommended] from: https://nodejs.org/
    echo Once installed, restart your command prompt/terminal and run this script again.
    echo.
    pause
    exit /b
)
echo [OK] Node.js detected.

:: 2. Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm [Node Package Manager] was not found.
    echo Please ensure npm is installed along with Node.js.
    echo.
    pause
    exit /b
)
echo [OK] npm detected.

:: 3. Check and install frontend dependencies
if not exist "node_modules\" (
    echo.
    echo [INFO] Frontend node_modules folder is missing.
    echo Installing required packages for frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies.
        pause
        exit /b
    )
) else (
    echo [OK] Frontend dependencies already installed.
)

:: 4. Check and install backend dependencies
if not exist "server\node_modules\" (
    echo.
    echo [INFO] Backend node_modules folder is missing.
    echo Installing required packages for backend...
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies.
        cd ..
        pause
        exit /b
    )
    cd ..
) else (
    echo [OK] Backend dependencies already installed.
)

echo.
echo ===================================================
echo           STARTING DEVELOPMENT SERVERS
echo ===================================================
echo.
echo Booting up the servers in the background...

:: Start Backend Server
start "Dispatch Now Backend" /min cmd /c "cd server && npm start"
echo [✓] Node.js backend server started (Port 5000)

:: Start Frontend React Server (Vite)
start "Dispatch Now Frontend" /min cmd /c "npm run dev -- --port 5173"
echo [✓] React frontend server started (Port 5173)

echo.
echo Waiting 4 seconds for servers to fully initialize...
timeout /t 4 >nul

:: Open browser to local frontend portal
start http://localhost:5173

echo.
echo ➜ Frontend Portal is running at: http://localhost:5173
echo ➜ Backend API is running at:      http://localhost:5000
echo.
echo ===================================================
echo  LEAVE THIS WINDOW OPEN TO KEEP THE WEBSITE ACTIVE
echo ===================================================
echo Press any key in this window to stop both servers...
pause >nul

echo.
echo Stopping servers and cleaning up background tasks...

:: Kill backend and frontend terminal windows by title
taskkill /FI "WINDOWTITLE eq Dispatch Now Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Dispatch Now Frontend*" /T /F >nul 2>&1

echo.
echo [OK] Both servers stopped successfully.
timeout /t 2 >nul
