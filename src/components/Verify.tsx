import { releases } from '../data/site.ts'
import { CodeBlock, Reveal, Section, Term } from './ui.tsx'

export function Verify() {
  const primary = releases[0]
  const file = primary?.file ?? 'ShadeOS-x64.iso'
  const hash = primary?.sha256 ?? ''

  const psCommand = `Get-FileHash .\\${file} -Algorithm SHA256 | Format-List`
  const cmdCommand = `certutil -hashfile ${file} SHA256`

  return (
    <Section
      id="dogrulama"
      index={2}
      label="doğrulama"
      title="Kurmadan önce doğrula"
      desc="Bir kurulum imajı sisteme en derin seviyede erişir. SHA-256 özeti, dosyanın aktarım sırasında bozulmadığını ve üçüncü bir tarafça değiştirilmediğini kanıtlayan tek pratik yöntemdir."
    >
      <Reveal delay={80}>
        <div className="verify__grid">
          <div className="verify__stack">
            <CodeBlock caption={`beklenen özet — ${file}`} value={hash}>
              {hash ? (
                hash
              ) : (
                <span className="empty">sürüm yayınlandığında eklenecek</span>
              )}
            </CodeBlock>

            <p className="verify__hint">
              Hesapladığın değer yukarıdakiyle karakter karakter aynı değilse
              dosyayı kullanma, sil ve yeniden indir.
            </p>
          </div>

          <Term title="powershell — doğrulama">
            <div className="verify__stack">
              <CodeBlock caption="powershell" value={psCommand}>
                <span className="accent">Get-FileHash</span>
                {` .\\${file} `}
                <span className="dim">-Algorithm</span>
                {' SHA256 '}
                <span className="dim">| Format-List</span>
              </CodeBlock>

              <CodeBlock caption="komut istemi (alternatif)" value={cmdCommand}>
                <span className="accent">certutil</span>
                <span className="dim">{' -hashfile '}</span>
                {file}
                {' SHA256'}
              </CodeBlock>
            </div>
          </Term>
        </div>
      </Reveal>
    </Section>
  )
}
