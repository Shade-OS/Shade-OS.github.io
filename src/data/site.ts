/**
 * Sitenin tüm içeriği burada. Metin, sürüm veya SEO alanı eklemek için
 * bileşenlere değil, bu dosyaya dokunman yeterli.
 */

/**
 * ⚠ ALAN ADI — yayına almadan önce burayı değiştir.
 * canonical, og:url, sitemap.xml ve robots.txt hep buradan türetilir.
 * Sonunda eğik çizgi OLMASIN.
 */
export const SITE_URL = 'https://shadeos.dev'

export const site = {
  name: 'ShadeOS',
  tagline: 'Windows. Fazlası değil.',
  description:
    'Sıfırdan derlenen, gereksiz yazılımlardan arındırılmış bağımsız bir Windows kurulum imajı.',
  /** Arama sonuçlarında görünen açıklama — 150-160 karakter arası ideal. */
  metaDescription:
    'ShadeOS, gereksiz yazılımlardan arındırılmış bağımsız bir Windows kurulum imajıdır. ISO indir, SHA-256 ile doğrula, kur. Microsoft ile bağlantısı yoktur.',
  locale: 'tr_TR',
  lang: 'tr',
  author: 'ShadeOS',
  keywords: [
    'ShadeOS',
    'debloat windows',
    'özel windows iso',
    'sade windows',
    'bloatware olmadan windows',
    'windows kurulum imajı',
    'custom windows iso',
  ],
  repo: 'https://github.com/',
  contact: 'mailto:berkays0733@gmail.com',
} as const

/** Sosyal medya önizleme görseli (1200×630). */
export const ogImage = {
  path: '/og.png',
  width: 1200,
  height: 630,
  alt: 'ShadeOS — Windows. Fazlası değil.',
  type: 'image/png',
} as const

export const nav = [
  { href: '#indir', label: 'indir' },
  { href: '#dogrulama', label: 'doğrulama' },
  { href: '#kurulum', label: 'kurulum' },
  { href: '#sss', label: 'sss' },
] as const

/** Hero'daki sahte derleme çıktısı — yalnızca görsel. */
export const bootLines = [
  { kind: 'cmd', text: 'shadeos build --target iso --arch x64' },
  { kind: 'ok', text: 'kaynak imaj çözümlendi' },
  { kind: 'ok', text: 'bileşen ağacı yeniden yazıldı' },
  { kind: 'ok', text: 'bütünlük özeti hesaplandı' },
  { kind: 'out', text: 'ShadeOS-x64.iso hazır' },
] as const

export const marquee = [
  'BAĞIMSIZ PROJE',
  'MICROSOFT İLE BAĞLANTISI YOKTUR',
  'RESMİ BİR MICROSOFT ÜRÜNÜ DEĞİLDİR',
  'DESTEK MICROSOFT TARAFINDAN SAĞLANMAZ',
] as const

export type ReleaseStatus = 'hazir' | 'yakinda'

export type Release = {
  id: string
  file: string
  version: string
  arch: string
  size: string
  date: string
  /** Tam SHA-256 özeti. Yayına kadar boş bırak. */
  sha256: string
  status: ReleaseStatus
  /** Doğrudan indirme bağlantısı. Hazır olmadan null bırak. */
  url: string | null
  note?: string
}

/**
 * ── YAYINA HAZIRLARKEN ────────────────────────────────────────
 * status: 'hazir' yap, url + sha256 + size + date alanlarını doldur.
 * Buton, doğrulama bölümü ve yapısal veri otomatik olarak canlıya geçer.
 * ──────────────────────────────────────────────────────────────
 */
export const releases: Release[] = [
  {
    id: 'stable-x64',
    file: 'ShadeOS-x64.iso',
    version: '0.1.0',
    arch: 'x64',
    size: '—',
    date: '—',
    sha256: '',
    status: 'yakinda',
    url: null,
    note: 'kararlı',
  },
  {
    id: 'preview-x64',
    file: 'ShadeOS-x64-preview.iso',
    version: '0.2.0-dev',
    arch: 'x64',
    size: '—',
    date: '—',
    sha256: '',
    status: 'yakinda',
    url: null,
    note: 'önizleme',
  },
]

export const installSteps = [
  {
    title: 'İmajı indir',
    body: 'Listeden mimarine uygun .iso dosyasını indir. İndirme tamamlanmadan sonraki adıma geçme.',
  },
  {
    title: 'Özeti doğrula',
    body: 'Dosyanın SHA-256 özetini hesapla ve bu sitedeki değerle karakter karakter karşılaştır. Eşleşmiyorsa dosyayı sil.',
  },
  {
    title: 'USB hazırla',
    body: 'Rufus veya Ventoy ile en az 8 GB kapasiteli bir USB belleği önyüklenebilir hale getir. USB üzerindeki tüm veriler silinir.',
  },
  {
    title: 'Kur',
    body: 'Cihazı USB üzerinden başlat ve kurulum sihirbazını takip et. Kurulumdan önce mevcut diskini yedeklemen önerilir.',
  },
] as const

export const faq = [
  {
    q: 'ShadeOS bir Microsoft ürünü mü?',
    a: 'Hayır. ShadeOS bağımsız bir projedir. Microsoft Corporation ile herhangi bir bağlantısı, ortaklığı, sponsorluğu veya onayı yoktur. Bu site de Microsoft tarafından işletilmez.',
  },
  {
    q: 'Lisans tarafı nasıl işliyor?',
    a: 'ShadeOS hiçbir lisans satmaz, dağıtmaz veya sağlamaz. Kullanacağın Windows lisansı tamamen sana aittir ve geçerli bir lisansa sahip olmak senin sorumluluğundadır.',
  },
  {
    q: 'İndirdiğim dosyayı neden doğrulamalıyım?',
    a: 'Bir kurulum imajı sistemine en derin seviyede erişir. SHA-256 özeti, dosyanın aktarım sırasında bozulmadığını ve üçüncü bir tarafça değiştirilmediğini kanıtlayan tek pratik yöntemdir.',
  },
  {
    q: 'Destek nereden alınır?',
    a: 'Destek yalnızca proje kanalları üzerinden, gönüllülük esasıyla sağlanır. Microsoft bu imaj için destek vermez; resmi destek kanallarına başvurma.',
  },
  {
    q: 'Kaynak kodu ve şeffaflık?',
    a: 'Derleme betikleri ve projeye eklenen araçların kaynak kodu depo üzerinden açık şekilde takip edilebilir. Neyin çıkarıldığı ve neyin eklendiği belge altına alınır.',
  },
] as const
