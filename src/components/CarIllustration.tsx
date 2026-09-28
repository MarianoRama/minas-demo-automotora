import { useId } from 'react'
import type { TipoCarroceria } from '../data/cars'

interface Props {
  tipo: TipoCarroceria
  color: string
  className?: string
  titulo?: string
}

const GROUND = 172

function shade(hex: string, amount: number) {
  const c = hex.replace('#', '')
  const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  const f = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  r = Math.round(r + (f - r) * p)
  g = Math.round(g + (f - g) * p)
  b = Math.round(b + (f - b) * p)
  return `rgb(${r}, ${g}, ${b})`
}

/** Hueco de rueda: semicírculo que se recorre de adelante hacia atrás (derecha → izquierda). */
function arch(cx: number, y: number, r: number) {
  return `L${cx + r},${y} A${r},${r} 0 0 0 ${cx - r},${y}`
}

interface Silueta {
  /** Contorno de la carrocería (auto mirando a la derecha). */
  body: string
  /** Superficie vidriada lateral. */
  glass: string
  /** Parantes que dividen el vidrio (se pintan del color de la carrocería). */
  pillars: string[]
  /** Líneas de puertas. */
  doors: string[]
  /** Línea de cintura / pliegue lateral. */
  crease: string
  wheels: { cx: number; r: number }[]
  rockerY: number
  archR: number
  headlight: string
  taillight: string
  mirror: string
  handles: { x: number; y: number }[]
  /** Parte baja en plástico negro (SUV / pickup). */
  cladding?: boolean
  extra?: 'rack' | 'bed'
}

function silueta(tipo: TipoCarroceria): Silueta {
  switch (tipo) {
    case 'Hatchback': {
      const w = [{ cx: 112, r: 27 }, { cx: 292, r: 27 }]
      const y = 150
      const R = 35
      return {
        wheels: w,
        rockerY: y,
        archR: R,
        body: `M54,${y} C48,${y} 44,146 44,138 L44,112
          C44,105 46,99 50,94 L60,80 C64,74 70,70 80,68
          C110,62 150,59 192,59 L216,59
          C238,61 252,70 276,96 C304,99 328,104 344,111
          C354,116 359,123 359,131 L358,142 C357,147 353,${y} 347,${y}
          ${arch(w[1].cx, y, R)} ${arch(w[0].cx, y, R)} Z`,
        glass: `M60,95 L67,84 C71,77 78,73 88,71 C116,66 152,64 192,64 L214,64
          C230,65 242,74 262,97 Z`,
        pillars: ['M86,95 L98,70 L120,66 L112,96 Z', 'M184,99 L186,65 L194,65 L193,99 Z'],
        doors: ['M189,100 L188,146', 'M272,100 C270,118 268,132 262,146', 'M114,100 C114,116 116,124 120,132'],
        crease: 'M46,116 C140,110 250,110 352,118',
        headlight: 'M340,110 C350,113 357,118 359,124 L346,124 C341,121 338,116 340,110 Z',
        taillight: 'M44,100 L55,99 L55,114 L44,115 Z',
        mirror: 'M264,95 C266,89 272,86 280,87 L281,95 Z',
        handles: [{ x: 156, y: 108 }, { x: 236, y: 108 }],
      }
    }
    case 'Sedán': {
      const w = [{ cx: 98, r: 27 }, { cx: 302, r: 27 }]
      const y = 150
      const R = 35
      return {
        wheels: w,
        rockerY: y,
        archR: R,
        body: `M34,${y} C28,${y} 24,146 24,138 L24,121
          C24,111 29,105 40,103 L114,98
          C136,82 158,68 188,64 L236,63
          C256,64 270,73 292,97 C322,100 346,104 363,111
          C372,115 377,122 377,130 L376,142 C375,147 371,${y} 365,${y}
          ${arch(w[1].cx, y, R)} ${arch(w[0].cx, y, R)} Z`,
        glass: `M126,98 C146,84 164,72 190,69 L234,68
          C250,69 262,77 280,96 Z`,
        pillars: ['M126,98 L150,82 L160,82 L146,98 Z', 'M204,98 L205,68 L213,68 L212,98 Z'],
        doors: ['M208,99 L207,147', 'M286,99 C284,118 280,134 272,146', 'M136,99 C134,116 132,128 132,140'],
        crease: 'M26,114 C140,108 260,108 370,117',
        headlight: 'M356,110 C366,113 373,118 376,124 L362,124 C357,121 354,116 356,110 Z',
        taillight: 'M24,106 L40,104 L40,115 L24,117 Z',
        mirror: 'M280,95 C282,89 288,86 296,87 L297,95 Z',
        handles: [{ x: 176, y: 107 }, { x: 250, y: 107 }],
      }
    }
    case 'SUV': {
      const w = [{ cx: 108, r: 29 }, { cx: 302, r: 29 }]
      const y = 146
      const R = 37
      return {
        wheels: w,
        rockerY: y,
        archR: R,
        cladding: true,
        extra: 'rack',
        body: `M44,${y} C38,${y} 34,142 34,134 L34,96
          C34,78 39,65 52,58 C72,52 110,50 160,50 L234,50
          C254,51 268,60 290,88 C318,92 342,97 358,104
          C367,109 371,117 371,127 L370,138 C369,143 365,${y} 359,${y}
          ${arch(w[1].cx, y, R)} ${arch(w[0].cx, y, R)} Z`,
        glass: `M48,91 C48,78 54,67 66,62 C92,57 128,56 162,56 L232,56
          C248,57 260,65 278,88 Z`,
        pillars: ['M100,90 L112,57 L132,57 L124,90 Z', 'M196,89 L198,56 L207,56 L206,89 Z'],
        doors: ['M201,90 L200,132', 'M282,90 C280,106 276,120 270,132', 'M128,90 C128,106 130,118 134,128'],
        crease: 'M36,106 C140,100 260,100 364,110',
        headlight: 'M350,102 C360,105 368,110 371,117 L356,117 C351,114 348,109 350,102 Z',
        taillight: 'M34,92 L46,91 L46,106 L34,107 Z',
        mirror: 'M280,87 C282,81 288,78 296,79 L297,87 Z',
        handles: [{ x: 168, y: 100 }, { x: 246, y: 100 }],
      }
    }
    case 'Pickup': {
      const w = [{ cx: 96, r: 29 }, { cx: 306, r: 29 }]
      const y = 146
      const R = 37
      return {
        wheels: w,
        rockerY: y,
        archR: R,
        cladding: true,
        extra: 'bed',
        body: `M28,${y} C22,${y} 20,142 20,136 L20,94 C20,90 22,88 26,88
          L186,88 L187,68 C188,58 196,52 208,52 L258,52
          C274,53 286,62 306,88 C332,91 354,95 367,101
          C375,106 378,114 378,124 L377,138 C376,143 372,${y} 366,${y}
          ${arch(w[1].cx, y, R)} ${arch(w[0].cx, y, R)} Z`,
        glass: `M194,87 L194,68 C195,61 200,58 210,58 L256,58
          C270,59 280,67 296,87 Z`,
        pillars: ['M238,87 L239,58 L247,58 L246,87 Z'],
        doors: ['M191,90 L191,134', 'M242,90 L241,134', 'M300,90 C298,106 292,122 284,134'],
        crease: 'M22,104 C140,99 260,99 372,108',
        headlight: 'M354,99 C364,102 372,107 377,114 L360,114 C355,111 352,105 354,99 Z',
        taillight: 'M20,94 L30,94 L30,110 L20,110 Z',
        mirror: 'M296,86 C298,80 304,77 312,78 L313,86 Z',
        handles: [{ x: 214, y: 98 }, { x: 266, y: 98 }],
      }
    }
  }
}

function Wheel({ cx, r, uid }: { cx: number; r: number; uid: string }) {
  const cy = GROUND - r
  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * r * 0.16}
        y1={cy + Math.sin(a) * r * 0.16}
        x2={cx + Math.cos(a) * r * 0.6}
        y2={cy + Math.sin(a) * r * 0.6}
        stroke={`url(#rim-${uid})`}
        strokeWidth={r * 0.2}
        strokeLinecap="round"
      />
    )
  })
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#161a20" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke="#262b33" strokeWidth={r * 0.05} />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="#2b313a" />
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#565e69" />
      {spokes}
      <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke="#c4cad2" strokeWidth={r * 0.07} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#8d96a1" stroke="#3a414b" strokeWidth="1" />
    </g>
  )
}

/**
 * Ilustración vectorial de perfil lateral, parametrizada por carrocería y color.
 * No usa fotos: cada auto tiene un campo `foto` opcional que la reemplaza.
 */
export default function CarIllustration({ tipo, color, className, titulo }: Props) {
  const uid = useId().replace(/:/g, '')
  const s = silueta(tipo)
  const light = shade(color, 0.3)
  const dark = shade(color, -0.35)
  const outline = shade(color, -0.55)

  return (
    <svg
      viewBox="0 0 400 190"
      className={className}
      role="img"
      aria-label={titulo ?? `Ilustración de ${tipo.toLowerCase()}`}
    >
      <defs>
        <linearGradient id={`paint-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b4d63" />
          <stop offset="100%" stopColor="#141c27" />
        </linearGradient>
        <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef1f4" />
          <stop offset="100%" stopColor="#a9b1bb" />
        </linearGradient>
        <radialGradient id={`shadow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" stopOpacity="0.32" />
          <stop offset="70%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`bodyclip-${uid}`}>
          <path d={s.body} />
        </clipPath>
        <clipPath id={`glassclip-${uid}`}>
          <path d={s.glass} />
        </clipPath>
      </defs>

      {/* sombra en el piso */}
      <ellipse cx="200" cy={GROUND + 1} rx="190" ry="11" fill={`url(#shadow-${uid})`} />

      {/* interior oscuro de los pasos de rueda */}
      {s.wheels.map((w) => (
        <path
          key={`in-${w.cx}`}
          d={`M${w.cx - s.archR + 1},${s.rockerY} A${s.archR - 1},${s.archR - 1} 0 0 1 ${w.cx + s.archR - 1},${s.rockerY} Z`}
          fill="#0c0f14"
        />
      ))}

      {s.wheels.map((w) => (
        <Wheel key={w.cx} cx={w.cx} r={w.r} uid={uid} />
      ))}

      {/* carrocería */}
      <path d={s.body} fill={`url(#paint-${uid})`} />

      <g clipPath={`url(#bodyclip-${uid})`}>
        {/* reflejo en el hombro */}
        <path d={s.crease} stroke="#fff" strokeOpacity="0.28" strokeWidth="7" fill="none" transform="translate(0,-5)" />
        <path d={s.crease} stroke={outline} strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
        {/* zócalo inferior más oscuro */}
        <rect x="0" y={s.rockerY - 10} width="400" height="12" fill={dark} opacity="0.55" />
        {s.cladding && <rect x="0" y={s.rockerY - 14} width="400" height="16" fill="#23272e" />}
        {s.doors.map((d) => (
          <path key={d} d={d} stroke={outline} strokeOpacity="0.45" strokeWidth="1.2" fill="none" />
        ))}
      </g>

      {/* molduras de los pasos de rueda */}
      {s.wheels.map((w) => (
        <path
          key={`arch-${w.cx}`}
          d={`M${w.cx - s.archR},${s.rockerY} A${s.archR},${s.archR} 0 0 1 ${w.cx + s.archR},${s.rockerY}`}
          fill="none"
          stroke={s.cladding ? '#23272e' : outline}
          strokeWidth={s.cladding ? 6 : 1.5}
          strokeOpacity={s.cladding ? 1 : 0.6}
        />
      ))}

      {/* vidrios */}
      <path d={s.glass} fill={`url(#glass-${uid})`} />
      <g clipPath={`url(#glassclip-${uid})`}>
        <polygon points="150,0 196,0 150,190 104,190" fill="#fff" opacity="0.14" />
        <polygon points="206,0 218,0 172,190 160,190" fill="#fff" opacity="0.1" />
      </g>
      {s.pillars.map((p) => (
        <path key={p} d={p} fill="#11161e" />
      ))}

      {/* caja de la pickup */}
      {s.extra === 'bed' && (
        <g>
          <path d="M22,91 L185,91" stroke="#1b2029" strokeWidth="3" />
          <path d="M26,92 L26,132" stroke={outline} strokeOpacity="0.45" strokeWidth="1.2" />
          <path d="M150,88 L158,64 L186,64" fill="none" stroke="#1b2029" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="14" y="132" width="22" height="7" rx="2" fill="#2d333c" />
        </g>
      )}
      {/* barras de techo del SUV */}
      {s.extra === 'rack' && (
        <g fill="#1b2029">
          <rect x="84" y="45" width="150" height="3.5" rx="1.5" />
          <rect x="94" y="47" width="6" height="5" rx="1" />
          <rect x="218" y="47" width="6" height="5" rx="1" />
        </g>
      )}

      {/* ópticas, espejo, manijas */}
      <path d={s.headlight} fill="#fdf3d2" stroke={outline} strokeWidth="1" />
      <path d={s.taillight} fill="#b3261e" stroke={outline} strokeWidth="1" />
      <path d={s.mirror} fill={dark} />
      {s.handles.map((h) => (
        <rect key={h.x} x={h.x} y={h.y} width="14" height="3.5" rx="1.75" fill={outline} opacity="0.55" />
      ))}

      {/* contorno fino */}
      <path d={s.body} fill="none" stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
