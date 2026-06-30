import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { persistencePlugin } from './vite-plugins/persistence'

export default defineConfig({
  plugins: [vue(), persistencePlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: { port: 3002 }
})