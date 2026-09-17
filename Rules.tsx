import { AlertTriangle, BookOpen, Flag, HeartPulse, Radio, RotateCcw, Shield, Trophy } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Panel, PanelHeader } from '../components/ui/Panel'

const placementPoints = [
  ['1st', 10], ['2nd', 7], ['3rd', 6], ['4th', 5], ['5th', 4],
  ['6th', 3], ['7th', 2], ['8th', 1], ['9th', 0], ['10th', 0],
]

const ruleSections = [
  ['01', 'Tournament Format', '100 registered teams are divided into 10 groups of 10 teams.|The competition progresses through Group Stage, Knockout Stage, Semi Finals and Grand Final.|The Grand Final consists of exactly 10 teams and determines 1st Place, 2nd Place, 3rd Place, Tournament MVP and Most Points Across All Tournament Stages.'],
  ['02', 'Team Rules', 'Each match contains a maximum of 10 teams.|Teams must use their registered roster. Rosters are locked when a match begins.|Players may not switch teams during an active match.|Unauthorized players joining another team are prohibited.|Team captains and managers are responsible for their registered roster.|Admins may unlock a roster before a match for legitimate tournament reasons.|Team names, logos and uniforms must follow tournament guidelines.'],
  ['03', 'Player Conduct', 'Follow tournament staff instructions and respect opponents, referees, casters and administrators.|Harassment, abusive behavior and disruptive conduct are prohibited.|Players must not exploit server problems, manipulate tournament results or interfere with tournament administration.|Serious misconduct may result in warnings, point penalties, player removal or team disqualification.'],
  ['04', 'Official Scoring', 'TOTAL SCORE = Placement Points + Kill Points + Bonuses.|1 Kill = 1 Point.|Example: 10 placement points + 20 kills = 30 points.'],
  ['05', 'Team Wipe Bonus', 'A complete elimination of an opposing team awards +3 bonus points.|The system must confirm that the opposing team has been completely eliminated before awarding the bonus.|Duplicate or incorrect team-wipe scoring is prohibited.'],
  ['06', 'Flag Objective', 'Each match contains only one flag. There will never be multiple flags in the same match.|The flag location is randomly selected from administrator-approved locations on the official Apocalypse Map.|Successfully capturing the flag awards +3 points.|Eliminating the player carrying the captured flag awards +2 bonus points.|The system must prevent duplicate flag bonuses.|Flag events are recorded in the live scoreboard, match report, caster overlay, match history and highlight system.'],
  ['07', 'Drone Rule', 'Each match contains only one drone, obtained through a special drop.|The drone is a reconnaissance tool with no weapon, no direct damage, limited operation time and limited range.|Only one drone is available per match. Deployment can be displayed as a live match event.'],
  ['08', 'Zone System', 'RAMAGE uses a five-zone system with 5 major zone stages per match.|The final zone is determined according to the tournament configured zone system.|Players outside the active zone receive zone damage and are responsible for managing rotations and positioning.|Intentionally exploiting zone mechanics is prohibited.'],
  ['09', 'Vehicle / VDM Rules', 'Vehicle Deathmatch is strictly prohibited.|Vehicle-to-player collision is disabled for competitive gameplay. Vehicles must not be used to kill players.|Vehicle-to-vehicle collision remains enabled.'],
  ['10', 'Vehicle Kill Penalty', 'When a player is killed by a vehicle, the system restores the victim, records the incident and gives the driver a VDM warning.|1st Warning: Official warning.|2nd Warning: Final warning.|3rd Warning: Kick from the match or server.|Repeated or intentional VDM may result in additional tournament penalties.'],
  ['11', 'Recall System', 'Each player receives 1 recall per match.|After elimination, a player may use their available recall according to the configured server mechanic.|After the recall is used, the player cannot receive another normal recall during that match.|Administration may override the normal system only for verified technical or server issues.'],
  ['12', 'Server Crash / Match Recall', 'Administrators may initiate MATCH RECALL when a serious server problem affects an active match.|Hard Recall is intended for a verified technical issue where a player could not properly join their assigned team.|The decision to use Match Recall or Hard Recall belongs to tournament administration.'],
  ['13', 'Disconnect Rule', 'A player affected by a technical disconnect may receive a reconnect window.|The system attempts to restore the player to their original team and match.|Players cannot intentionally disconnect to exploit the system.|Reconnection does not reset official scores. Intentional disconnect abuse may result in penalties.'],
  ['14', 'No Kill Stealing', 'Players must not intentionally manipulate elimination credit.|The server determines the official killer through combat and event tracking.|The official server event log is the final reference for disputed kill attribution.'],
  ['15', 'Boost & Horlicks', '1 Boost = +100 Health.|1 Horlicks = +100 Armor.|Both items must respect the player maximum health and armor limits.|Commercial use of real-world brand names or logos requires appropriate permission.'],
  ['16', 'Loot System', 'Loot is distributed consistently across the map according to the configured loot table.|The Drone, Flag objective, Boost and Horlicks must follow their specific tournament rules.'],
  ['17', 'Anti-Cheat', 'Anti-cheat monitoring may detect suspicious kills, abnormal movement, speed violations, teleportation, weapon or ammo anomalies, god-mode behavior and impossible gameplay events.|Anti-cheat alerts are reviewed by authorized tournament staff.|A detection alert is not automatically treated as final proof without review where appropriate.'],
  ['18', 'Exploits & Bug Abuse', 'Players must not intentionally exploit server, map, collision, UI, weapon, zone, vehicle, recall or team-system bugs.|Serious tournament-breaking bugs should be reported to tournament staff.|Intentional abuse of a known exploit may result in penalties or disqualification.'],
  ['19', 'Custom Uniforms', 'Approved custom uniforms may contain a team logo, team name, player number, team colors and approved sponsor branding.|Uniforms must not provide gameplay advantages such as excessive camouflage, invisible textures or misleading player models.'],
  ['20', 'Admin / Referee / Caster', 'Tournament staff may have dedicated custom PEDs and visual identities.|Roles include Admin, Referee, Caster and Tournament Staff.|Staff PEDs must not provide unfair combat advantages.|Casters and spectators operate under tournament administration permissions.'],
  ['21', 'Graphics Modes', 'Player Mode is designed for maximum FPS, clear visibility, reduced visual clutter, optimized effects and performance-focused rendering.|Admin / Caster Mode is designed for higher visual quality, cinematic presentation, enhanced lighting and broadcast-focused spectator visuals.'],
  ['22', 'Match Highlights', 'Important events may be automatically recorded for broadcasts and match reports.|Examples include First Blood, Multi-Kill, Team Wipe, Important Rotation, Zone Rotation, Flag Capture, Flag Carrier Elimination, Close Escape, Final Zone and Champion Moment.'],
  ['23', 'Live Scoreboard', 'The official website may display Team, Position, Kills, Points, Team Wipes, Flag Points, Players Alive and Match Status.|Live data must come from the official tournament system or server integration.|The official tournament database is the final authority for scores.'],
  ['24', 'Score Disputes', 'A dispute should include the team, player, match, approximate time, issue description and supporting evidence where available.|Tournament staff review official server logs and available evidence. The administration ruling applies to the match.'],
  ['25', 'Stream Sniping / Information Abuse', 'Players must not use external streams, broadcasts or spectator information to gain an unfair advantage during an active match.|Publicly available tournament information may be used after it has been officially released.'],
  ['26', 'Spectator / Caster Information', 'Caster and spectator information must not be intentionally communicated to active players to provide an unfair advantage.|Staff must follow tournament broadcast procedures.'],
  ['27', 'Match Start', 'Players must join the correct team, be ready before the scheduled start and follow administrator instructions.|Players must remain in their assigned team. Once a match begins, the roster is locked unless administration intervenes.'],
  ['28', 'Late Join / Server Issues', 'If a player cannot join because of a verified server issue, administration may investigate and use the appropriate recall or hard-recall procedure.|Normal player mistakes do not automatically qualify for a hard recall.'],
  ['29', 'Admin Authority', 'Administrators may pause a match, recall a match, perform a hard recall for verified technical issues, investigate incidents and review anti-cheat or VDM reports.|Administrators may correct verified scoring errors and apply tournament penalties.|All major administrative actions should be recorded in an audit log.'],
  ['30', 'Penalties', 'Depending on severity, penalties may include a warning, player penalty, point deduction, match penalty, player removal, team penalty, match disqualification or tournament disqualification.|Severe cheating or intentional tournament manipulation may result in immediate disqualification.'],
  ['31', 'Fair Play', 'RAMAGE is based on Skill, Teamwork, Positioning, Strategy, Survival and Competition.|Players are expected to compete fairly and respect tournament integrity.'],
  ['32', 'Final Authority', 'Tournament administration has final authority over match disputes, scoring disputes, technical issues, rule interpretations, penalties, disqualifications and server incidents.|Rules may be updated when required to maintain competitive fairness, server stability and tournament integrity.'],
]

export default function Rules() {
  return (
    <div>
      <div className="border-b border-line bg-gradient-to-b from-signal/[0.06] to-transparent scanlines">
        <Section eyebrow="Official Tournament Rulebook" title="RAMAGE Rules" description="XLANTIS CITY | FiveM PvP Battleground | 100 Registered Teams | 10-Team Grand Final | Total Prize Pool: INR 10,00,000" className="pb-16" />
      </div>

      <Section eyebrow="At A Glance" title="Competition Framework" className="pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={<Trophy size={17} />} label="Tournament" value="RAMAGE" />
          <SummaryCard icon={<BookOpen size={17} />} label="Format" value="FiveM PvP Battleground" />
          <SummaryCard icon={<Flag size={17} />} label="Official Map" value="Dulang Creation's Apocalypse Map" />
          <SummaryCard icon={<Trophy size={17} />} label="Grand Final" value="Exactly 10 Teams" />
        </div>
      </Section>

      <Section eyebrow="Official Scoring" title="Point System" className="pb-8">
        <Panel clip={false}>
          <PanelHeader title="Total Score = Placement Points + Kill Points + Bonuses" />
          <div className="grid gap-6 p-5 md:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">Placement Points</div>
              <table className="w-full font-mono text-sm"><tbody>{placementPoints.map(([position, points]) => <tr key={position} className="border-b border-line-soft"><td className="py-1.5 text-ink-dim">{position} Place</td><td className="py-1.5 text-right text-ink">{points} pts</td></tr>)}</tbody></table>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">Kill Points & Bonuses</div>
              <ul className="space-y-2 font-mono text-sm text-ink-dim">
                <ScoreRow label="1 Kill" value="1 pt" />
                <ScoreRow label="Team Wipe" value="+3 pts" />
                <ScoreRow label="Flag Capture" value="+3 pts" />
                <ScoreRow label="Flag Carrier Elimination" value="+2 pts" />
              </ul>
              <p className="mt-5 border-l-2 border-signal pl-3 text-sm text-ink-dim">Example: 10 placement points + 20 kills = 30 points.</p>
            </div>
          </div>
        </Panel>
      </Section>

      <Section eyebrow="Core Systems" title="Match Operations" className="pb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={<RotateCcw size={17} />} label="Recall" value="1 Per Player / Match" />
          <SummaryCard icon={<Flag size={17} />} label="Flag" value="1 Per Match" />
          <SummaryCard icon={<Radio size={17} />} label="Drone" value="1 Per Match" />
          <SummaryCard icon={<Shield size={17} />} label="Zones" value="5 Major Stages" />
        </div>
      </Section>

      <Section eyebrow="Complete Regulations" title="Rulebook" className="pb-24">
        <div className="grid gap-4 lg:grid-cols-2">
          {ruleSections.map(([number, title, content]) => (
            <Panel key={number} className="p-5">
              <div className="mb-3 flex items-center gap-3 border-b border-line-soft pb-3"><span className="font-mono text-xs text-signal">{number}</span><h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink">{title}</h3></div>
              <ul className="space-y-2 text-sm leading-6 text-ink-dim">{content.split('|').map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" />{item}</li>)}</ul>
            </Panel>
          ))}
        </div>
      </Section>

      <Section eyebrow="Field Items" title="Consumables" className="border-t border-line pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-5"><div className="mb-2 flex items-center gap-2 text-live"><HeartPulse size={16} /><span className="font-display text-lg font-bold uppercase">Boost</span></div><p className="text-sm text-ink-dim">1 Boost = +100 Health, within the configured maximum.</p></Panel>
          <Panel className="p-5"><div className="mb-2 flex items-center gap-2 text-data"><Shield size={16} /><span className="font-display text-lg font-bold uppercase">Horlicks</span></div><p className="text-sm text-ink-dim">1 Horlicks = +100 Armor, within the configured maximum.</p></Panel>
        </div>
      </Section>

      <Section eyebrow="Fair Competition" title="RAMAGE Final Authority" description="Fight. Survive. Dominate." className="pb-24">
        <Panel className="flex items-start gap-3 border-hazard/40 p-5"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-hazard" /><p className="text-sm text-ink-dim">The official RAMAGE tournament administration and tournament database are the final authority for rules, incidents, disputes and scores.</p></Panel>
      </Section>
    </div>
  )
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <Panel className="p-5"><div className="mb-3 flex items-center gap-2 text-signal">{icon}<span className="font-mono text-[11px] uppercase tracking-widest">{label}</span></div><div className="font-display text-base font-bold uppercase text-ink">{value}</div></Panel>
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return <li className="flex justify-between border-b border-line-soft py-1.5"><span>{label}</span><span className="text-signal">{value}</span></li>
}
