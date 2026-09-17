import { ArrowUpRight, Handshake, Megaphone, ShieldCheck, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Section } from '../components/ui/Section'
import { Panel } from '../components/ui/Panel'
import { Badge } from '../components/ui/Badge'
import { useStore } from '../lib/store'
import type { Sponsor } from '../data/types'

const TIER_LABELS: Record<Sponsor['tier'], string> = {
  main: 'Title Partner',
  tournament: 'Tournament Partners',
  partner: 'Official Partners',
  team: 'Team Partners',
}

const TIER_ORDER: Sponsor['tier'][] = ['main', 'tournament', 'partner', 'team']

export default function Sponsors() {
  const { sponsors } = useStore()
  const mainSponsor = sponsors.find((sponsor) => sponsor.tier === 'main')
  const groupedSponsors = TIER_ORDER.filter((tier) => tier !== 'main').map((tier) => ({
    tier,
    sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
  })).filter((group) => group.sponsors.length > 0)

  return (
    <div>
      <div className="border-b border-line bg-gradient-to-br from-signal/[0.1] via-void to-data/[0.06] scanlines">
        <Section
          eyebrow="Built By The Bold"
          title="Sponsors"
          description="The brands powering RAMPAGE competition, broadcast and the next generation of XLANTIS CITY esports."
          className="pb-16 pt-16 lg:pb-24 lg:pt-24"
        >
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat icon={<Zap size={16} />} label="Live Season" value="S01" />
            <Stat icon={<Megaphone size={16} />} label="Official Partners" value={String(sponsors.length)} />
            <Stat icon={<Handshake size={16} />} label="Built Together" value="2026" />
          </div>
        </Section>
      </div>

      {mainSponsor && (
        <Section eyebrow="Presented By" title={TIER_LABELS.main}>
          <Panel className="relative overflow-hidden border-signal/50 p-8 md:p-12">
            <div className="absolute right-0 top-0 h-32 w-32 border-b border-l border-signal/20 bg-signal/[0.04]" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-signal font-display text-4xl font-bold text-signal clip-tactical-sm">
                  {mainSponsor.wordmarkInitial}
                </span>
                <div>
                  <Badge tone="signal">Title Partner</Badge>
                  <h3 className="mt-2 font-display text-3xl font-bold uppercase text-ink md:text-4xl">{mainSponsor.name}</h3>
                  <p className="mt-2 max-w-lg text-sm text-ink-dim">Fueling every drop, rotation and final-zone finish this season.</p>
                </div>
              </div>
              <ShieldCheck className="hidden text-signal md:block" size={34} />
            </div>
          </Panel>
        </Section>
      )}

      {groupedSponsors.map(({ tier, sponsors: tierSponsors }) => (
        <Section key={tier} eyebrow={tier === 'tournament' ? 'Season Support' : 'Community Support'} title={TIER_LABELS[tier]} className="pt-4 lg:pt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tierSponsors.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} />)}
          </div>
        </Section>
      ))}

      <Section eyebrow="Put Your Name On The Map" title="Partner With RAMPAGE" className="pb-24">
        <Panel className="flex flex-col gap-6 border-data/40 bg-data/[0.04] p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <div className="font-display text-2xl font-bold uppercase text-ink">Make the next match louder.</div>
            <p className="mt-2 max-w-xl text-sm text-ink-dim">Reach the teams, players and community shaping competitive XLANTIS CITY.</p>
          </div>
          <a href="mailto:partnerships@xlantiscity.gg" className="flex shrink-0 items-center gap-2 border border-data/50 bg-data/10 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-data hover:bg-data/20">
            Start a conversation <ArrowUpRight size={15} />
          </a>
        </Panel>
      </Section>
    </div>
  )
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Panel className="flex min-h-40 flex-col justify-between p-6 transition-colors hover:border-signal/40">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center border border-line bg-void font-display text-xl font-bold text-ink-dim">
          {sponsor.wordmarkInitial}
        </span>
        <Badge tone="neutral">{sponsor.tier}</Badge>
      </div>
      <div className="mt-8 font-display text-lg font-semibold uppercase tracking-wide text-ink">{sponsor.name}</div>
    </Panel>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border border-line bg-void/60 p-4">
      <span className="text-signal">{icon}</span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{label}</div>
        <div className="font-display text-lg font-bold uppercase text-ink">{value}</div>
      </div>
    </div>
  )
}
