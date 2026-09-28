/**
 * Redimensiona una imagen elegida por el usuario a máximo 1200px de lado
 * mayor y la devuelve como dataURL JPEG (calidad ~0.75), lista para guardar
 * en localStorage sin ocupar demasiado espacio.
 */
export function redimensionarImagen(archivo: File, ladoMax = 1200, calidad = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida'))
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > ladoMax) {
          height = Math.round((height * ladoMax) / width)
          width = ladoMax
        } else if (height > ladoMax) {
          width = Math.round((width * ladoMax) / height)
          height = ladoMax
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen en este navegador'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', calidad))
      }
      img.src = lector.result as string
    }
    lector.readAsDataURL(archivo)
  })
}
