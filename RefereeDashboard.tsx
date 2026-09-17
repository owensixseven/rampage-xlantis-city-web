import { useState } from 'react'
import { AlertOctagon, CheckCircle2, FileWarning, Gavel, ShieldQuestion, XCircle } from 'lucide-react'
import { Section } from '../../components/ui/Section'
import { Panel, PanelHeader } from '../../components/ui/Panel'
import { Badge } from '../../components/ui/Badge'
import { teams } from '../../data/mockData'
import { useStore } from '../../lib/store'
import { useAuth } from '../../lib/auth'

type ReportStatus = 'Open' | 'Under Review' | 'Resolved' | 'Dismissed'

interface Report {
  id: number
  type: string
  team: string
  status: ReportStatus
}

const INITIAL_REPORTS: Report[] = [
  { id: 1, type: 'VDM Report', team: teams[4].name, status: 'Open' },
  { id: 2, type: 'Cheating Report', team: teams[11].name, status: 'Under Review' },
  { id: 3, type: 'Incident Report', team: teams[22].name, status: 'Resolved' },
  { id: 4, type: 'Player Warning', team: teams[8].name, status: 'Open' },
]

const STATUS_TONE: Record<ReportStatus, 'hazard' | 'signal' | 'live' | 'neutral'> = {
  Open: 'hazard', 'Under Review': 'signal', Resolved: 'live', Dismissed: 'neutral',
}

export default function RefereeDashboard() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
  const { logAction } = useStore()
  const { session } = useAuth()
  const actor = session?.label ?? 'Referee'

  const resolve = (id: number) => {
    const report = reports.find((r) => r.id === id)
    setReports((list) => list.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)))
    if (report) logAction(actor, `Resolved ${report.type} — ${report.team}`)
  }

  const dismiss = (id: number) => {
    const report = reports.find((r) => r.id === id)
    setReports((list) => list.map((r) => (r.id === id ? { ...r, status: 'Dismissed' } : r)))
    if (report) logAction(actor, `Dismissed ${report.type} — ${report.team}`)
  }

  const openCount = reports.filter((r) => r.status === 'Open').length

  return (
    <Section eyebrow="Match Integrity" title="Referee Dashboard" description="Resolve or dismiss reports below — actions are logged to the shared admin audit log.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={<FileWarning size={16} />} label="Open Reports" value={`${openCount}`} />
        <StatBox icon={<AlertOctagon size={16} />} label="VDM Reports" value={`${reports.filter((r) => r.type === 'VDM Report').length}`} />
        <StatBox icon={<ShieldQuestion size={16} />} label="Under Review" value={`${reports.filter((r) => r.status === 'Under Review').length}`} />
        <StatBox icon={<Gavel size={16} />} label="Resolved" value={`${reports.filter((r) => r.status === 'Resolved').length}`} />
      </div>

      <Panel clip={false} className="mt-6">
        <PanelHeader title="Report Queue" eyebrow="Requires Referee Action" />
        <ul className="divide-y divide-line-soft">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
              <div>
                <div className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{r.type}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{r.team}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                {(r.status === 'Open' || r.status === 'Under Review') && (
                  <>
                    <button onClick={() => resolve(r.id)} className="flex items-center gap-1.5 border border-live/40 bg-live/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-live hover:bg-live/20">
                      <CheckCircle2 size={12} /> Resolve
                    </button>
                    <button onClick={() => dismiss(r.id)} className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim hover:bg-panel-raised">
                      <XCircle size={12} /> Dismiss
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-mute">Evidence & Recall Requests</div>
          <p className="text-sm text-ink-dim">Match Recall and Hard Recall are issued from the Admin Dashboard's Matches tab — referees can request one there once a dispute is confirmed.</p>
        </Panel>
        <Panel className="p-5">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-mute">Audit Log</div>
          <p className="text-sm text-ink-dim">Every resolve/dismiss action above is written to the shared audit log, visible in the Admin Dashboard's Audit Logs tab.</p>
        </Panel>
      </div>
    </Section>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-line bg-panel p-4">
      <div className="mb-2 text-signal">{icon}</div>
      <div className="font-display text-lg font-bold text-ink">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  )
}
