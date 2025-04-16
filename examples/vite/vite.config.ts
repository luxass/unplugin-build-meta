import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import buildMeta from "unplugin-build-meta/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildMeta()],
})
