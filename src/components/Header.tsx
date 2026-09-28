import { useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import { useDatos } from '../data/store'

const links = [
  { href: '#catalogo', label: 'Vehículos' },
  { href: '#financiacion', label: 'Financiación' },
  { href: '#vender', label: 'Vendé tu auto' },
  { href: '#confianza', label: 'Nosotros' },
  { href: '#contacto', label: 'Ubicación' },
]

export default function Header() {
  const { negocio } = useDatos()
  const [open, setOpen] = useState(false)
  const linkContacto = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent('Hola, quiero hacer una consulta.')}`

  return (
    <header className="sticky top-0 z-40 border-b border-tinta-3/40 bg-tinta text-hueso">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-senal font-display text-lg font-bold text-tinta">
            {negocio.inicial}
          </span>
          <span className="font-display text-base font-bold uppercase tracking-tight sm:text-lg">
            {negocio.nombre}
          </span>
        </a>

        <nav className="hidden gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.12em] text-hueso/80 transition hover:text-senal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={linkContacto}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-sm bg-senal px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-tinta transition hover:bg-hueso md:flex"
        >
          <Phone size={15} aria-hidden="true" />
          Contactar
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-hueso/25 text-hueso md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-tinta-3/40 bg-tinta px-4 py-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-3 text-sm font-semibold uppercase tracking-wide text-hueso/85 hover:bg-tinta-3/60 hover:text-senal"
            >
              {link.label}
            </a>
          ))}
          <a
            href={linkContacto}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-sm bg-senal px-4 py-3 text-sm font-bold uppercase tracking-wide text-tinta"
          >
            <Phone size={16} aria-hidden="true" />
            Contactar
          </a>
        </nav>
      )}
    </header>
  )
}
