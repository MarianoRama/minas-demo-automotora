import { useState } from 'react'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#vender', label: 'Vendé tu auto' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
            PA
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Pereyra <span className="text-blue-400">Automotores</span>
          </span>
        </a>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-200 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className="text-xl leading-none">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav id="menu-movil" className="flex flex-col gap-1 border-t border-slate-800 bg-slate-900 px-4 py-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
