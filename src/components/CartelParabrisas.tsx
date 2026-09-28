interface Props {
  texto: string
  precio?: string
  rotacion?: number
  className?: string
}

/**
 * El cartel de cartulina que se pega en el parabrisas de los autos usados
 * en Uruguay: fondo claro, marcador grueso, un poco torcido. Se usa como
 * recurso gráfico en tarjetas y en la ficha, nunca como dato real del auto.
 */
export default function CartelParabrisas({ texto, precio, rotacion = -3, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none select-none bg-cartulina px-3 py-2 text-center leading-none shadow-[2px_3px_0_rgba(0,0,0,0.18)] ring-1 ring-black/10 ${className}`}
      style={{ transform: `rotate(${rotacion}deg)` }}
      aria-hidden="true"
    >
      {precio && (
        <p className="font-marcador text-lg text-cartel-tinta sm:text-xl">{precio}</p>
      )}
      <p className="font-marcador text-[13px] uppercase tracking-wide text-cartel-tinta sm:text-sm">
        {texto}
      </p>
    </div>
  )
}
