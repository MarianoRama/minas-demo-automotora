export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">Pereyra Automotores</p>
          <p className="mt-1 text-sm">Minas, Lavalleja, Uruguay · Dirección de ejemplo</p>
        </div>

        <div className="text-sm">
          <p>Teléfono de contacto a configurar</p>
          <p>Correo de contacto a configurar</p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl border-t border-slate-800 px-4 pt-6 text-xs sm:px-6">
        <p>
          © {new Date().getFullYear()} Pereyra Automotores. Sitio de demostración
          (portafolio) — nombre, datos y vehículos son ficticios.
        </p>
      </div>
    </footer>
  )
}
