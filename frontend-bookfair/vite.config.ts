import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Proxy API calls during dev to avoid CORS
      '/auth': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
