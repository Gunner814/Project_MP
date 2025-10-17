@echo off
title Singapore Life Planner - Production Build
color 0E

echo =========================================================
echo         SINGAPORE LIFE PLANNER - PRODUCTION BUILD
echo =========================================================
echo.
echo This will create an optimized production build
echo.

:: Navigate to project directory
cd /d "D:\Project_MP"

:: Check if node_modules exists
if not exist "node_modules\" (
    color 0C
    echo ❌ Dependencies not installed!
    echo Please run first-time-setup.bat first
    echo.
    pause
    exit /b 1
)

:: Clean previous build
echo [1/3] Cleaning previous build...
if exist "dist" (
    rmdir /S /Q dist
    echo ✓ Cleaned previous build
) else (
    echo ✓ No previous build to clean
)
echo.

:: Run build
echo [2/3] Building production version...
echo This may take 1-2 minutes...
echo.
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Build failed!
    echo Please check for errors above
    echo.
    pause
    exit /b 1
)
echo.
echo ✓ Build completed successfully!
echo.

:: Display build info
echo [3/3] Build information:
echo.
echo Build location: D:\Project_MP\dist
echo.

:: Calculate build size
for /f "tokens=3" %%a in ('dir dist /s ^| find "File(s)"') do set size=%%a
echo Build size: %size% bytes
echo.

color 0A
echo =========================================================
echo         ✅ PRODUCTION BUILD COMPLETE!
echo =========================================================
echo.
echo To deploy:
echo 1. Upload contents of 'dist' folder to your web server
echo 2. Or use a service like Vercel, Netlify, or GitHub Pages
echo.
echo To preview locally:
echo Run: npm run preview
echo Then open: http://localhost:4173
echo.
echo =========================================================
echo.
echo Would you like to preview the build now? (Y/N)
choice /C YN /N
if %errorlevel%==1 (
    echo.
    echo Starting preview server...
    call npm run preview
)

pause