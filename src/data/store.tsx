import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { autosEjemplo, type Auto } from './cars'
import { FUENTE_DATOS, negocioEjemplo, type Negocio } from '../config'
import { csvARegistros } from './parseCsv'
import { registroAAuto } from './mapCsvAuto'

const CLAVE = 'minas-demo-automotora.datos.v1'

interface Persistido {
  autos: Auto[]
  negocio: Negocio
}

function leerLocal(): Persistido | null {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return null
    const datos = JSON.parse(crudo)
    if (!datos || !Array.isArray(datos.autos) || typeof datos.negocio !== 'object') return null
    return datos as Persistido
  } catch {
    return null
  }
}

function guardarLocal(datos: Persistido): string | null {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos))
    return null
  } catch {
    return 'No se pudo guardar en este navegador (¿memoria llena o modo privado?). Los cambios podrían perderse al recargar.'
  }
}

function idUnico(marca: string, modelo: string, existentes: Auto[]) {
  const base =
    `${marca}-${modelo}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'auto'
  let id = base
  let n = 2
  while (existentes.some((a) => a.id === id)) {
    id = `${base}-${n}`
    n++
  }
  return id
}

interface DatosContextValue {
  autos: Auto[]
  negocio: Negocio
  fuenteAutos: 'local' | 'sheets'
  cargandoSheet: boolean
  errorSheet: string | null
  errorStorage: string | null
  crearAuto: (datos: Omit<Auto, 'id'>) => Auto
  actualizarAuto: (id: string, cambios: Partial<Auto>) => void
  eliminarAuto: (id: string) => void
  duplicarAuto: (id: string) => void
  actualizarNegocio: (cambios: Partial<Negocio>) => void
  restaurarEjemplo: () => void
  exportarJSON: () => void
  importarJSON: (archivo: File) => Promise<void>
}

const DatosContext = createContext<DatosContextValue | null>(null)

export function DatosProvider({ children }: { children: ReactNode }) {
  const inicial = useMemo(() => leerLocal(), [])
  const [autos, setAutos] = useState<Auto[]>(inicial?.autos ?? autosEjemplo)
  const [negocio, setNegocio] = useState<Negocio>(inicial?.negocio ?? negocioEjemplo)
  const [errorStorage, setErrorStorage] = useState<string | null>(null)
  const [cargandoSheet, setCargandoSheet] = useState(FUENTE_DATOS.tipo === 'sheets')
  const [errorSheet, setErrorSheet] = useState<string | null>(null)
  const listo = useRef(FUENTE_DATOS.tipo !== 'local')

  // Carga desde Google Sheets si corresponde. Si falla, se mantienen los
  // datos locales/de ejemplo como respaldo.
  useEffect(() => {
    if (FUENTE_DATOS.tipo !== 'sheets') return
    let vigente = true
    setCargandoSheet(true)
    fetch(FUENTE_DATOS.csvUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((texto) => {
        if (!vigente) return
        const registros = csvARegistros(texto)
        const cargados = registros
          .map((r, i) => registroAAuto(r, i))
          .filter((a): a is Auto => a !== null)
        if (cargados.length === 0) throw new Error('La planilla no tiene filas válidas')
        setAutos(cargados)
        setErrorSheet(null)
      })
      .catch((e) => {
        if (!vigente) return
        setErrorSheet(
          `No se pudo cargar la planilla (${e instanceof Error ? e.message : 'error desconocido'}). Mostrando datos de ejemplo.`,
        )
      })
      .finally(() => {
        if (vigente) setCargandoSheet(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  // Persistencia local (solo cuando la fuente de autos es local).
  useEffect(() => {
    if (!listo.current) {
      listo.current = true
      return
    }
    if (FUENTE_DATOS.tipo !== 'local') return
    const error = guardarLocal({ autos, negocio })
    setErrorStorage(error)
  }, [autos, negocio])

  const crearAuto = useCallback((datos: Omit<Auto, 'id'>) => {
    let creado!: Auto
    setAutos((prev) => {
      const id = idUnico(datos.marca, datos.modelo, prev)
      creado = { ...datos, id }
      return [creado, ...prev]
    })
    return creado
  }, [])

  const actualizarAuto = useCallback((id: string, cambios: Partial<Auto>) => {
    setAutos((prev) => prev.map((a) => (a.id === id ? { ...a, ...cambios, id: a.id } : a)))
  }, [])

  const eliminarAuto = useCallback((id: string) => {
    setAutos((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const duplicarAuto = useCallback((id: string) => {
    setAutos((prev) => {
      const original = prev.find((a) => a.id === id)
      if (!original) return prev
      const nuevoId = idUnico(original.marca, original.modelo, prev)
      const copia: Auto = { ...original, id: nuevoId, destacado: false, estado: 'Disponible' }
      const posicion = prev.findIndex((a) => a.id === id)
      const copiaLista = [...prev]
      copiaLista.splice(posicion + 1, 0, copia)
      return copiaLista
    })
  }, [])

  const actualizarNegocio = useCallback((cambios: Partial<Negocio>) => {
    setNegocio((prev) => ({ ...prev, ...cambios }))
  }, [])

  const restaurarEjemplo = useCallback(() => {
    setAutos(autosEjemplo)
    setNegocio(negocioEjemplo)
    const error = guardarLocal({ autos: autosEjemplo, negocio: negocioEjemplo })
    setErrorStorage(error)
  }, [])

  const exportarJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify({ autos, negocio }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `datos-sitio-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [autos, negocio])

  const importarJSON = useCallback(async (archivo: File) => {
    const texto = await archivo.text()
    const datos = JSON.parse(texto)
    if (!Array.isArray(datos.autos) || typeof datos.negocio !== 'object') {
      throw new Error('El archivo no tiene el formato esperado (autos, negocio).')
    }
    setAutos(datos.autos)
    setNegocio({ ...negocioEjemplo, ...datos.negocio })
  }, [])

  const value = useMemo<DatosContextValue>(
    () => ({
      autos,
      negocio,
      fuenteAutos: FUENTE_DATOS.tipo,
      cargandoSheet,
      errorSheet,
      errorStorage,
      crearAuto,
      actualizarAuto,
      eliminarAuto,
      duplicarAuto,
      actualizarNegocio,
      restaurarEjemplo,
      exportarJSON,
      importarJSON,
    }),
    [
      autos,
      negocio,
      cargandoSheet,
      errorSheet,
      errorStorage,
      crearAuto,
      actualizarAuto,
      eliminarAuto,
      duplicarAuto,
      actualizarNegocio,
      restaurarEjemplo,
      exportarJSON,
      importarJSON,
    ],
  )

  return <DatosContext.Provider value={value}>{children}</DatosContext.Provider>
}

export function useDatos() {
  const ctx = useContext(DatosContext)
  if (!ctx) throw new Error('useDatos debe usarse dentro de DatosProvider')
  return ctx
}
