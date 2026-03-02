import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace 'Pitchpro' with your exact GitHub repository name
  base: '/Pitchpro/', 
})
