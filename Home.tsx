import { NavLink } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { PrizePool } from '../components/home/PrizePool'
import { Roadmap } from '../components/home/Roadmap'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'
import { Badge, LiveDot } from '../components/ui/Badge'
import { ScoreboardTable } from '../components/scoreboard/ScoreboardTable'
import { TeamCard } from '../components/teams/TeamCard'
import { MatchCard } from '../components/matches/MatchCard'
import { MvpSpotlight } from '../components/mvp/MvpSpotlight'
import { HighlightCard } from '../components/highlights/HighlightCard'
import { PredictionGame } from '../components/home/PredictionGame'
import {
  mvpTournament, highlights, buildMvpEntry, playerById,
} from '../data/mockData'
import { useStore } from '../lib/store'

export default function Home() {
  const { teams, matches, sponsors, publishedHighlightIds, mvpOverridePlayerId } = useStore()
  const overridePlayer = mvpOverridePlayerId ? playerById(mvpOverridePlayerId) : null
  const mvpEntry = overridePlayer ? buildMvpEntry(overridePlayer) : mvpTournament
  const liveMatch = matches.find((m) => m.status === 'live') ?? null
  const upcoming = matches.filter((m) => m.status === 'upcoming').slice(0, 3)
  const featuredTeams = teams.slice(0, 4)
  const topHighlights = highlights.filter((h) => publishedHighlightIds.has(h.id)).slice(0, 4)
  const standings = [...teams].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 8)

  return (
    <div>
      <Hero />

      {liveMatch && (
        <Section eyebrow="Right Now" title="Live Match" className="pb-0">
          <Panel clip={false} className="overflow-hidden">
            <PanelHeader
              eyebrow={`Match ${liveMatch.matchNumber} · Group ${liveMatch.group}`}
              title={`Zone ${liveMatch.zone} — ${liveMatch.zoneStatus}`}
              action={
                <NavLink to={`/matches/${liveMatch.id}`} className="flex items-center gap-1.5 border border-hazard/40 bg-hazard/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-hazard">
                  <LiveDot /> Open Match Center
                </NavLink>
              }
            />
            <div className="p-4">
              <ScoreboardTable rows={liveMatch.scoreboard.slice(0, 6)} live compact />
            </div>
          </Panel>
        </Section>
      )}

      <Section
        eyebrow="Schedule"
        title="Upcoming Matches"
        action={<NavLink to="/matches" className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-signal">See all matches <ArrowRight size={13} /></NavLink>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((m, index) => <MatchCard key={m.id} match={m} index={index} />)}
        </div>
      </Section>

      <Section
        eyebrow="Group Stage Leaders"
        title="Current Standings"
        action={<NavLink to="/standings" className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-signal">Full standings <ArrowRight size={13} /></NavLink>}
      >
        <ScoreboardTable rows={standings.map((t, i) => ({
          teamId: t.id, rank: i + 1, position: null, positionPoints: t.positionPoints,
          kills: t.kills, killPoints: t.kills, teamWipes: t.teamWipes, flagPoints: t.flagPoints,
          totalPoints: t.totalPoints, playersAlive: 0, status: 'eliminated' as const,
        }))} />
      </Section>

      <Section
        eyebrow="Roster Watch"
        title="Featured Teams"
        action={<NavLink to="/teams" className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-signal">View all 100 teams <ArrowRight size={13} /></NavLink>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTeams.map((t, index) => <TeamCard key={t.id} team={t} index={index} />)}
        </div>
      </Section>

      <Section eyebrow="Standout Performer" title="Current MVP">
        <MvpSpotlight entry={mvpEntry} />
      </Section>

      <Section eyebrow="Fan Zone" title="Try Your Luck">
        <PredictionGame />
      </Section>

      <Section
        eyebrow="Best Moments"
        title="Latest Highlights"
        action={<NavLink to="/highlights" className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-signal">All highlights <ArrowRight size={13} /></NavLink>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topHighlights.map((h, index) => <HighlightCard key={h.id} highlight={h} index={index} />)}
        </div>
      </Section>

      <Section eyebrow="₹10,00,000 On The Line" title="Prize Pool">
        <PrizePool />
      </Section>

      <Section eyebrow="The Path To Champion" title="Tournament Roadmap">
        <Roadmap />
      </Section>

      <Section eyebrow="Backed By" title="Sponsors">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((s) => (
            <div key={s.id} className="flex flex-col items-center justify-center gap-2 border border-line bg-panel p-6 text-center">
              <span className="flex h-9 w-9 items-center justify-center border border-line font-display text-sm text-ink-dim">{s.wordmarkInitial}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">{s.name}</span>
              <Badge tone="neutral" className="mt-1">{s.tier}</Badge>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Stay Connected" title="Discord Community" className="pb-24">
        <Panel clip={false} className="flex flex-col items-center gap-4 p-10 text-center">
          <MessageCircle size={28} className="text-data" />
          <p className="max-w-md text-sm text-ink-dim">
            Team announcements, match schedules and referee rulings are posted first in the official
            XLANTIS CITY Discord.
          </p>
          <a href="https://discord.gg/GxV9SAkvx" target="_blank" rel="noreferrer" className="border border-data/40 bg-data/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-data">
            Join Discord
          </a>
        </Panel>
      </Section>
    </div>
  )
}
