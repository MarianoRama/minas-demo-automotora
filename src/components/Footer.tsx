import { AUTOR } from '../config'
import { useDatos } from '../data/store'

export default function Footer() {
  const { negocio } = useDatos()
  const linkAutor = `https://wa.me/${AUTOR.whatsapp}?text=${encodeURIComponent(
    `Hola ${AUTOR.nombre}, vi el sitio demo de ${negocio.nombre} y quiero una página así para mi negocio.`,
  )}`

  return (
    <footer className="bg-tinta-2 py-10 text-hueso/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-hueso">{negocio.nombre}</p>
          <p className="mt-1 text-sm">{negocio.direccion}</p>
        </div>

        <div className="text-sm">
          <p>Tel: {negocio.whatsapp}</p>
          <p className="mt-1">{negocio.email}</p>
        </div>

        <nav aria-label="Secciones" className="text-sm">
          <ul className="space-y-1">
            <li><a href="#catalogo" className="hover:text-senal">Catálogo</a></li>
            <li><a href="#financiacion" className="hover:text-senal">Financiación</a></li>
            <li><a href="#vender" className="hover:text-senal">Vendé tu auto</a></li>
            <li><a href="#contacto" className="hover:text-senal">Ubicación</a></li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-hueso/10 px-4 pb-20 pt-6 text-xs sm:px-6 sm:pb-6">
        <p>
          © {new Date().getFullYear()} {negocio.nombre}. Sitio de demostración: negocio
          ficticio creado como muestra de portafolio.
        </p>
        <p className="mt-2">
          Sitio demo por {AUTOR.nombre}: {AUTOR.texto}. ¿Querés una página así para tu
          negocio?{' '}
          <a
            href={linkAutor}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-senal underline underline-offset-2 hover:text-hueso"
          >
            Escribime
          </a>
          .{' '}
          <a href="#/admin" className="underline underline-offset-2 hover:text-hueso">
            Administrar sitio
          </a>
        </p>
      </div>
    </footer>
  )
}
