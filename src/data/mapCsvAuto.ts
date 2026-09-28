import type { Auto, Caja, Combustible, EstadoAuto, Traccion, TipoCarroceria } from './cars'

const TIPOS: TipoCarroceria[] = ['Hatchback', 'Sedán', 'SUV', 'Pickup']
const COMBUSTIBLES: Combustible[] = ['Nafta', 'Diésel', 'Híbrido', 'Eléctrico']
const CAJAS: Caja[] = ['Manual', 'Automática']
const TRACCIONES: Traccion[] = ['Delantera', 'Trasera', '4x4']
const ESTADOS: EstadoAuto[] = ['Disponible', 'Reservado', 'Vendido']

function num(v: string | undefined, porDefecto = 0) {
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : porDefecto
}

function uno<T extends string>(v: string | undefined, opciones: readonly T[], porDefecto: T): T {
  const encontrado = opciones.find((o) => o.toLowerCase() === String(v ?? '').trim().toLowerCase())
  return encontrado ?? porDefecto
}

function bool(v: string | undefined) {
  return ['si', 'sí', 'true', '1', 'x'].includes(String(v ?? '').trim().toLowerCase())
}

/**
 * Convierte un registro (fila) del CSV publicado de Google Sheets en un Auto.
 * Columnas esperadas (ver README): id, marca, modelo, version, anio, km,
 * precio, tipo, combustible, caja, color, colorNombre, etiqueta, destacado,
 * estado, descripcion, caracteristicas (separadas por "|"), motor,
 * potenciaHp, traccion, puertas, pasajeros, foto.
 * Filas sin marca o modelo se descartan.
 */
export function registroAAuto(r: Record<string, string>, indice: number): Auto | null {
  const marca = (r.marca ?? '').trim()
  const modelo = (r.modelo ?? '').trim()
  if (!marca || !modelo) return null

  const id = (r.id ?? '').trim() || `${marca}-${modelo}-${indice}`.toLowerCase().replace(/\s+/g, '-')

  return {
    id,
    marca,
    modelo,
    version: (r.version ?? '').trim(),
    anio: num(r.anio, new Date().getFullYear()),
    km: num(r.km, 0),
    precio: num(r.precio, 0),
    tipo: uno(r.tipo, TIPOS, 'Hatchback'),
    combustible: uno(r.combustible, COMBUSTIBLES, 'Nafta'),
    caja: uno(r.caja, CAJAS, 'Manual'),
    color: (r.color ?? '#6B7280').trim() || '#6B7280',
    colorNombre: (r.colorNombre ?? 'gris').trim() || 'gris',
    etiqueta: (r.etiqueta ?? '').trim() || undefined,
    destacado: bool(r.destacado),
    estado: uno(r.estado, ESTADOS, 'Disponible'),
    descripcion: (r.descripcion ?? '').trim(),
    caracteristicas: (r.caracteristicas ?? '')
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean),
    motor: (r.motor ?? '').trim(),
    potenciaHp: num(r.potenciaHp, 0),
    traccion: uno(r.traccion, TRACCIONES, 'Delantera'),
    puertas: num(r.puertas, 4),
    pasajeros: num(r.pasajeros, 5),
    foto: (r.foto ?? '').trim() || undefined,
  }
}
