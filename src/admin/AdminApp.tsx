import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useDatos } from '../data/store'
import { FUENTE_DATOS } from '../config'
import type { Auto } from '../data/cars'
import AdminLogin from './AdminLogin'
import { cerrarSesionAdmin, haySesionAdmin } from './sesion'
import AdminAutosLista from './AdminAutosLista'
import AdminAutoForm from './AdminAutoForm'
import AdminNegocio from './AdminNegocio'

type Pestania = 'autos' | 'negocio'
type Vista = { tipo: 'lista' } | { tipo: 'form'; auto?: Auto }

export default function AdminApp() {
  const [autenticado, setAutenticado] = useState(haySesionAdmin)

  if (!autenticado) return <AdminLogin onIngresar={() => setAutenticado(true)} />

  return <AdminPanel onSalir={() => setAutenticado(false)} />
}

function AdminPanel({ onSalir }: { onSalir: () => void }) {
  const { crearAuto, actualizarAuto, cargandoSheet, errorSheet } = useDatos()
  const [pestania, setPestania] = useState<Pestania>('autos')
  const [vista, setVista] = useState<Vista>({ tipo: 'lista' })

  function guardarAuto(datos: Omit<Auto, 'id'>) {
    if (vista.tipo === 'form' && vista.auto) {
      actualizarAuto(vista.auto.id, datos)
    } else {
      crearAuto(datos)
    }
    setVista({ tipo: 'lista' })
  }

  return (
    <div className="min-h-screen bg-hueso-2">
      <p className="bg-tinta py-2 text-center text-xs font-bold uppercase tracking-wide text-hueso">
        Modo demostración: los cambios se guardan solo en este navegador
      </p>

      <header className="flex items-center justify-between border-b border-linea bg-white px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-senal-2">Panel</p>
          <h1 className="font-display text-lg font-bold text-tinta">Administrar sitio</h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="#/" className="hidden text-sm font-semibold text-tinta underline underline-offset-2 sm:inline">
            Ver sitio
          </a>
          <button
            type="button"
            onClick={() => {
              cerrarSesionAdmin()
              onSalir()
            }}
            className="flex min-h-11 items-center gap-1.5 border-2 border-linea px-3 text-sm font-bold text-texto/70"
          >
            <LogOut size={15} aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>

      <nav aria-label="Secciones del panel" className="flex gap-1 border-b border-linea bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={() => {
            setPestania('autos')
            setVista({ tipo: 'lista' })
          }}
          aria-current={pestania === 'autos' ? 'page' : undefined}
          className={`min-h-12 border-b-2 px-4 text-sm font-bold uppercase tracking-wide ${
            pestania === 'autos' ? 'border-senal text-tinta' : 'border-transparent text-texto/50'
          }`}
        >
          Autos
        </button>
        <button
          type="button"
          onClick={() => setPestania('negocio')}
          aria-current={pestania === 'negocio' ? 'page' : undefined}
          className={`min-h-12 border-b-2 px-4 text-sm font-bold uppercase tracking-wide ${
            pestania === 'negocio' ? 'border-senal text-tinta' : 'border-transparent text-texto/50'
          }`}
        >
          Datos del negocio
        </button>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {pestania === 'autos' && FUENTE_DATOS.tipo === 'sheets' ? (
          <div className="border-2 border-dashed border-linea bg-white p-6 text-sm text-texto/75">
            <p className="font-bold text-tinta">Estos datos se editan en tu planilla de Google.</p>
            <p className="mt-2">
              El stock de autos viene de una planilla conectada, así que se edita ahí (marca,
              precio, foto, etc.) y se actualiza sola en el sitio.
            </p>
            <a
              href={FUENTE_DATOS.csvUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-semibold text-senal-2 underline underline-offset-2"
            >
              Abrir la planilla
            </a>
            {cargandoSheet && <p className="mt-3 text-texto/60">Cargando datos de la planilla...</p>}
            {errorSheet && <p className="mt-3 font-semibold text-senal-2">{errorSheet}</p>}
          </div>
        ) : pestania === 'autos' ? (
          vista.tipo === 'lista' ? (
            <AdminAutosLista
              onNuevo={() => setVista({ tipo: 'form' })}
              onEditar={(auto) => setVista({ tipo: 'form', auto })}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-xl font-bold text-tinta">
                {vista.auto ? `Editar ${vista.auto.marca} ${vista.auto.modelo}` : 'Agregar auto'}
              </h2>
              <AdminAutoForm auto={vista.auto} onGuardar={guardarAuto} onCancelar={() => setVista({ tipo: 'lista' })} />
            </div>
          )
        ) : (
          <AdminNegocio />
        )}
      </main>
    </div>
  )
}
