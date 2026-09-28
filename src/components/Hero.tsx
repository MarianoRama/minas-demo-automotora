import { autosPublicados } from '../data/cars'
import { WhatsAppAction } from './WhatsAppAction'

const precio = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function Hero() {
  const destacado = autosPublicados.find((auto) => auto.estado === 'Disponible')

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            Minas, Uruguay
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Autos usados en Minas, con opciones para cada día
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Conocé el inventario, compará opciones y consultá directamente por el vehículo que te
            interesa. Coordinamos la visita y respondemos tus dudas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
            >
              Ver catálogo
            </a>
            <a
              href="#vender"
              className="rounded-md border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
            >
              Vendé tu auto
            </a>
          </div>
        </div>

        {destacado ? (
          <article className="w-full max-w-lg overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl shadow-black/20">
            {destacado.imagenes[0] ? (
              <img
                src={destacado.imagenes[0]}
                alt={`${destacado.marca} ${destacado.modelo}; imagen ilustrativa`}
                className="aspect-[4/3] w-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 px-4 text-center text-slate-600">Foto pendiente de cargar</div>
            )}
            <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Disponible</p>
                <h2 className="mt-1 text-xl font-semibold">{destacado.marca} {destacado.modelo}</h2>
                <p className="mt-1 text-sm text-slate-600">{destacado.anio} · {destacado.km.toLocaleString('es-UY')} km</p>
                <p className="mt-1 text-xs text-slate-500">Foto ilustrativa; no corresponde a esta unidad de la demo.</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg font-bold">{precio.format(destacado.precio)}</p>
                <WhatsAppAction
                  label={`Consultar ${destacado.marca} ${destacado.modelo}`}
                  message={`Hola, me interesa el ${destacado.marca} ${destacado.modelo} ${destacado.anio}.`}
                  className="mt-2 inline-flex min-h-10 items-center font-semibold text-blue-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Consultar vehículo
                </WhatsAppAction>
              </div>
            </div>
          </article>
        ) : (
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 text-slate-200">
            <p className="font-semibold text-white">Estamos actualizando el inventario</p>
            <p className="mt-2 text-sm">Consultá más tarde para ver los vehículos disponibles.</p>
          </div>
        )}
      </div>
    </section>
  )
}
