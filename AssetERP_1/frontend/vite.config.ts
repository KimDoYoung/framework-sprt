import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    // '@/api/client' → src/api/client (tsconfig paths와 같게)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: {
    port: 5173,
    proxy: {
      // xfwd: X-Forwarded-Host로 원래 호스트(kfstest.localhost:5173)를 전달 → 백엔드가 서브도메인(테넌트)을 판별
      //  (changeOrigin이 Host를 localhost:8080으로 바꾸므로 필요. 백엔드 server.forward-headers-strategy=framework)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        xfwd: true
      },
      // STOMP over WebSocket (handshake에 ACCESS_TOKEN 쿠키가 함께 전달됨)
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        xfwd: true
      }
    }
  }
});
