import { useMemo, useState } from 'react'
import { autos, type TipoAuto } from '../data/cars'

const filtros: Array<TipoAuto | 'Todos'> = ['Todos', 'Sedán', 'SUV', 'Pick-up']

const formatoPrecio = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatoKm = new Intl.NumberFormat('es-UY')

export default function Catalogo() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>('Todos')

  const autosFiltrados = useMemo(() => {
    if (filtro === 'Todos') return autos
    return autos.filter((auto) => auto.tipo === filtro)
  }, [filtro])

  return (
    <section id="catalogo" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Catálogo
          </h2>
          <p className="mt-2 text-slate-600">
            Unidades seleccionadas y revisadas por nuestro equipo técnico
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filtros.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFiltro(tipo)}
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {autosFiltrados.map((auto) => (
            <article
              key={auto.id}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={auto.imagen}
                  alt={`${auto.marca} ${auto.modelo}`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute left-2 top-2 rounded-full bg-slate-900/85 px-2 py-1 text-xs font-semibold text-white">
                  Usado
                </span>
                <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                  {auto.tipo}
                </span>
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
                <a
                  href={`https://wa.me/59899000000?text=${encodeURIComponent(
                    `Hola, me interesa el ${auto.marca} ${auto.modelo} ${auto.anio}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-md border border-blue-600 py-2 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >
                  Consultar
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
