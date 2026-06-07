@echo off
title Clear Dispatch Now Local Database
echo ==============================================
echo   CLEARING DISPATCH NOW LOCAL DATABASE
echo ==============================================
echo.
echo Sending command to wipe all local mock databases...
echo.

:: Try launching the clear command on standard local ports
start http://localhost:3000/?clear_db=true
start http://localhost:5173/?clear_db=true
start http://localhost:8000/?clear_db=true

echo.
echo Database clearing request sent!
echo If your server is running, the browser will display a confirmation dialog.
echo.
pause
