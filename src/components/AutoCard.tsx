import { useDatos } from '../data/store'
import type { Auto } from '../data/cars'
import { formatoKm, formatoPrecio } from '../lib/formato'
import { useReveal, revealClases } from '../hooks/useReveal'
import CarIllustration from './CarIllustration'
import CartelParabrisas from './CartelParabrisas'
import SelloEstado from './SelloEstado'

interface Props {
  auto: Auto
  delay: number
  onVerFicha: (auto: Auto) => void
}

function badgePorDefecto(auto: Auto): { texto: string; clase: string } | null {
  if (auto.destacado) return { texto: 'Destacado', clase: 'bg-senal text-tinta' }
  if (auto.combustible === 'Eléctrico') return { texto: 'Eléctrico', clase: 'bg-tinta-3 text-hueso' }
  if (auto.combustible === 'Híbrido') return { texto: 'Híbrido', clase: 'bg-emerald-800 text-hueso' }
  return null
}

export default function AutoCard({ auto, delay, onVerFicha }: Props) {
  const { negocio } = useDatos()
  const { ref, visible } = useReveal<HTMLElement>(delay)

  const mensaje = `Hola, te escribo por el ${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio} (U$S ${auto.precio.toLocaleString('es-UY')}). ¿Sigue disponible?`
  const linkWhatsapp = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`

  const badge = badgePorDefecto(auto)

  return (
    <article
      ref={ref}
      className={`group flex flex-col overflow-hidden border border-linea bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-tinta/50 hover:shadow-[6px_6px_0_var(--color-tinta)] ${revealClases(visible)}`}
    >
      <button
        type="button"
        onClick={() => onVerFicha(auto)}
        className="flex flex-col text-left"
        aria-label={`Ver ficha de ${auto.marca} ${auto.modelo}`}
      >
        <div className="relative overflow-hidden bg-hueso-2 px-4 pt-4">
          {badge && (
            <span className={`absolute left-3 top-3 z-10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${badge.clase}`}>
              {badge.texto}
            </span>
          )}
          {auto.etiqueta && (
            <CartelParabrisas
              texto={auto.etiqueta}
              rotacion={-4}
              className="absolute right-3 top-3 z-10"
            />
          )}
          {auto.foto ? (
            <img
              src={auto.foto}
              alt={`${auto.marca} ${auto.modelo} ${auto.version}`}
              className="h-48 w-full object-cover transition duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <CarIllustration
              tipo={auto.tipo}
              color={auto.color}
              titulo={`${auto.marca} ${auto.modelo}, color ${auto.colorNombre}`}
              className="h-48 w-full transition duration-300 ease-out group-hover:scale-105"
            />
          )}
          <SelloEstado estado={auto.estado} />
        </div>
        <div className="px-4 pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-senal-2">{auto.marca}</p>
          <h3 className="font-display text-lg font-bold leading-tight text-tinta">
            {auto.modelo} <span className="font-semibold text-texto/60">{auto.version}</span>
          </h3>
          <p className="tabular mt-1.5 text-sm text-texto/60">
            {auto.anio} · {auto.tipo} · {formatoKm(auto.km)} km
          </p>

          <p className="tabular mt-3 font-display text-2xl font-extrabold text-senal-2">
            {formatoPrecio(auto.precio)}
          </p>
        </div>
      </button>

      <div className="mt-4 flex gap-2 border-t border-linea px-4 py-3">
        <button
          type="button"
          onClick={() => onVerFicha(auto)}
          className="group/btn flex min-h-11 flex-1 items-center justify-center gap-1.5 bg-tinta px-3 text-sm font-bold uppercase tracking-wide text-hueso transition hover:bg-senal hover:text-tinta"
        >
          Ver detalle
          <span className="transition-transform duration-200 ease-out group-hover/btn:translate-x-1">
            →
          </span>
        </button>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label={`Consultar por WhatsApp el ${auto.marca} ${auto.modelo}`}
          className="flex min-h-11 min-w-11 items-center justify-center bg-[#25D366] px-3 text-tinta transition hover:brightness-95"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </article>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.697 4.61 1.902 6.487L4 29l7.71-1.869A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm0 21.6a9.55 9.55 0 0 1-4.87-1.34l-.35-.21-4.58 1.11 1.13-4.46-.23-.36A9.55 9.55 0 1 1 25.55 15a9.56 9.56 0 0 1-9.55 9.6Zm5.24-7.15c-.29-.15-1.71-.84-1.97-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.42 1.03 2.8 1.17 3 .15.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
    </svg>
  )
}
