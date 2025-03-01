import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LLM-Chatbot-Using-React/',
  build: {
    rollupOptions: {
      output: {
        // This will help prevent the use of eval() in the production build
        format: 'iife',
      }
    },
    // Ensure proper CSP compatibility
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      format: {
        // This helps prevent the creation of code that requires eval
        comments: false,
        ecma: 2020,
      },
    },
  },
})
