import { useEffect, useRef, useState } from 'react'
import { Check, Share2, CalendarCheck, X } from 'lucide-react'
import type { Auto } from '../data/cars'
import { useDatos } from '../data/store'
import { formatoKm, formatoPrecio } from '../lib/formato'
import CarIllustration from './CarIllustration'
import CartelParabrisas from './CartelParabrisas'
import SelloEstado from './SelloEstado'

interface Props {
  auto: Auto
  onClose: () => void
}

export default function AutoDetalle({ auto, onClose }: Props) {
  const { negocio } = useDatos()
  const cerrarRef = useRef<HTMLButtonElement>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    cerrarRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const mensajeConsulta = `Hola, te escribo por el ${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio} que vi en el sitio (U$S ${auto.precio.toLocaleString('es-UY')}). ¿Sigue disponible?`
  const mensajeVisita = `Hola, quiero coordinar una visita para ver y probar el ${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio}.`
  const linkWhatsapp = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensajeConsulta)}`
  const linkVisita = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensajeVisita)}`

  async function compartir() {
    const url = window.location.href.split('#')[0] + '#catalogo'
    const data = {
      title: `${auto.marca} ${auto.modelo}, ${negocio.nombre}`,
      text: `Mirá este ${auto.marca} ${auto.modelo} ${auto.anio} en ${negocio.nombre}: ${formatoPrecio(auto.precio)}`,
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      throw new Error('sin Web Share API')
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setCopiado(true)
        window.setTimeout(() => setCopiado(false), 2500)
      } catch {
        // último recurso: nada más que hacer en el sandbox de demo
      }
    }
  }

  const especificaciones = [
    { label: 'Motor', valor: auto.motor },
    { label: 'Potencia', valor: `${auto.potenciaHp} HP` },
    { label: 'Transmisión', valor: auto.caja },
    { label: 'Tracción', valor: auto.traccion },
    { label: 'Puertas', valor: String(auto.puertas) },
    { label: 'Pasajeros', valor: String(auto.pasajeros) },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-hueso shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-linea bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-senal-2">
              {auto.marca}
            </p>
            <h3 id="ficha-titulo" className="font-display text-2xl font-extrabold text-tinta">
              {auto.modelo} {auto.version}
            </h3>
            <p className="mt-0.5 text-sm text-texto/60">
              {auto.anio} · {auto.tipo} · {formatoKm(auto.km)} km
            </p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-tinta hover:bg-hueso-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="tabular font-display text-3xl font-extrabold text-senal-2">
              {formatoPrecio(auto.precio)}
            </p>
            {auto.destacado && (
              <span className="rounded-sm bg-senal px-2 py-1 text-xs font-bold uppercase tracking-wide text-tinta">
                Destacado
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-texto/75">{auto.descripcion}</p>
        </div>

        <div className="relative mt-4 flex items-center justify-center bg-hueso-2 px-5 py-6 sm:px-6">
          {auto.etiqueta && (
            <CartelParabrisas texto={auto.etiqueta} rotacion={3} className="absolute right-6 top-4 z-10 sm:right-10" />
          )}
          {auto.foto ? (
            <img
              src={auto.foto}
              alt={`${auto.marca} ${auto.modelo} ${auto.version}`}
              className="max-h-56 w-full rounded object-cover"
            />
          ) : (
            <CarIllustration
              tipo={auto.tipo}
              color={auto.color}
              titulo={`${auto.marca} ${auto.modelo}, color ${auto.colorNombre}`}
              className="w-full max-w-sm"
            />
          )}
          <SelloEstado estado={auto.estado} />
        </div>

        <div className="px-5 py-5 sm:px-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-senal-2">
            Características
          </h4>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {auto.caracteristicas.map((c) => (
              <li key={c} className="flex items-start gap-2 border-b border-linea/70 py-1.5 text-sm text-texto/80">
                <Check size={15} className="mt-0.5 shrink-0 text-senal-2" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-senal-2">
            Especificaciones
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {especificaciones.map((e) => (
              <div key={e.label} className="rounded-sm bg-hueso-2 px-3 py-2.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-texto/50">
                  {e.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-tinta">{e.valor}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-texto/55">
            Precio de contado. Aceptamos permuta y financiación propia: mirá el simulador
            más abajo en el sitio.
          </p>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-linea bg-white px-5 py-4 sm:flex-row sm:px-6">
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3.5 text-sm font-bold uppercase tracking-wide text-tinta transition hover:brightness-95"
          >
            WhatsApp
          </a>
          <a
            href={linkVisita}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-sm border-2 border-tinta px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-tinta transition hover:border-senal hover:text-senal-2"
          >
            <CalendarCheck size={16} aria-hidden="true" />
            Visita
          </a>
          <button
            type="button"
            onClick={compartir}
            className="flex items-center justify-center gap-2 rounded-sm border-2 border-linea px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-texto/70 transition hover:border-tinta hover:text-tinta"
          >
            <Share2 size={16} aria-hidden="true" />
            {copiado ? 'Copiado' : 'Compartir'}
          </button>
        </div>
      </div>
    </div>
  )
}
