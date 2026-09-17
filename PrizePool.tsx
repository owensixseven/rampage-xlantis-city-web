import { Award, Medal, Star, Target, Trophy } from 'lucide-react'
import { formatInr } from '../../lib/format'

const PRIZES = [
  { icon: Trophy, label: '1st Place', amount: 500000, tone: 'gold' },
  { icon: Medal, label: '2nd Place', amount: 250000, tone: 'silver' },
  { icon: Award, label: '3rd Place', amount: 150000, tone: 'bronze' },
  { icon: Star, label: 'Tournament MVP', amount: 75000, tone: 'signal' },
  { icon: Target, label: 'Most Points — All Stages', amount: 25000, tone: 'data' },
] as const

const TONE_STYLES: Record<string, string> = {
  gold: 'border-rank-gold/40 text-rank-gold',
  silver: 'border-rank-silver/40 text-rank-silver',
  bronze: 'border-rank-bronze/40 text-rank-bronze',
  signal: 'border-signal/40 text-signal',
  data: 'border-data/40 text-data',
}

export function PrizePool() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {PRIZES.map((p) => {
        const Icon = p.icon
        return (
          <div key={p.label} className={`border bg-panel p-5 clip-tactical-sm ${TONE_STYLES[p.tone]}`}>
            <Icon size={22} />
            <div className="mt-4 font-display text-2xl font-bold tabular text-ink">{formatInr(p.amount)}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-mute">{p.label}</div>
          </div>
        )
      })}
      <div className="col-span-full mt-1 border-t border-line pt-4 text-right font-mono text-xs uppercase tracking-widest text-ink-dim">
        Total Prize Pool <span className="ml-2 text-base font-bold text-signal">{formatInr(1000000)}</span>
      </div>
    </div>
  )
}
