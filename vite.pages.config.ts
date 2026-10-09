import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(root, 'pages'),
  base: '/zi-you-yisi/',
  publicDir: resolve(root, 'public'),
  plugins: [react()],
  build: {
    outDir: resolve(root, 'docs'),
    emptyOutDir: true,
  },
});
