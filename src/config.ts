export const AUTOR = {
  nombre: 'Mariano Rama',
  whatsapp: '59899000000',
  texto: 'Diseño y desarrollo web en Minas',
}

export interface HorarioDia {
  dia: string
  horario: string
}

export interface Negocio {
  nombre: string
  inicial: string
  eslogan: string
  whatsapp: string
  direccion: string
  email: string
  anioFundacion: number
  horarios: HorarioDia[]
  avisoHome: string
  tasaMensual: number
}

export const negocioEjemplo: Negocio = {
  nombre: 'Pereyra Automotores',
  inicial: 'P8',
  eslogan: 'Autos con historia clara, en Ruta 8',
  whatsapp: '59899123456',
  direccion: 'Ruta 8 km 121, Minas, Lavalleja',
  email: 'contacto@pereyraautomotores.uy',
  anioFundacion: 2007,
  horarios: [
    { dia: 'Lunes a viernes', horario: '9:00 – 19:00' },
    { dia: 'Sábados', horario: '9:00 – 13:00' },
    { dia: 'Domingos', horario: 'Cerrado' },
  ],
  avisoHome: 'Entran 3 autos nuevos esta semana: Kia Seltos, Toro y Corolla Cross.',
  tasaMensual: 0.032,
}

/**
 * De dónde sale el stock de autos.
 * - 'local': los datos de ejemplo + lo que se edite desde el panel (localStorage).
 * - 'sheets': se cargan desde una planilla de Google Sheets publicada como CSV.
 *   Ver README.md → "Conectar una planilla de Google" para las columnas esperadas.
 */
export type FuenteDatos = { tipo: 'local' } | { tipo: 'sheets'; csvUrl: string }

export const FUENTE_DATOS: FuenteDatos = { tipo: 'local' }

/** Precio mínimo (U$S) a partir del cual ofrecemos financiación propia. */
export const UMBRAL_FINANCIACION = 9000

/** PIN de acceso al panel de administración (solo para esta demo). */
export const PIN_ADMIN = '1234'
