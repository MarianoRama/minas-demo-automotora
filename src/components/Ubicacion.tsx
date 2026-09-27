const horarios = [
  { dia: 'Lunes a viernes', horario: '9:00 - 19:00' },
  { dia: 'Sábados', horario: '9:00 - 13:00' },
  { dia: 'Domingos', horario: 'Cerrado' },
]

export default function Ubicacion() {
  return (
    <section id="contacto" className="bg-slate-100 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dónde estamos
          </h2>
          <p className="mt-2 text-slate-600">
            Ruta 8 km 121, Minas, Lavalleja, Uruguay (dirección de ejemplo)
          </p>
          <div className="mt-6 overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200">
            <iframe
              title="Ubicación de Automotora Ruta 8 en Minas, Uruguay"
              src="https://www.google.com/maps?q=Minas,+Uruguay&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-900">Horarios</h3>
          <ul className="mt-4 divide-y divide-slate-200 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            {horarios.map((item) => (
              <li
                key={item.dia}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-700">{item.dia}</span>
                <span className="text-slate-500">{item.horario}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-blue-900 p-5 text-white">
            <p className="text-sm text-blue-200">¿Preferís hablar directo?</p>
            <p className="mt-1 text-lg font-semibold">+598 99 000 000</p>
            <p className="mt-1 text-sm text-blue-200">
              contacto@automotoraruta8.uy (ejemplo)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
