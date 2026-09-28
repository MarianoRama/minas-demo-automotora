import { useEffect, useState } from 'react'

/** 6 tarjetas por página en mobile, 9 en desktop (≥640px). */
export function useTamPagina() {
  const [tam, setTam] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches ? 9 : 6,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const onChange = () => setTam(mq.matches ? 9 : 6)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return tam
}
