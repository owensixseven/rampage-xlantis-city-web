import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Activity, BarChart3, BrainCircuit, Crosshair, Gauge, Shuffle, Sparkles, Trophy, Users } from 'lucide-react'
import { Panel } from '../ui/Panel'
import { Badge } from '../ui/Badge'
import { TeamBadge } from '../teams/TeamBadge'
import { useStore } from '../../lib/store'
import { players } from '../../data/mockData'
import type { Team, Player } from '../../data/types'

const SHUFFLE_MS = 1400
const SHUFFLE_TICK_MS = 55
const REVEAL_PHASE_MS = 1450
type RiskProfile = 'safe' | 'balanced' | 'chaos'

function launchConfetti(color: string) {
  const colors = [color, '#e8b400', '#ffffff', '#4dc8e0']
  confetti({ particleCount: 56, spread: 62, startVelocity: 34, gravity: 0.9, ticks: 220, origin: { x: 0.5, y: 0.58 }, colors, scalar: 0.85, disableForReducedMotion: true })
  window.setTimeout(() => confetti({ particleCount: 22, angle: 62, spread: 42, startVelocity: 28, gravity: 1.05, ticks: 180, origin: { x: 0.08, y: 0.72 }, colors, scalar: 0.7, disableForReducedMotion: true }), 100)
  window.setTimeout(() => confetti({ particleCount: 22, angle: 118, spread: 42, startVelocity: 28, gravity: 1.05, ticks: 180, origin: { x: 0.92, y: 0.72 }, colors, scalar: 0.7, disableForReducedMotion: true }), 150)
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function weightedPick<T>(items: T[], score: (item: T) => number) {
  const weights = items.map((item) => Math.max(1, score(item)))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let cursor = Math.random() * total
  return items.find((_, index) => (cursor -= weights[index]) <= 0) ?? items[items.length - 1]
}

function teamModelScore(team: Team, risk: RiskProfile = 'balanced') {
  const aggression = risk === 'chaos' ? team.kills * 0.8 + team.teamWipes * 8 : risk === 'safe' ? team.positionPoints * 0.5 - team.avgPlacement * 2 : team.kills * 0.35 + team.teamWipes * 4
  return team.totalPoints + team.wins * 9 + aggression + team.flagPoints * 2 - team.avgPlacement * 1.5
}

function playerModelScore(player: Player, risk: RiskProfile = 'balanced') {
  const aggression = risk === 'chaos' ? player.kills * 1.6 - player.deaths * 0.15 : risk === 'safe' ? player.survivalTimeSec / 55 + player.assists : player.kills * 1.4 + player.assists * 0.7
  return player.mvpScore + aggression + player.damage / 120 + player.survivalTimeSec / 90 - player.deaths * 0.45
}

function confidence<T>(items: T[], score: (item: T) => number, selected: T) {
  const ranked = [...items].sort((a, b) => score(b) - score(a))
  const top = score(ranked[0])
  const second = score(ranked[1] ?? ranked[0])
  const gap = Math.max(0, top - second)
  const spread = Math.max(1, top)
  return Math.min(94, Math.round(54 + (gap / spread) * 100 + (score(selected) / spread) * 25))
}

function useRevealSequence(active: boolean) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase(0)
      return
    }
    const timer = window.setInterval(() => setPhase((current) => (current + 1) % 4), REVEAL_PHASE_MS)
    return () => window.clearInterval(timer)
  }, [active])

  return phase
}

function RevealSequence({ phase, color }: { phase: number; color?: string }) {
  const accent = color ?? '#ff7a1a'
  const labels = ['SCAN', 'SIGNAL', 'FORM', 'LOCK']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-y-0 w-px"
        style={{ backgroundColor: accent, boxShadow: `0 0 18px ${accent}` }}
        animate={{ left: phase === 0 ? ['-5%', '105%'] : '105%', opacity: phase === 0 ? [0, 0.8, 0] : 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-3 top-3 font-mono text-[9px] tracking-[0.24em]"
        style={{ color: accent }}
        animate={{ opacity: phase === 1 ? [0.35, 1, 0.35] : 0 }}
        transition={{ duration: 1.1, repeat: phase === 1 ? Infinity : 0 }}
      >
        {labels[phase]}
      </motion.div>
      <div className="absolute bottom-3 left-3 right-3 flex gap-1">
        {labels.map((label, index) => (
          <motion.span
            key={label}
            className="h-0.5 flex-1 origin-left"
            style={{ backgroundColor: accent }}
            animate={{ scaleX: phase === index ? [0.25, 1, 0.45] : 0.12, opacity: phase === index ? [0.35, 1, 0.35] : 0.18 }}
            transition={{ duration: 1.05, repeat: phase === index ? Infinity : 0, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}

export function PredictionGame() {
  const { teams } = useStore()
  const [mode, setMode] = useState<'champion' | 'mvp'>('champion')
  const [risk, setRisk] = useState<RiskProfile>('balanced')

  const eligibleTeams = teams.filter((t) => t.status === 'APPROVED' || t.status === 'LOCKED')

  return (
    <Panel clip={false} className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-signal"><BrainCircuit size={12} /> Fan Prediction Lab</div>
          <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
            Run The Form Model
          </h3>
        </div>
        <div className="flex items-center gap-2 border border-line bg-void-2 px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
          <Activity size={12} className="text-data" /> Engine <span className="text-data">v2.4 live</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setMode('champion')}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
              mode === 'champion' ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
            }`}
          >
            <Trophy size={12} /> Champion
          </button>
          <button
            onClick={() => setMode('mvp')}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
              mode === 'mvp' ? 'border-signal/50 bg-signal/10 text-signal' : 'border-line text-ink-mute'
            }`}
          >
            <Users size={12} /> MVP
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 grid gap-3 border-b border-line pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute"><Gauge size={12} className="text-signal" /> Tune the simulation</div>
            <p className="max-w-xl text-sm text-ink-dim">Choose how the engine values consistency, aggression, or upset potential.</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['safe', 'balanced', 'chaos'] as RiskProfile[]).map((profile) => (
              <button key={profile} onClick={() => setRisk(profile)} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${risk === profile ? 'border-signal/60 bg-signal/10 text-signal' : 'border-line text-ink-mute hover:text-ink'}`}>
                {profile === 'safe' ? 'Safe' : profile === 'balanced' ? 'Balanced' : 'Chaos'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-2 text-center font-mono text-[10px] uppercase tracking-wider">
          <div className="border border-line bg-void-2 p-3"><div className="mb-1 text-ink-mute">Candidates</div><div className="text-lg text-ink">{mode === 'champion' ? eligibleTeams.length : players.length}</div></div>
          <div className="border border-line bg-void-2 p-3"><div className="mb-1 text-ink-mute">Signal</div><div className="text-lg text-signal">{risk === 'safe' ? 'Stability' : risk === 'chaos' ? 'Upsets' : 'Form'}</div></div>
          <div className="border border-line bg-void-2 p-3"><div className="mb-1 text-ink-mute">Mode</div><div className="text-lg text-data">{mode === 'champion' ? 'Team' : 'Player'}</div></div>
        </div>
        {mode === 'champion' ? <ChampionPredictor teams={eligibleTeams} risk={risk} /> : <MvpPredictor risk={risk} />}
        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          Synthetic form model for fun — uses tournament stats, not official odds.
        </p>
      </div>
    </Panel>
  )
}

function ChampionPredictor({ teams, risk }: { teams: Team[]; risk: RiskProfile }) {
  const [spinning, setSpinning] = useState(false)
  const [displayTeam, setDisplayTeam] = useState<Team | null>(null)
  const [result, setResult] = useState<Team | null>(null)
  const revealPhase = useRevealSequence(Boolean(result) && !spinning)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const spin = () => {
    if (spinning || teams.length === 0) return
    setSpinning(true)
    setResult(null)
    const start = Date.now()

    intervalRef.current = setInterval(() => {
      const pick = teams[Math.floor(Math.random() * teams.length)]
      setDisplayTeam(pick)
      if (Date.now() - start >= SHUFFLE_MS) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const winner = weightedPick(teams, (team) => teamModelScore(team, risk))
        setDisplayTeam(winner)
        setResult(winner)
        setSpinning(false)
        launchConfetti(winner.colors.primary)
      }
    }, SHUFFLE_TICK_MS)
  }

  const shown = result ?? displayTeam

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-3 overflow-hidden border p-6 transition-colors"
        style={{
          borderColor: shown ? hexToRgba(shown.colors.primary, 0.4) : undefined,
          backgroundColor: shown ? hexToRgba(shown.colors.primary, 0.06) : undefined,
          boxShadow: result && shown ? `0 0 0 1px ${hexToRgba(shown.colors.primary, 0.12)}, 0 18px 50px ${hexToRgba(shown.colors.primary, 0.12)}` : undefined,
        }}
        animate={result ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {result && <RevealSequence phase={revealPhase} color={shown?.colors.primary} />}
        {result && <motion.div className="pointer-events-none absolute inset-3 border border-white/10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0], scale: [0.9, 1.04, 1.08] }} transition={{ duration: 0.9, ease: 'easeOut' }} />}
        {shown ? (
          <>
            <motion.div key={shown.id} initial={{ opacity: 0, scale: 0.65, rotate: -8 }} animate={{ opacity: 1, scale: spinning ? [1, 1.08, 1] : 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 360, damping: 18 }}>
              <TeamBadge team={shown} size="xl" />
            </motion.div>
            <motion.div key={`${shown.id}-name`} initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.08, duration: 0.35 }} className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
              {shown.name}
            </motion.div>
            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.3 }} className="flex flex-wrap items-center justify-center gap-2">
                <Badge tone="gold" dot><Sparkles size={11} /> Model Champion</Badge>
                <Badge tone="neutral"><BarChart3 size={11} /> {confidence(teams, (team) => teamModelScore(team, risk), result)}% confidence</Badge>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <div className="flex h-20 w-20 items-center justify-center border border-dashed border-line text-ink-mute">
              <Trophy size={26} />
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-mute">
              Click predict to reveal a team
            </div>
          </>
        )}
      </motion.div>

      <button
        onClick={spin}
        disabled={spinning}
        className="flex items-center gap-2 bg-signal px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Shuffle size={14} className={spinning ? 'animate-spin' : ''} />
        {spinning ? 'Running Model…' : result ? 'Run Again' : 'Predict Champion'}
      </button>
      {result && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="flex flex-wrap justify-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute"><span>{result.wins} wins</span><span>·</span><span>{result.kills} kills</span><span>·</span><span>{result.avgPlacement.toFixed(1)} avg place</span></motion.div>}
    </div>
  )
}

function MvpPredictor({ risk }: { risk: RiskProfile }) {
  const [spinning, setSpinning] = useState(false)
  const [displayPlayer, setDisplayPlayer] = useState<Player | null>(null)
  const [result, setResult] = useState<Player | null>(null)
  const revealPhase = useRevealSequence(Boolean(result) && !spinning)
  const { teams } = useStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const teamById = (id: string) => teams.find((t) => t.id === id)

  const spin = () => {
    if (spinning || players.length === 0) return
    setSpinning(true)
    setResult(null)
    const start = Date.now()

    intervalRef.current = setInterval(() => {
      const pick = players[Math.floor(Math.random() * players.length)]
      setDisplayPlayer(pick)
      if (Date.now() - start >= SHUFFLE_MS) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const winner = weightedPick(players, (player) => playerModelScore(player, risk))
        setDisplayPlayer(winner)
        setResult(winner)
        setSpinning(false)
        const team = teamById(winner.teamId)
        launchConfetti(team?.colors.primary ?? '#1298ed')
      }
    }, SHUFFLE_TICK_MS)
  }

  const shown = result ?? displayPlayer
  const shownTeam = shown ? teamById(shown.teamId) : null

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-3 overflow-hidden border p-6 transition-colors"
        style={{
          borderColor: shownTeam ? hexToRgba(shownTeam.colors.primary, 0.4) : undefined,
          backgroundColor: shownTeam ? hexToRgba(shownTeam.colors.primary, 0.06) : undefined,
          boxShadow: result && shownTeam ? `0 0 0 1px ${hexToRgba(shownTeam.colors.primary, 0.12)}, 0 18px 50px ${hexToRgba(shownTeam.colors.primary, 0.12)}` : undefined,
        }}
        animate={result ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {result && <RevealSequence phase={revealPhase} color={shownTeam?.colors.primary} />}
        {result && <motion.div className="pointer-events-none absolute inset-3 border border-white/10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0], scale: [0.9, 1.04, 1.08] }} transition={{ duration: 0.9, ease: 'easeOut' }} />}
        {shown && shownTeam ? (
          <>
            <motion.div
              key={shown.id}
              className={`flex h-20 w-20 items-center justify-center font-display text-2xl font-bold text-void clip-tactical-sm ${spinning ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: shownTeam.colors.primary }}
              initial={{ opacity: 0, scale: 0.65, rotate: -8 }}
              animate={{ opacity: 1, scale: spinning ? [1, 1.1, 1] : 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18 }}
            >
              {shown.name.split('"')[1]?.slice(0, 2).toUpperCase() ?? shown.name.slice(0, 2)}
            </motion.div>
            <motion.div key={`${shown.id}-name`} initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.08, duration: 0.35 }} className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
              {shown.name}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }} className="font-mono text-xs uppercase tracking-wider text-ink-dim">
              {shownTeam.name} · {shown.role}
            </motion.div>
            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.3 }} className="flex flex-wrap items-center justify-center gap-2">
                <Badge tone="gold" dot><Sparkles size={11} /> Model MVP</Badge>
                <Badge tone="neutral"><Crosshair size={11} /> {confidence(players, (player) => playerModelScore(player, risk), result)}% confidence</Badge>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <div className="flex h-20 w-20 items-center justify-center border border-dashed border-line text-ink-mute">
              <Users size={26} />
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-mute">
              Click predict to reveal a player
            </div>
          </>
        )}
      </motion.div>

      <button
        onClick={spin}
        disabled={spinning}
        className="flex items-center gap-2 bg-signal px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Shuffle size={14} className={spinning ? 'animate-spin' : ''} />
        {spinning ? 'Running Model…' : result ? 'Run Again' : 'Predict MVP'}
      </button>
      {result && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="flex flex-wrap justify-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-mute"><span>{result.kills} kills</span><span>·</span><span>{result.damage.toLocaleString()} damage</span><span>·</span><span>{result.assists} assists</span></motion.div>}
    </div>
  )
}
