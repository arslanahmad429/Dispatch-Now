@echo off
title Launching Dispatch Now Website
echo ==============================================
echo   LAUNCHING DISPATCH NOW DEMO
echo ==============================================
echo.
echo Checking system dependencies...

:: Try Node.js first
where node >nul 2>nul
if %errorlevel%==0 (
    echo [OK] Node.js detected! Starting local server...
    echo Please wait 3 seconds for server bootup...
    
    :: Start server in background without asking confirmation
    start /b npx -y serve -s dist -l 3000 >nul 2>&1
    
    :: Wait 3 seconds
    timeout /t 3 >nul
    
    :: Open browser
    start http://localhost:3000
    
    echo.
    echo ➜ Web server running at: http://localhost:3000
    echo.
    echo [IMPORTANT] Leave this window open while using the website.
    echo Press any key in this window to stop the server.
    pause >nul
    goto end
)

:: Try Python next
where python >nul 2>nul
if %errorlevel%==0 (
    echo [OK] Python detected! Starting local server...
    echo Please wait 3 seconds for server bootup...
    
    :: Change directory & start Python server in background
    cd dist
    start /b python -m http.server 8000 >nul 2>&1
    
    :: Wait 3 seconds
    timeout /t 3 >nul
    
    :: Open browser
    start http://localhost:8000
    
    echo.
    echo ➜ Web server running at: http://localhost:8000
    echo.
    echo [IMPORTANT] Leave this window open while using the website.
    echo Press any key in this window to stop the server.
    pause >nul
    goto end
)

echo.
echo ==============================================
echo   [ERROR] WEB SERVER DEPENDENCY MISSING
echo ==============================================
echo Web browsers block modern web applications from running directly off the local drive due to CORS security policies.
echo.
echo Please install Node.js (recommended) to run the website offline:
echo 1. Go to: https://nodejs.org/
echo 2. Download and install the "LTS" version.
echo 3. Once installed, double-click this file again!
echo.
pause
:end
