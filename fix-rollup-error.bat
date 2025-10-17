@echo off
title Fix Rollup Error - Singapore Life Planner
color 0E

echo =========================================================
echo         FIXING ROLLUP MODULE ERROR
echo =========================================================
echo.
echo This will fix the "@rollup/rollup-win32-x64-msvc" error
echo.

cd /d "D:\Project_MP"

echo [Step 1] Cleaning up old files...
echo.

:: Remove node_modules
if exist "node_modules" (
    echo Removing node_modules directory...
    rmdir /S /Q node_modules
    echo ✓ node_modules removed
) else (
    echo ✓ No node_modules to remove
)

:: Remove package-lock.json
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /Q package-lock.json
    echo ✓ package-lock.json removed
) else (
    echo ✓ No package-lock.json to remove
)

:: Remove .vite cache
if exist ".vite" (
    echo Removing .vite cache...
    rmdir /S /Q .vite
    echo ✓ .vite cache removed
)

echo.
echo [Step 2] Clearing npm cache...
call npm cache clean --force
echo ✓ npm cache cleared
echo.

echo [Step 3] Installing dependencies fresh...
echo This may take 2-5 minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Installation failed!
    echo.
    echo Trying alternative fix...
    echo.
    call npm install --force
)

echo.
echo [Step 4] Installing Rollup specifically...
call npm install rollup@latest --save-dev
echo.

:: Verify the fix
echo [Step 5] Verifying installation...
call npm list rollup
echo.

color 0A
echo =========================================================
echo         ✅ FIX COMPLETED!
echo =========================================================
echo.
echo The Rollup error should now be fixed.
echo.
echo Would you like to start the application now? (Y/N)
choice /C YN /N
if %errorlevel%==1 (
    echo.
    echo Starting Singapore Life Planner...
    echo.
    call npm run dev
) else (
    echo.
    echo You can start the app later by running:
    echo - launcher.bat (option 1)
    echo - start-life-planner.bat
    echo.
)

pause