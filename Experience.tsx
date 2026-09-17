import { Gauge, Shirt, UserSquare2, Zap } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { TeamBadge } from '../components/teams/TeamBadge'
import { useStore } from '../lib/store'

const PEDS = [
  { role: 'RAMPAGE Admin', desc: 'Branded, high-visibility admin identity for zone and match control.' },
  { role: 'RAMPAGE Referee', desc: 'Distinct referee silhouette for on-ground rulings, no combat advantage.' },
  { role: 'RAMPAGE Caster', desc: 'Broadcast-only presence for on-map casting and interviews.' },
]

export default function Experience() {
  const { teams } = useStore()
  return (
    <div>
      <Section eyebrow="Two Ways To Experience RAMPAGE" title="Dual Graphics System">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="p-6">
            <div className="mb-3 flex items-center gap-2 text-live"><Zap size={18} /><span className="font-display text-lg font-bold uppercase">Player Mode</span></div>
            <ul className="space-y-1.5 text-sm text-ink-dim">
              <li>Maximum FPS</li>
              <li>High visibility, low visual clutter</li>
              <li>Optimized shadows, reduced particles</li>
              <li>Built for competitive readability</li>
            </ul>
          </Panel>
          <Panel className="p-6">
            <div className="mb-3 flex items-center gap-2 text-signal"><Gauge size={18} /><span className="font-display text-lg font-bold uppercase">Admin / Caster Mode</span></div>
            <ul className="space-y-1.5 text-sm text-ink-dim">
              <li>High-end shadows, cinematic lighting</li>
              <li>Higher environmental detail</li>
              <li>Enhanced effects for spectator presentation</li>
              <li>Broadcast-quality visuals</li>
            </ul>
          </Panel>
        </div>
      </Section>

      <Section eyebrow="On-Map Identity" title="Custom PED System">
        <div className="grid gap-4 sm:grid-cols-3">
          {PEDS.map((p) => (
            <Panel key={p.role} className="p-6 text-center">
              <UserSquare2 size={26} className="mx-auto mb-3 text-signal" />
              <div className="font-display text-base font-semibold uppercase tracking-wide text-ink">{p.role}</div>
              <p className="mt-2 text-xs text-ink-dim">{p.desc}</p>
            </Panel>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-mute">
          Custom PEDs carry XLANTIS CITY / RAMPAGE branding and provide no combat advantages.
        </p>
      </Section>

      <Section eyebrow="Team Identity" title="Uniform Showcase" className="pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Panel className="overflow-hidden border-rank-gold/40 p-6 text-center">
            <Shirt size={30} className="mx-auto mb-3 text-rank-gold" />
            <div className="font-display text-base font-bold uppercase tracking-wide text-rank-gold">RAMPAGE Champions</div>
            <p className="mt-2 text-xs text-ink-dim">The championship uniform — awarded once a Grand Final winner is crowned.</p>
          </Panel>
          {teams.slice(0, 5).map((t) => (
            <Panel key={t.id} className="p-6 text-center">
              <div className="mx-auto mb-3 flex justify-center">
                <TeamBadge team={t} size="lg" />
              </div>
              <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{t.name}</div>
              <p className="mt-2 text-xs text-ink-dim">Team colors, logo & sponsor branding on the competitive uniform.</p>
            </Panel>
          ))}
        </div>
      </Section>
    </div>
  )
}
