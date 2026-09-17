import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { Badge } from '../components/ui/Badge'
import { useStore } from '../lib/store'

const STATES = [
  { key: 'PENDING', desc: 'Submitted and waiting to enter review' },
  { key: 'UNDER_REVIEW', desc: 'Roster and identity checks in progress' },
  { key: 'APPROVED', desc: 'Team is confirmed for the group draw' },
  { key: 'REJECTED', desc: 'Registration did not meet entry requirements' },
  { key: 'LOCKED', desc: 'Roster is locked — no further changes before match day' },
] as const

export default function TeamRegister() {
  const { createTeam } = useStore()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [teamName, setTeamName] = useState('')
  const [captain, setCaptain] = useState('')
  const [roster, setRoster] = useState(['', '', '', ''])
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined)
  const [submittedTeamId, setSubmittedTeamId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Logo must be an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setLogoDataUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim() || !captain.trim()) {
      setError('Team name and captain are required.')
      return
    }
    const rosterEntries = roster.map((r) => r.trim()).filter(Boolean)
    try {
      const team = await createTeam({ name: teamName.trim(), captainName: captain.trim(), rosterEntries, logoDataUrl })
      setError('')
      setSubmittedTeamId(team.id)
    } catch {
      setError('Could not submit registration — please try again.')
    }
  }

  return (
    <Section eyebrow="Enter The Battleground" title="Team Registration">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Panel clip={false}>
          <PanelHeader title="Registration Form" eyebrow="Step 1 of 1" />
          <form className="space-y-5 p-5" onSubmit={handleSubmit}>
            <Field label="Team Name">
              <input required className="input" placeholder="e.g. Iron Syndicate" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </Field>
            <Field label="Team Logo">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-3 border border-dashed border-line py-6 font-mono text-xs uppercase tracking-wider text-ink-mute hover:border-signal/40 hover:text-signal"
              >
                {logoDataUrl ? (
                  <>
                    <img src={logoDataUrl} alt="" className="h-10 w-10 border border-line object-cover" />
                    <span>Logo selected — click to change</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={16} /> Upload Logo (PNG/JPG/SVG)
                  </>
                )}
              </button>
            </Field>
            <Field label="Captain">
              <input required className="input" placeholder="Captain in-game name" value={captain} onChange={(e) => setCaptain(e.target.value)} />
            </Field>
            <Field label="Roster — Player IDs">
              <div className="space-y-2">
                {roster.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="input"
                      placeholder={`Player ${i + 1} ID (e.g. RGX-1042)`}
                      value={val}
                      onChange={(e) => setRoster((r) => r.map((v, idx) => (idx === i ? e.target.value : v)))}
                    />
                    {roster.length > 1 && (
                      <button type="button" onClick={() => setRoster((r) => r.filter((_, idx) => idx !== i))} className="text-ink-mute hover:text-hazard">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setRoster((r) => [...r, ''])} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-signal">
                  <Plus size={13} /> Add Player
                </button>
              </div>
            </Field>

            {error && (
              <div className="border border-hazard/40 bg-hazard/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-hazard">
                {error}
              </div>
            )}

            <button type="submit" className="w-full bg-signal py-3 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim">
              Submit Registration
            </button>

            {submittedTeamId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border border-live/40 bg-live/10 px-4 py-3 font-mono text-xs uppercase tracking-wider text-live">
                  <CheckCircle2 size={14} /> Registration submitted — status set to PENDING
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/teams/${submittedTeamId}`)}
                  className="w-full border border-line py-2.5 font-mono text-xs uppercase tracking-wider text-ink-dim hover:border-signal hover:text-signal"
                >
                  View Team Page
                </button>
              </div>
            )}
          </form>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-mute">Registration States</div>
          <ul className="space-y-3">
            {STATES.map((s) => (
              <li key={s.key} className="flex items-start gap-3">
                <Circle size={14} className="mt-0.5 shrink-0 text-ink-mute" />
                <div>
                  <Badge tone="neutral">{s.key.replace('_', ' ')}</Badge>
                  <p className="mt-1 text-xs text-ink-dim">{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-xs text-ink-dim">
            New registrations appear immediately in the Teams directory and the Admin
            Dashboard's Teams tab for approval — this is saved to your browser only
            (see the Admin Dashboard note about session persistence).
          </p>
        </Panel>
      </div>

      <style>{`.input{width:100%;background:var(--color-void-2);border:1px solid var(--color-line);padding:0.65rem 0.85rem;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-ink);} .input:focus{outline:none;border-color:var(--color-signal);}`}</style>
    </Section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">{label}</span>
      {children}
    </label>
  )
}
