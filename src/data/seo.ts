/**
 * Tüm SEO çıktısı (meta etiketler, JSON-LD, sitemap, robots) burada üretilir
 * ve derleme sırasında `plugins/seo.ts` tarafından index.html'e enjekte edilir.
 * Tek kaynak: site.ts.
 */

import {
  faq,
  installSteps,
  ogImage,
  releases,
  site,
  SITE_URL,
} from './site.ts'

export const canonical = `${SITE_URL}/`
export const ogImageUrl = `${SITE_URL}${ogImage.path}`

const pageTitle = `${site.name} — ${site.tagline}`

type Tag = { tag: string; attrs: Record<string, string>; children?: string }

const meta = (attrs: Record<string, string>): Tag => ({ tag: 'meta', attrs })
const link = (attrs: Record<string, string>): Tag => ({ tag: 'link', attrs })

/** <head> içine girecek tüm etiketler. */
export function headTags(): Tag[] {
  return [
    { tag: 'title', attrs: {}, children: pageTitle },

    meta({ name: 'description', content: site.metaDescription }),
    meta({ name: 'keywords', content: site.keywords.join(', ') }),
    meta({ name: 'author', content: site.author }),
    meta({ name: 'application-name', content: site.name }),
    meta({ name: 'generator', content: 'Vite' }),
    meta({
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    }),
    meta({ name: 'referrer', content: 'strict-origin-when-cross-origin' }),
    meta({ name: 'format-detection', content: 'telephone=no' }),

    link({ rel: 'canonical', href: canonical }),
    link({ rel: 'alternate', hreflang: site.lang, href: canonical }),
    link({ rel: 'alternate', hreflang: 'x-default', href: canonical }),
    link({ rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }),

    // ── Open Graph ─────────────────────────────────────────────
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:site_name', content: site.name }),
    meta({ property: 'og:locale', content: site.locale }),
    meta({ property: 'og:url', content: canonical }),
    meta({ property: 'og:title', content: pageTitle }),
    meta({ property: 'og:description', content: site.metaDescription }),
    meta({ property: 'og:image', content: ogImageUrl }),
    meta({ property: 'og:image:secure_url', content: ogImageUrl }),
    meta({ property: 'og:image:type', content: ogImage.type }),
    meta({ property: 'og:image:width', content: String(ogImage.width) }),
    meta({ property: 'og:image:height', content: String(ogImage.height) }),
    meta({ property: 'og:image:alt', content: ogImage.alt }),

    // ── Twitter / X ────────────────────────────────────────────
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: pageTitle }),
    meta({ name: 'twitter:description', content: site.metaDescription }),
    meta({ name: 'twitter:image', content: ogImageUrl }),
    meta({ name: 'twitter:image:alt', content: ogImage.alt }),

    // ── ikonlar / manifest ─────────────────────────────────────
    link({ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }),
    link({ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }),
    link({ rel: 'manifest', href: '/site.webmanifest' }),
  ]
}

/* ── yapısal veri (schema.org) ─────────────────────────────── */

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`
const APP_ID = `${SITE_URL}/#software`

export function jsonLd() {
  const published = releases.filter((r) => r.status === 'hazir')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: site.name,
        url: canonical,
        description: site.description,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon.svg`,
        },
        // Arama motorlarının bağımsızlığı yanlış eşleştirmemesi için:
        disambiguatingDescription:
          'Bağımsız bir topluluk projesi. Microsoft Corporation ile bağlantısı, ortaklığı veya onayı yoktur.',
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: canonical,
        name: site.name,
        description: site.metaDescription,
        inLanguage: site.lang,
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': APP_ID,
        name: site.name,
        applicationCategory: 'OperatingSystem',
        operatingSystem: 'Windows',
        url: canonical,
        description: site.description,
        inLanguage: site.lang,
        publisher: { '@id': ORG_ID },
        image: ogImageUrl,
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: published.length
            ? 'https://schema.org/InStock'
            : 'https://schema.org/PreOrder',
        },
        ...(published[0]
          ? {
              softwareVersion: published[0].version,
              downloadUrl: published[0].url,
              fileFormat: 'application/x-iso9660-image',
            }
          : {}),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        inLanguage: site.lang,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'HowTo',
        '@id': `${SITE_URL}/#kurulum`,
        name: `${site.name} nasıl kurulur`,
        description:
          'ShadeOS kurulum imajını indirme, doğrulama ve kurma adımları.',
        inLanguage: site.lang,
        step: installSteps.map((step, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: step.title,
          text: step.body,
          url: `${SITE_URL}/#kurulum`,
        })),
      },
    ],
  }
}

/* ── sitemap.xml ───────────────────────────────────────────── */

export function sitemapXml(lastmod: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${canonical}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${ogImageUrl}</image:loc>
      <image:title>${site.name}</image:title>
    </image:image>
  </url>
</urlset>
`
}

/* ── robots.txt ────────────────────────────────────────────── */

export function robotsTxt() {
  return `# ${site.name}
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}
