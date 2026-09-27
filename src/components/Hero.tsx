export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            Minas, Uruguay
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Autos usados de confianza, listos para rodar
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            En Automotora Ruta 8 revisamos cada vehículo antes de ofrecerlo.
            Financiación, permuta y garantía de motor y caja en toda la
            flota.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
            >
              Ver catálogo
            </a>
            <a
              href="#vender"
              className="rounded-md border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
            >
              Vendé tu auto
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <svg
            viewBox="0 0 400 220"
            className="w-full max-w-md drop-shadow-2xl"
            role="img"
            aria-label="Ilustración de un auto estilizado"
          >
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="190" rx="170" ry="14" fill="#0f172a" opacity="0.5" />
            <path
              d="M40 140 L60 95 Q75 75 100 75 L150 75 L175 50 Q185 42 200 42 L260 42 Q275 42 285 55 L305 75 L340 80 Q365 85 365 115 L365 140 Z"
              fill="url(#carBody)"
            />
            <path
              d="M170 75 L190 55 Q198 48 208 48 L255 48 Q265 48 272 58 L288 75 Z"
              fill="#dbeafe"
              opacity="0.85"
            />
            <rect x="40" y="130" width="325" height="14" rx="6" fill="#1e3a8a" />
            <circle cx="110" cy="150" r="26" fill="#0f172a" />
            <circle cx="110" cy="150" r="11" fill="#cbd5e1" />
            <circle cx="300" cy="150" r="26" fill="#0f172a" />
            <circle cx="300" cy="150" r="11" fill="#cbd5e1" />
            <rect x="55" y="100" width="20" height="8" rx="4" fill="#fde68a" />
            <rect x="330" y="100" width="20" height="8" rx="4" fill="#f87171" />
          </svg>
        </div>
      </div>
    </section>
  )
}
