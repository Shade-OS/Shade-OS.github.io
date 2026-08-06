import { releases, type Release } from '../data/site.ts'
import { useSpotlight } from '../hooks.ts'
import { Reveal, Section } from './ui.tsx'

const COLUMNS = ['dosya', 'sürüm', 'mimari', 'boyut', 'tarih'] as const

function DiskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function Row({ release }: { release: Release }) {
  const spot = useSpotlight<HTMLDivElement>()
  const ready = release.status === 'hazir' && release.url

  return (
    <div
      className="rel__row spot-card"
      ref={spot.ref}
      onPointerMove={spot.onPointerMove}
    >
      <div className="rel__file">
        <DiskIcon />
        <b>{release.file}</b>
        {release.note ? <span className="badge">{release.note}</span> : null}
      </div>

      <span className="rel__cell">
        <span className="rel__label">sürüm</span>
        {release.version}
      </span>
      <span className="rel__cell">
        <span className="rel__label">mimari</span>
        {release.arch}
      </span>
      <span className="rel__cell">
        <span className="rel__label">boyut</span>
        {release.size}
      </span>
      <span className="rel__cell">
        <span className="rel__label">tarih</span>
        {release.date}
      </span>

      {ready ? (
        <a
          className="btn btn--sm btn--primary"
          href={release.url ?? '#'}
          download
        >
          indir
        </a>
      ) : (
        <button className="btn btn--sm" type="button" disabled>
          yakında
        </button>
      )}
    </div>
  )
}

export function Downloads() {
  const anyReady = releases.some((r) => r.status === 'hazir' && r.url)

  return (
    <Section
      id="indir"
      index={1}
      label="indir"
      title="İmajlar"
      desc="Her imaj, SHA-256 özetiyle birlikte yayınlanır. Kuruluma başlamadan önce indirdiğin dosyayı mutlaka doğrula."
    >
      <Reveal delay={80}>
        <div className="rel">
          <div className="rel__head">
            {COLUMNS.map((c) => (
              <span key={c}>{c}</span>
            ))}
            <span />
          </div>
          {releases.map((release) => (
            <Row key={release.id} release={release} />
          ))}
        </div>

        {!anyReady ? (
          <p className="rel__note">
            Yayın bağlantıları henüz açılmadı. Sürüm hazır olduğunda bu tablo
            indirme bağlantısı ve özet değeriyle birlikte güncellenecek.
          </p>
        ) : null}
      </Reveal>
    </Section>
  )
}
