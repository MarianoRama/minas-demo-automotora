import type { ElementType, ReactNode } from 'react'
import { useReveal, revealClases } from '../hooks/useReveal'

interface Props {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}

/** Envoltorio genérico que anima su contenido al entrar en viewport. */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay)
  return (
    <Tag ref={ref} className={`${revealClases(visible)} ${className}`}>
      {children}
    </Tag>
  )
}
