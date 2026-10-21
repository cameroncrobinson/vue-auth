import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Use '@vitejs/plugin-vue2' if on Vue 2
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Re-creates the "@" alias pointing to your src folder
      '@': path.resolve(__dirname, './src'),
    },
    // Vite requires explicit extensions, but you can define fallback completions here
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
})
