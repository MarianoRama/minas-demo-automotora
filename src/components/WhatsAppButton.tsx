import { WhatsAppAction, whatsappConfigurado } from './WhatsAppAction'

export default function WhatsAppButton() {
  if (!whatsappConfigurado) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl bg-white p-3 shadow-lg shadow-slate-900/20 ring-1 ring-slate-200">
      <WhatsAppAction
        label="Consultar por WhatsApp"
        message="Hola, quisiera hacer una consulta sobre los vehículos."
        className="flex min-h-11 items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
      >
        WhatsApp
      </WhatsAppAction>
    </div>
  )
}
