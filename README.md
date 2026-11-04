# Filinvest Commercial Lots Properties Explorer

An interactive map-based property explorer showcasing Filinvest's premium commercial lots across key Philippine townships — Filinvest City (Alabang), City di Mare (Cebu), Daang Hari (Las Piñas), and Brentville (Biñan, Laguna).

Built with React, Leaflet (OpenStreetMap), and Vite.

---

## Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18.x or newer | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or newer (comes with Node) | — |

> **Tip:** If you use [nvm](https://github.com/nvm-sh/nvm), just run `nvm use` in the project folder — it will pick up the `.nvmrc` file automatically.

---

## ⚡ One-Click Start

Just double-click the launcher for your OS:

| OS | File | How to Run |
|----|------|------------|
| **Windows** | `start.bat` | Double-click it |
| **Linux / Mac** | `start.sh` | Double-click, or run `./start.sh` in terminal |

It will automatically:
1. ✅ Check that Node.js 18+ is installed
2. ✅ Create a `.env` file if you don't have one
3. ✅ Install all dependencies (first run only)
4. ✅ Download map tiles for offline use (first run only)
5. ✅ Start the app at **http://localhost:3000**

> **Note:** The first run requires internet to download dependencies and map tiles. After that, the app works fully offline.

> **Only prerequisite:** [Node.js 18+](https://nodejs.org/) must be installed.

---

## Manual Setup (alternative)

If you prefer doing it step by step:

```bash
# 1. Clone the repository
git clone https://github.com/strat-innov/filinvest-comm-lots-properties-explorer.git
cd filinvest-comm-lots-properties-explorer

# 2. Install dependencies
npm install

# 3. Create your .env (optional — app works without it)
cp .env.example .env

# 4. Download map tiles for offline use (one-time, needs internet)
npm run download-tiles

# 5. Start the dev server
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

> **Note:** All `.env` values are optional. Set `VITE_PUBLIC_URL` to your deployed site so the landing-screen “Scan to open on mobile” QR code points to it; otherwise it points to the address the app is served from.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run clean` | Remove the `dist/` folder |
| `npm run download-tiles` | Download map tiles for offline use |
| `npm run setup` | Install deps + download tiles in one go |

---

## Project Structure

```
filinvest-comm-lots-properties-explorer/
├── public/                  # Static assets (images, SVGs, audio)
│   ├── CDM/                 # City di Mare assets
│   ├── DH/                  # Daang Hari assets
│   ├── FC/                  # Filinvest City assets
│   ├── TVF/                 # The Village Front assets
│   ├── tiles/               # Offline map tile cache (auto-generated)
│   └── *.svg, *.jpg         # Concept maps & backgrounds
├── scripts/
│   └── download-tiles.mjs   # Map tile downloader for offline use
├── src/
│   ├── components/          # React UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── screens/             # Page-level screen components
│   ├── App.tsx              # Root application component
│   ├── constants.ts         # Project & lot data definitions
│   ├── types.ts             # TypeScript type definitions
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── start.sh / start.bat     # One-click launchers
├── .env.example             # Environment variable template
├── index.html               # HTML entry point
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

---

## Building for Production

To create an optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` folder. You can preview it with:

```bash
npm run preview
```

To deploy, serve the contents of `dist/` with any static file server (e.g., Nginx, Vercel, Netlify, GitHub Pages).

---

## Troubleshooting

### `npm install` fails with native module errors

Try deleting the lock file and `node_modules`, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

The dev server defaults to port 3000. If it's taken, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Blank page on load

- Make sure you ran `npm install` before `npm run dev`.
- Check the browser console (F12) for errors.
- Verify your Node.js version is 18 or newer: `node -v`

### Map tiles not loading (grey squares)

Run the tile downloader to cache map tiles locally:

```bash
npm run download-tiles
```

This downloads OpenStreetMap tiles for all project locations. Requires internet once; after that, maps work offline.

---

## Offline Mode

This app is designed to work **fully offline** after initial setup:

| Resource | Offline Strategy |
|----------|------------------|
| **Map tiles** | Pre-downloaded to `public/tiles/` via `download-tiles` script |
| **Fonts** | Bundled locally via `@fontsource` packages (Inter, Montserrat) |
| **Images & SVGs** | All assets in `public/` — no external CDN |
| **Chatbot** | Runs entirely client-side with local response logic |

If internet is available, any tiles not in the local cache will fall back to loading from OpenStreetMap online.

---

## Tech Stack

- **[React](https://react.dev/)** — UI framework
- **[Vite](https://vite.dev/)** — Build tool & dev server
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)** — Interactive maps
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — Animations
- **[Lucide React](https://lucide.dev/)** — Icons

---

## License

This project is proprietary to Filinvest Alabang, Inc. All rights reserved.
