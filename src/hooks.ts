import { useEffect, useRef, useState, type PointerEvent } from 'react'

/** Kullanıcı hareketi azaltmayı tercih ediyorsa animasyonları kapat. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * İmlecin öğe içindeki konumunu --cx / --cy olarak yazar.
 * Yeniden render tetiklemez; doğrudan stil üzerine yazar.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  function onPointerMove(event: PointerEvent<T>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--cx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--cy', `${event.clientY - rect.top}px`)
  }

  return { ref, onPointerMove }
}
