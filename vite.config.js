import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  build: {
    // Source maps para Sentry mapear stack traces em produção
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Chunk splitting para melhorar cache e performance
    rollupOptions: {
      output: {
        // Vite 8 (Rolldown): manualChunks deve ser uma função
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
        },
      },
    },
  },

  // Previne que credenciais do servidor vazem para o bundle
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
