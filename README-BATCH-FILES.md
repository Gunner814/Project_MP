# Singapore Life Planner - Batch File Guide 🚀

## Quick Start
Just double-click `launcher.bat` for the main menu with all options!

## Available Batch Files

### 🎯 Main Files

#### `launcher.bat` (Recommended)
- **Main control panel** with menu for all features
- One-stop access to all functionality
- User-friendly interface with numbered options

#### `start-life-planner.bat`
- Full startup with dependency checks
- Installs packages if needed
- Shows detailed progress
- Best for daily use

#### `quick-start.bat`
- Minimal startup - no checks
- Fastest way to launch
- Use when you know everything is working

### 🔧 Setup & Maintenance

#### `first-time-setup.bat`
- Run this FIRST after cloning/downloading
- Installs all dependencies
- Creates .env file
- Sets up directory structure

#### `build-production.bat`
- Creates optimized production build
- Minifies and bundles code
- Ready for deployment
- Shows build size and location

#### `troubleshoot.bat`
- Diagnostic and repair tools
- Port checking
- Cache clearing
- Dependency reinstall
- System requirements check

## Usage Instructions

### First Time Users
1. Run `first-time-setup.bat`
2. Wait for installation to complete
3. Run `launcher.bat` and select option 1

### Daily Use
- Double-click `launcher.bat` and select option 1
- OR directly run `start-life-planner.bat`
- OR use `quick-start.bat` for fastest launch

### Troubleshooting
If the app won't start:
1. Run `troubleshoot.bat`
2. Select option 2 (Reinstall dependencies)
3. Try starting again

## Shortcuts

### From Windows
1. Right-click `launcher.bat`
2. Select "Send to" > "Desktop (create shortcut)"
3. Rename shortcut to "Singapore Life Planner"
4. Optional: Change icon

### From Command Prompt
```cmd
cd D:\Project_MP
launcher
```

## Requirements
- Windows 7 or later
- Node.js 18+ installed
- 500MB free disk space
- Internet connection (first time only)

## Ports Used
- Development: `http://localhost:3000`
- Production Preview: `http://localhost:4173`

## Color Codes in Batch Files
- 🟦 Blue: Information
- 🟩 Green: Success
- 🟨 Yellow: Building/Processing
- 🟥 Red: Error
- ⬜ White: Menu/Options

## Tips
- Keep `launcher.bat` on your desktop for easy access
- Use `quick-start.bat` when developing
- Run `build-production.bat` before deployment
- Use `troubleshoot.bat` if anything goes wrong

## File Descriptions

| File | Purpose | When to Use |
|------|---------|------------|
| `launcher.bat` | Main menu | Always start here |
| `start-life-planner.bat` | Full launch with checks | Daily development |
| `quick-start.bat` | Fast launch | When in a hurry |
| `first-time-setup.bat` | Initial setup | Once, after download |
| `build-production.bat` | Create deployment build | Before going live |
| `troubleshoot.bat` | Fix problems | When things break |

## Common Issues

### "Node.js is not installed"
- Download from https://nodejs.org/
- Install LTS version
- Restart your computer

### "Port 3000 is in use"
- Run `troubleshoot.bat`
- Select option 5 to check port
- Follow instructions to free port

### "Dependencies not installed"
- Run `first-time-setup.bat`
- Or use `troubleshoot.bat` option 2

## Support
Check the main README.md for project documentation.