/**
 * Derlenmiş SSR paketini çalıştırıp sonucu dist/index.html içine gömer.
 * Böylece JS çalıştırmayan tarayıcılar (sosyal medya kazıyıcıları, bazı arama
 * motorları) sayfayı boş değil, tam içerikle görür.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const HTML = resolve('dist/index.html')
const SSR_ENTRY = resolve('dist-ssr/entry-server.js')
const PLACEHOLDER = '<div id="root"></div>'

const { render } = await import(pathToFileURL(SSR_ENTRY).href)
const html = readFileSync(HTML, 'utf8')

if (!html.includes(PLACEHOLDER)) {
  throw new Error(`prerender: "${PLACEHOLDER}" dist/index.html içinde bulunamadı`)
}

const markup = render()
writeFileSync(HTML, html.replace(PLACEHOLDER, `<div id="root">${markup}</div>`))

// SSR ara çıktısı yayına gitmez.
rmSync(resolve('dist-ssr'), { recursive: true, force: true })

const kb = (markup.length / 1024).toFixed(1)
console.log(`✓ prerender  dist/index.html  (+${kb} kB HTML)`)
