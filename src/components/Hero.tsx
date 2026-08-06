import { useEffect, useState } from 'react'

import { bootLines, site } from '../data/site.ts'
import { usePrefersReducedMotion } from '../hooks.ts'
import { Reveal, Term } from './ui.tsx'

const TAG: Record<string, string> = { cmd: '$', ok: '[ok]', out: '=>' }
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@*/\\<>=0123456789'

/** Karakterleri rastgele başlayıp yerine oturan çözümleme efekti. */
function Scramble({ text, run }: { text: string; run: number }) {
  const reduced = usePrefersReducedMotion()
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (reduced) {
      setOut(text)
      return
    }

    const steps = text.length * 4
    let frame = 0

    const id = window.setInterval(() => {
      frame += 1
      const locked = Math.floor((frame / steps) * text.length)

      setOut(
        text
          .split('')
          .map((char, i) =>
            i < locked
              ? char
              : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char),
          )
          .join(''),
      )

      if (frame >= steps) {
        window.clearInterval(id)
        setOut(text)
      }
    }, 34)

    return () => window.clearInterval(id)
  }, [text, run, reduced])

  return <>{out}</>
}

/** Satır satır yazılan sahte derleme çıktısı. */
function BootLog() {
  const reduced = usePrefersReducedMotion()
  const [line, setLine] = useState(0)
  const [char, setChar] = useState(0)

  useEffect(() => {
    if (reduced) {
      setLine(bootLines.length)
      return
    }
    if (line >= bootLines.length) return

    const text = bootLines[line]?.text ?? ''
    if (char < text.length) {
      const id = window.setTimeout(() => setChar((c) => c + 1), 16)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => {
      setLine((l) => l + 1)
      setChar(0)
    }, 240)
    return () => window.clearTimeout(id)
  }, [line, char, reduced])

  const finished = line >= bootLines.length

  return (
    <div className="boot" aria-hidden="true">
      {bootLines.map((entry, i) => {
        if (i > line) return null
        const text = i < line ? entry.text : entry.text.slice(0, char)
        return (
          <div className="boot__line" key={entry.text} data-kind={entry.kind}>
            <span className={`boot__tag boot__tag--${entry.kind}`}>
              {TAG[entry.kind]}
            </span>
            <span className="boot__text">{text}</span>
          </div>
        )
      })}
      {finished ? (
        <div className="boot__line" data-kind="cmd">
          <span className="boot__tag boot__tag--cmd">$</span>
          <span className="boot__cursor" />
        </div>
      ) : null}
    </div>
  )
}

export function Hero() {
  const [run, setRun] = useState(0)

  return (
    <section className="hero" id="top">
      <div className="shell hero__grid">
        <Reveal>
          <p className="hero__eyebrow">
            <i aria-hidden="true" />
            bağımsız windows imajı
          </p>

          <h1
            className="wordmark"
            onPointerEnter={() => setRun((n) => n + 1)}
            title="SHADEOS"
          >
            <span aria-hidden="true">
              <Scramble text="SHADEOS" run={run} />
            </span>
            <span className="sr-only">SHADEOS</span>
          </h1>

          <p className="hero__tagline">{site.tagline}</p>
          <p className="hero__desc">{site.description}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#indir">
              iso indir
            </a>
            <a className="btn" href="#dogrulama">
              sha-256 doğrula
            </a>
          </div>

          <p className="hero__disclaim">
            <span aria-hidden="true">!</span>
            <span>
              ShadeOS <b>bağımsız bir projedir.</b> Microsoft Corporation ile
              hiçbir bağlantısı, ortaklığı veya onayı yoktur. Bu imaj için
              Microsoft destek sağlamaz.
            </span>
          </p>
        </Reveal>

        <Reveal delay={140} className="hero__aside">
          <Term title="shadeos@build — bash" className="term--float">
            <BootLog />
          </Term>
        </Reveal>
      </div>
    </section>
  )
}
