import { useState, type FormEvent } from 'react'
import { WhatsAppAction } from './WhatsAppAction'

interface FormState {
  marca: string
  modelo: string
  anio: string
  telefono: string
}

const estadoInicial: FormState = {
  marca: '',
  modelo: '',
  anio: '',
  telefono: '',
}

export default function VenderAuto() {
  const [form, setForm] = useState<FormState>(estadoInicial)
  const [enviado, setEnviado] = useState(false)

  function handleChange(campo: keyof FormState, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <section id="vender" className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Vendé tu auto
          </h2>
          <p className="mt-3 text-slate-600">
            Compartí los datos básicos de tu vehículo para preparar una consulta. En este ejemplo
            no guardamos tus datos ni enviamos formularios a un servidor.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• Tasación a coordinar con el equipo</li>
            <li>• Posibilidad de conversar una permuta</li>
            <li>• Revisión de documentación del vehículo</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label
                htmlFor="marca"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Marca
              </label>
              <input
                id="marca"
                required
                value={form.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Toyota"
              />
            </div>
            <div>
              <label
                htmlFor="modelo"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Modelo
              </label>
              <input
                id="modelo"
                required
                value={form.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Corolla"
              />
            </div>
            <div>
              <label
                htmlFor="anio"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Año
              </label>
              <input
                id="anio"
                required
                type="number"
                min="1980"
                max={new Date().getFullYear()}
                value={form.anio}
                onChange={(e) => handleChange('anio', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: 2019"
              />
            </div>
            <div>
              <label
                htmlFor="telefono"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                required
                type="tel"
                value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: 099 123 456"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-[#c4422e] py-3 text-sm font-semibold text-white transition hover:bg-[#a73323]"
          >
            Solicitar tasación
          </button>

          {enviado && (
            <div className="mt-4 rounded-md bg-green-50 px-3 py-3 text-sm text-green-900 ring-1 ring-green-200" role="status">
              <p>La demo no envió ni guardó estos datos. Podés preparar una consulta para WhatsApp:</p>
              <WhatsAppAction
                className="mt-2 inline-flex min-h-11 items-center rounded px-2 font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                label="Copiar o continuar consulta de tasación en WhatsApp"
                message={`Hola, quisiera consultar por una tasación. Vehículo: ${form.marca} ${form.modelo}, año ${form.anio}. Mi teléfono: ${form.telefono}.`}
              >
                Continuar por WhatsApp
              </WhatsAppAction>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
