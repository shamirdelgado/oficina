import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { es } from './src/i18n/es.ts'

export default defineConfig({
  base: '/oficina/',
  plugins: [react(), {
    name: 'page-description',
    transformIndexHtml: html => html.replace(
      '<meta name="description" content="" />',
      `<meta name="description" content="${es.description}" />`,
    ),
  }],
})
