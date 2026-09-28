import { Phone, Mail } from 'lucide-react'
import { useDatos } from '../data/store'
import Reveal from './Reveal'

export default function Ubicacion() {
  const { negocio } = useDatos()

  return (
    <section id="contacto" className="bg-hueso-2 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-tinta sm:text-4xl">
            Dónde estamos
          </h2>
          <p className="mt-2 text-texto/75">
            {negocio.direccion}. Playón y showroom sobre la ruta, a 5 minutos del centro.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-sm bg-tinta-3 ring-1 ring-linea">
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-hueso/50">
              Mapa de Minas, Lavalleja: se carga en producción
            </div>
            <iframe
              title={`Ubicación de ${negocio.nombre} en Minas, Uruguay`}
              src="https://www.google.com/maps?q=Minas,+Lavalleja,+Uruguay&output=embed"
              className="relative h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h3 className="font-display text-xl font-bold text-tinta">Horarios</h3>
          <ul className="mt-4 divide-y divide-linea rounded-sm bg-white ring-1 ring-linea">
            {negocio.horarios.map((item) => (
              <li key={item.dia} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-semibold text-texto/80">{item.dia}</span>
                <span className="tabular text-texto/60">{item.horario}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-sm bg-tinta p-5 text-hueso">
            <p className="text-xs font-bold uppercase tracking-wide text-senal">
              ¿Preferís hablar directo?
            </p>
            <a
              href={`tel:+${negocio.whatsapp}`}
              className="mt-2 flex items-center gap-2 text-lg font-bold hover:text-senal"
            >
              <Phone size={18} aria-hidden="true" />
              +{formatoTelefono(negocio.whatsapp)}
            </a>
            <a
              href={`mailto:${negocio.email}`}
              className="mt-1 flex items-center gap-2 text-sm text-hueso/75 hover:text-senal"
            >
              <Mail size={16} aria-hidden="true" />
              {negocio.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function formatoTelefono(whatsapp: string) {
  // 598991234 56 -> +598 99 123 456 (ajustado a la cantidad de dígitos que haya)
  const digitos = whatsapp.replace(/\D/g, '')
  const pais = digitos.slice(0, 3)
  const resto = digitos.slice(3)
  return `${pais} ${resto.slice(0, 2)} ${resto.slice(2, 5)} ${resto.slice(5)}`.trim()
}
