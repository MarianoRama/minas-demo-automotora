import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { TipoCarroceria } from '../data/cars'

export type FiltroTipo = TipoCarroceria | 'Todos'
export type FiltroMarca = string | 'Todas'

interface Filtros {
  tipo: FiltroTipo
  marca: FiltroMarca
  precioMax: number
  busqueda: string
}

interface FiltrosContextValue {
  filtros: Filtros
  setTipo: (v: FiltroTipo) => void
  setMarca: (v: FiltroMarca) => void
  setPrecioMax: (v: number) => void
  setBusqueda: (v: string) => void
  aplicarBusquedaRapida: (v: Partial<Filtros>) => void
}

const valoresIniciales: Filtros = {
  tipo: 'Todos',
  marca: 'Todas',
  precioMax: Number.POSITIVE_INFINITY,
  busqueda: '',
}

const FiltrosContext = createContext<FiltrosContextValue | null>(null)

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>(valoresIniciales)

  const value = useMemo<FiltrosContextValue>(
    () => ({
      filtros,
      setTipo: (tipo) => setFiltros((f) => ({ ...f, tipo })),
      setMarca: (marca) => setFiltros((f) => ({ ...f, marca })),
      setPrecioMax: (precioMax) => setFiltros((f) => ({ ...f, precioMax })),
      setBusqueda: (busqueda) => setFiltros((f) => ({ ...f, busqueda })),
      aplicarBusquedaRapida: (parcial) => setFiltros((f) => ({ ...f, ...parcial })),
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
