import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { autosPublicados, type Auto } from "../data/cars";
import { WhatsAppAction } from "./WhatsAppAction";
const money = (n: number) => `US$ ${n.toLocaleString("es-UY")}`;
const num = (n: number) => n.toLocaleString("es-UY");
const initial = {
  query: "",
  marca: "",
  tipo: "",
  min: "",
  max: "",
  desde: "",
  hasta: "",
  km: "",
  disponibles: true,
  favoritos: false,
};
type Filters = typeof initial;
type PageItem = number | "ellipsis";
function pageItems(pageCount: number, current: number): PageItem[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const numbers = [...new Set([1, pageCount, current - 1, current, current + 1])]
    .filter((number) => number >= 1 && number <= pageCount)
    .sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;
  for (const number of numbers) {
    if (number - previous === 2) items.push(previous + 1);
    else if (number - previous > 2) items.push("ellipsis");
    items.push(number);
    previous = number;
  }
  return items;
}
function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d.close();
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="motor-dialog"
      aria-label={title}
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="motor-dialog-head">
        <h2>{title}</h2>
        <button autoFocus onClick={close} aria-label="Cerrar">
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
function VehicleDetail({ auto }: { auto: Auto }) {
  const [photo, setPhoto] = useState(0);
  return (
    <div className="motor-detail">
      <div>
        <img
          className="motor-detail-photo"
          src={auto.imagenes[photo]}
          alt={`${auto.marca} ${auto.modelo}, imagen de referencia`}
        />
        {auto.imagenes.length > 1 && (
          <div className="motor-thumbs">
            {auto.imagenes.map((url, i) => (
              <button
                key={url}
                onClick={() => setPhoto(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={photo === i}
              >
                <img src={url} alt="" />
              </button>
            ))}
          </div>
        )}
        <p className="motor-note">
          Fotos de referencia. Datos y precios de ejemplo; no representan una
          unidad a la venta.
        </p>
      </div>
      <div>
        <span className="motor-tag">{auto.estado}</span>
        <p className="motor-detail-price">{money(auto.precio)}</p>
        <dl className="motor-specs">
          {[
            ["Marca", auto.marca],
            ["Modelo", auto.modelo],
            ["Año", auto.anio],
            ["Kilometraje", `${num(auto.km)} km`],
            ["Carrocería", auto.tipo],
            ["Ubicación", "Minas, Lavalleja"],
          ].map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <h3>Coordiná una visita</h3>
        <p>
          Consultá por esta unidad, pedí más información o contanos si tenés un
          vehículo para entregar.
        </p>
        <WhatsAppAction
          label={`Consultar ficha de ${auto.marca} ${auto.modelo}`}
          message={`Hola, me interesa ${auto.marca} ${auto.modelo}, año ${auto.anio}, ${num(auto.km)} km, publicado a ${money(auto.precio)}. Quisiera confirmar disponibilidad y coordinar una visita.`}
          className="motor-primary motor-full"
        >
          Consultar por este vehículo
        </WhatsAppAction>
        <p className="motor-note">
          En esta demo podés copiar la consulta. El envío se habilita con el
          contacto de la automotora.
        </p>
      </div>
    </div>
  );
}
export default function Catalogo() {
  const pageSize = 6;
  const [f, setF] = useState<Filters>(initial);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recientes");
  const [filtersOpen, setFiltersOpen] = useState(
    () => window.matchMedia("(min-width: 761px)").matches,
  );
  const [saved, setSaved] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [detail, setDetail] = useState<Auto | null>(null);
  const [comparison, setComparison] = useState(false);
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setF((old) => ({ ...old, [key]: value }));
    setPage(1);
  };
  const invalidPrice = f.min !== "" && f.max !== "" && +f.min > +f.max;
  const invalidYear = f.desde !== "" && f.hasta !== "" && +f.desde > +f.hasta;
  const filtered = useMemo(
    () =>
      autosPublicados
        .filter(
          (a) =>
            (!f.disponibles || a.estado === "Disponible") &&
            (!f.favoritos || saved.includes(a.id)) &&
            `${a.marca} ${a.modelo}`
              .toLocaleLowerCase("es-UY")
              .includes(f.query.trim().toLocaleLowerCase("es-UY")) &&
            (!f.marca || a.marca === f.marca) &&
            (!f.tipo || a.tipo === f.tipo) &&
            (f.min === "" || a.precio >= +f.min) &&
            (f.max === "" || a.precio <= +f.max) &&
            (f.desde === "" || a.anio >= +f.desde) &&
            (f.hasta === "" || a.anio <= +f.hasta) &&
            (f.km === "" || a.km <= +f.km),
        )
        .sort((a, b) =>
          sort === "precio-asc"
            ? a.precio - b.precio
            : sort === "precio-desc"
              ? b.precio - a.precio
              : sort === "km"
                ? a.km - b.km
                : b.anio - a.anio,
        ),
    [f, sort, saved],
  );
  const selected = autosPublicados.filter((a) => compare.includes(a.id));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const firstVisible = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(page * pageSize, filtered.length);
  const pageAutos = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);
  const numeric = (
    key: "min" | "max" | "desde" | "hasta" | "km",
    label: string,
    placeholder: string,
  ) => (
    <label>
      {label}
      <input
        type="number"
        min="0"
        step="1"
        value={f[key]}
        placeholder={placeholder}
        onChange={(e) => update(key, e.target.value)}
      />
    </label>
  );
  return (
    <section id="catalogo" className="motor-catalog">
      <div className="motor-wrap">
        <div className="motor-section-heading">
          <div>
            <p className="motor-eyebrow">BUSCÁ. COMPARÁ. ELEGÍ.</p>
            <h2>Encontrá tu próximo vehículo</h2>
          </div>
          <p>
            Inventario de demostración
            <br />
            Fotos y precios ilustrativos
          </p>
        </div>
        <div className="motor-catalog-layout">
          <aside className="motor-filter-panel">
            <details
              open={filtersOpen}
              onToggle={(e) => setFiltersOpen(e.currentTarget.open)}
            >
              <summary>
                Filtros <span>Afiná tu búsqueda</span>
              </summary>
              <div className="motor-filter-fields">
                <label>
                  Marca
                  <select
                    value={f.marca}
                    onChange={(e) => update("marca", e.target.value)}
                  >
                    <option value="">Todas las marcas</option>
                    {[...new Set(autosPublicados.map((a) => a.marca))]
                      .sort()
                      .map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                  </select>
                </label>
                <label>
                  Carrocería
                  <select
                    value={f.tipo}
                    onChange={(e) => update("tipo", e.target.value)}
                  >
                    <option value="">Todas las carrocerías</option>
                    {["Sedán", "SUV", "Pick-up"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend>Precio en dólares</legend>
                  <div className="motor-range">
                    {numeric("min", "Desde US$", "Sin mínimo")}
                    {numeric("max", "Hasta US$", "Sin máximo")}
                  </div>
                </fieldset>
                {invalidPrice && (
                  <p role="alert" className="motor-error">
                    El precio mínimo supera al máximo.
                  </p>
                )}
                <fieldset>
                  <legend>Año</legend>
                  <div className="motor-range">
                    {numeric("desde", "Desde el año", "Cualquiera")}
                    {numeric("hasta", "Hasta el año", "Cualquiera")}
                  </div>
                </fieldset>
                {invalidYear && (
                  <p role="alert" className="motor-error">
                    El año inicial supera al final.
                  </p>
                )}
                {numeric("km", "Kilómetros máximos", "Sin límite")}
                <label className="motor-check">
                  <input
                    type="checkbox"
                    checked={f.disponibles}
                    onChange={(e) => update("disponibles", e.target.checked)}
                  />
                  Solo disponibles
                </label>
                <label className="motor-check">
                  <input
                    type="checkbox"
                    checked={f.favoritos}
                    onChange={(e) => update("favoritos", e.target.checked)}
                  />
                  Mis favoritos ({saved.length})
                </label>
                <button
                  className="motor-clear"
                  onClick={() => {
                    setF(initial);
                    setSort("recientes");
                    setPage(1);
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </details>
          </aside>
          <div className="motor-results">
            <label className="motor-search">
              <span className="sr-only">Buscar por marca o modelo</span>
              <input
                id="buscar-auto"
                type="search"
                value={f.query}
                onChange={(e) => update("query", e.target.value)}
                placeholder="Buscar por marca o modelo…"
              />
              <span aria-hidden="true">⌕</span>
            </label>
            <div className="motor-results-toolbar">
              <p aria-live="polite">
                <strong>{filtered.length ? `${firstVisible}–${lastVisible} de ${filtered.length}` : "0"}</strong>{" "}
                {filtered.length === 1 ? "vehículo" : "vehículos"}
              </p>
              <label>
                Ordenar
                <select
                  aria-label="Ordenar"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                >
                  <option value="recientes">Más nuevos</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="km">Menos kilómetros</option>
                </select>
              </label>
            </div>
            <div className="motor-grid">
              {pageAutos.map((a) => (
                <article
                  key={a.id}
                  className="motor-card"
                  data-price={a.precio}
                  data-year={a.anio}
                  data-km={a.km}
                >
                  <div className="motor-card-photo">
                    <button
                      className="motor-photo-open"
                      onClick={() => setDetail(a)}
                      aria-label={`Ver ficha de ${a.marca} ${a.modelo}`}
                    >
                      <img
                        src={a.imagenes[0]}
                        alt={`${a.marca} ${a.modelo}, foto de referencia`}
                        loading="lazy"
                      />
                    </button>
                    <span className="motor-card-type">{a.tipo}</span>
                    <button
                      className="motor-save"
                      aria-label={`Guardar ${a.marca} ${a.modelo}`}
                      aria-pressed={saved.includes(a.id)}
                      onClick={() =>
                        setSaved((old) =>
                          old.includes(a.id)
                            ? old.filter((id) => id !== a.id)
                            : [...old, a.id],
                        )
                      }
                    >
                      {saved.includes(a.id) ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="motor-card-body">
                    <p className="motor-card-brand">
                      {a.marca}
                      <span>{a.estado}</span>
                    </p>
                    <h3>
                      <button onClick={() => setDetail(a)}>{a.modelo}</button>
                    </h3>
                    <p className="motor-card-meta">
                      {a.anio}
                      <span>·</span>
                      {num(a.km)} km
                    </p>
                    <p className="motor-card-price">{money(a.precio)}</p>
                    <div className="motor-card-bottom">
                      <button
                        className="motor-detail-button"
                        onClick={() => setDetail(a)}
                      >
                        Ver ficha ↗
                      </button>
                      <label className="motor-check">
                        <input
                          type="checkbox"
                          checked={compare.includes(a.id)}
                          disabled={
                            compare.length >= 3 && !compare.includes(a.id)
                          }
                          onChange={(e) =>
                            setCompare((old) =>
                              e.target.checked
                                ? [...old, a.id]
                                : old.filter((id) => id !== a.id),
                            )
                          }
                        />
                        Comparar
                      </label>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="motor-pagination" aria-label="Paginación del catálogo de vehículos">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Página anterior">Anterior</button>
                <div className="motor-page-numbers" aria-label="Páginas">
                  {pageItems(pageCount, page).map((item, index) => item === "ellipsis"
                    ? <span key={`ellipsis-${index}`} aria-hidden="true">…</span>
                    : <button key={item} type="button" onClick={() => setPage(item)} aria-label={`Página ${item}`} aria-current={page === item ? "page" : undefined}>{item}</button>)}
                </div>
                <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label="Página siguiente">Siguiente</button>
              </nav>
            )}
            {filtered.length === 0 && (
              <div className="motor-empty">
                <h3>No hay vehículos con esa combinación.</h3>
                <p>Probá ampliar el precio, el año o el kilometraje.</p>
                <button className="motor-primary" onClick={() => { setF(initial); setPage(1); }}>
                  Ver todos los vehículos
                </button>
              </div>
            )}
          </div>
        </div>
        {compare.length > 0 && (
          <div className="motor-compare-bar">
            <p>
              <strong>{compare.length}/3</strong> para comparar{" "}
              <span>{selected.map((a) => a.modelo).join(" · ")}</span>
            </p>
            <button
              className="motor-primary"
              disabled={compare.length < 2}
              onClick={() => setComparison(true)}
            >
              Comparar vehículos
            </button>
            <button className="motor-clear" onClick={() => setCompare([])}>
              Vaciar
            </button>
          </div>
        )}
        {detail && (
          <Modal
            title={`${detail.marca} ${detail.modelo}`}
            close={() => setDetail(null)}
          >
            <VehicleDetail auto={detail} />
          </Modal>
        )}
        {comparison && (
          <Modal
            title="Compará tus opciones"
            close={() => setComparison(false)}
          >
            <div className="motor-comparison">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Vehículo</th>
                    {selected.map((a) => (
                      <th scope="col" key={a.id}>
                        {a.marca}
                        <br />
                        {a.modelo}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Precio", ...selected.map((a) => money(a.precio))],
                    ["Año", ...selected.map((a) => a.anio)],
                    ["Kilómetros", ...selected.map((a) => `${num(a.km)} km`)],
                    ["Carrocería", ...selected.map((a) => a.tipo)],
                    ["Estado", ...selected.map((a) => a.estado)],
                  ].map(([title, ...cells]) => (
                    <tr key={title}>
                      <th scope="row">{title}</th>
                      {cells.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="motor-note">
                Comparación de unidades de ejemplo. Confirmá los datos con el
                vendedor antes de decidir.
              </p>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
}
