import type { TipoCarroceria } from '../data/cars'

interface Props {
  tipo: TipoCarroceria
  color: string
  className?: string
  titulo?: string
}

/**
 * Ilustración de perfil lateral, plana y duotono, parametrizada por
 * carrocería y color. No usa fotos: es un ícono de marca propio del sitio.
 */
export default function CarIllustration({ tipo, color, className, titulo }: Props) {
  const cfg = configPorTipo[tipo]
  const glass = 'rgba(18, 35, 63, 0.82)'
  const rocker = shade(color, -0.28)

  return (
    <svg
      viewBox="0 0 320 176"
      className={className}
      role="img"
      aria-label={titulo ?? `Ilustración de ${tipo.toLowerCase()}`}
    >
      {/* sombra de piso */}
      <ellipse cx="164" cy="152" rx="126" ry="9" fill="#12233F" opacity="0.14" />

      {/* carrocería */}
      <path d={cfg.body} fill={color} stroke="#12233F" strokeWidth="3" strokeLinejoin="round" />

      {/* zócalo (duotono, tono más oscuro del mismo color) */}
      <path d={cfg.rocker} fill={rocker} />

      {/* cabina / vidrios */}
      <path d={cfg.cabin} fill={color} stroke="#12233F" strokeWidth="3" strokeLinejoin="round" />
      <path d={cfg.glass} fill={glass} />

      {/* detalles: manija, paragolpes, caja (pickup) */}
      {cfg.extras.map((d, i) => (
        <path key={i} d={d} fill="#12233F" opacity="0.85" />
      ))}

      {/* ópticas */}
      <rect x={cfg.headlight.x} y={cfg.headlight.y} width="14" height="8" rx="2" fill="#F4C77A" />
      <rect x={cfg.taillight.x} y={cfg.taillight.y} width="10" height="8" rx="2" fill="#C24B2E" />

      {/* ruedas */}
      {cfg.wheels.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="140" r={cfg.wheelR} fill="#12233F" />
          <circle cx={cx} cy="140" r={cfg.wheelR - 8} fill="#D9D2C4" />
          <circle cx={cx} cy="140" r="3.5" fill="#12233F" />
        </g>
      ))}
    </svg>
  )
}

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

interface TipoConfig {
  body: string
  rocker: string
  cabin: string
  glass: string
  extras: string[]
  wheels: number[]
  wheelR: number
  headlight: { x: number; y: number }
  taillight: { x: number; y: number }
}

const configPorTipo: Record<TipoCarroceria, TipoConfig> = {
  Hatchback: {
    body: 'M40,132 L40,110 Q40,100 50,98 L262,98 Q276,98 280,112 L282,132 Z',
    rocker: 'M40,124 L282,124 L282,132 Q276,134 262,134 L58,134 Q42,134 40,124 Z',
    cabin: 'M96,98 L118,58 Q122,50 132,50 L206,50 Q216,50 220,60 L232,98 Z',
    glass: 'M104,92 L122,62 Q125,57 131,57 L203,57 Q210,57 213,63 L224,92 L182,92 L182,78 L142,78 L142,92 Z',
    extras: ['M40,116 L58,116 L58,120 L40,120 Z', 'M150,94 L164,94 L164,97 L150,97 Z'],
    wheels: [90, 232],
    wheelR: 24,
    headlight: { x: 264, y: 108 },
    taillight: { x: 44, y: 108 },
  },
  Sedán: {
    body: 'M32,132 L32,112 Q32,101 43,99 L272,99 Q286,99 288,114 L290,132 Z',
    rocker: 'M32,124 L290,124 L290,132 Q286,134 272,134 L50,134 Q34,134 32,124 Z',
    cabin: 'M88,99 L108,60 Q112,52 122,52 L198,52 Q206,52 210,60 L222,88 Q244,90 250,99 Z',
    glass: 'M96,93 L112,64 Q115,58 121,58 L195,58 Q201,58 204,64 L214,88 L176,88 L176,74 L134,74 L134,88 Z',
    extras: ['M32,116 L50,116 L50,120 L32,120 Z', 'M140,95 L154,95 L154,98 L140,98 Z'],
    wheels: [98, 246],
    wheelR: 24,
    headlight: { x: 272, y: 109 },
    taillight: { x: 36, y: 109 },
  },
  SUV: {
    body: 'M36,132 L36,102 Q36,90 48,88 L268,88 Q284,88 288,104 L290,132 Z',
    rocker: 'M36,122 L290,122 L290,132 Q284,134 268,134 L54,134 Q38,134 36,122 Z',
    cabin: 'M92,88 L106,48 Q109,40 118,40 L214,40 Q223,40 226,49 L236,88 Z',
    glass: 'M100,82 L112,53 Q115,47 121,47 L211,47 Q217,47 219,53 L228,82 L184,82 L184,66 L144,66 L144,82 Z',
    extras: ['M36,110 L58,110 L58,114 L36,114 Z', 'M154,84 L168,84 L168,87 L154,87 Z'],
    wheels: [94, 236],
    wheelR: 27,
    headlight: { x: 270, y: 100 },
    taillight: { x: 40, y: 100 },
  },
  Pickup: {
    body: 'M30,132 L30,108 Q30,97 41,95 L150,95 L150,120 L282,120 L286,132 Z M150,95 L150,120 L150,95 Z',
    rocker: 'M30,124 L286,124 L286,132 Q280,134 268,134 L48,134 Q32,134 30,124 Z',
    cabin: 'M84,95 L102,56 Q106,48 115,48 L140,48 Q148,48 150,58 L150,95 Z',
    glass: 'M92,89 L106,60 Q109,54 115,54 L138,54 Q143,54 144,60 L144,89 Z',
    extras: [
      'M150,102 L282,102 L282,108 L150,108 Z',
      'M30,116 L48,116 L48,120 L30,120 Z',
      'M158,98 L172,98 L172,101 L158,101 Z',
    ],
    wheels: [80, 250],
    wheelR: 27,
    headlight: { x: 264, y: 106 },
    taillight: { x: 34, y: 112 },
  },
}
