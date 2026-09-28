import { useDatos } from '../data/store'
import Reveal from './Reveal'

const puntos = [
  {
    numero: '01',
    titulo: 'Revisión de 40 puntos',
    texto:
      'Mecánica, chapa, tren delantero y papeles antes de tasar. Si un auto no pasa, no entra al playón.',
  },
  {
    numero: '02',
    titulo: '90 días de garantía',
    texto: 'Motor y caja garantizados por escrito desde la entrega. La garantía se aplica acá, en nuestro taller de Ruta 8.',
  },
  {
    numero: '03',
    titulo: 'Trámite sin vueltas',
    texto:
      'Certificado, padrón y transferencia los hacemos con la escribanía de siempre, la que está frente a la plaza.',
  },
  {
    numero: '04',
    titulo: 'Tu auto como parte de pago',
    texto: 'Tasamos el que traés y lo descontamos del que te llevás. Si sobra plata a tu favor, se financia en cuotas.',
  },
]

export default function Confianza() {
  const { negocio } = useDatos()

  return (
    <section id="confianza" className="bg-hueso py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="grid gap-6 border-b-2 border-tinta pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
          <p className="tabular font-display text-6xl font-extrabold leading-none text-senal sm:text-7xl">
            {negocio.anioFundacion}
          </p>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-tinta sm:text-3xl">
              El año que abrimos el playón sobre Ruta 8. Seguimos en el mismo lugar.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden bg-linea sm:grid-cols-2 lg:grid-cols-4">
          {puntos.map((p, i) => (
            <Reveal
              key={p.numero}
              delay={i * 70}
              className="group flex flex-col bg-hueso p-6 transition-colors duration-300 ease-out hover:bg-white"
            >
              <span className="tabular font-display text-sm font-bold text-senal-2">{p.numero}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-tinta">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-texto/70">{p.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
