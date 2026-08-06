import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { seo } from './plugins/seo.ts'

export default defineConfig({
  plugins: [react(), seo()],
  define: {
    // Ön-render ile istemci arasında yıl farkı çıkmasın diye sabitlenir.
    __BUILD_YEAR__: new Date().getFullYear(),
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  build: {
    // Kaynak haritaları hata ayıklamayı kolaylaştırır, SEO'ya etkisi yok.
    sourcemap: false,
    target: 'es2022',
  },
})
