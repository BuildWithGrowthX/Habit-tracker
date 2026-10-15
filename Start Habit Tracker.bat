@echo off
title 6-Month Excel Habit Tracker Dashboard
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
echo ========================================================
echo   6-Month Excel Habit Tracker Dashboard
echo   Starting local server at http://127.0.0.1:5173
echo ========================================================
echo.
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173"
call "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" run dev -- --host 127.0.0.1 --port 5173
pause
