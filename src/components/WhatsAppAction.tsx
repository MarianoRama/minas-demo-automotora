import { useState, type ReactNode } from 'react'

const numeroConfigurado = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? ''
const formatoValido = /^\+?[\d\s()-]+$/.test(numeroConfigurado)
const numeroWhatsApp = numeroConfigurado.replace(/\D/g, '')
const numeroSeguro = formatoValido && numeroWhatsApp !== '59899000000' && numeroWhatsApp.length >= 8 && numeroWhatsApp.length <= 15
  ? numeroWhatsApp
  : ''

export const whatsappConfigurado = Boolean(numeroSeguro)

export function WhatsAppAction({
  message,
  children,
  className,
  label,
}: {
  message: string
  children: ReactNode
  className: string
  label: string
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')

  if (numeroSeguro) {
    return (
      <a
        href={`https://wa.me/${numeroSeguro}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    )
  }

  async function copyMessage() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(message)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button type="button" onClick={copyMessage} aria-label={label} className={className}>
        {copyState === 'copied' ? 'Consulta copiada' : 'Copiar consulta'}
      </button>
      {copyState === 'copied' && (
        <p className="text-xs leading-relaxed text-current/80" aria-live="polite">
          Consulta copiada. Todavía no se envió.
        </p>
      )}
      {copyState === 'manual' && (
        <div>
          <p className="text-xs" role="status">No se pudo copiar. Seleccioná el mensaje para copiarlo.</p>
          <textarea
            readOnly
            value={message}
            aria-label="Consulta para copiar manualmente"
            rows={3}
            className="w-full rounded border border-slate-300 bg-white p-2 text-sm text-slate-900"
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </div>
  )
}
