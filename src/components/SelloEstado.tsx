import type { EstadoAuto } from '../data/cars'

interface Props {
  estado: EstadoAuto
  className?: string
}

/** Sello cruzado tipo goma de "RESERVADO" / "VENDIDO" sobre la ilustración o foto. */
export default function SelloEstado({ estado, className = '' }: Props) {
  if (estado === 'Disponible') return null

  const color = estado === 'Vendido' ? 'border-senal-2 text-senal-2' : 'border-tinta text-tinta'

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span
        className={`-rotate-[14deg] border-[3px] bg-hueso/90 px-4 py-1 text-lg font-black uppercase tracking-[0.15em] ${color}`}
      >
        {estado}
      </span>
    </div>
  )
}
