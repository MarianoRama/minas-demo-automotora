import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

function paginasAMostrar(pagina: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const paginas = new Set([1, total, pagina, pagina - 1, pagina + 1])
  const lista = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const conPuntos: (number | '...')[] = []
  lista.forEach((p, i) => {
    if (i > 0 && p - (lista[i - 1] as number) > 1) conPuntos.push('...')
    conPuntos.push(p)
  })
  return conPuntos
}

export default function Paginacion({ pagina, totalPaginas, onCambiar }: Props) {
  if (totalPaginas <= 1) return null

  return (
    <nav aria-label="Paginado del catálogo" className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
      <button
        type="button"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
        className="flex h-11 w-11 items-center justify-center border-2 border-tinta text-tinta transition hover:bg-tinta hover:text-hueso disabled:cursor-not-allowed disabled:border-linea disabled:text-texto/30 disabled:hover:bg-transparent disabled:hover:text-texto/30"
      >
        <ChevronLeft size={18} />
      </button>

      {paginasAMostrar(pagina, totalPaginas).map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="px-1 text-sm text-texto/40">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onCambiar(p)}
            aria-current={p === pagina ? 'page' : undefined}
            className={`flex h-11 min-w-11 items-center justify-center border-2 px-2 text-sm font-bold tabular transition ${
              p === pagina
                ? 'border-tinta bg-tinta text-hueso'
                : 'border-linea text-texto/70 hover:border-tinta hover:text-tinta'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
        aria-label="Página siguiente"
        className="flex h-11 w-11 items-center justify-center border-2 border-tinta text-tinta transition hover:bg-tinta hover:text-hueso disabled:cursor-not-allowed disabled:border-linea disabled:text-texto/30 disabled:hover:bg-transparent disabled:hover:text-texto/30"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
