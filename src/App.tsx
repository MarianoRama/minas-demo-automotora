import { DatosProvider } from './data/store'
import { useHashRoute } from './hooks/useHashRoute'
import SitioPublico from './SitioPublico'
import AdminApp from './admin/AdminApp'

function App() {
  const hash = useHashRoute()
  const esAdmin = hash.startsWith('#/admin')

  return (
    <DatosProvider>
      {esAdmin ? <AdminApp /> : <SitioPublico />}
    </DatosProvider>
  )
}

export default App
