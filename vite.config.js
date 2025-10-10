import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

export default defineConfig( {
  plugins: [ 
    react({
      fastRefresh: true,
      jsxRuntime: 'automatic'
    }), 
    tailwindcss() 
  ],
  resolve: {
    alias: {
      '@': path.resolve( __dirname, './src' ),
    },
  },
  optimizeDeps: {
    // Solo pre-bundle las dependencias más críticas
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    // Excluir react-icons para evitar bundling pesado
    exclude: [
      'react-icons'
    ],
    force: false, // No forzar optimización cada vez
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    open: false,
    hmr: {
      overlay: false
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  esbuild: {
    target: 'esnext',
    logLevel: 'silent'
  },
  css: {
    devSourcemap: false
  },
  clearScreen: false
} )


