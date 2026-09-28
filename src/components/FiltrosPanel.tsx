import type { Auto, Caja, Combustible, TipoCarroceria } from '../data/cars'
import { useFiltrosCatalogo } from '../context/FiltrosCatalogo'
import { formatoPrecio } from '../lib/formato'

interface Props {
  autos: Auto[]
  idPrefix?: string
}

const CHIPS_RAPIDOS = [
  { campo: 'soloDestacados', label: 'Destacados' },
  { campo: 'soloRecienIngresados', label: 'Recién ingresados' },
  { campo: 'soloElectrificados', label: 'Eléctricos e híbridos' },
  { campo: 'soloFinanciables', label: 'Financiables' },
] as const

export default function FiltrosPanel({ autos, idPrefix = 'f' }: Props) {
  const { filtros, actualizar, alternarValor, limpiar } = useFiltrosCatalogo()

  const tipos = Array.from(new Set(autos.map((a) => a.tipo))) as TipoCarroceria[]
  const marcas = Array.from(new Set(autos.map((a) => a.marca))).sort()
  const combustibles = Array.from(new Set(autos.map((a) => a.combustible))) as Combustible[]
  const cajas = Array.from(new Set(autos.map((a) => a.caja))) as Caja[]
  const precios = autos.map((a) => a.precio)
  const precioMinDatos = precios.length ? Math.min(...precios) : 0
  const precioMaxDatos = precios.length ? Math.max(...precios) : 0
  const anios = autos.map((a) => a.anio)
  const anioMinDatos = anios.length ? Math.min(...anios) : 2000
  const kms = autos.map((a) => a.km)
  const kmMaxDatos = kms.length ? Math.max(...kms) : 100000

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Buscar rápido</p>
        <div className="flex flex-wrap gap-2">
          {CHIPS_RAPIDOS.map((chip) => (
            <button
              key={chip.campo}
              type="button"
              onClick={() => actualizar({ [chip.campo]: !filtros[chip.campo] })}
              aria-pressed={filtros[chip.campo]}
              className={`min-h-10 border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                filtros[chip.campo]
                  ? 'border-senal bg-senal text-tinta'
                  : 'border-linea text-texto/70 hover:border-senal/60'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">
          Carrocería
        </legend>
        <div className="flex flex-col gap-1.5">
          {tipos.map((t) => (
            <label key={t} className="flex min-h-8 cursor-pointer items-center gap-2 text-sm text-texto/80">
              <input
                type="checkbox"
                checked={filtros.tipos.includes(t)}
                onChange={() => alternarValor('tipos', t)}
                className="h-4 w-4 accent-senal"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Marca</legend>
        <div className="grid max-h-40 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
          {marcas.map((m) => (
            <label key={m} htmlFor={`${idPrefix}-marca-${m}`} className="flex min-h-8 cursor-pointer items-center gap-2 text-sm text-texto/80">
              <input
                id={`${idPrefix}-marca-${m}`}
                type="checkbox"
                checked={filtros.marcas.includes(m)}
                onChange={() => alternarValor('marcas', m)}
                className="h-4 w-4 shrink-0 accent-senal"
              />
              <span className="truncate">{m}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Combustible</legend>
        <div className="flex flex-wrap gap-1.5">
          {combustibles.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => alternarValor('combustibles', c)}
              aria-pressed={filtros.combustibles.includes(c)}
              className={`min-h-9 border-2 px-3 text-xs font-bold transition ${
                filtros.combustibles.includes(c)
                  ? 'border-tinta bg-tinta text-hueso'
                  : 'border-linea text-texto/70 hover:border-tinta/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Caja</legend>
        <div className="flex flex-wrap gap-1.5">
          {cajas.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => alternarValor('cajas', c)}
              aria-pressed={filtros.cajas.includes(c)}
              className={`min-h-9 border-2 px-3 text-xs font-bold transition ${
                filtros.cajas.includes(c)
                  ? 'border-tinta bg-tinta text-hueso'
                  : 'border-linea text-texto/70 hover:border-tinta/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">
          Precio: {formatoPrecio(filtros.precioMin)} a {formatoPrecio(Number.isFinite(filtros.precioMax) ? filtros.precioMax : precioMaxDatos)}
        </p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-texto/60">
            Desde
            <input
              type="range"
              min={precioMinDatos}
              max={precioMaxDatos}
              step={500}
              value={filtros.precioMin}
              onChange={(e) => actualizar({ precioMin: Number(e.target.value) })}
              className="h-2 flex-1 accent-senal"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-texto/60">
            Hasta
            <input
              type="range"
              min={precioMinDatos}
              max={precioMaxDatos}
              step={500}
              value={Number.isFinite(filtros.precioMax) ? filtros.precioMax : precioMaxDatos}
              onChange={(e) => actualizar({ precioMax: Number(e.target.value) })}
              className="h-2 flex-1 accent-senal"
            />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-anio`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-texto/50">
          Año desde {filtros.anioDesde > 0 ? filtros.anioDesde : anioMinDatos}
        </label>
        <input
          id={`${idPrefix}-anio`}
          type="range"
          min={anioMinDatos}
          max={new Date().getFullYear()}
          step={1}
          value={filtros.anioDesde > 0 ? filtros.anioDesde : anioMinDatos}
          onChange={(e) => actualizar({ anioDesde: Number(e.target.value) })}
          className="h-2 w-full accent-senal"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-km`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-texto/50">
          Hasta {(Number.isFinite(filtros.kmMax) ? filtros.kmMax : kmMaxDatos).toLocaleString('es-UY')} km
        </label>
        <input
          id={`${idPrefix}-km`}
          type="range"
          min={0}
          max={kmMaxDatos}
          step={1000}
          value={Number.isFinite(filtros.kmMax) ? filtros.kmMax : kmMaxDatos}
          onChange={(e) => actualizar({ kmMax: Number(e.target.value) })}
          className="h-2 w-full accent-senal"
        />
      </div>

      <label className="flex min-h-8 cursor-pointer items-center gap-2 border-t border-linea pt-4 text-sm text-texto/80">
        <input
          type="checkbox"
          checked={filtros.mostrarVendidos}
          onChange={(e) => actualizar({ mostrarVendidos: e.target.checked })}
          className="h-4 w-4 accent-senal"
        />
        Mostrar también los vendidos
      </label>

      <button
        type="button"
        onClick={limpiar}
        className="min-h-11 border-2 border-tinta text-sm font-bold uppercase tracking-wide text-tinta transition hover:bg-tinta hover:text-hueso"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
