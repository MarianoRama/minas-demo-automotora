# Pereyra Automotores — Demo de portafolio

Este proyecto es una **demo de portafolio**, no un sitio real. Fue armado como
ejemplo para mostrarle a dueños de automotoras (venta de autos usados) en
Minas, Uruguay, qué tipo de sitio se les puede ofrecer como freelancer.
El nombre "Pereyra Automotores", los autos, precios, teléfono, dirección y
demás datos son **ficticios**.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin `@tailwindcss/vite`)
- Tipografías self-hosted: `@fontsource-variable/archivo` (display),
  `@fontsource-variable/inter` (texto) y `@fontsource/permanent-marker`
  (cartel de parabrisas, uso puntual)
- [`lucide-react`](https://lucide.dev/) para iconos

## Identidad visual

- **Paleta**: blanco hueso, azul tinta profundo y naranja señal como acento
  cálido (referencia a la cartelería vial de Ruta 8).
- **Tipografía**: Archivo (display) + Inter (texto), con números tabulares
  para precios y kilometraje, y Permanent Marker solo para el cartel de
  parabrisas ("Único dueño", "4x4 real", etc.).
- Los autos se ilustran con SVG propios de perfil lateral, parametrizados
  por carrocería y color. Si un auto tiene foto cargada, se usa esa foto en
  vez de la ilustración.
- Los autos Reservados o Vendidos muestran un sello cruzado sobre la
  imagen, como en el vidrio de una automotora real.

## Secciones del sitio público

- Header, Hero con buscador rápido y aviso destacado del home
- Catálogo único, paginado (9 por página en desktop, 6 en mobile), con
  filtros por carrocería, marca, combustible, caja, precio, año, kilometraje
  y chips rápidos (Destacados, Recién ingresados, Eléctricos e híbridos,
  Financiables). En mobile los filtros están en un panel deslizable.
- Ficha de detalle (modal), simulador de financiación, formulario para
  vender el auto, sección de confianza, cinta de marcas aliadas, ubicación
  con mapa y horarios, botón de WhatsApp

## Panel de administración (`#/admin`)

Pensado para que el dueño del negocio edite el sitio desde el celular, sin
tocar código:

- Acceso con PIN de demostración: **1234** (se guarda en `sessionStorage`).
  En un sitio real, el acceso se hace con la cuenta de Google del dueño (si
  los datos viven en una planilla) o con un login de verdad (por ejemplo,
  Supabase).
- Alta, edición, duplicado y baja de autos, con carga de foto desde el
  celular o la PC (se redimensiona sola a 1200px, JPEG calidad ~0.75).
- Estados con un toque: Disponible / Reservado / Vendido, y marca de
  Destacado.
- Edición de los datos del negocio: WhatsApp, dirección, horarios, aviso
  del home y tasa del simulador de financiación.
- Descargar copia (JSON), cargar copia y volver a los datos de ejemplo.

Todo se guarda en `localStorage` bajo la clave
`minas-demo-automotora.datos.v1`. Si el navegador no puede guardar (modo
privado, memoria llena), el panel avisa y el sitio sigue funcionando con lo
que haya en memoria.

### Arquitectura de datos

- `src/data/store.tsx`: `DatosProvider` + hook `useDatos()`. Todo el sitio
  público y el panel leen de acá, nunca importan `src/data/cars.ts`
  directamente.
- `src/data/cars.ts`: datos de ejemplo (autos ficticios).
- `src/config.ts`: datos de ejemplo del negocio, autor de la demo y la
  fuente de datos (`FUENTE_DATOS`).

### Conectar una planilla de Google (para un cliente real)

En `src/config.ts`, cambiá:

```ts
export const FUENTE_DATOS: FuenteDatos = { tipo: 'sheets', csvUrl: 'https://docs.google.com/.../pub?output=csv' }
```

La planilla (Archivo → Compartir → Publicar en la Web → CSV) debe tener
estas columnas en la primera fila:

```
id,marca,modelo,version,anio,km,precio,tipo,combustible,caja,color,colorNombre,etiqueta,destacado,estado,descripcion,caracteristicas,motor,potenciaHp,traccion,puertas,pasajeros,foto
```

- `tipo`: Hatchback / Sedán / SUV / Pickup
- `combustible`: Nafta / Diésel / Híbrido / Eléctrico
- `caja`: Manual / Automática
- `traccion`: Delantera / Trasera / 4x4
- `estado`: Disponible / Reservado / Vendido
- `destacado`: si / no
- `caracteristicas`: separadas por `|` (ej: `Aire acondicionado|Bluetooth`)
- `foto`: URL de una imagen (opcional)

Cuando la fuente es `sheets`, el panel deja de mostrar el formulario de
autos y en cambio explica que esos datos se editan en la planilla. Los
"Datos del negocio" del panel siguen editándose siempre desde acá, aunque
los autos vengan de una planilla.

El parser de CSV (`src/data/parseCsv.ts`) soporta comillas y comas dentro
de los campos. Se puede probar con:

```bash
node --experimental-strip-types <(cat <<'EOF'
import { csvARegistros } from './src/data/parseCsv.ts'
console.log(csvARegistros('a,b\n1,"2, con coma"'))
EOF
)
```

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

## Cómo cambiar los datos del negocio o las fotos

- **Desde el panel** (`#/admin`, PIN 1234): la forma pensada para el dueño
  del negocio. No requiere tocar código.
- **Datos de ejemplo por código**: `src/data/cars.ts` (stock) y
  `src/config.ts` (negocio, autor de la demo). Estos son los valores por
  defecto y los que vuelven al usar "Volver a datos de ejemplo" en el panel.

## Deploy

- **Vercel**: importar el repositorio, framework detectado automáticamente
  como Vite. No requiere configuración adicional.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages / subcarpetas**: ya está configurado `base: './'` en
  `vite.config.ts`, así que el build funciona sirviéndose desde cualquier
  subcarpeta. El ruteo del panel usa hash (`#/admin`), así que no hace
  falta configurar el servidor para rutas del lado del cliente.
