import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { persistencePlugin } from './vite-plugins/persistence'

export default defineConfig({
  plugins: [vue(), persistencePlugin()],
  server: { port: 3000 }
})