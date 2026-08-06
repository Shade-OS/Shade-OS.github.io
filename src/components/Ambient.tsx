import { useEffect, useState, type CSSProperties } from 'react'

import { usePrefersReducedMotion } from '../hooks.ts'

/**
 * İmleci takip eden global değişkenler:
 *   --mx / --my  → viewport içindeki piksel konumu (ışık huzmesi)
 *   --px / --py  → merkeze göre -1..1 (paralaks)
 * rAF ile sınırlandırılır, render tetiklemez.
 */
export function PointerTracker() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const root = document.documentElement
    let x = 0
    let y = 0
    let queued = false

    const flush = () => {
      queued = false
      root.style.setProperty('--mx', `${x}px`)
      root.style.setProperty('--my', `${y}px`)
      root.style.setProperty('--px', `${(x / window.innerWidth - 0.5).toFixed(3)}`)
      root.style.setProperty('--py', `${(y / window.innerHeight - 0.5).toFixed(3)}`)
    }

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      if (!queued) {
        queued = true
        requestAnimationFrame(flush)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  return <div className="spot" aria-hidden="true" />
}

/** Sayfanın en üstünde ilerleyen ince okuma çubuğu. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className="progress"
      aria-hidden="true"
      style={{ '--p': progress } as CSSProperties}
    />
  )
}

/** Ekranın tamamına yayılan çok hafif film grenli doku. */
export function Grain() {
  return <div className="grain" aria-hidden="true" />
}
