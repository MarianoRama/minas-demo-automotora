import { useState, type FormEvent, type ReactNode } from 'react'
import { NEGOCIO } from '../config'
import Reveal from './Reveal'

interface FormState {
  marca: string
  modelo: string
  anio: string
  km: string
  telefono: string
  comentario: string
}

const estadoInicial: FormState = {
  marca: '',
  modelo: '',
  anio: '',
  km: '',
  telefono: '',
  comentario: '',
}

export default function VenderAuto() {
  const [form, setForm] = useState<FormState>(estadoInicial)

  function handleChange(campo: keyof FormState, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const partes = [
      `Hola, quiero tasar mi auto para vender o entregar como parte de pago.`,
      `Vehículo: ${form.marca} ${form.modelo} ${form.anio}`.trim(),
      form.km && `Kilometraje aproximado: ${form.km} km`,
      form.comentario && `Comentario: ${form.comentario}`,
      form.telefono && `Mi teléfono: ${form.telefono}`,
    ].filter(Boolean)
    const mensaje = partes.join('\n')
    const url = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="vender" className="bg-hueso-2 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-tinta sm:text-4xl">
            Vendé o entregá tu auto
          </h2>
          <p className="mt-3 max-w-md text-texto/75">
            Contanos qué tenés y te respondemos por WhatsApp con una tasación de
            referencia. Si te sirve como parte de pago, lo descontamos del auto que
            elijas del stock.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-texto/75">
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-senal" />
              Tasación de referencia por WhatsApp, sin compromiso
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-senal" />
              Lo tomamos como parte de pago o te lo compramos al contado
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-senal" />
              Gestionamos transferencia y trámites en Minas
            </li>
          </ul>
        </Reveal>

        <Reveal delay={100} className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-linea sm:p-7">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Marca" id="marca" required>
                <input
                  id="marca"
                  required
                  value={form.marca}
                  onChange={(e) => handleChange('marca', e.target.value)}
                  className={inputClase}
                  placeholder="Ej: Chevrolet"
                />
              </Campo>
              <Campo label="Modelo" id="modelo" required>
                <input
                  id="modelo"
                  required
                  value={form.modelo}
                  onChange={(e) => handleChange('modelo', e.target.value)}
                  className={inputClase}
                  placeholder="Ej: Onix"
                />
              </Campo>
              <Campo label="Año" id="anio" required>
                <input
                  id="anio"
                  required
                  type="number"
                  min={1980}
                  max={2026}
                  value={form.anio}
                  onChange={(e) => handleChange('anio', e.target.value)}
                  className={inputClase}
                  placeholder="Ej: 2019"
                />
              </Campo>
              <Campo label="Kilometraje" id="km">
                <input
                  id="km"
                  type="number"
                  min={0}
                  value={form.km}
                  onChange={(e) => handleChange('km', e.target.value)}
                  className={inputClase}
                  placeholder="Ej: 65000"
                />
              </Campo>
              <Campo label="Tu teléfono" id="telefono" required className="sm:col-span-2">
                <input
                  id="telefono"
                  required
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className={inputClase}
                  placeholder="Ej: 099 123 456"
                />
              </Campo>
              <Campo label="Comentario (opcional)" id="comentario" className="sm:col-span-2">
                <textarea
                  id="comentario"
                  rows={3}
                  value={form.comentario}
                  onChange={(e) => handleChange('comentario', e.target.value)}
                  className={inputClase}
                  placeholder="Estado general, service, algún detalle a mencionar..."
                />
              </Campo>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3.5 text-sm font-bold text-tinta transition hover:brightness-95"
            >
              Enviar por WhatsApp
            </button>
            <p className="mt-3 text-center text-xs text-texto/50">
              Se abre WhatsApp con el mensaje ya armado, listo para enviar.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

const inputClase =
  'w-full min-h-11 rounded-sm border border-linea px-3 py-2 text-sm focus:border-tinta focus:outline-none'

function Campo({
  label,
  id,
  required,
  className = '',
  children,
}: {
  label: string
  id: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-texto/75">
        {label} {required && <span className="text-senal-2">*</span>}
      </label>
      {children}
    </div>
  )
}
