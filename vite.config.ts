import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mdx'], // Treat MDX files as static assets
  server: {
    fs: {
      // Allow serving files from the storage-samples directory
      allow: ['..', 'storage-samples']
    }
  }
});