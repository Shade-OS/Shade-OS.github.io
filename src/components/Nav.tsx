import { useEffect, useRef, useState } from 'react'

import { nav, site } from '../data/site.ts'
import { ThemeToggle } from './ThemeToggle.tsx'

/** Görünür bölüme göre menüde aktif bağlantıyı işaretler. */
function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState('')
  const visible = useRef(new Set<string>())

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id)
          else visible.current.delete(entry.target.id)
        }
        setActive(ids.find((id) => visible.current.has(id)) ?? '')
      },
      { rootMargin: '-38% 0px -52% 0px' },
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}

const SECTION_IDS = nav.map((item) => item.href.slice(1))

export function Nav() {
  const [stuck, setStuck] = useState(false)
  const active = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="nav" data-stuck={stuck}>
      <div className="shell nav__inner">
        <a className="brand" href="#top" aria-label={`${site.name} — başa dön`}>
          <img
            className="brand__mark"
            src="/mark-512.png"
            width="512"
            height="512"
            alt=""
            decoding="async"
          />
          <span className="brand__dim">~/</span>
          {site.name.toLowerCase()}
          <span className="brand__caret" aria-hidden="true" />
        </a>

        <nav className="nav__links" aria-label="Ana menü">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              data-optional={i > 1}
              data-active={active === item.href.slice(1)}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__end">
          <ThemeToggle />
          <a className="btn btn--sm btn--primary nav__cta" href="#indir">
            iso indir
          </a>
        </div>
      </div>
    </header>
  )
}
