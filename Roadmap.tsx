const STAGES = [
  { count: '100', label: 'Registered Teams', detail: 'Open registration, roster lock on approval' },
  { count: '10 × 10', label: 'Group Stage', detail: '10 groups of 10 teams each' },
  { count: '40', label: 'Advance', detail: 'Top teams per group progress' },
  { count: '20', label: 'Knockout', detail: 'Single-match elimination' },
  { count: '10', label: 'Semi Finals', detail: 'One 10-team battleground match' },
  { count: '10', label: 'Grand Final', detail: 'The last stand for the title' },
  { count: '01', label: 'Rampage Champion', detail: 'Crowned on Dulang Apocalypse Map' },
]

export function Roadmap() {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-[38px] hidden h-px bg-line lg:block" />
      <div className="grid gap-3 lg:grid-cols-7">
        {STAGES.map((s, i) => (
          <div key={s.label} className="relative border border-line bg-panel p-4">
            <div className="mb-3 hidden h-2 w-2 -translate-y-8 bg-signal lg:block" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              Stage {String(i + 1).padStart(2, '0')}
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-signal">{s.count}</div>
            <div className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-ink">{s.label}</div>
            <div className="mt-1 text-xs text-ink-dim">{s.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
