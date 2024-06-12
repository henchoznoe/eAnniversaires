import react from '@vitejs/plugin-react'
import path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@bootstrap', replacement: path.resolve(__dirname, 'node_modules/bootstrap') }
    ]
  },
  optimizeDeps: {
    include: ['react-quilljs']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    chunkSizeWarningLimit: 5000,
  }
})
