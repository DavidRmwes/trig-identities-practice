import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'trig-identities-practice' to your actual GitHub repo name
  base: '/trig-identities-practice/',
})
