import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

const saveLotsPlugin = () => ({
  name: 'save-lots-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if ((req.url === '/api/save-lots' || req.url === '/api/save-concept-lots') && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const fileName = req.url === '/api/save-concept-lots' ? 'conceptCoordinates.json' : 'lotCoordinates.json';
            const filepath = path.resolve(__dirname, `src/${fileName}`);
            let existing = {};
            if (fs.existsSync(filepath)) {
              existing = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            }
            // Merge array of exported lots into a dictionary mapping ID -> coordinates (or points)
            const newData: Record<string, any> = {};
            data.forEach((lot: any) => {
              newData[lot.id] = req.url === '/api/save-concept-lots' ? lot.points : lot.coordinates;
            });
            const updated = { ...existing, ...newData };
            fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), saveLotsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Set DISABLE_HMR=true to turn off HMR and file watching.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
