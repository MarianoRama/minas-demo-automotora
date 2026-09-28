import { useState, type ReactNode } from 'react'
import { useDatos } from '../data/store'
import type { HorarioDia } from '../config'

export default function AdminNegocio() {
  const { negocio, actualizarNegocio, errorStorage } = useDatos()
  const [guardado, setGuardado] = useState(false)

  function set<K extends keyof typeof negocio>(k: K, v: (typeof negocio)[K]) {
    actualizarNegocio({ [k]: v })
    setGuardado(true)
    window.setTimeout(() => setGuardado(false), 1500)
  }

  function setHorario(i: number, cambios: Partial<HorarioDia>) {
    const nuevos = negocio.horarios.map((h, idx) => (idx === i ? { ...h, ...cambios } : h))
    set('horarios', nuevos)
  }

  return (
    <div className="flex flex-col gap-6">
      {errorStorage && (
        <p className="border-2 border-senal-2 bg-senal/10 px-4 py-3 text-sm font-semibold text-senal-2">
          {errorStorage}
        </p>
      )}

      <div>
        <h2 className="font-display text-xl font-bold text-tinta">Datos del negocio</h2>
        <p className="mt-1 text-sm text-texto/60">
          Se guardan solos apenas los cambiás. {guardado && <span className="font-semibold text-senal-2">Guardado ✓</span>}
        </p>
      </div>

      <Campo label="Nombre del negocio">
        <input value={negocio.nombre} onChange={(e) => set('nombre', e.target.value)} className={inputClase} />
      </Campo>

      <Campo label="Eslogan corto">
        <input value={negocio.eslogan} onChange={(e) => set('eslogan', e.target.value)} className={inputClase} />
      </Campo>

      <Campo label="WhatsApp" ayuda="Con código de país, sin espacios ni +. Ej: 59899123456">
        <input value={negocio.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputClase} inputMode="numeric" />
      </Campo>

      <Campo label="Dirección">
        <input value={negocio.direccion} onChange={(e) => set('direccion', e.target.value)} className={inputClase} />
      </Campo>

      <Campo label="Email de contacto">
        <input type="email" value={negocio.email} onChange={(e) => set('email', e.target.value)} className={inputClase} />
      </Campo>

      <Campo label="Año de fundación">
        <input inputMode="numeric" value={negocio.anioFundacion} onChange={(e) => set('anioFundacion', Number(e.target.value) || negocio.anioFundacion)} className={inputClase} />
      </Campo>

      <div>
        <p className="mb-2 text-sm font-semibold text-texto/75">Horarios</p>
        <div className="flex flex-col gap-2">
          {negocio.horarios.map((h, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input
                value={h.dia}
                onChange={(e) => setHorario(i, { dia: e.target.value })}
                className={inputClase}
                placeholder="Ej: Lunes a viernes"
              />
              <input
                value={h.horario}
                onChange={(e) => setHorario(i, { horario: e.target.value })}
                className={inputClase}
                placeholder="Ej: 9:00 – 19:00"
              />
            </div>
          ))}
        </div>
      </div>

      <Campo label="Aviso del home" ayuda="Un texto corto que se ve arriba en la página principal">
        <textarea
          rows={2}
          value={negocio.avisoHome}
          onChange={(e) => set('avisoHome', e.target.value)}
          className={inputClase}
        />
      </Campo>

      <Campo
        label="Tasa mensual del simulador de financiación"
        ayuda="En porcentaje, solo para orientar (no es una oferta real). Ej: 3.2"
      >
        <input
          inputMode="decimal"
          value={(negocio.tasaMensual * 100).toFixed(1)}
          onChange={(e) => {
            const v = Number(e.target.value.replace(',', '.'))
            if (Number.isFinite(v)) set('tasaMensual', v / 100)
          }}
          className={inputClase}
        />
      </Campo>
    </div>
  )
}

const inputClase = 'w-full min-h-11 border border-linea px-3 py-2 text-sm focus:border-tinta focus:outline-none'

function Campo({
  label,
  ayuda,
  children,
}: {
  label: string
  ayuda?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-texto/75">{label}</label>
      {children}
      {ayuda && <p className="mt-1 text-xs text-texto/50">{ayuda}</p>}
    </div>
  )
}
