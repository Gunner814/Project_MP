@echo off
title Singapore Life Planner - First Time Setup
color 0B

echo =========================================================
echo         SINGAPORE LIFE PLANNER - INITIAL SETUP
echo =========================================================
echo.
echo This script will set up the Singapore Life Planner project
echo.

:: Check Node.js
echo [Step 1] Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Visit https://nodejs.org/
    echo 2. Download LTS version
    echo 3. Run the installer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js installed
echo.

:: Navigate to project directory
cd /d "D:\Project_MP"

:: Install dependencies
echo [Step 2] Installing project dependencies...
echo This may take 2-5 minutes depending on your internet speed...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)
echo.
echo ✓ Dependencies installed successfully!
echo.

:: Create .env file from template if it doesn't exist
echo [Step 3] Setting up environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✓ Created .env file from template
        echo.
        echo ⚠️  IMPORTANT: Edit the .env file to add your API keys
        echo    Located at: D:\Project_MP\.env
    ) else (
        echo ⚠️  Warning: .env.example not found
    )
) else (
    echo ✓ .env file already exists
)
echo.

:: Create necessary directories if they don't exist
echo [Step 4] Creating project directories...
if not exist "public\icons" mkdir "public\icons"
if not exist "public\screenshots" mkdir "public\screenshots"
if not exist "src\pages" mkdir "src\pages"
echo ✓ Directories created
echo.

:: Display success message
color 0A
echo =========================================================
echo         ✅ SETUP COMPLETED SUCCESSFULLY!
echo =========================================================
echo.
echo Next steps:
echo.
echo 1. Edit .env file to add your API keys (optional)
echo    Location: D:\Project_MP\.env
echo.
echo 2. Run the application:
echo    Double-click: start-life-planner.bat
echo    Or run: npm run dev
echo.
echo 3. Open your browser to:
echo    http://localhost:3000
echo.
echo =========================================================
echo.
echo Would you like to start the application now? (Y/N)
choice /C YN /N
if %errorlevel%==1 (
    echo.
    echo Starting Singapore Life Planner...
    call npm run dev
)

pause