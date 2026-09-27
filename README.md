# Pereyra Automotores — Demo de portafolio

Este proyecto es una **demo de portafolio**, no un sitio real. Fue armado como
ejemplo para mostrarle a dueños de automotoras (venta de autos usados) en
Minas, Uruguay, qué tipo de sitio se les puede ofrecer como freelancer.
El nombre "Pereyra Automotores", los autos, precios, teléfono, dirección y
demás datos son **ficticios**.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin `@tailwindcss/vite`)
- Tipografías self-hosted con `@fontsource-variable/archivo` (display) y
  `@fontsource-variable/inter` (texto)
- [`lucide-react`](https://lucide.dev/) para iconos

## Identidad visual

- **Paleta**: blanco hueso, azul tinta profundo y naranja señal como acento
  cálido (referencia a la cartelería vial de Ruta 8).
- **Tipografía**: Archivo (display, bien ancha y pesada) + Inter (texto),
  con números tabulares para precios y kilometraje.
- Los autos se ilustran con SVG propios de perfil lateral, parametrizados
  por carrocería (hatchback, sedán, SUV, pickup) y pintados del color de
  cada unidad — no hay fotos de stock ni placeholders genéricos.

## Secciones incluidas

- Header con navegación y CTA de contacto
- Hero con buscador rápido (marca / tipo / precio), auto destacado y
  contador en vivo de unidades disponibles
- Catálogo agrupado (Destacados, Recién ingresados, Automáticos y
  eléctricos) en carruseles horizontales + catálogo completo filtrable por
  carrocería, marca, precio y búsqueda de texto, con orden configurable
- Ficha de detalle (modal) con características, especificaciones técnicas,
  WhatsApp, coordinar visita y compartir (Web Share API con fallback a
  copiar el link)
- Simulador de financiación (entrega + plazo, tasa de ejemplo marcada como
  ilustrativa)
- Formulario "Vendé o entregá tu auto" que arma un mensaje de WhatsApp
- Sección de confianza (revisión, garantía, trámites, permuta) sin clichés
- Cinta de marcas aliadas (financieras/aseguradoras ficticias) con scroll
  infinito
- Ubicación (mapa embebido de Minas, Uruguay) y horarios
- Botón flotante de WhatsApp
- Footer con crédito del autor

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (por defecto `http://localhost:5173`).

Para generar el build de producción:

```bash
npm run build
npm run preview
```

## Cómo cambiar los datos del negocio

- **Datos generales** (nombre, WhatsApp, dirección, email, año de
  fundación): `src/config.ts`, objeto `NEGOCIO`.
- **Crédito del autor** (para reutilizar esta demo con otro cliente):
  también en `src/config.ts`, objeto `AUTOR`.
- **Stock de autos**: `src/data/cars.ts`. Cada auto tiene un campo
  opcional `foto?: string` — si se completa con una URL o ruta local, se
  muestra esa foto en vez de la ilustración SVG generada.

## Deploy

- **Vercel**: importar el repositorio, framework detectado automáticamente
  como Vite. No requiere configuración adicional.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages / subcarpetas**: ya está configurado `base: './'` en
  `vite.config.ts`, así que el build funciona sirviéndose desde cualquier
  subcarpeta.
