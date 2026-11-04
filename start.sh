#!/usr/bin/env bash
# ─────────────────────────────────────────────────
#  Filinvest Commercial Lots Properties Explorer — One-Click Start
# ─────────────────────────────────────────────────
#  Double-click this file or run:  ./start.sh

set -e

cd "$(dirname "$0")"

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║   Filinvest Commercial Lots Explorer     ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# ── Check for Node.js ──
if ! command -v node &> /dev/null; then
    echo "  ✖  Node.js is not installed."
    echo "     Download it from: https://nodejs.org/"
    echo ""
    read -rp "  Press Enter to exit..."
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "  ✖  Node.js 18+ is required (you have v$(node -v))."
    echo "     Download the latest from: https://nodejs.org/"
    echo ""
    read -rp "  Press Enter to exit..."
    exit 1
fi

echo "  ✔  Node.js $(node -v) detected"

# ── Set up .env if missing ──
if [ ! -f .env ]; then
    echo "  →  Creating .env from .env.example..."
    cp .env.example .env
fi

# ── Install dependencies ──
if [ ! -d node_modules ]; then
    echo "  →  Installing dependencies (first run, may take a minute)..."
    echo ""
    npm install
    echo ""
    echo "  ✔  Dependencies installed"
else
    echo "  ✔  Dependencies already installed"
fi

# ── Download offline map tiles ──
if [ ! -d public/tiles ]; then
    echo "  →  Downloading map tiles for offline use..."
    echo "     (This only runs once — may take a few minutes)"
    echo ""
    node scripts/download-tiles.mjs
    echo ""
    echo "  ✔  Map tiles cached for offline use"
else
    echo "  ✔  Offline map tiles already cached"
fi

# ── Launch ──
echo ""
echo "  🚀  Starting dev server..."
echo "  ───────────────────────────────────────────"
echo "  Open in your browser:  http://localhost:3000"
echo "  Press Ctrl+C to stop."
echo "  ───────────────────────────────────────────"
echo ""

npm run dev
