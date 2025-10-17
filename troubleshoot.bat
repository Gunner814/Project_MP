@echo off
title Singapore Life Planner - Troubleshooting
color 0F

:menu
cls
echo =========================================================
echo         SINGAPORE LIFE PLANNER - TROUBLESHOOTING
echo =========================================================
echo.
echo Select an option:
echo.
echo [1] Check system requirements
echo [2] Reinstall dependencies (clean install)
echo [3] Clear cache
echo [4] Reset environment file
echo [5] Check port 3000 availability
echo [6] View error logs
echo [7] Update all packages
echo [8] Run tests
echo [9] Back to main menu
echo [0] Exit
echo.
echo =========================================================
echo.

set /p choice=Enter your choice (0-9):

if "%choice%"=="1" goto checksystem
if "%choice%"=="2" goto reinstall
if "%choice%"=="3" goto clearcache
if "%choice%"=="4" goto resetenv
if "%choice%"=="5" goto checkport
if "%choice%"=="6" goto viewlogs
if "%choice%"=="7" goto updatepackages
if "%choice%"=="8" goto runtests
if "%choice%"=="9" goto menu
if "%choice%"=="0" exit

echo Invalid choice. Please try again.
pause
goto menu

:checksystem
cls
echo Checking System Requirements...
echo =========================================================
echo.
echo Node.js version:
node --version
echo.
echo npm version:
npm --version
echo.
echo Project directory:
echo %cd%
echo.
echo Available disk space:
wmic logicaldisk where caption="D:" get size,freespace
echo.
echo =========================================================
pause
goto menu

:reinstall
cls
echo Reinstalling Dependencies...
echo =========================================================
echo.
cd /d "D:\Project_MP"
echo Removing node_modules...
if exist "node_modules" rmdir /S /Q node_modules
echo Removing package-lock.json...
if exist "package-lock.json" del package-lock.json
echo.
echo Installing fresh dependencies...
call npm install
echo.
echo ✓ Dependencies reinstalled!
echo =========================================================
pause
goto menu

:clearcache
cls
echo Clearing Cache...
echo =========================================================
echo.
cd /d "D:\Project_MP"
echo Clearing npm cache...
call npm cache clean --force
echo.
echo Clearing build cache...
if exist "dist" rmdir /S /Q dist
if exist ".vite" rmdir /S /Q .vite
echo.
echo ✓ Cache cleared!
echo =========================================================
pause
goto menu

:resetenv
cls
echo Resetting Environment File...
echo =========================================================
echo.
cd /d "D:\Project_MP"
if exist ".env" (
    echo Backing up current .env to .env.backup...
    copy .env .env.backup
    echo.
)
echo Creating fresh .env from template...
copy .env.example .env
echo.
echo ✓ Environment file reset!
echo Note: Remember to add your API keys to the new .env file
echo =========================================================
pause
goto menu

:checkport
cls
echo Checking Port 3000...
echo =========================================================
echo.
netstat -ano | findstr :3000
if %errorlevel%==0 (
    echo.
    echo ⚠️  Port 3000 is in use!
    echo.
    echo To free the port:
    echo 1. Find the PID from the last column above
    echo 2. Run: taskkill /PID [number] /F
    echo.
) else (
    echo ✓ Port 3000 is available
)
echo =========================================================
pause
goto menu

:viewlogs
cls
echo Recent npm logs...
echo =========================================================
echo.
cd /d "D:\Project_MP"
if exist "npm-debug.log" (
    type npm-debug.log | more
) else (
    echo No error logs found.
    echo Logs will appear here if there are npm errors.
)
echo.
echo =========================================================
pause
goto menu

:updatepackages
cls
echo Updating Packages...
echo =========================================================
echo.
cd /d "D:\Project_MP"
echo Checking for outdated packages...
call npm outdated
echo.
echo Updating packages to latest versions...
call npm update
echo.
echo ✓ Packages updated!
echo =========================================================
pause
goto menu

:runtests
cls
echo Running Tests...
echo =========================================================
echo.
cd /d "D:\Project_MP"
call npm test
echo.
echo =========================================================
pause
goto menu