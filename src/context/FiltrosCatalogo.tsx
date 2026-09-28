import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Caja, Combustible, TipoCarroceria } from '../data/cars'

export type Orden = 'destacados' | 'precio-asc' | 'precio-desc' | 'km-asc' | 'anio-desc'

export interface Filtros {
  tipos: TipoCarroceria[]
  marcas: string[]
  combustibles: Combustible[]
  cajas: Caja[]
  precioMin: number
  precioMax: number
  anioDesde: number
  kmMax: number
  mostrarVendidos: boolean
  soloDestacados: boolean
  soloRecienIngresados: boolean
  soloElectrificados: boolean
  soloFinanciables: boolean
  busqueda: string
  orden: Orden
}

export const filtrosIniciales: Filtros = {
  tipos: [],
  marcas: [],
  combustibles: [],
  cajas: [],
  precioMin: 0,
  precioMax: Number.POSITIVE_INFINITY,
  anioDesde: 0,
  kmMax: Number.POSITIVE_INFINITY,
  mostrarVendidos: false,
  soloDestacados: false,
  soloRecienIngresados: false,
  soloElectrificados: false,
  soloFinanciables: false,
  busqueda: '',
  orden: 'destacados',
}

interface FiltrosContextValue {
  filtros: Filtros
  setFiltros: (v: Filtros | ((f: Filtros) => Filtros)) => void
  actualizar: (parcial: Partial<Filtros>) => void
  alternarValor: <K extends 'tipos' | 'marcas' | 'combustibles' | 'cajas'>(
    campo: K,
    valor: Filtros[K][number],
  ) => void
  limpiar: () => void
  aplicarBusquedaRapida: (v: Partial<Filtros>) => void
}

const FiltrosContext = createContext<FiltrosContextValue | null>(null)

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales)

  const value = useMemo<FiltrosContextValue>(
    () => ({
      filtros,
      setFiltros,
      actualizar: (parcial) => setFiltros((f) => ({ ...f, ...parcial })),
      alternarValor: (campo, valor) =>
        setFiltros((f) => {
          const lista = f[campo] as unknown[]
          const yaEsta = lista.includes(valor)
          const nueva = yaEsta ? lista.filter((v) => v !== valor) : [...lista, valor]
          return { ...f, [campo]: nueva }
        }),
      limpiar: () => setFiltros(filtrosIniciales),
      aplicarBusquedaRapida: (parcial) => setFiltros({ ...filtrosIniciales, ...parcial }),
    }),
    [filtros],
  )

  return <FiltrosContext.Provider value={value}>{children}</FiltrosContext.Provider>
}

export function useFiltrosCatalogo() {
  const ctx = useContext(FiltrosContext)
  if (!ctx) throw new Error('useFiltrosCatalogo debe usarse dentro de FiltrosProvider')
  return ctx
}
