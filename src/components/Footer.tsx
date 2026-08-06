import { nav, site } from '../data/site.ts'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div>
            <a className="brand" href="#top">
              <span className="brand__dim">~/</span>
              {site.name.toLowerCase()}
            </a>
            <p className="footer__legal" style={{ marginTop: '1.1rem' }}>
              <strong>
                ShadeOS bağımsız bir projedir ve Microsoft Corporation ile
                herhangi bir bağlantısı, ortaklığı, sponsorluğu veya onayı
                yoktur.
              </strong>{' '}
              Windows, Microsoft Corporation'ın tescilli ticari markasıdır ve bu
              sitede yalnızca tanımlama amacıyla anılmaktadır. Proje hiçbir
              lisans satmaz veya dağıtmaz; geçerli bir lisansa sahip olmak
              kullanıcının sorumluluğundadır. İmajlar olduğu gibi, garanti
              verilmeksizin sunulur.
            </p>
          </div>

          <nav className="footer__links" aria-label="Alt menü">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={site.repo} target="_blank" rel="noreferrer noopener">
              depo
            </a>
            <a href={site.contact}>iletişim</a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {__BUILD_YEAR__} ShadeOS</span>
          <span>bağımsız · topluluk yapımı · resmi değildir</span>
        </div>
      </div>
    </footer>
  )
}
