import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // ← ye add karo
    port: 5173,        // optional (default hai)
    strictPort: true,  // agar port busy ho toh error de
  }
});
