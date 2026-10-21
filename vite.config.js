import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Use '@vitejs/plugin-vue2' if on Vue 2
import path from 'path'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
  plugins: [vue({
    include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile Markdown files
  }),
  Markdown({ /* options */ }),],
  resolve: {
    alias: {
      // Re-creates the "@" alias pointing to your src folder
      '@': path.resolve(__dirname, './src'),
    },
    // Vite requires explicit extensions, but you can define fallback completions here
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', 'md'],
  },
})
