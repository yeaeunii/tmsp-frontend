import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const backendStaticDir = "D:/eGovFrameDev-3.10.0-64bit/workspace/tmsP/tmsP/src/main/resources/static";


export default defineConfig({
  plugins: [
       vue(),
       tailwindcss(),
   ],
  // server
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: path.resolve(backendStaticDir),
    emptyOutDir: true,
  },
})
