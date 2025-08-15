import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

export default defineConfig( {
  plugins: [ react(), tailwindcss() ],
  resolve: {
    alias: {
      '@': path.resolve( __dirname, './src' ),
    },
  },
  optimizeDeps: {
    exclude: [ 'react-icons/io5', 'react-icons/ios', 'react-icons/ci', 'react-icons/hi2', 'react-icons/hi', 'react-icons/fa', 'react-icons/fa6', 'react-icons/md', 'react-icons/md2', 'react-icons/ti', 'react-icons/tb', 'react-icons/vsc', 'react-icons/bs', 'react-icons/bi', 'react-icons/cg', 'react-icons/fi', 'react-icons/fc', 'react-icons/rx', 'react-icons/si', 'react-icons/sl', 'react-icons/im' ],
  },
  server: {
    port: 5173, // Cambia 3001 por el puerto que desees
    host: true, // Permite acceso desde otras máquinas en la red local
  },
  define: {
    'process.env': {},
    Buffer: [],
  },
} )


