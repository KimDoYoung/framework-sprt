import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // STOMP over WebSocket (handshake에 ACCESS_TOKEN 쿠키가 함께 전달됨)
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  }
});
