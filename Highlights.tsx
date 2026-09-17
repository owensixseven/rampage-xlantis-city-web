import { useMemo, useState } from 'react'
import { Section } from '../components/ui/Section'
import { HighlightCard } from '../components/highlights/HighlightCard'
import { highlights } from '../data/mockData'
import { useStore } from '../lib/store'
import type { HighlightCategory } from '../data/types'

const CATEGORIES: HighlightCategory[] = [
  'FIRST_BLOOD', 'AGGRESSIVE_PUSH', 'IMPORTANT_ROTATION', 'ZONE_ROTATION',
  'STRATEGIC_REPOSITION', 'VEHICLE_ROTATION', 'MULTI_KILL', 'TEAM_WIPE',
  'CLOSE_ESCAPE', 'FLAG_CAPTURE', 'FLAG_CARRIER_ELIMINATION', 'FINAL_ZONE',
  'CHAMPION_MOMENT',
]

export default function Highlights() {
  const { publishedHighlightIds } = useStore()
  const [category, setCategory] = useState<HighlightCategory | 'ALL'>('ALL')
  const published = useMemo(() => highlights.filter((h) => publishedHighlightIds.has(h.id)), [publishedHighlightIds])
  const filtered = useMemo(
    () => (category === 'ALL' ? published : published.filter((h) => h.category === category)),
    [published, category],
  )

  return (
    <Section eyebrow="Best Moments Of RAMPAGE" title="Highlights">
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategory('ALL')}
          className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
            category === 'ALL' ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
              category === c ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
            }`}
          >
            {c.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line bg-panel p-12 text-center font-mono text-sm text-ink-mute">No highlights in this category yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((h, index) => <HighlightCard key={h.id} highlight={h} index={index} />)}
        </div>
      )}
    </Section>
  )
}
