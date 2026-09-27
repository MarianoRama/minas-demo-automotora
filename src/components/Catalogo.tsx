import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { autos, tiposCarroceria, type Auto } from '../data/cars'
import { formatoPrecio } from '../lib/formato'
import { useFiltrosCatalogo, type FiltroTipo } from '../context/FiltrosCatalogo'
import AutoDetalle from './AutoDetalle'
import AutoCard from './AutoCard'
import Reveal from './Reveal'
import CarruselCategoria from './CarruselCategoria'

const anioMasNuevo = Math.max(...autos.map((a) => a.anio))
const destacados = autos.filter((a) => a.destacado)
const recienIngresados = autos.filter((a) => anioMasNuevo - a.anio <= 1)
const electrificados = autos.filter((a) => a.combustible === 'Eléctrico' || a.caja === 'Automática')

type Orden = 'destacados' | 'precio-asc' | 'precio-desc' | 'km-asc' | 'anio-desc'

const ordenes: { valor: Orden; label: string }[] = [
  { valor: 'destacados', label: 'Destacados' },
  { valor: 'precio-asc', label: 'Precio: menor a mayor' },
  { valor: 'precio-desc', label: 'Precio: mayor a menor' },
  { valor: 'km-asc', label: 'Menos kilómetros' },
  { valor: 'anio-desc', label: 'Más nuevos' },
]

const PRECIO_MAX = Math.max(...autos.map((a) => a.precio))
const PRECIO_MIN = Math.min(...autos.map((a) => a.precio))
const marcas = Array.from(new Set(autos.map((a) => a.marca))).sort()

export default function Catalogo() {
  const { filtros, setTipo, setMarca, setPrecioMax, setBusqueda } = useFiltrosCatalogo()
  const [orden, setOrden] = useState<Orden>('destacados')
  const [seleccionado, setSeleccionado] = useState<Auto | null>(null)

  const precioMaxEfectivo = Number.isFinite(filtros.precioMax) ? filtros.precioMax : PRECIO_MAX

  const resultado = useMemo(() => {
    let lista = autos.filter((a) => a.precio <= precioMaxEfectivo)
    if (filtros.tipo !== 'Todos') lista = lista.filter((a) => a.tipo === filtros.tipo)
    if (filtros.marca !== 'Todas') lista = lista.filter((a) => a.marca === filtros.marca)
    if (filtros.busqueda.trim()) {
      const q = filtros.busqueda.trim().toLowerCase()
      lista = lista.filter((a) =>
        `${a.marca} ${a.modelo} ${a.version}`.toLowerCase().includes(q),
      )
    }
    const ordenada = [...lista]
    switch (orden) {
      case 'precio-asc':
        ordenada.sort((a, b) => a.precio - b.precio)
        break
      case 'precio-desc':
        ordenada.sort((a, b) => b.precio - a.precio)
        break
      case 'km-asc':
        ordenada.sort((a, b) => a.km - b.km)
        break
      case 'anio-desc':
        ordenada.sort((a, b) => b.anio - a.anio)
        break
      default:
        ordenada.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
    }
    return ordenada
  }, [filtros.tipo, filtros.marca, filtros.busqueda, precioMaxEfectivo, orden])

  return (
    <section id="catalogo" className="bg-hueso py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-tinta sm:text-4xl">
            Nuestros <span className="text-senal-2">Vehículos</span>
          </h2>
          <p className="mt-1 text-sm text-texto/70">
            {autos.length} unidades en stock · precios de contado en dólares
          </p>
        </Reveal>

        <CarruselCategoria titulo="Destacados" total={destacados.length}>
          {destacados.map((auto, i) => (
            <AutoCard key={auto.id} auto={auto} delay={i * 60} onVerFicha={setSeleccionado} />
          ))}
        </CarruselCategoria>

        <CarruselCategoria titulo="Recién ingresados" total={recienIngresados.length}>
          {recienIngresados.map((auto, i) => (
            <AutoCard key={auto.id} auto={auto} delay={i * 60} onVerFicha={setSeleccionado} />
          ))}
        </CarruselCategoria>

        <CarruselCategoria titulo="Automáticos y eléctricos" total={electrificados.length}>
          {electrificados.map((auto, i) => (
            <AutoCard key={auto.id} auto={auto} delay={i * 60} onVerFicha={setSeleccionado} />
          ))}
        </CarruselCategoria>

        <Reveal className="mt-14 flex flex-wrap items-end justify-between gap-4 border-b-2 border-tinta pb-4">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-tinta sm:text-3xl">
              Catálogo completo
            </h3>
            <p className="mt-1 text-sm text-texto/70">
              {resultado.length} de {autos.length} unidades
            </p>
          </div>

          <label className="relative flex w-full max-w-xs items-center sm:w-64">
            <Search size={18} className="pointer-events-none absolute left-3 text-texto/40" />
            <span className="sr-only">Buscar por marca o modelo</span>
            <input
              type="search"
              value={filtros.busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar marca o modelo..."
              className="w-full rounded-sm border border-linea bg-white py-2.5 pl-10 pr-3 text-sm focus:border-tinta focus:outline-none"
            />
          </label>
        </Reveal>

        <div className="mt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">
            Carrocería
          </p>
          <div className="flex flex-wrap gap-2">
            {(['Todos', ...tiposCarroceria] as FiltroTipo[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                aria-pressed={filtros.tipo === t}
                className={`min-h-11 rounded-sm px-4 py-2 text-sm font-bold transition ${
                  filtros.tipo === t
                    ? 'bg-tinta text-hueso'
                    : 'bg-hueso-2 text-texto/70 ring-1 ring-linea hover:ring-tinta/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Marca</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMarca('Todas')}
              aria-pressed={filtros.marca === 'Todas'}
              className={`min-h-11 rounded-sm px-4 py-2 text-sm font-bold transition ${
                filtros.marca === 'Todas'
                  ? 'bg-senal text-tinta'
                  : 'bg-hueso-2 text-texto/70 ring-1 ring-linea hover:ring-senal/50'
              }`}
            >
              Todas
            </button>
            {marcas.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarca(m)}
                aria-pressed={filtros.marca === m}
                className={`min-h-11 rounded-sm px-4 py-2 text-sm font-bold transition ${
                  filtros.marca === m
                    ? 'bg-senal text-tinta'
                    : 'bg-hueso-2 text-texto/70 ring-1 ring-linea hover:ring-senal/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-sm bg-hueso-2 px-4 py-3 ring-1 ring-linea">
            <label htmlFor="precioMax" className="whitespace-nowrap text-sm font-semibold text-texto/70">
              Hasta
            </label>
            <input
              id="precioMax"
              type="range"
              min={PRECIO_MIN}
              max={PRECIO_MAX}
              step={500}
              value={precioMaxEfectivo}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="h-2 flex-1 accent-senal"
            />
            <span className="tabular w-24 text-right text-sm font-bold text-tinta">
              {formatoPrecio(precioMaxEfectivo)}
            </span>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-texto/70">Ordenar:</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="min-h-11 rounded-sm border border-linea bg-white px-2 py-2 text-sm focus:border-tinta focus:outline-none"
            >
              {ordenes.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {resultado.length === 0 ? (
          <p className="mt-14 rounded-sm bg-hueso-2 px-6 py-10 text-center text-texto/70 ring-1 ring-linea">
            No encontramos autos con esos filtros. Probá ampliando el rango de precio o
            escribinos, capaz tenemos algo que todavía no subimos al sitio.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultado.map((auto, i) => (
              <AutoCard
                key={auto.id}
                auto={auto}
                delay={(i % 6) * 70}
                onVerFicha={setSeleccionado}
              />
            ))}
          </div>
        )}
      </div>

      {seleccionado && <AutoDetalle auto={seleccionado} onClose={() => setSeleccionado(null)} />}
    </section>
  )
}
