import { useState, type FormEvent } from 'react'
import { PIN_ADMIN } from '../config'
import { iniciarSesionAdmin } from './sesion'

export default function AdminLogin({ onIngresar }: { onIngresar: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function ingresar(e: FormEvent) {
    e.preventDefault()
    if (pin === PIN_ADMIN) {
      iniciarSesionAdmin()
      onIngresar()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tinta px-4 py-12">
      <form onSubmit={ingresar} className="w-full max-w-sm border-2 border-hueso/20 bg-hueso p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-senal-2">Panel del negocio</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-tinta">Ingresá con tu PIN</h1>
        <p className="mt-2 text-sm text-texto/70">
          Acá el dueño cambia precios, sube fotos y actualiza los datos del negocio sin
          tocar código.
        </p>

        <label htmlFor="pin" className="mt-6 block text-sm font-semibold text-texto/80">
          PIN de acceso
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value)
            setError(false)
          }}
          className={`mt-1 min-h-12 w-full border-2 px-3 text-lg tracking-[0.3em] focus:outline-none ${
            error ? 'border-senal-2' : 'border-linea focus:border-tinta'
          }`}
          placeholder="••••"
        />
        {error && <p className="mt-2 text-sm font-semibold text-senal-2">PIN incorrecto. Probá de nuevo.</p>}

        <button
          type="submit"
          className="mt-5 min-h-12 w-full bg-tinta text-sm font-bold uppercase tracking-wide text-hueso transition hover:bg-senal hover:text-tinta"
        >
          Entrar
        </button>

        <p className="mt-5 border border-dashed border-linea bg-hueso-2 px-3 py-2 text-xs text-texto/60">
          PIN de demostración: <strong className="tabular">1234</strong>. En un sitio real, el
          acceso se hace con tu cuenta de Google (si los datos viven en una planilla) o con
          un login de verdad (por ejemplo, Supabase), no con este PIN.
        </p>

        <a href="#/" className="mt-4 block text-center text-sm text-texto/60 underline underline-offset-2">
          Volver al sitio
        </a>
      </form>
    </div>
  )
}
