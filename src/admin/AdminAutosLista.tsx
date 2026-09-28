import { useRef, useState } from 'react'
import { Copy, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useDatos } from '../data/store'
import type { Auto } from '../data/cars'
import { formatoPrecio } from '../lib/formato'
import ConfirmDialog from './ConfirmDialog'
import CarIllustration from '../components/CarIllustration'

interface Props {
  onNuevo: () => void
  onEditar: (auto: Auto) => void
}

const estadoClase: Record<Auto['estado'], string> = {
  Disponible: 'bg-emerald-700 text-hueso',
  Reservado: 'bg-tinta text-hueso',
  Vendido: 'bg-senal-2 text-hueso',
}

export default function AdminAutosLista({ onNuevo, onEditar }: Props) {
  const { autos, eliminarAuto, duplicarAuto, exportarJSON, importarJSON, restaurarEjemplo, errorStorage } = useDatos()
  const [busqueda, setBusqueda] = useState('')
  const [aEliminar, setAEliminar] = useState<Auto | null>(null)
  const [confirmarReset, setConfirmarReset] = useState(false)
  const [avisoImport, setAvisoImport] = useState<string | null>(null)
  const inputImportRef = useRef<HTMLInputElement>(null)

  const filtrados = autos.filter((a) =>
    `${a.marca} ${a.modelo} ${a.version}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  async function onImportar(archivo: File | undefined) {
    if (!archivo) return
    try {
      await importarJSON(archivo)
      setAvisoImport(null)
    } catch (e) {
      setAvisoImport(e instanceof Error ? e.message : 'No se pudo leer ese archivo')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {errorStorage && (
        <p className="border-2 border-senal-2 bg-senal/10 px-4 py-3 text-sm font-semibold text-senal-2">
          {errorStorage}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-tinta">Autos ({autos.length})</h2>
        <button
          type="button"
          onClick={onNuevo}
          className="flex min-h-11 items-center gap-2 bg-tinta px-4 text-sm font-bold uppercase tracking-wide text-hueso"
        >
          <Plus size={16} aria-hidden="true" />
          Agregar auto
        </button>
      </div>

      <label className="relative flex items-center">
        <Search size={18} className="pointer-events-none absolute left-3 text-texto/40" />
        <span className="sr-only">Buscar auto</span>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por marca o modelo..."
          className="min-h-11 w-full border border-linea bg-white py-2 pl-10 pr-3 text-sm focus:border-tinta focus:outline-none"
        />
      </label>

      <ul className="flex flex-col divide-y divide-linea border border-linea bg-white">
        {filtrados.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-texto/60">No hay autos que coincidan.</li>
        )}
        {filtrados.map((auto) => (
          <li key={auto.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden bg-hueso-2">
              {auto.foto ? (
                <img src={auto.foto} alt="" className="h-full w-full object-cover" />
              ) : (
                <CarIllustration tipo={auto.tipo} color={auto.color} className="h-full w-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-tinta">
                {auto.marca} {auto.modelo}{' '}
                <span className="font-normal text-texto/60">{auto.version}</span>
              </p>
              <p className="tabular text-xs text-texto/60">
                {auto.anio} · {formatoPrecio(auto.precio)}
              </p>
              <span className={`mt-1 inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${estadoClase[auto.estado]}`}>
                {auto.estado}
              </span>
              {auto.destacado && (
                <span className="ml-1 inline-block bg-senal px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tinta">
                  Destacado
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEditar(auto)}
                aria-label={`Editar ${auto.marca} ${auto.modelo}`}
                className="flex h-11 w-11 items-center justify-center border border-linea text-tinta hover:border-tinta"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => duplicarAuto(auto.id)}
                aria-label={`Duplicar ${auto.marca} ${auto.modelo}`}
                className="flex h-11 w-11 items-center justify-center border border-linea text-tinta hover:border-tinta"
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={() => setAEliminar(auto)}
                aria-label={`Eliminar ${auto.marca} ${auto.modelo}`}
                className="flex h-11 w-11 items-center justify-center border border-linea text-senal-2 hover:border-senal-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 border-t border-linea pt-5 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={exportarJSON}
          className="min-h-11 flex-1 border-2 border-tinta px-4 text-sm font-bold uppercase tracking-wide text-tinta"
        >
          Descargar copia (JSON)
        </button>
        <button
          type="button"
          onClick={() => inputImportRef.current?.click()}
          className="min-h-11 flex-1 border-2 border-tinta px-4 text-sm font-bold uppercase tracking-wide text-tinta"
        >
          Cargar copia
        </button>
        <input
          ref={inputImportRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => onImportar(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => setConfirmarReset(true)}
          className="min-h-11 flex-1 border-2 border-senal-2 px-4 text-sm font-bold uppercase tracking-wide text-senal-2"
        >
          Volver a datos de ejemplo
        </button>
      </div>
      {avisoImport && <p className="text-sm font-semibold text-senal-2">{avisoImport}</p>}

      {aEliminar && (
        <ConfirmDialog
          titulo="¿Eliminar este auto?"
          texto={`${aEliminar.marca} ${aEliminar.modelo} se va a borrar de la lista. No se puede deshacer.`}
          textoConfirmar="Eliminar"
          peligroso
          onCancelar={() => setAEliminar(null)}
          onConfirmar={() => {
            eliminarAuto(aEliminar.id)
            setAEliminar(null)
          }}
        />
      )}

      {confirmarReset && (
        <ConfirmDialog
          titulo="¿Volver a los datos de ejemplo?"
          texto="Se pierden todos los cambios hechos desde este navegador (autos y datos del negocio)."
          textoConfirmar="Restaurar"
          peligroso
          onCancelar={() => setConfirmarReset(false)}
          onConfirmar={() => {
            restaurarEjemplo()
            setConfirmarReset(false)
          }}
        />
      )}
    </div>
  )
}
