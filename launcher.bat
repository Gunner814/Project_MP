@echo off
title Singapore Life Planner - Main Launcher
color 0B

:mainmenu
cls
echo.
echo    ==================================================================
echo    #                                                                #
echo    #         SINGAPORE LIFE PLANNER - MAIN LAUNCHER                #
echo    #         Plan Your Journey, Visualize Your Future              #
echo    #                                                                #
echo    ==================================================================
echo.
echo    ------------------------------------------------------------------
echo                         QUICK ACTIONS
echo    ------------------------------------------------------------------
echo.
echo       [1] Start Application (Development Mode)
echo       [2] Quick Start (No checks, fast launch)
echo       [3] Open in Browser (http://localhost:3000)
echo.
echo    ------------------------------------------------------------------
echo                         SETUP and BUILD
echo    ------------------------------------------------------------------
echo.
echo       [4] First Time Setup (Install dependencies)
echo       [5] Build for Production
echo       [6] Preview Production Build
echo.
echo    ------------------------------------------------------------------
echo                           UTILITIES
echo    ------------------------------------------------------------------
echo.
echo       [7] Troubleshooting Tools
echo       [8] Open Project Folder
echo       [9] Open VS Code (if installed)
echo.
echo    ------------------------------------------------------------------
echo       [0] Exit
echo    ------------------------------------------------------------------
echo.
set /p choice=    Select an option (0-9):

if "%choice%"=="1" goto startdev
if "%choice%"=="2" goto quickstart
if "%choice%"=="3" goto openbrowser
if "%choice%"=="4" goto firstsetup
if "%choice%"=="5" goto build
if "%choice%"=="6" goto preview
if "%choice%"=="7" goto troubleshoot
if "%choice%"=="8" goto openfolder
if "%choice%"=="9" goto opencode
if "%choice%"=="0" goto exitapp

echo.
echo    [!] Invalid choice. Please enter a number between 0 and 9.
timeout /t 2 >nul
goto mainmenu

:startdev
cls
echo    Starting Singapore Life Planner...
echo.
cd /d "D:\Project_MP"
call start-life-planner.bat
goto mainmenu

:quickstart
cls
echo    Quick starting application...
echo.
cd /d "D:\Project_MP"
call quick-start.bat
goto mainmenu

:openbrowser
echo.
echo    Opening browser...
start http://localhost:3000
timeout /t 2 >nul
goto mainmenu

:firstsetup
cls
cd /d "D:\Project_MP"
call first-time-setup.bat
pause
goto mainmenu

:build
cls
cd /d "D:\Project_MP"
call build-production.bat
pause
goto mainmenu

:preview
cls
echo    Starting production preview server...
echo.
cd /d "D:\Project_MP"
echo    Preview will be available at: http://localhost:4173
echo.
call npm run preview
pause
goto mainmenu

:troubleshoot
cls
cd /d "D:\Project_MP"
call troubleshoot.bat
goto mainmenu

:openfolder
echo.
echo    Opening project folder...
start explorer "D:\Project_MP"
timeout /t 2 >nul
goto mainmenu

:opencode
echo.
echo    Opening in VS Code...
cd /d "D:\Project_MP"
code . 2>nul
if %errorlevel% neq 0 (
    echo.
    echo    [!] VS Code is not installed or not in PATH
    echo    Please install VS Code from: https://code.visualstudio.com/
    pause
)
goto mainmenu

:exitapp
cls
echo.
echo    ==================================================================
echo    #                                                                #
echo    #          Thank you for using Singapore Life Planner!          #
echo    #          Plan wisely, prosper greatly!                        #
echo    #                                                                #
echo    ==================================================================
echo.
timeout /t 2 >nul
exit