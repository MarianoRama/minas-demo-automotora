import { useMemo, useState } from 'react'
import { autosPublicados, type TipoAuto } from '../data/cars'
import { WhatsAppAction } from './WhatsAppAction'

const filtros: Array<TipoAuto | 'Todos'> = ['Todos', 'Sedán', 'SUV', 'Pick-up']

const formatoPrecio = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatoKm = new Intl.NumberFormat('es-UY')

export default function Catalogo() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>('Todos')
  const [busqueda, setBusqueda] = useState('')

  const autosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es-UY')
    return autosPublicados.filter((auto) => {
      const coincideTipo = filtro === 'Todos' || auto.tipo === filtro
      const coincideTexto = `${auto.marca} ${auto.modelo}`.toLocaleLowerCase('es-UY').includes(termino)
      return coincideTipo && coincideTexto
    })
  }, [busqueda, filtro])

  return (
    <section id="catalogo" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Catálogo
          </h2>
          <p className="mt-2 text-slate-600">
            Consultá disponibilidad, precio y detalles de cada vehículo.
          </p>
        </div>

        <div className="mx-auto mb-5 max-w-md">
          <label htmlFor="buscar-auto" className="sr-only">Buscar por marca o modelo</label>
          <input
            id="buscar-auto"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscá por marca o modelo"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>
        <div className="mb-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar autos por tipo">
          {filtros.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFiltro(tipo)}
              aria-pressed={filtro === tipo}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filtro === tipo
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>

        <p className="mb-6 text-center text-sm text-slate-500" aria-live="polite">
          {autosFiltrados.length} {autosFiltrados.length === 1 ? 'vehículo en catálogo' : 'vehículos en catálogo'}
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {autosFiltrados.map((auto) => (
            <article
              key={auto.id}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                {auto.imagenes[0] ? (
                  <>
                    <img
                      src={auto.imagenes[0]}
                      alt={`${auto.marca} ${auto.modelo}; foto ilustrativa`}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {auto.id === 1 && (
                      <p className="px-4 pt-1 text-xs text-slate-500">Foto ilustrativa; no corresponde a esta unidad.</p>
                    )}
                  </>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-600">
                    Foto pendiente de cargar
                  </div>
                )}
                <div className="flex items-center justify-between px-4 pt-3 text-xs font-semibold">
                  <span className={auto.estado === 'Vendido' ? 'text-slate-500' : 'text-emerald-800'}>{auto.estado}</span>
                  <span className="text-slate-600">{auto.tipo}</span>
                </div>
                {auto.imagenes.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto px-4 pt-2" role="group" aria-label={`Fotos de ${auto.marca} ${auto.modelo}`}>
                    {auto.imagenes.map((imagen, index) => (
                      <a key={`${auto.id}-${index}`} href={imagen} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                        <img src={imagen} alt={`Ver foto ${index + 1} de ${auto.marca} ${auto.modelo}`} className="h-12 w-16 rounded object-cover" loading="lazy" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">
                  {auto.marca} {auto.modelo}
                </h3>
                <p className="text-sm text-slate-500">
                  {auto.anio} · {formatoKm.format(auto.km)} km
                </p>
                <p className="mt-3 text-lg font-bold text-blue-700">
                  {formatoPrecio.format(auto.precio)}
                </p>
                {auto.estado === 'Disponible' ? (
                  <WhatsAppAction
                    label={`Consultar ${auto.marca} ${auto.modelo}`}
                    message={`Hola, me interesa el ${auto.marca} ${auto.modelo} ${auto.anio}.`}
                    className="mt-4 min-h-11 w-full rounded-md border border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Consultar
                  </WhatsAppAction>
                ) : (
                  <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-600">Esta unidad ya fue vendida</p>
                )}
              </div>
            </article>
          ))}
        </div>
        {autosFiltrados.length === 0 && (
          <p className="mt-8 text-center text-slate-600" role="status">
            No encontramos autos con esos datos. Probá con otra marca o modelo.
          </p>
        )}
      </div>
    </section>
  )
}
