# Pereyra Automotores — Demo de portafolio

## Carga del inventario

El inventario se mantiene en `src/data/cars.json`. El panel de ejemplo en `/admin` usa Decap CMS
para editar ese JSON y subir fotos a `public/uploads`. Las unidades en borrador no aparecen en el sitio.

El panel apunta al repositorio GitHub de este ejemplo. El inicio de sesión queda pendiente:
hay que publicar el sitio, elegir y configurar un proveedor OAuth del lado servidor, y otorgar
permisos GitHub al editor. No guardes contraseñas ni claves privadas en el código. Con el
backend GitHub, quien edita necesita permiso de escritura en el repositorio. Consultá la
[guía oficial de Decap para GitHub](https://decapcms.org/docs/github-backend/).

El contacto no está configurado: el sitio permite copiar la consulta en vez de abrir un número
ficticio. Para configurarlo, definí `VITE_WHATSAPP_NUMBER` con el teléfono completo en formato
internacional. Si la variable queda vacía, no se crea ningún enlace externo de WhatsApp.

Este proyecto es una **demo de portafolio**, no un sitio real. "Pereyra Automotores" es el
nombre de marca solicitado para la muestra; no representa ni atribuye afirmaciones a una empresa
real. Los vehículos, precios y dirección también son ejemplos. La única foto de auto incluida
es ilustrativa y no corresponde a los anuncios de la demo; las demás fichas muestran “Foto pendiente”.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin `@tailwindcss/vite`)

## Secciones incluidas

- Header con logo y navegación
- Ficha de auto ilustrativa en portada, búsqueda por marca/modelo y filtro por tipo
- Catálogo con estado disponible/vendido y fichas borrador ocultas
- Formulario "Vendé tu auto" sin backend ni registro de datos
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
