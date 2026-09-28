/**
 * Parser de CSV chico y sin dependencias, para leer una planilla de Google
 * Sheets publicada como CSV. Soporta campos entre comillas dobles con comas
 * y saltos de línea adentro, y comillas escapadas ("").
 */
export function parseCsv(texto: string): string[][] {
  const filas: string[][] = []
  let fila: string[] = []
  let campo = ''
  let entreComillas = false

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]

    if (entreComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else {
          entreComillas = false
        }
      } else {
        campo += c
      }
      continue
    }

    if (c === '"') {
      entreComillas = true
    } else if (c === ',') {
      fila.push(campo)
      campo = ''
    } else if (c === '\r') {
      // se ignora, el salto real llega con \n (o es \r\n)
    } else if (c === '\n') {
      fila.push(campo)
      filas.push(fila)
      fila = []
      campo = ''
    } else {
      campo += c
    }
  }

  if (campo.length > 0 || fila.length > 0) {
    fila.push(campo)
    filas.push(fila)
  }

  return filas.filter((f) => !(f.length === 1 && f[0].trim() === ''))
}

/** Convierte el CSV en una lista de objetos usando la primera fila como encabezados. */
export function csvARegistros(texto: string): Record<string, string>[] {
  const filas = parseCsv(texto)
  if (filas.length === 0) return []
  const encabezados = filas[0].map((h) => h.trim())
  return filas.slice(1).map((fila) => {
    const registro: Record<string, string> = {}
    encabezados.forEach((encabezado, i) => {
      registro[encabezado] = (fila[i] ?? '').trim()
    })
    return registro
  })
}
