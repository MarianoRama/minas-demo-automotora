import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useDatos } from '../data/store'
import { UMBRAL_FINANCIACION } from '../config'
import { formatoPrecio } from '../lib/formato'
import { useFiltrosCatalogo, filtrosIniciales, type Orden } from '../context/FiltrosCatalogo'
import { useTamPagina } from '../hooks/useTamPagina'
import AutoDetalle from './AutoDetalle'
import AutoCard from './AutoCard'
import FiltrosPanel from './FiltrosPanel'
import Paginacion from './Paginacion'
import Reveal from './Reveal'
import type { Auto } from '../data/cars'

const ordenes: { valor: Orden; label: string }[] = [
  { valor: 'destacados', label: 'Destacados primero' },
  { valor: 'precio-asc', label: 'Precio: menor a mayor' },
  { valor: 'precio-desc', label: 'Precio: mayor a menor' },
  { valor: 'km-asc', label: 'Menos kilómetros' },
  { valor: 'anio-desc', label: 'Más nuevos' },
]

export default function Catalogo() {
  const { autos, negocio } = useDatos()
  const { filtros, actualizar, limpiar } = useFiltrosCatalogo()
  const [seleccionado, setSeleccionado] = useState<Auto | null>(null)
  const [pagina, setPagina] = useState(1)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const tamPagina = useTamPagina()
  const listaRef = useRef<HTMLDivElement>(null)

  const anioMasNuevo = useMemo(() => Math.max(...autos.map((a) => a.anio), 0), [autos])

  const visiblesPorEstado = useMemo(
    () => autos.filter((a) => a.estado !== 'Vendido' || filtros.mostrarVendidos),
    [autos, filtros.mostrarVendidos],
  )

  const resultado = useMemo(() => {
    let lista = visiblesPorEstado
    if (filtros.tipos.length) lista = lista.filter((a) => filtros.tipos.includes(a.tipo))
    if (filtros.marcas.length) lista = lista.filter((a) => filtros.marcas.includes(a.marca))
    if (filtros.combustibles.length)
      lista = lista.filter((a) => filtros.combustibles.includes(a.combustible))
    if (filtros.cajas.length) lista = lista.filter((a) => filtros.cajas.includes(a.caja))
    lista = lista.filter((a) => a.precio <= filtros.precioMax && a.precio >= filtros.precioMin)
    if (filtros.anioDesde > 0) lista = lista.filter((a) => a.anio >= filtros.anioDesde)
    lista = lista.filter((a) => a.km <= filtros.kmMax)
    if (filtros.soloDestacados) lista = lista.filter((a) => a.destacado)
    if (filtros.soloRecienIngresados) lista = lista.filter((a) => anioMasNuevo - a.anio <= 1)
    if (filtros.soloElectrificados)
      lista = lista.filter((a) => a.combustible === 'Eléctrico' || a.combustible === 'Híbrido')
    if (filtros.soloFinanciables) lista = lista.filter((a) => a.precio >= UMBRAL_FINANCIACION)
    if (filtros.busqueda.trim()) {
      const q = filtros.busqueda.trim().toLowerCase()
      lista = lista.filter((a) => `${a.marca} ${a.modelo} ${a.version}`.toLowerCase().includes(q))
    }

    const ordenada = [...lista]
    switch (filtros.orden) {
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
        ordenada.sort((a, b) => Number(b.destacado) - Number(a.destacado))
    }
    return ordenada
  }, [visiblesPorEstado, filtros, anioMasNuevo])

  // Vuelve a la página 1 cada vez que cambian los filtros o el orden.
  useEffect(() => {
    setPagina(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtros.tipos,
    filtros.marcas,
    filtros.combustibles,
    filtros.cajas,
    filtros.precioMin,
    filtros.precioMax,
    filtros.anioDesde,
    filtros.kmMax,
    filtros.mostrarVendidos,
    filtros.soloDestacados,
    filtros.soloRecienIngresados,
    filtros.soloElectrificados,
    filtros.soloFinanciables,
    filtros.busqueda,
    filtros.orden,
  ])

  const totalPaginas = Math.max(1, Math.ceil(resultado.length / tamPagina))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const inicio = (paginaSegura - 1) * tamPagina
  const paginaActual = resultado.slice(inicio, inicio + tamPagina)

  function irAPagina(p: number) {
    setPagina(p)
    const prefiereMenosMovimiento =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    listaRef.current?.scrollIntoView({
      behavior: prefiereMenosMovimiento ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  const chipsActivos = construirChipsActivos(filtros, actualizar)

  const mensajeAviso = `Hola, estoy buscando un auto y no encontré lo que quería en el sitio. ¿Me avisan si entra algo así: ${filtros.marcas.join(', ') || 'sin marca definida'}${filtros.tipos.length ? `, ${filtros.tipos.join('/')}` : ''}?`
  const linkAviso = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensajeAviso)}`

  return (
    <section id="catalogo" className="bg-hueso py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-tinta pb-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-tinta sm:text-4xl">
              El stock, entero
            </h2>
            <p className="mt-1 text-sm text-texto/70">
              {autos.length} autos en total · precios de contado en dólares
            </p>
          </div>

          <label className="relative flex w-full max-w-xs items-center sm:w-64">
            <Search size={18} className="pointer-events-none absolute left-3 text-texto/40" />
            <span className="sr-only">Buscar por marca o modelo</span>
            <input
              type="search"
              value={filtros.busqueda}
              onChange={(e) => actualizar({ busqueda: e.target.value })}
              placeholder="Buscar marca o modelo..."
              className="w-full border border-linea bg-white py-2.5 pl-10 pr-3 text-sm focus:border-tinta focus:outline-none"
            />
          </label>
        </Reveal>

        <div ref={listaRef} className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border border-linea bg-white p-5">
              <FiltrosPanel autos={autos} idPrefix="desktop" />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFiltrosAbiertos(true)}
                className="flex min-h-11 items-center gap-2 border-2 border-tinta px-4 text-sm font-bold uppercase tracking-wide text-tinta lg:hidden"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filtros{chipsActivos.length > 0 ? ` (${chipsActivos.length})` : ''}
              </button>

              <p className="text-sm text-texto/70">
                {resultado.length === 0
                  ? '0 resultados'
                  : `Mostrando ${inicio + 1}–${Math.min(inicio + tamPagina, resultado.length)} de ${resultado.length}`}
              </p>

              <label className="ml-auto flex items-center gap-2 text-sm">
                <span className="hidden font-semibold text-texto/70 sm:inline">Ordenar:</span>
                <select
                  value={filtros.orden}
                  onChange={(e) => actualizar({ orden: e.target.value as Orden })}
                  className="min-h-11 border border-linea bg-white px-2 py-2 text-sm focus:border-tinta focus:outline-none"
                >
                  {ordenes.map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {chipsActivos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chipsActivos.map((chip) => (
                  <button
                    key={chip.clave}
                    type="button"
                    onClick={chip.quitar}
                    className="flex min-h-9 items-center gap-1.5 border border-tinta/30 bg-hueso-2 px-3 text-xs font-semibold text-texto/80 transition hover:border-senal hover:text-senal-2"
                  >
                    {chip.label}
                    <X size={13} aria-hidden="true" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={limpiar}
                  className="min-h-9 px-2 text-xs font-semibold text-senal-2 underline underline-offset-2"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {resultado.length === 0 ? (
              <div className="mt-10 border border-dashed border-linea bg-hueso-2 px-6 py-12 text-center">
                <p className="text-texto/75">
                  No hay autos con esos filtros
                  {chipsActivos.length > 0 ? '. Probá sacando alguno de los que tenés puestos.' : '.'}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={limpiar}
                    className="min-h-11 border-2 border-tinta px-5 text-sm font-bold uppercase tracking-wide text-tinta transition hover:bg-tinta hover:text-hueso"
                  >
                    Limpiar filtros
                  </button>
                  <a
                    href={linkAviso}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-11 border-2 border-[#25D366] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#128c4a] transition hover:bg-[#25D366] hover:text-tinta"
                  >
                    Avisame si entra uno así
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginaActual.map((auto, i) => (
                  <AutoCard key={auto.id} auto={auto} delay={(i % tamPagina) * 60} onVerFicha={setSeleccionado} />
                ))}
              </div>
            )}

            <Paginacion pagina={paginaSegura} totalPaginas={totalPaginas} onCambiar={irAPagina} />
          </div>
        </div>
      </div>

      {filtrosAbiertos && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-tinta/60 lg:hidden">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros del catálogo"
            className="max-h-[85vh] overflow-y-auto rounded-t-lg bg-hueso p-5"
          >
            <div className="mb-4 flex items-center justify-between border-b border-linea pb-3">
              <h3 className="font-display text-lg font-bold text-tinta">Filtros</h3>
              <button
                type="button"
                onClick={() => setFiltrosAbiertos(false)}
                aria-label="Cerrar filtros"
                className="flex h-10 w-10 items-center justify-center text-tinta"
              >
                <X size={20} />
              </button>
            </div>
            <FiltrosPanel autos={autos} idPrefix="mobile" />
            <div className="sticky bottom-0 mt-5 flex gap-2 bg-hueso pt-3">
              <button
                type="button"
                onClick={limpiar}
                className="min-h-12 flex-1 border-2 border-tinta text-sm font-bold uppercase tracking-wide text-tinta"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setFiltrosAbiertos(false)}
                className="min-h-12 flex-1 bg-tinta text-sm font-bold uppercase tracking-wide text-hueso"
              >
                Ver {resultado.length} autos
              </button>
            </div>
          </div>
        </div>
      )}

      {seleccionado && <AutoDetalle auto={seleccionado} onClose={() => setSeleccionado(null)} />}
    </section>
  )
}

function construirChipsActivos(
  filtros: ReturnType<typeof useFiltrosCatalogo>['filtros'],
  actualizar: ReturnType<typeof useFiltrosCatalogo>['actualizar'],
) {
  const chips: { clave: string; label: string; quitar: () => void }[] = []

  filtros.tipos.forEach((t) =>
    chips.push({
      clave: `tipo-${t}`,
      label: t,
      quitar: () => actualizar({ tipos: filtros.tipos.filter((x) => x !== t) }),
    }),
  )
  filtros.marcas.forEach((m) =>
    chips.push({
      clave: `marca-${m}`,
      label: m,
      quitar: () => actualizar({ marcas: filtros.marcas.filter((x) => x !== m) }),
    }),
  )
  filtros.combustibles.forEach((c) =>
    chips.push({
      clave: `comb-${c}`,
      label: c,
      quitar: () => actualizar({ combustibles: filtros.combustibles.filter((x) => x !== c) }),
    }),
  )
  filtros.cajas.forEach((c) =>
    chips.push({
      clave: `caja-${c}`,
      label: c,
      quitar: () => actualizar({ cajas: filtros.cajas.filter((x) => x !== c) }),
    }),
  )
  if (Number.isFinite(filtros.precioMax) && filtros.precioMax !== filtrosIniciales.precioMax)
    chips.push({
      clave: 'precio-max',
      label: `Hasta ${formatoPrecio(filtros.precioMax)}`,
      quitar: () => actualizar({ precioMax: filtrosIniciales.precioMax }),
    })
  if (filtros.precioMin > 0)
    chips.push({
      clave: 'precio-min',
      label: `Desde ${formatoPrecio(filtros.precioMin)}`,
      quitar: () => actualizar({ precioMin: 0 }),
    })
  if (filtros.anioDesde > 0)
    chips.push({
      clave: 'anio',
      label: `Desde ${filtros.anioDesde}`,
      quitar: () => actualizar({ anioDesde: 0 }),
    })
  if (Number.isFinite(filtros.kmMax) && filtros.kmMax !== filtrosIniciales.kmMax)
    chips.push({
      clave: 'km',
      label: `Hasta ${filtros.kmMax.toLocaleString('es-UY')} km`,
      quitar: () => actualizar({ kmMax: filtrosIniciales.kmMax }),
    })
  if (filtros.soloDestacados)
    chips.push({ clave: 'destacados', label: 'Destacados', quitar: () => actualizar({ soloDestacados: false }) })
  if (filtros.soloRecienIngresados)
    chips.push({
      clave: 'recientes',
      label: 'Recién ingresados',
      quitar: () => actualizar({ soloRecienIngresados: false }),
    })
  if (filtros.soloElectrificados)
    chips.push({
      clave: 'electrificados',
      label: 'Eléctricos e híbridos',
      quitar: () => actualizar({ soloElectrificados: false }),
    })
  if (filtros.soloFinanciables)
    chips.push({
      clave: 'financiables',
      label: 'Financiables',
      quitar: () => actualizar({ soloFinanciables: false }),
    })
  if (filtros.mostrarVendidos)
    chips.push({
      clave: 'vendidos',
      label: 'Incluye vendidos',
      quitar: () => actualizar({ mostrarVendidos: false }),
    })

  return chips
}
