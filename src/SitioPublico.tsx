import { FiltrosProvider } from './context/FiltrosCatalogo'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalogo from './components/Catalogo'
import Financiacion from './components/Financiacion'
import VenderAuto from './components/VenderAuto'
import Confianza from './components/Confianza'
import Aliados from './components/Aliados'
import Ubicacion from './components/Ubicacion'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function SitioPublico() {
  return (
    <div className="min-h-screen bg-hueso">
      <p className="bg-senal py-1 text-center text-[11px] font-bold uppercase tracking-wide text-tinta">
        Sitio de demostración: negocio ficticio, portafolio de diseño web
      </p>
      <Header />
      <FiltrosProvider>
        <main>
          <Hero />
          <Catalogo />
          <Financiacion />
          <VenderAuto />
          <Confianza />
          <Aliados />
          <Ubicacion />
        </main>
      </FiltrosProvider>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
