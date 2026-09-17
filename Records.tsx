import { Trophy } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { records } from '../data/mockData'

export default function Records() {
  return (
    <Section eyebrow="All-Time" title="Records" description="Demo data — figures shown are illustrative, not official RAMPAGE results.">
      <div className="grid gap-4 sm:grid-cols-2">
        {records.map((r) => (
          <Panel key={r.id} className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-signal/40 bg-signal/10 text-signal">
              <Trophy size={18} />
            </span>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-mute">{r.label}</div>
              <div className="font-display text-2xl font-bold text-ink">{r.value}</div>
              <div className="mt-0.5 font-mono text-xs text-ink-dim">{r.holderName} · {r.context}</div>
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  )
}
