#!/usr/bin/env node
/**
 * Download OpenStreetMap tiles for offline use.
 * 
 * Covers all 4 project locations at zoom levels 13–18.
 * Tiles are saved to public/tiles/{z}/{x}/{y}.png
 * 
 * Usage:  node scripts/download-tiles.mjs
 * 
 * IMPORTANT: Please respect the OSM Tile Usage Policy:
 * https://operations.osmfoundation.org/policies/tiles/
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'tiles');

// Project locations with a padding radius (in degrees) around each center
const LOCATIONS = [
  { name: 'Brentville',      lat: 14.3142, lng: 121.0833 },
  { name: 'Daang Hari',      lat: 14.3820, lng: 121.0125 },
  { name: 'Filinvest City',  lat: 14.4172, lng: 121.0354 },
  { name: 'DLSU Dasma',      lat: 14.3242, lng: 120.9575 },  // Easter egg marker
  { name: 'City di Mare',    lat: 10.2715, lng: 123.8788 },
];

// Zoom levels to download — 13 (overview) through 18 (street-level)
const ZOOM_MIN = 13;
const ZOOM_MAX = 18;

// Padding in degrees around each center point (roughly ~2km at equator)
const PADDING_DEG = 0.025;

// Tile servers to cycle through (respect OSM usage policy: max 2 connections)
const TILE_SERVERS = ['a', 'b', 'c'];
let serverIndex = 0;

// Rate limiting: delay between requests in ms
const DELAY_MS = 100;

function lonToTile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function latToTile(lat, zoom) {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      resolve('skipped');
      return;
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, { 
      headers: { 
        'User-Agent': 'FilinvestPropertiesExplorer/1.0 (offline-tile-cache)' 
      } 
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve('downloaded');
        });
      } else {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🗺️  OpenStreetMap Tile Downloader for Offline Use');
  console.log('─'.repeat(50));

  // Collect all unique tiles across all locations and zoom levels
  const tileSet = new Set();
  const tiles = [];

  for (const loc of LOCATIONS) {
    for (let z = ZOOM_MIN; z <= ZOOM_MAX; z++) {
      const xMin = lonToTile(loc.lng - PADDING_DEG, z);
      const xMax = lonToTile(loc.lng + PADDING_DEG, z);
      const yMin = latToTile(loc.lat + PADDING_DEG, z); // Note: lat tiles are inverted
      const yMax = latToTile(loc.lat - PADDING_DEG, z);

      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          const key = `${z}/${x}/${y}`;
          if (!tileSet.has(key)) {
            tileSet.add(key);
            tiles.push({ z, x, y });
          }
        }
      }
    }
  }

  console.log(`📦  Total unique tiles to download: ${tiles.length}`);
  console.log(`📁  Output: ${OUTPUT_DIR}`);
  console.log('');

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < tiles.length; i++) {
    const { z, x, y } = tiles[i];
    const server = TILE_SERVERS[serverIndex % TILE_SERVERS.length];
    serverIndex++;

    const url = `https://${server}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const destPath = path.join(OUTPUT_DIR, `${z}`, `${x}`, `${y}.png`);

    try {
      const result = await downloadFile(url, destPath);
      if (result === 'downloaded') {
        downloaded++;
      } else {
        skipped++;
      }

      // Progress indicator
      if ((i + 1) % 50 === 0 || i === tiles.length - 1) {
        const pct = Math.round(((i + 1) / tiles.length) * 100);
        process.stdout.write(`\r  Progress: ${i + 1}/${tiles.length} (${pct}%) — ${downloaded} new, ${skipped} cached, ${errors} errors`);
      }

      // Rate limit
      if (result === 'downloaded') {
        await sleep(DELAY_MS);
      }
    } catch (err) {
      errors++;
      console.error(`\n  ✖ Error: ${err.message}`);
    }
  }

  console.log('\n');
  console.log('─'.repeat(50));
  console.log(`✔  Done!  ${downloaded} downloaded, ${skipped} already cached, ${errors} errors`);
  console.log(`📁  Tiles saved to: ${OUTPUT_DIR}`);
  
  // Calculate total size
  let totalSize = 0;
  function calcSize(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        calcSize(full);
      } else {
        totalSize += fs.statSync(full).size;
      }
    }
  }
  calcSize(OUTPUT_DIR);
  console.log(`💾  Total tile cache size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
