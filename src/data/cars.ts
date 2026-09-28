export type TipoAuto = 'Sedán' | 'SUV' | 'Pick-up'
export type EstadoAuto = 'Borrador' | 'Disponible' | 'Vendido'

export interface Auto {
  id: number
  marca: string
  modelo: string
  anio: number
  precio: number
  km: number
  tipo: TipoAuto
  estado: EstadoAuto
  imagenes: string[]
}

import inventario from './cars.json'

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

const tipos: TipoAuto[] = ['Sedán', 'SUV', 'Pick-up']
const estados: EstadoAuto[] = ['Borrador', 'Disponible', 'Vendido']
const datos: unknown = inventario

function esTipoAuto(valor: unknown): valor is TipoAuto {
  return tipos.some((tipo) => tipo === valor)
}

function esEstadoAuto(valor: unknown): valor is EstadoAuto {
  return estados.some((estado) => estado === valor)
}

export const autos: Auto[] = esRegistro(datos) && Array.isArray(datos.autos)
  ? datos.autos.flatMap((valor): Auto[] => {
      if (!esRegistro(valor)) return []
      const imagenes = Array.isArray(valor.imagenes)
        ? valor.imagenes.filter((imagen): imagen is string => typeof imagen === 'string' && imagen.trim() !== '')
        : []
      if (
        typeof valor.id !== 'number' || !Number.isInteger(valor.id) ||
        typeof valor.marca !== 'string' || typeof valor.modelo !== 'string' ||
        typeof valor.anio !== 'number' || !Number.isInteger(valor.anio) ||
        typeof valor.precio !== 'number' || !Number.isFinite(valor.precio) || valor.precio < 0 ||
        typeof valor.km !== 'number' || !Number.isFinite(valor.km) || valor.km < 0 ||
        !esTipoAuto(valor.tipo)
      ) return []
      const estado = esEstadoAuto(valor.estado) ? valor.estado : 'Borrador'
      return [{
        id: valor.id,
        marca: valor.marca,
        modelo: valor.modelo,
        anio: valor.anio,
        precio: valor.precio,
        km: valor.km,
        tipo: valor.tipo,
        estado,
        imagenes,
      }]
    })
  : []

export const autosPublicados = autos.filter((auto) => auto.estado !== 'Borrador')
