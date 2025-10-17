@echo off
title Singapore Life Planner - Launcher
color 0A

echo =========================================================
echo            SINGAPORE LIFE PLANNER
echo            Plan Your Journey, Visualize Your Future
echo =========================================================
echo.

:: Check if Node.js is installed
echo [1/4] Checking Node.js installation...
call node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    echo Press any key to return to main menu...
    pause >nul
    exit /b 1
)
echo ✓ Node.js found:
call node --version
echo.

:: Check if npm is installed
echo [2/4] Checking npm...
call npm --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: npm is not installed or not working correctly!
    echo Please install npm or reinstall Node.js from https://nodejs.org/
    echo.
    echo Press any key to return to main menu...
    pause >nul
    exit /b 1
)
echo ✓ npm found:
call npm --version
echo.

:: Navigate to project directory
echo [3/4] Setting up project directory...
cd /d "D:\Project_MP"
echo ✓ Directory: %cd%
echo.

:: Check if node_modules exists, if not install dependencies
echo [4/4] Checking dependencies...
if not exist "node_modules\" (
    echo.
    echo Installing dependencies for first-time setup...
    echo This may take a few minutes...
    echo.
    call npm install
    if errorlevel 1 (
        color 0C
        echo.
        echo ERROR: Failed to install dependencies!
        echo Please check your internet connection and try again.
        echo.
        echo Press any key to return to main menu...
        pause >nul
        exit /b 1
    )
    echo.
    echo ✓ Dependencies installed successfully!
) else (
    echo ✓ Dependencies already installed
)

echo.
echo =========================================================
echo            STARTING SINGAPORE LIFE PLANNER
echo =========================================================
echo.
echo The application will open in your browser at:
echo.
echo    http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo =========================================================
echo.

:: Start the development server
call npm run dev

:: If npm run dev exits (user pressed Ctrl+C)
echo.
echo =========================================================
echo Application stopped.
echo =========================================================
pause