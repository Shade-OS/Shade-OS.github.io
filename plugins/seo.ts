import type { Plugin } from 'vite'

import {
  headTags,
  jsonLd,
  robotsTxt,
  sitemapXml,
} from '../src/data/seo.ts'

/** `</script>` kaçışı — JSON-LD gövdesi HTML'i erken kapatmasın. */
function safeJson(value: unknown) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c')
}

/**
 * Meta etiketleri, JSON-LD, sitemap.xml ve robots.txt'yi
 * src/data/site.ts'ten türetip derlemeye ekler.
 */
export function seo(): Plugin {
  let isSsrBuild = false

  return {
    name: 'shadeos:seo',

    config(_config, env) {
      isSsrBuild = Boolean(env.isSsrBuild)
    },

    transformIndexHtml: {
      order: 'pre',
      handler() {
        // 'head' (sona ekleme) bilinçli: 'head-prepend' <meta charset>'i
        // aşağı iterdi ve charset ilk 1024 bayt içinde kalmazdı.
        return [
          ...headTags().map((t) => ({ ...t, injectTo: 'head' as const })),
          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            children: safeJson(jsonLd()),
            injectTo: 'head' as const,
          },
        ]
      },
    },

    /* dev sunucusunda da /robots.txt ve /sitemap.xml çalışsın */
    configureServer(server) {
      const files: Record<string, { type: string; body: () => string }> = {
        '/robots.txt': { type: 'text/plain; charset=utf-8', body: robotsTxt },
        '/sitemap.xml': {
          type: 'application/xml; charset=utf-8',
          body: () => sitemapXml(new Date().toISOString().slice(0, 10)),
        },
      }

      server.middlewares.use((req, res, next) => {
        const hit = req.url ? files[req.url.split('?')[0] ?? ''] : undefined
        if (!hit) return next()
        res.setHeader('Content-Type', hit.type)
        res.end(hit.body())
      })
    },

    /* derlemede statik dosya olarak yaz (SSR derlemesinde değil) */
    generateBundle() {
      if (isSsrBuild) return
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt(),
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemapXml(today),
      })
    },
  }
}
