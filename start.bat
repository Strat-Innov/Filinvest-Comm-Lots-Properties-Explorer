@echo off
chcp 65001 >nul 2>&1
:: ─────────────────────────────────────────────────
::  Filinvest Commercial Lots Properties Explorer — One-Click Start
:: ─────────────────────────────────────────────────
::  Double-click this file to launch the app.

cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════════════╗
echo   ║   Filinvest Commercial Lots Explorer     ║
echo   ╚══════════════════════════════════════════╝
echo.

:: ── Check for Node.js ──
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   X  Node.js is not installed.
    echo      Download it from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -v') do set NODE_RAW=%%a
set NODE_MAJOR=%NODE_RAW:v=%
if %NODE_MAJOR% lss 18 (
    echo   X  Node.js 18+ is required.
    echo      Download the latest from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do echo   √  Node.js %%v detected

:: ── Set up .env if missing ──
if not exist .env (
    echo   →  Creating .env from .env.example...
    copy .env.example .env >nul
)

:: ── Install dependencies ──
if not exist node_modules (
    echo   →  Installing dependencies (first run, may take a minute^)...
    echo.
    call npm install
    echo.
    echo   √  Dependencies installed
) else (
    echo   √  Dependencies already installed
)

:: ── Download offline map tiles ──
if not exist public\tiles (
    echo   →  Downloading map tiles for offline use...
    echo      (This only runs once — may take a few minutes^)
    echo.
    call node scripts/download-tiles.mjs
    echo.
    echo   √  Map tiles cached for offline use
) else (
    echo   √  Offline map tiles already cached
)

:: ── Launch ──
echo.
echo   🚀  Starting dev server...
echo   ───────────────────────────────────────────
echo   Open in your browser:  http://localhost:3000
echo   Press Ctrl+C to stop.
echo   ───────────────────────────────────────────
echo.

call npm run dev

pause
