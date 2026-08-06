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

/** Menünün açılır panele düştüğü genişlik; CSS'teki eşikle aynı olmalı. */
const MOBILE_BREAKPOINT = 780

export function Nav() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(SECTION_IDS)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /*  Panel acikken kapanmasi gereken UC durum var ve ucu de gercekten
      oluyor: Escape'e basmak, panel disina dokunmak, ve pencereyi
      masaustu genisligine buyutmek. Sonuncusu atlanirsa panel acik
      kalip masaustu duzenini bozuyor.  */
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const header = headerRef.current
      if (header && !header.contains(e.target as Node)) setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="nav" data-stuck={stuck} data-open={open} ref={headerRef}>
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

        {/*  Masaustunde satir ici menu, dar ekranda acilir panel.
            AYNI dugumler: bagantilar mobilde gizlenmiyor, TASINIYOR.
            Onceki surumde 560px altinda ilk ikisi disindaki her bagalanti
            display:none ile siliniyordu; "kurulum" ve "sss" telefonda
            hicbir yerden erisilemiyordu.  */}
        <nav className="nav__links" id="nav-menu" data-open={open} aria-label="Ana menü">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-active={active === item.href.slice(1)}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {/*  Panel icindeki indirme dugmesi. Masaustunde gizli; oradaki
              esdegeri .nav__end icinde duruyor. Ayni anda yalnizca biri
              display:none disinda oldugu icin ekran okuyucuya tek bagalanti
              gorunur.  */}
          <a
            className="btn btn--sm btn--primary nav__panel-cta"
            href="#indir"
            onClick={() => setOpen(false)}
          >
            iso indir
          </a>
        </nav>

        <div className="nav__end">
          <ThemeToggle />

          <a className="btn btn--sm btn--primary nav__cta" href="#indir">
            iso indir
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
