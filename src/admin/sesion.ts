const CLAVE_SESION = 'minas-demo-automotora.admin.sesion'

export function haySesionAdmin() {
  try {
    return sessionStorage.getItem(CLAVE_SESION) === 'ok'
  } catch {
    return false
  }
}

export function iniciarSesionAdmin() {
  try {
    sessionStorage.setItem(CLAVE_SESION, 'ok')
  } catch {
    // sin sessionStorage igual dejamos pasar en esta sesión de la página
  }
}

export function cerrarSesionAdmin() {
  try {
    sessionStorage.removeItem(CLAVE_SESION)
  } catch {
    // si sessionStorage no está disponible no hay nada que limpiar
  }
}
