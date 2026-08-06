import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/* ── kaydırınca beliren sarmalayıcı ───────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

/* ── bölüm iskeleti ──────────────────────────────────────── */

export function Section({
  id,
  index,
  label,
  title,
  desc,
  children,
}: {
  id: string
  index: number
  label: string
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <section className="section" id={id}>
      <div className="shell">
        <Reveal>
          <header className="section__head">
            <p className="section__label">
              <span className="section__idx">
                {String(index).padStart(2, '0')}
              </span>
              {label}
            </p>
            <h2 className="section__title">{title}</h2>
            {desc ? <p className="section__desc">{desc}</p> : null}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/* ── terminal penceresi ──────────────────────────────────── */

export function Term({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`term ${className}`}>
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">{title}</span>
      </div>
      <div className="term__body">{children}</div>
    </div>
  )
}

/* ── panoya kopyala ──────────────────────────────────────── */

export function CopyButton({
  value,
  label = 'kopyala',
}: {
  value: string
  label?: string
}) {
  const [done, setDone] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // izin verilmediyse sessizce vazgeç
      return
    }
    setDone(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 1800)
  }

  return (
    <button
      type="button"
      className="copy"
      onClick={copy}
      disabled={!value}
      data-done={done}
      aria-label={done ? 'kopyalandı' : label}
    >
      {done ? '✓ kopyalandı' : label}
    </button>
  )
}

/* ── kopyalanabilir kod bloğu ────────────────────────────── */

export function CodeBlock({
  caption,
  value,
  children,
}: {
  caption: string
  value: string
  children?: ReactNode
}) {
  return (
    <div className="code">
      <div className="code__body">
        <span className="code__cap">{caption}</span>
        <code className="code__text">{children ?? value}</code>
      </div>
      <CopyButton value={value} />
    </div>
  )
}
