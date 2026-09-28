const precio = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const km = new Intl.NumberFormat('es-UY')

export function formatoPrecio(valor: number) {
  return precio.format(valor)
}

export function formatoKm(valor: number) {
  return km.format(valor)
}
