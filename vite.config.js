import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LLM-Chatbot-Using-React/',
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.openai.com",  // Add this for OpenAI API calls
      ].join('; ')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './src/main.jsx'  // Explicitly specify the entry point
      },
      output: {
        format: 'es',
        sanitizeFileName: (name) => name.replace(/[<>:"/\\|?*]+/g, '-'),
      }
    },
    minify: 'esbuild'
  }
})