import Header from './components/Header'
import Hero from './components/Hero'
import Catalogo from './components/Catalogo'
import VenderAuto from './components/VenderAuto'
import Ubicacion from './components/Ubicacion'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Catalogo />
        <VenderAuto />
        <Ubicacion />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
