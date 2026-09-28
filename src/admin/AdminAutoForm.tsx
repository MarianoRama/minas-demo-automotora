import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ImagePlus, X } from 'lucide-react'
import type { Auto, Caja, Combustible, EstadoAuto, Traccion, TipoCarroceria } from '../data/cars'
import { tiposCarroceria, estadosAuto } from '../data/cars'
import { redimensionarImagen } from './imagen'

const combustibles: Combustible[] = ['Nafta', 'Diésel', 'Híbrido', 'Eléctrico']
const cajas: Caja[] = ['Manual', 'Automática']
const tracciones: Traccion[] = ['Delantera', 'Trasera', '4x4']

interface FormValores {
  marca: string
  modelo: string
  version: string
  anio: string
  km: string
  precio: string
  tipo: TipoCarroceria
  combustible: Combustible
  caja: Caja
  color: string
  colorNombre: string
  etiqueta: string
  destacado: boolean
  estado: EstadoAuto
  descripcion: string
  caracteristicasTexto: string
  motor: string
  potenciaHp: string
  traccion: Traccion
  puertas: string
  pasajeros: string
  foto?: string
}

function autoAFormulario(auto?: Auto): FormValores {
  return {
    marca: auto?.marca ?? '',
    modelo: auto?.modelo ?? '',
    version: auto?.version ?? '',
    anio: String(auto?.anio ?? new Date().getFullYear()),
    km: String(auto?.km ?? 0),
    precio: String(auto?.precio ?? ''),
    tipo: auto?.tipo ?? 'Hatchback',
    combustible: auto?.combustible ?? 'Nafta',
    caja: auto?.caja ?? 'Manual',
    color: auto?.color ?? '#6B7280',
    colorNombre: auto?.colorNombre ?? 'gris',
    etiqueta: auto?.etiqueta ?? '',
    destacado: auto?.destacado ?? false,
    estado: auto?.estado ?? 'Disponible',
    descripcion: auto?.descripcion ?? '',
    caracteristicasTexto: (auto?.caracteristicas ?? []).join('\n'),
    motor: auto?.motor ?? '',
    potenciaHp: String(auto?.potenciaHp ?? ''),
    traccion: auto?.traccion ?? 'Delantera',
    puertas: String(auto?.puertas ?? 4),
    pasajeros: String(auto?.pasajeros ?? 5),
    foto: auto?.foto,
  }
}

interface Props {
  auto?: Auto
  onGuardar: (datos: Omit<Auto, 'id'>) => void
  onCancelar: () => void
}

export default function AdminAutoForm({ auto, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<FormValores>(() => autoAFormulario(auto))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [avisoFoto, setAvisoFoto] = useState<string | null>(null)
  const inputFotoRef = useRef<HTMLInputElement>(null)

  function campo<K extends keyof FormValores>(k: K, v: FormValores[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSubirFoto(archivo: File | undefined) {
    if (!archivo) return
    setAvisoFoto(null)
    try {
      const dataUrl = await redimensionarImagen(archivo)
      campo('foto', dataUrl)
    } catch {
      setAvisoFoto('No se pudo procesar esa imagen. Probá con otra foto.')
    }
  }

  function validar(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!form.marca.trim()) e.marca = 'Falta la marca'
    if (!form.modelo.trim()) e.modelo = 'Falta el modelo'
    const anio = Number(form.anio)
    if (!Number.isInteger(anio) || anio < 1980 || anio > new Date().getFullYear() + 1)
      e.anio = 'Año fuera de rango'
    const precio = Number(form.precio)
    if (!Number.isFinite(precio) || precio <= 0) e.precio = 'Poné un precio en dólares, sin puntos'
    const km = Number(form.km)
    if (!Number.isFinite(km) || km < 0) e.km = 'El kilometraje no puede ser negativo'
    if (!form.descripcion.trim()) e.descripcion = 'Escribí una descripción corta'
    return e
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    onGuardar({
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      version: form.version.trim(),
      anio: Number(form.anio),
      km: Number(form.km),
      precio: Number(form.precio),
      tipo: form.tipo,
      combustible: form.combustible,
      caja: form.caja,
      color: form.color,
      colorNombre: form.colorNombre.trim() || 'gris',
      etiqueta: form.etiqueta.trim() || undefined,
      destacado: form.destacado,
      estado: form.estado,
      descripcion: form.descripcion.trim(),
      caracteristicas: form.caracteristicasTexto
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean),
      motor: form.motor.trim(),
      potenciaHp: Number(form.potenciaHp) || 0,
      traccion: form.traccion,
      puertas: Number(form.puertas) || 4,
      pasajeros: Number(form.pasajeros) || 5,
      foto: form.foto,
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Foto</p>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden border-2 border-dashed border-linea bg-hueso-2">
            {form.foto ? (
              <img src={form.foto} alt="Vista previa" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-center text-[11px] text-texto/50">
                Sin foto: se usa la ilustración
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onSubirFoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              className="flex min-h-11 items-center gap-2 border-2 border-tinta px-4 text-sm font-bold uppercase tracking-wide text-tinta"
            >
              <ImagePlus size={16} aria-hidden="true" />
              {form.foto ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {form.foto && (
              <button
                type="button"
                onClick={() => campo('foto', undefined)}
                className="flex min-h-9 items-center gap-1.5 text-sm font-semibold text-senal-2"
              >
                <X size={14} aria-hidden="true" />
                Quitar foto
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-texto/55">
          Sacá la foto con el celular o subí una de la computadora. Se ajusta sola de tamaño.
        </p>
        {avisoFoto && <p className="mt-1 text-xs font-semibold text-senal-2">{avisoFoto}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Marca" error={errores.marca}>
          <input value={form.marca} onChange={(e) => campo('marca', e.target.value)} className={inputClase(errores.marca)} placeholder="Ej: Chevrolet" />
        </Campo>
        <Campo label="Modelo" error={errores.modelo}>
          <input value={form.modelo} onChange={(e) => campo('modelo', e.target.value)} className={inputClase(errores.modelo)} placeholder="Ej: Onix" />
        </Campo>
        <Campo label="Versión">
          <input value={form.version} onChange={(e) => campo('version', e.target.value)} className={inputClase()} placeholder="Ej: Joy 1.4" />
        </Campo>
        <Campo label="Año" error={errores.anio} ayuda="Ej: 2019">
          <input inputMode="numeric" value={form.anio} onChange={(e) => campo('anio', e.target.value)} className={inputClase(errores.anio)} placeholder="Ej: 2019" />
        </Campo>
        <Campo label="Kilometraje" error={errores.km} ayuda="Solo números">
          <input inputMode="numeric" value={form.km} onChange={(e) => campo('km', e.target.value)} className={inputClase(errores.km)} placeholder="Ej: 65000" />
        </Campo>
        <Campo label="Precio en dólares" error={errores.precio} ayuda="Sin puntos ni el símbolo U$S">
          <input inputMode="numeric" value={form.precio} onChange={(e) => campo('precio', e.target.value)} className={inputClase(errores.precio)} placeholder="Ej: 12900" />
        </Campo>

        <Campo label="Carrocería">
          <select value={form.tipo} onChange={(e) => campo('tipo', e.target.value as TipoCarroceria)} className={inputClase()}>
            {tiposCarroceria.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Combustible">
          <select value={form.combustible} onChange={(e) => campo('combustible', e.target.value as Combustible)} className={inputClase()}>
            {combustibles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Caja">
          <select value={form.caja} onChange={(e) => campo('caja', e.target.value as Caja)} className={inputClase()}>
            {cajas.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Tracción">
          <select value={form.traccion} onChange={(e) => campo('traccion', e.target.value as Traccion)} className={inputClase()}>
            {tracciones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Color (nombre)">
          <input value={form.colorNombre} onChange={(e) => campo('colorNombre', e.target.value)} className={inputClase()} placeholder="Ej: blanco banquina" />
        </Campo>
        <Campo label="Color (para la ilustración)">
          <input type="color" value={form.color} onChange={(e) => campo('color', e.target.value)} className="min-h-11 w-full border border-linea px-1 py-1" />
        </Campo>
        <Campo label="Motor">
          <input value={form.motor} onChange={(e) => campo('motor', e.target.value)} className={inputClase()} placeholder="Ej: 1.6L 8V" />
        </Campo>
        <Campo label="Potencia (HP)">
          <input inputMode="numeric" value={form.potenciaHp} onChange={(e) => campo('potenciaHp', e.target.value)} className={inputClase()} />
        </Campo>
        <Campo label="Puertas">
          <input inputMode="numeric" value={form.puertas} onChange={(e) => campo('puertas', e.target.value)} className={inputClase()} />
        </Campo>
        <Campo label="Pasajeros">
          <input inputMode="numeric" value={form.pasajeros} onChange={(e) => campo('pasajeros', e.target.value)} className={inputClase()} />
        </Campo>
        <Campo label="Cartel (opcional)" ayuda='Ej: "Único dueño", "Recibo menor"' className="sm:col-span-2">
          <input value={form.etiqueta} onChange={(e) => campo('etiqueta', e.target.value)} className={inputClase()} maxLength={28} />
        </Campo>
      </div>

      <Campo label="Descripción" error={errores.descripcion}>
        <textarea
          rows={2}
          value={form.descripcion}
          onChange={(e) => campo('descripcion', e.target.value)}
          className={inputClase(errores.descripcion)}
          placeholder="Una frase corta, como la dirías vos"
        />
      </Campo>

      <Campo label="Características" ayuda="Una por línea, aparecen como lista en la ficha">
        <textarea
          rows={5}
          value={form.caracteristicasTexto}
          onChange={(e) => campo('caracteristicasTexto', e.target.value)}
          className={inputClase()}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-texto/50">Estado</p>
          <div className="flex flex-wrap gap-2">
            {estadosAuto.map((e: EstadoAuto) => (
              <button
                key={e}
                type="button"
                onClick={() => campo('estado', e)}
                aria-pressed={form.estado === e}
                className={`min-h-11 border-2 px-4 text-sm font-bold transition ${
                  form.estado === e ? 'border-tinta bg-tinta text-hueso' : 'border-linea text-texto/70'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 self-end text-sm font-semibold text-texto/80">
          <input type="checkbox" checked={form.destacado} onChange={(e) => campo('destacado', e.target.checked)} className="h-5 w-5 accent-senal" />
          Mostrar como destacado
        </label>
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-linea bg-hueso pt-4">
        <button type="button" onClick={onCancelar} className="min-h-12 flex-1 border-2 border-linea text-sm font-bold uppercase tracking-wide text-texto/70">
          Cancelar
        </button>
        <button type="submit" className="min-h-12 flex-1 bg-tinta text-sm font-bold uppercase tracking-wide text-hueso">
          Guardar
        </button>
      </div>
    </form>
  )
}

function inputClase(error?: string) {
  return `w-full min-h-11 border px-3 py-2 text-sm focus:outline-none ${
    error ? 'border-senal-2' : 'border-linea focus:border-tinta'
  }`
}

function Campo({
  label,
  error,
  ayuda,
  className = '',
  children,
}: {
  label: string
  error?: string
  ayuda?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-semibold text-texto/75">{label}</label>
      {children}
      {ayuda && !error && <p className="mt-1 text-xs text-texto/50">{ayuda}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-senal-2">{error}</p>}
    </div>
  )
}
