import { useId } from 'react'
import type { TipoCarroceria } from '../data/cars'

interface Props {
  tipo: TipoCarroceria
  color: string
  className?: string
  titulo?: string
}

const GROUND = 182

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

/** Travels right-to-left over each wheel arch (front wheel first), ending at xRear. */
function bottomEdgeRTL(xRear: number, rockerY: number, wheelsDesc: number[], archR: number) {
  let d = ''
  for (const cx of wheelsDesc) {
    d += `L${cx + archR},${rockerY} A${archR},${archR} 0 0 0 ${cx - archR},${rockerY} `
  }
  d += `L${xRear},${rockerY} `
  return d
}

interface TipoConfig {
  wheels: [number, number][] // [cx, r]
  body: string
  glass: string
  pillar: { x1: number; y1: number; x2: number; y2: number }
  belt: string
  cladding?: string
  mirrorPath: string
  headlight: { x: number; y: number; w: number; h: number; rotate: number }
  taillight: { x: number; y: number; w: number; h: number }
  handle: { x: number; y: number; w: number; h: number }
}

function buildConfig(tipo: TipoCarroceria): TipoConfig {
  switch (tipo) {
    case 'Hatchback': {
      const wheels: [number, number][] = [[104, 32], [300, 32]]
      const archR = 36
      const rockerY = 150
      const xRear = 40
      const xFront = 344
      return {
        wheels,
        body: `M${xRear},${rockerY} L40,136
          Q40,128 48,125
          L62,120
          Q68,100 84,88
          L94,81
          Q110,70 130,64
          Q150,58 172,57
          L206,57
          Q220,57 227,68
          L240,96
          L266,100
          Q292,104 308,116
          L332,127
          Q344,132 344,140
          L${xFront},${rockerY}
          ${bottomEdgeRTL(xRear, rockerY, [300, 104], archR)}
          Z`,
        glass: `M96,102 L102,86
          Q112,74 128,69
          Q146,64 168,63
          L204,63
          Q212,63 216,71
          L226,96
          Z`,
        pillar: { x1: 168, y1: 63, x2: 168, y2: 99 },
        belt: `M40,120 L344,140`,
        mirrorPath: `M92,83 C97,79 104,77 109,78 L107,85 Z`,
        headlight: { x: 312, y: 115, w: 21, h: 12, rotate: 18 },
        taillight: { x: 42, y: 130, w: 14, h: 10 },
        handle: { x: 178, y: 88, w: 20, h: 5 },
      }
    }
    case 'Sedán': {
      const wheels: [number, number][] = [[100, 32], [312, 32]]
      const archR = 36
      const rockerY = 150
      const xRear = 38
      const xFront = 356
      return {
        wheels,
        body: `M${xRear},${rockerY} L38,138
          Q38,130 46,127
          L58,123
          Q64,102 80,90
          L90,83
          Q106,71 126,65
          Q144,59 164,58
          L196,58
          Q208,58 213,68
          L220,84
          L246,88
          Q262,90 276,95
          L296,102
          Q336,108 348,124
          L354,134
          Q356,138 356,144
          L${xFront},${rockerY}
          ${bottomEdgeRTL(xRear, rockerY, [312, 100], archR)}
          Z`,
        glass: `M92,104 L98,88
          Q108,75 124,70
          Q142,65 162,64
          L194,64
          Q202,64 206,72
          L212,86
          Z`,
        pillar: { x1: 158, y1: 64, x2: 158, y2: 103 },
        belt: `M38,122 L356,144`,
        mirrorPath: `M88,85 C93,81 100,79 105,80 L103,87 Z`,
        headlight: { x: 324, y: 117, w: 21, h: 12, rotate: 16 },
        taillight: { x: 40, y: 132, w: 14, h: 10 },
        handle: { x: 172, y: 92, w: 20, h: 5 },
      }
    }
    case 'SUV': {
      const wheels: [number, number][] = [[98, 35], [306, 35]]
      const archR = 40
      const rockerY = 148
      const xRear = 36
      const xFront = 356
      return {
        wheels,
        body: `M${xRear},${rockerY} L36,124
          Q36,113 46,109
          L60,104
          Q66,84 84,72
          L96,65
          Q114,54 136,49
          Q152,45 170,45
          L224,45
          Q238,45 245,57
          L256,102
          L282,105
          Q326,108 342,122
          L352,134
          Q356,139 356,146
          L${xFront},${rockerY}
          ${bottomEdgeRTL(xRear, rockerY, [306, 98], archR)}
          Z`,
        cladding: `M${xRear},${rockerY} L${xFront},${rockerY} L356,164 Q356,172 348,172 L44,172 Q36,172 36,164 Z`,
        glass: `M92,98 L100,78
          Q112,63 130,57
          Q150,50 172,50
          L220,50
          Q230,50 234,60
          L244,98
          Z`,
        pillar: { x1: 176, y1: 50, x2: 176, y2: 98 },
        belt: `M36,113 L356,134`,
        mirrorPath: `M108,80 C113,76 120,74 125,75 L123,82 Z`,
        headlight: { x: 340, y: 126, w: 21, h: 12, rotate: 20 },
        taillight: { x: 38, y: 126, w: 15, h: 11 },
        handle: { x: 186, y: 82, w: 20, h: 5 },
      }
    }
    case 'Pickup': {
      const wheels: [number, number][] = [[130, 32], [298, 32]]
      const archR = 36
      const rockerY = 150
      const xRear = 36
      const xFront = 358
      return {
        wheels,
        body: `M${xRear},${rockerY} L36,112
          Q36,104 46,104
          L228,104
          Q222,88 228,64
          Q230,56 240,52
          L258,50
          Q270,50 278,58
          L286,90
          L338,97
          Q352,100 356,112
          L358,130
          L${xFront},${rockerY}
          ${bottomEdgeRTL(xRear, rockerY, [298, 130], archR)}
          Z`,
        glass: `M234,98
          L242,64
          Q248,56 258,54
          L266,54
          Q272,54 274,60
          L280,88
          Z`,
        pillar: { x1: 256, y1: 54, x2: 256, y2: 92 },
        belt: `M36,110 L356,112`,
        mirrorPath: `M264,72 C269,68 275,66 280,67 L278,74 Z`,
        headlight: { x: 342, y: 100, w: 19, h: 12, rotate: 10 },
        taillight: { x: 38, y: 108, w: 15, h: 11 },
        handle: { x: 246, y: 78, w: 18, h: 5 },
      }
    }
  }
}

function Wheel({ cx, r, dark }: { cx: number; r: number; dark: string }) {
  const cy = GROUND - r * 0.98
  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    const x1 = cx + Math.cos(a) * r * 0.14
    const y1 = cy + Math.sin(a) * r * 0.14
    const x2 = cx + Math.cos(a) * r * 0.54
    const y2 = cy + Math.sin(a) * r * 0.54
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9aa0a8" strokeWidth={r * 0.13} strokeLinecap="round" />
  })
  return (
    <g>
      <ellipse cx={cx} cy={GROUND + 2} rx={r * 1.3} ry={r * 0.3} fill="#000" opacity={0.2} />
      <circle cx={cx} cy={cy} r={r} fill="#15181d" />
      <circle cx={cx} cy={cy} r={r * 0.97} fill="none" stroke="#31353c" strokeWidth={r * 0.06} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="#d7dadf" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="#9aa0a8" strokeWidth={r * 0.04} />
      {spokes}
      <circle cx={cx} cy={cy} r={r * 0.15} fill={dark} />
    </g>
  )
}

/**
 * Ilustración de perfil lateral, plana y duotono, parametrizada por
 * carrocería y color. No usa fotos: es un ícono de marca propio del sitio,
 * con proporciones de auto moderno (capó, parabrisas inclinado, techo
 * continuo, ruedas grandes con llanta de aleación y reflejo en el vidrio).
 */
export default function CarIllustration({ tipo, color, className, titulo }: Props) {
  const uid = useId().replace(/:/g, '')
  const cfg = buildConfig(tipo)
  const light = shade(color, 0.34)
  const dark = shade(color, -0.24)

  return (
    <svg
      viewBox="0 0 400 210"
      className={className}
      role="img"
      aria-label={titulo ?? `Ilustración de ${tipo.toLowerCase()}`}
    >
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="52%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="30%" stopColor="rgba(13,22,40,0.94)" />
          <stop offset="100%" stopColor="rgba(13,22,40,0.94)" />
        </linearGradient>
        <clipPath id={`glassclip-${uid}`}>
          <path d={cfg.glass} />
        </clipPath>
      </defs>

      <ellipse cx="200" cy={GROUND + 4} rx="172" ry="9" fill="#000" opacity="0.16" />

      {cfg.wheels.map(([cx, r], i) => (
        <Wheel key={i} cx={cx} r={r} dark={dark} />
      ))}

      <path d={cfg.body} fill={`url(#grad-${uid})`} stroke="#0d1a2e" strokeWidth="2.5" strokeLinejoin="round" />

      {cfg.cladding && <path d={cfg.cladding} fill="#22262c" stroke="#0d1a2e" strokeWidth="1.5" />}

      <path d={cfg.glass} fill={`url(#glass-${uid})`} stroke="#0d1a2e" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon
        points="0,220 90,220 220,-20 130,-20"
        fill="rgba(255,255,255,0.32)"
        clipPath={`url(#glassclip-${uid})`}
      />

      <line
        x1={cfg.pillar.x1}
        y1={cfg.pillar.y1}
        x2={cfg.pillar.x2}
        y2={cfg.pillar.y2}
        stroke="#0d1a2e"
        strokeWidth="2.5"
      />
      <path d={cfg.belt} stroke={dark} strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* óptica delantera */}
      <rect
        x={cfg.headlight.x}
        y={cfg.headlight.y}
        width={cfg.headlight.w}
        height={cfg.headlight.h}
        rx="3"
        transform={`rotate(${cfg.headlight.rotate} ${cfg.headlight.x + cfg.headlight.w / 2} ${cfg.headlight.y + cfg.headlight.h / 2})`}
        fill="#f4d78a"
        stroke="#0d1a2e"
        strokeWidth="1.2"
      />
      {/* óptica trasera */}
      <rect
        x={cfg.taillight.x}
        y={cfg.taillight.y}
        width={cfg.taillight.w}
        height={cfg.taillight.h}
        rx="2.5"
        fill="#c0392b"
        stroke="#0d1a2e"
        strokeWidth="1"
      />
      {/* manija */}
      <rect
        x={cfg.handle.x}
        y={cfg.handle.y}
        width={cfg.handle.w}
        height={cfg.handle.h}
        rx="2.5"
        fill="#0d1a2e"
        opacity="0.5"
      />
      {/* espejo retrovisor */}
      <path d={cfg.mirrorPath} fill={dark} stroke="#0d1a2e" strokeWidth="1" />

      {/* detalles extra: pickup: caja/rollbar, SUV: rack de techo */}
      {tipo === 'Pickup' && (
        <>
          <rect x="50" y="100" width="176" height="4" fill="#0d1a2e" opacity="0.55" />
          <path d="M198,104 L198,66" stroke="#0d1a2e" strokeWidth="4" strokeLinecap="round" />
          <path d="M220,104 L220,66" stroke="#0d1a2e" strokeWidth="4" strokeLinecap="round" />
          <path d="M198,66 L220,66" stroke="#0d1a2e" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {tipo === 'SUV' && <rect x="140" y="44" width="76" height="5" rx="2" fill="#0d1a2e" opacity="0.8" />}
    </svg>
  )
}
