import { useMemo, useState } from 'react'
import { AlertTriangle, Bug, CheckCircle2, Flag, Swords, Users } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { useStore } from '../lib/store'
import { players } from '../data/mockData'
import type { ReportCategory } from '../lib/reportTypes'

const CATEGORIES: { key: ReportCategory; label: string; icon: React.ReactNode }[] = [
  { key: 'player', label: 'Player', icon: <Users size={16} /> },
  { key: 'team', label: 'Team', icon: <Flag size={16} /> },
  { key: 'match', label: 'Match', icon: <Swords size={16} /> },
  { key: 'bug', label: 'Bug', icon: <Bug size={16} /> },
]

export default function Report() {
  const { teams, matches, submitReport } = useStore()
  const [category, setCategory] = useState<ReportCategory>('player')
  const [targetId, setTargetId] = useState('')
  const [description, setDescription] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const playerOptions = useMemo(() => players.slice(0, 500), [])
  const teamOptions = teams
  const matchOptions = matches

  const targetLabelFor = (): string | null => {
    if (category === 'player') return playerOptions.find((p) => p.id === targetId)?.name ?? null
    if (category === 'team') return teamOptions.find((t) => t.id === targetId)?.name ?? null
    if (category === 'match') {
      const m = matchOptions.find((mm) => mm.id === targetId)
      return m ? `Match ${m.matchNumber} · ${m.stage}` : null
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Please describe the issue.')
      return
    }
    if (category !== 'bug' && !targetId) {
      setError(`Please select which ${category} you're reporting.`)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await submitReport({
        category,
        targetId: category === 'bug' ? null : targetId,
        targetLabel: category === 'bug' ? null : targetLabelFor(),
        description: description.trim(),
        reporterName: reporterName.trim() || undefined,
      })
      setSubmitted(true)
      setDescription('')
      setTargetId('')
    } catch {
      setError('Could not submit your report — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section eyebrow="Help Keep RAMPAGE Fair" title="Report an Issue" description="Report a player, a team, a match, or a bug on the site. Reports go straight to the referee and admin team.">
      <div className="mx-auto max-w-xl">
        <Panel className="p-6">
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setCategory(c.key)
                  setTargetId('')
                  setError('')
                }}
                className={`flex flex-col items-center gap-1.5 border px-3 py-3 font-mono text-[11px] uppercase tracking-wider ${
                  category === c.key ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-dim'
                }`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 size={28} className="text-live" />
              <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Report Submitted</p>
              <p className="text-sm text-ink-dim">Thanks — a referee or admin will review this shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-dim hover:border-signal hover:text-signal"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {category !== 'bug' && (
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                    Select {category === 'player' ? 'Player' : category === 'team' ? 'Team' : 'Match'}
                  </span>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink focus:border-signal/50 focus:outline-none"
                  >
                    <option value="">— Choose one —</option>
                    {category === 'player' &&
                      playerOptions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} · {p.playerId}</option>
                      ))}
                    {category === 'team' &&
                      teamOptions.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    {category === 'match' &&
                      matchOptions.map((m) => (
                        <option key={m.id} value={m.id}>Match {m.matchNumber} · {m.stage}{m.group ? ` · Group ${m.group}` : ''}</option>
                      ))}
                  </select>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                  {category === 'bug' ? 'What went wrong?' : 'Describe the issue'}
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder={category === 'bug' ? 'e.g. The scoreboard shows the wrong kill count on the Live page…' : 'What happened, and when?'}
                  className="w-full resize-none border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">Your Name (optional)</span>
                <input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Leave blank to report anonymously"
                  className="w-full border border-line bg-void-2 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-mute focus:border-signal/50 focus:outline-none"
                />
              </label>

              {error && (
                <div className="flex items-center gap-2 border border-hazard/40 bg-hazard/10 px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-hazard">
                  <AlertTriangle size={13} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-signal py-3 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Report'}
              </button>
            </form>
          )}
        </Panel>
      </div>
    </Section>
  )
}
