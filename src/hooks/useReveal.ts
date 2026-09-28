import { useEffect, useRef, useState } from 'react'

/**
 * Revela un elemento con fade + slide corto cuando entra en viewport.
 * Se dispara una sola vez. Respeta prefers-reduced-motion (queda visible
 * de entrada, sin animar). Incluye una red de seguridad por si el
 * IntersectionObserver no llega a disparar (scroll programático muy
 * rápido, capturas automatizadas, etc.): fuerza la aparición igual.
 */
function prefiereMenosMovimiento() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(prefiereMenosMovimiento)

  useEffect(() => {
    const el = ref.current
    if (!el || prefiereMenosMovimiento()) return

    let activo = true
    const mostrar = () => {
      if (activo) setVisible(true)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          window.setTimeout(mostrar, delayMs)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(el)

    // Red de seguridad: si por lo que sea nunca se detecta la
    // intersección, igual mostramos el contenido pasado un rato.
    const fallback = window.setTimeout(mostrar, 1800)

    return () => {
      activo = false
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [delayMs])

  return { ref, visible }
}

export const revealClases = (visible: boolean) =>
  `transition-all duration-700 ease-out ${
    visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`
