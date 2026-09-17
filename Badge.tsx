import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Tone = 'signal' | 'live' | 'hazard' | 'data' | 'neutral' | 'gold'

const toneClasses: Record<Tone, string> = {
  signal: 'bg-signal/10 text-signal border-signal/40',
  live: 'bg-live/10 text-live border-live/40',
  hazard: 'bg-hazard/10 text-hazard border-hazard/40',
  data: 'bg-data/10 text-data border-data/40',
  neutral: 'bg-panel-hi text-ink-dim border-line',
  gold: 'bg-rank-gold/10 text-rank-gold border-rank-gold/40',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${toneClasses[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function LiveDot() {
  return (
    <motion.span className="relative flex h-2 w-2" animate={{ scale: [1, 1.25, 1], opacity: [0.75, 1, 0.75] }} transition={{ duration: 1.6, repeat: Infinity }}>
      <span className="absolute inline-flex h-full w-full rounded-full bg-hazard opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-hazard" />
    </motion.span>
  )
}
