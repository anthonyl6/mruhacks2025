import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['mojoapi-web-3jopp6-773554-142-179-227-74.traefik.me', "mojo.alahdal.ca"],
    port: 3002,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
