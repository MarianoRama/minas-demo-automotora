# Automotora Ruta 8 — Demo de portafolio

Este proyecto es una **demo de portafolio**, no un sitio real. Fue armado como
ejemplo para mostrarle a dueños de automotoras (venta de autos usados) en
Minas, Uruguay, qué tipo de landing page se les puede ofrecer como
freelancer. El nombre "Automotora Ruta 8", los autos, precios, teléfono,
dirección y demás datos son **ficticios**.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin `@tailwindcss/vite`)

## Secciones incluidas

- Header con logo y navegación
- Hero con ilustración SVG y CTA a catálogo
- Catálogo de autos con filtro por tipo (Sedán / SUV / Pick-up) usando
  `useState`
- Formulario "Vendé tu auto" (sin backend, solo simula el envío con
  `console.log` y un mensaje de confirmación)
- Botón flotante de WhatsApp
- Sección de ubicación (mapa embebido de Minas, Uruguay) y horarios
- Footer con contacto ficticio

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
