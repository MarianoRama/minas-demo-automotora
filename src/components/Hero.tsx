import { type FormEvent, useState } from 'react'
import { ArrowRight, Car, CalendarCheck } from 'lucide-react'
import CarIllustration from './CarIllustration'
import { NEGOCIO } from '../config'
import { autos, tiposCarroceria, type TipoCarroceria } from '../data/cars'
import { formatoKm, formatoPrecio } from '../lib/formato'
import { useFiltrosCatalogo, type FiltroTipo } from '../context/FiltrosCatalogo'

const anioActual = new Date().getFullYear()
const aniosOperando = anioActual - NEGOCIO.anioFundacion

const stats = [
  { valor: `${aniosOperando}+`, detalle: 'Años de trayectoria' },
  { valor: '600+', detalle: 'Autos entregados' },
  { valor: '90 días', detalle: 'Garantía de motor y caja' },
]

const marcas = Array.from(new Set(autos.map((a) => a.marca))).sort()

const rangosPrecio = [
  { valor: 'todos', label: 'Cualquier precio' },
  { valor: '15000', label: 'Hasta U$S 15.000' },
  { valor: '22000', label: 'Hasta U$S 22.000' },
  { valor: '30000', label: 'Hasta U$S 30.000' },
]

const destacado = autos.find((a) => a.id === 'hilux-srv') ?? autos[0]

export default function Hero() {
  const { aplicarBusquedaRapida } = useFiltrosCatalogo()
  const [tipo, setTipo] = useState<FiltroTipo>('Todos')
  const [marca, setMarca] = useState<'Todas' | string>('Todas')
  const [precio, setPrecio] = useState('todos')

  function buscar(e: FormEvent) {
    e.preventDefault()
    aplicarBusquedaRapida({
      tipo,
      marca,
      precioMax: precio === 'todos' ? Number.POSITIVE_INFINITY : Number(precio),
    })
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="inicio" className="rayas-diagonal relative overflow-hidden bg-hueso">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-16">
        <div className="flex flex-col justify-center">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-senal-2">
            <span aria-hidden="true" className="h-px w-7 bg-senal-2" />
            Concesionaria en Minas
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.3rem,5.4vw,3.6rem)] font-black leading-[1.02] tracking-tight text-tinta">
            Tu próximo auto
            <br />
            ya pasó nuestra
            <br />
            revisión.
          </h1>

          <p className="mt-5 max-w-md text-[clamp(1rem,1.6vw,1.125rem)] text-texto/80">
            Mecánica, chapa y papeles al día antes de tener precio.
            Financiación propia, permuta y trámite de transferencia
            incluido.
          </p>

          <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-sm bg-white px-3 py-2 text-xs font-bold text-tinta ring-1 ring-linea">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-green-600 motion-safe:animate-pulse"
            />
            {autos.length} vehículos disponibles hoy
          </span>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="flex items-center gap-2 rounded-sm bg-tinta px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-hueso transition hover:bg-senal hover:text-tinta"
            >
              <Car size={17} aria-hidden="true" />
              Ver catálogo
            </a>
            <a
              href="#vender"
              className="flex items-center gap-2 rounded-sm border-2 border-tinta px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-tinta transition hover:border-senal hover:text-senal-2"
            >
              <CalendarCheck size={17} aria-hidden="true" />
              Coordinar visita
            </a>
          </div>

          <form
            onSubmit={buscar}
            className="mt-6 grid gap-2 rounded-sm bg-white p-3 shadow-sm ring-1 ring-linea sm:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <label className="text-left">
              <span className="sr-only">Marca</span>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="min-h-11 w-full rounded-sm border border-linea px-2 text-sm focus:border-tinta focus:outline-none"
              >
                <option value="Todas">Cualquier marca</option>
                {marcas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-left">
              <span className="sr-only">Tipo de vehículo</span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoCarroceria | 'Todos')}
                className="min-h-11 w-full rounded-sm border border-linea px-2 text-sm focus:border-tinta focus:outline-none"
              >
                <option value="Todos">Cualquier tipo</option>
                {tiposCarroceria.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-left">
              <span className="sr-only">Precio</span>
              <select
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="min-h-11 w-full rounded-sm border border-linea px-2 text-sm focus:border-tinta focus:outline-none"
              >
                {rangosPrecio.map((r) => (
                  <option key={r.valor} value={r.valor}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="min-h-11 rounded-sm bg-tinta px-5 text-sm font-bold uppercase tracking-wide text-hueso transition hover:bg-senal hover:text-tinta"
            >
              Buscar
            </button>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-linea pt-6">
            {stats.map((s) => (
              <div key={s.detalle}>
                <p className="tabular font-display text-2xl font-extrabold text-tinta sm:text-3xl">
                  {s.valor}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-texto/55 sm:text-xs">
                  {s.detalle}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col justify-center">
          <div className="relative">
            <CarIllustration
              tipo={destacado.tipo}
              color={destacado.color}
              titulo={`${destacado.marca} ${destacado.modelo}, vehículo destacado`}
              className="w-full drop-shadow-[0_22px_30px_rgba(18,35,63,0.28)]"
            />
          </div>

          <a
            href="#catalogo"
            className="group relative z-10 -mt-6 flex w-fit items-center gap-4 self-center rounded-sm bg-white px-4 py-3 shadow-lg ring-1 ring-linea sm:self-end"
          >
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-senal-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-senal-2" />
                Vehículo destacado
              </p>
              <p className="mt-1 font-display text-base font-extrabold text-tinta">
                {destacado.marca} {destacado.modelo}
              </p>
              <p className="tabular text-xs text-texto/60">
                Desde {formatoPrecio(destacado.precio)} · {formatoKm(destacado.km)} km
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-senal text-tinta transition group-hover:translate-x-1">
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
