export default function Hero() {
  return (
    <section id="inicio" className="motor-hero">
      <img
        src="/minas-demo-automotora/vehiculos/20043212.jpg"
        alt="Nissan Kicks en ruta arbolada, fotografía ilustrativa"
        fetchPriority="high"
      />
      <div className="motor-hero-shade" />
      <div className="motor-wrap motor-hero-copy">
        <p className="motor-eyebrow">PEREYRA AUTOMOTORES · MINAS</p>
        <h1>
          Tu próximo auto.
          <br />
          <em>Bien elegido.</em>
        </h1>
        <p>
          Compará precios, kilómetros y años.
          <br />
          Encontrá el que va con vos.
        </p>
        <div className="motor-actions">
          <a className="motor-primary" href="#catalogo">
            Explorar vehículos ↗
          </a>
          <a className="motor-outline" href="#vender">
            Quiero vender mi auto
          </a>
        </div>
      </div>
      <span className="motor-photo-credit">
        Fotografía ilustrativa · Allan Carvalho / Pexels
      </span>
    </section>
  );
}
