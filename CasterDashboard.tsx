import { useState } from 'react'
import { Camera, Crosshair, Flag as FlagIcon, Users } from 'lucide-react'
import { Section } from '../../components/ui/Section'
import { Panel } from '../../components/ui/Panel'
import { Badge, LiveDot } from '../../components/ui/Badge'
import { TeamBadge } from '../../components/teams/TeamBadge'
import { useStore } from '../../lib/store'

const POVS = ['Admin POV', 'Player POV', 'FPP', 'TPP', 'Free Cam']

export default function CasterDashboard() {
  const [pov, setPov] = useState(POVS[0])
  const { matches, teams } = useStore()
  const liveMatch = matches.find((m) => m.status === 'live') ?? null
  const teamById = (id: string) => teams.find((t) => t.id === id)

  return (
    <Section eyebrow="Broadcast Control" title="Caster Dashboard" description="Demo interface for switching camera perspectives and previewing the broadcast overlay.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative aspect-video overflow-hidden border border-line bg-panel-raised">
            <div className="grid-overlay absolute inset-0 opacity-20" />
            <div className="scanlines absolute inset-0" />
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3">
              <Badge tone="hazard"><LiveDot /> {pov}</Badge>
              {liveMatch && <span className="font-mono text-xs text-ink-dim">Match {liveMatch.matchNumber} · Zone {liveMatch.zone}/5</span>}
            </div>
            <div className="flex h-full items-center justify-center">
              <Camera size={40} className="text-ink-mute" />
            </div>
            {liveMatch && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-line bg-void/85 px-3 py-2 font-mono text-[11px]">
                <div className="flex items-center gap-3">
                  {liveMatch.teamIds.slice(0, 4).map((id) => {
                    const t = teamById(id)
                    return t ? (
                      <span key={id} className="flex items-center gap-1.5">
                        <TeamBadge team={t} size="sm" />
                        {t.tag}
                      </span>
                    ) : null
                  })}
                </div>
                <span className="flex items-center gap-3 text-ink-dim">
                  <span className="flex items-center gap-1"><Crosshair size={11} /> Live kills</span>
                  <span className="flex items-center gap-1"><FlagIcon size={11} /> {liveMatch.flag.status}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> Players alive</span>
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {POVS.map((p) => (
              <button
                key={p}
                onClick={() => setPov(p)}
                className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-wider ${
                  pov === p ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-dim'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Panel className="p-4">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-mute">Overlay Elements</div>
            <ul className="space-y-1.5 text-xs text-ink-dim">
              <li>Team logos & names</li>
              <li>Kills / Points</li>
              <li>Players alive</li>
              <li>Match timer</li>
              <li>Zone status</li>
              <li>Flag status</li>
            </ul>
          </Panel>
          <Panel className="p-4">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-mute">Graphics Profile</div>
            <p className="text-xs text-ink-dim">
              Caster views render in Admin/Caster mode — cinematic lighting, high-end shadows and broadcast-quality presentation, distinct from the Player mode used in competitive play.
            </p>
          </Panel>
        </div>
      </div>
    </Section>
  )
}
