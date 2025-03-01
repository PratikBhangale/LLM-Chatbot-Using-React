import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LLM-Chatbot-Using-React/',
  build: {
    rollupOptions: {
      input: {
        main: './src/main.jsx'  // Explicitly specify the entry point
      },
      output: {
        format: 'es'
      }
    },
    minify: 'esbuild'
  }
})