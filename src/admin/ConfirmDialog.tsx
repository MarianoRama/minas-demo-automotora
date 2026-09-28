interface Props {
  titulo: string
  texto: string
  textoConfirmar?: string
  peligroso?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmDialog({
  titulo,
  texto,
  textoConfirmar = 'Confirmar',
  peligroso = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/70 p-4"
      onClick={onCancelar}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm border-2 border-tinta bg-hueso p-5"
      >
        <h3 id="confirm-titulo" className="font-display text-lg font-bold text-tinta">
          {titulo}
        </h3>
        <p className="mt-2 text-sm text-texto/75">{texto}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="min-h-11 flex-1 border-2 border-linea text-sm font-bold uppercase tracking-wide text-texto/70"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className={`min-h-11 flex-1 text-sm font-bold uppercase tracking-wide text-hueso ${
              peligroso ? 'bg-senal-2' : 'bg-tinta'
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
