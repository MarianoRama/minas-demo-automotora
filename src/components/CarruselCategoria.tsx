import { useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from './Reveal'

interface Props {
  titulo: string
  total: number
  children: ReactNode[]
}

/** Fila de tarjetas con scroll horizontal, flechas y contador "n / total". */
export default function CarruselCategoria({ titulo, total, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [indice, setIndice] = useState(0)

  function mover(delta: number) {
    const track = trackRef.current
    if (!track) return
    const nuevo = Math.min(Math.max(indice + delta, 0), total - 1)
    setIndice(nuevo)
    const card = track.children[nuevo] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  if (total === 0) return null

  return (
    <Reveal className="mt-12 first:mt-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-senal-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-senal-2" />
          {titulo}
        </h3>
        {total > 1 && (
          <div className="flex items-center gap-2">
            <span className="tabular text-xs font-semibold text-texto/50">
              {indice + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => mover(-1)}
              disabled={indice === 0}
              aria-label={`Anterior en ${titulo}`}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-linea text-tinta transition hover:border-tinta disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              disabled={indice === total - 1}
              aria-label={`Siguiente en ${titulo}`}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-linea text-tinta transition hover:border-tinta disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <div key={i} className="w-[78vw] shrink-0 snap-start sm:w-[320px]">
            {child}
          </div>
        ))}
      </div>
    </Reveal>
  )
}
