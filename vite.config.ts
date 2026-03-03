import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using relative base path './' is the safest way to fix the GitHub white screen issue
  base: './', 
})