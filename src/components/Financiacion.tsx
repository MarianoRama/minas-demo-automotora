import { useMemo, useState } from 'react'
import { autos } from '../data/cars'
import { formatoPrecio } from '../lib/formato'
import Reveal from './Reveal'

const TASA_MENSUAL_ILUSTRATIVA = 0.032 // 3,2% mensual — ejemplo, no es oferta real
const plazos = [12, 24, 36, 48] as const

export default function Financiacion() {
  const precioMedio = useMemo(
    () => Math.round(autos.reduce((acc, a) => acc + a.precio, 0) / autos.length / 100) * 100,
    [],
  )

  const [precio, setPrecio] = useState(precioMedio)
  const [entregaPct, setEntregaPct] = useState(30)
  const [plazo, setPlazo] = useState<(typeof plazos)[number]>(24)

  const entrega = Math.round((precio * entregaPct) / 100)
  const financiado = precio - entrega
  const cuota = calcularCuota(financiado, TASA_MENSUAL_ILUSTRATIVA, plazo)

  return (
    <section id="financiacion" className="bg-tinta py-16 text-hueso sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Simulá tu financiación
            </h2>
            <p className="mt-2 max-w-xl text-hueso/70">
              Entregá tu usado o parte del pago en efectivo y financiá el resto en cuotas
              fijas en pesos. Esto es un ejemplo para orientarte — la cuota real se calcula
              con el vehículo y tu perfil el día de la operación.
            </p>
          </div>
          <p className="rounded-sm bg-senal/15 px-3 py-2 text-xs font-bold uppercase tracking-wide text-senal">
            Tasa de ejemplo: {(TASA_MENSUAL_ILUSTRATIVA * 100).toFixed(1)}% mensual · ilustrativa
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10 grid gap-8 rounded-sm bg-tinta-3/50 p-6 ring-1 ring-hueso/10 sm:p-8 md:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="precioAuto" className="font-semibold text-hueso/80">
                  Precio del vehículo
                </label>
                <span className="tabular font-display font-bold text-senal">
                  {formatoPrecio(precio)}
                </span>
              </div>
              <input
                id="precioAuto"
                type="range"
                min={9000}
                max={35000}
                step={500}
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="mt-2 h-2 w-full accent-senal"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="entrega" className="font-semibold text-hueso/80">
                  Entrega inicial
                </label>
                <span className="tabular font-display font-bold text-senal">
                  {entregaPct}% · {formatoPrecio(entrega)}
                </span>
              </div>
              <input
                id="entrega"
                type="range"
                min={0}
                max={70}
                step={5}
                value={entregaPct}
                onChange={(e) => setEntregaPct(Number(e.target.value))}
                className="mt-2 h-2 w-full accent-senal"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-hueso/80">Plazo</p>
              <div className="flex flex-wrap gap-2">
                {plazos.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlazo(p)}
                    aria-pressed={plazo === p}
                    className={`min-h-11 rounded-sm px-4 text-sm font-bold transition ${
                      plazo === p
                        ? 'bg-senal text-tinta'
                        : 'bg-hueso/10 text-hueso/80 hover:bg-hueso/20'
                    }`}
                  >
                    {p} meses
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-sm bg-hueso p-6 text-tinta">
            <p className="text-xs font-bold uppercase tracking-wide text-texto/50">
              Cuota mensual estimada
            </p>
            <p className="tabular mt-1 font-display text-4xl font-extrabold text-tinta sm:text-5xl">
              {formatoPrecio(cuota)}
            </p>
            <dl className="tabular mt-5 space-y-2 border-t border-linea pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-texto/60">Monto a financiar</dt>
                <dd className="font-semibold">{formatoPrecio(financiado)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-texto/60">Plazo</dt>
                <dd className="font-semibold">{plazo} cuotas</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-texto/60">Tasa mensual (ejemplo)</dt>
                <dd className="font-semibold">{(TASA_MENSUAL_ILUSTRATIVA * 100).toFixed(1)}%</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-texto/55">
              * Simulación con fines ilustrativos, sistema francés de amortización. No
              constituye una oferta de crédito ni un compromiso de tasa. La financiación
              definitiva depende de la evaluación crediticia y del vehículo elegido.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function calcularCuota(monto: number, tasaMensual: number, meses: number) {
  if (monto <= 0) return 0
  if (tasaMensual === 0) return Math.round(monto / meses)
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses))
  return Math.round(cuota)
}
