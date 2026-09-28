import Reveal from './Reveal'

// Marcas ficticias (bancos, financieras y aseguradoras inventadas para la demo).
const aliados = [
  'Banco Cardal',
  'Financiera Rumbo',
  'Seguros Ceibo',
  'Mutual Amanecer',
  'Crédito Directo',
  'Banco del Este',
  'Plan Óvalo Sur',
  'Aseguradora Salus',
]

export default function Aliados() {
  const fila = [...aliados, ...aliados]

  return (
    <section className="border-y border-linea bg-hueso-2 py-10">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-texto/50">
          Financiamos con
        </p>
      </Reveal>

      <div className="pausa-hover mascara-bordes mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-14 pr-14">
          {fila.map((nombre, i) => (
            <span
              key={`${nombre}-${i}`}
              className="font-display text-xl font-extrabold uppercase tracking-tight text-texto/35 transition hover:text-tinta sm:text-2xl"
            >
              {nombre}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
