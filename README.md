# RAMPAGE — Xlantis City Tournament Platform

A multi-page esports tournament website for **XLANTIS CITY — RAMPAGE**, a FiveM PvP
battleground tournament. Built with React + TypeScript + Tailwind CSS v4, React Router,
Lucide icons, and Framer Motion/Recharts available for further use.

## Run it locally

The site works standalone (`npm install && npm run dev`), but for admin
actions (standings edits, MVP, team approvals, sponsors) to be **shared with
every visitor** instead of just your own browser, also run the backend:

```bash
# Terminal 1 — backend
cd server
npm install
npm run dev

# Terminal 2 — frontend (from the project root)
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173). The Admin
Dashboard shows a badge telling you whether you're connected to the shared
backend ("Live — shared with all visitors") or running in local-only
fallback mode ("Offline — local browser only"). See `server/README.md` for
endpoint details and how to deploy the backend somewhere real.

To produce a production build:

```bash
npm run build
npm run preview   # serve the built files locally
```

## Project structure

```
src/
  data/
    types.ts               Domain types (Team, Player, Match, MvpEntry, Highlight, ...)
    generator-utils.ts     Deterministic RNG + name pools for demo data
    mockData.ts             All generated demo data (100 teams, 400 players, matches, etc.)
  lib/
    tournamentService.ts   Service layer — the ONLY thing pages should read tournament
                            data through. Swap its internals for real API/WebSocket
                            calls later without touching any component.
    format.ts               Small formatting helpers (seconds, ₹, ordinals, K/D)
  components/
    ui/                     Panel, Badge, Section, StatCounter — shared primitives
    layout/                 Navbar, Footer
    home/                   Hero, PrizePool, Roadmap
    scoreboard/             ScoreboardTable (sortable/filterable live leaderboard)
    teams/ players/ matches/ mvp/ highlights/   Card components per domain
  pages/                    One file per route (see App.tsx for the full route list)
    admin/                  Admin dashboard
    dashboards/             Referee, Caster, Team Manager dashboards
```

## Admin / Team login

Real accounts live on the **backend server**, in `server/.env` — a file
that's gitignored and never committed, so this public repo never contains
real passwords. Copy `server/.env.example` to `server/.env` and set your
own accounts before running the backend:

```bash
cd server
cp .env.example .env
# edit .env — set RAMPAGE_ACCOUNTS_JSON to your own accounts and passwords
npm install
npm run dev
```

`.env.example` shows the exact format — a single JSON array of
`{ id, password, role, label }` objects. Roles are `super_admin`, `admin`,
`referee`, `caster`, or `team_manager`, and each one routes to its matching
dashboard (`/admin`, `/referee`, `/caster`, `/dashboard/team-manager`)
after sign-in.

**If the backend isn't running**, the login page falls back to a small,
clearly-fake demo account set in `src/data/credentials.ts` (passwords like
`demo-only-not-secure`) — safe to keep in this public repo since they're
not real credentials for anything. This lets the site still be
demoed/browsed without a server running.

The backend verifies every admin action server-side (via a session token
issued at login) — it doesn't just trust the frontend, so someone can't
bypass the login screen by calling the API directly. See
`server/README.md` for details.

## Editing team names and player rosters

Both are plain, hand-editable data files — no build step or regeneration
needed, just save and the dev server hot-reloads:

- **`src/data/teamNames.ts`** — a flat array of exactly 100 strings, one per
  team slot. Edit any entry to rename that team; it updates everywhere
  (cards, standings, scoreboard, match center, admin panel) automatically.
  Each team's short tag (e.g. `TVA`, `CHO`) is auto-generated from its name.

- **`src/data/playerRoster.ts`** — a `ROSTER_TEXT` block in
  `"TAG | Player Name"` format, one line per player, blank lines allowed
  between groups. The parser (`buildRosterFromText`) matches each label to
  a team automatically by:
  1. exact team name (e.g. `RMD X TPA`)
  2. exact auto-generated tag (e.g. `TVA`, `CID`)
  3. either half of a compound name on its own (e.g. `ARABI` matches
     `RZ7 X ARABI`, but only if no other team shares that half)

  Teams with no matched players fall back to a small placeholder roster so
  the site never shows an empty team page. If you paste a new list and a
  label doesn't match anything, that group is silently skipped rather than
  guessed at — check the browser console or ask for a diagnostic dump if
  players seem to be missing.

  As of the current `ROSTER_TEXT`, these labels didn't match any team and
  were skipped (likely typos of a real tag — fix them in `teamNames.ts` or
  `playerRoster.ts` and they'll pick up automatically): `BB`, `CM`, `EC`,
  `ES`, `FTH`, `KSD`, `LM`, `NXT`, `NTX`, `SBB`, `UK`, `VKS`, `ZIN`, `KFC`,
  `BL`, `KP`.

- **`src/data/teamStatsOverride.ts`** and **`src/data/mvpOverride.ts`** — for
  setting *permanent* default standings/MVP without touching the Admin
  Dashboard at all. Most people won't need these — see "Changing standings
  and MVP without editing any files" below for the easy, click-based way to
  do the same thing. These two files exist for setting numbers that should
  stay as the project's baseline even after someone clicks "Reset Demo Data"
  in the dashboard:

  ```ts
  // teamStatsOverride.ts — keyed by exact team name from teamNames.ts
  export const TEAM_STATS_OVERRIDES: Record<string, TeamStatsOverride> = {
    'TVA': { kills: 42, teamWipes: 3, flagPoints: 8, positionPoints: 21 },
  }
  ```
  ```ts
  // mvpOverride.ts
  export const MVP_OVERRIDE_PLAYER_NAME: string | null = 'BEBOH'
  ```

  You only need to set the fields you care about in the stats override —
  anything left out keeps its random default, and totals/ranks recalculate
  automatically. The MVP override matches by name case-insensitively; set
  it back to `null` for automatic (highest-score) selection.

## Changing standings and MVP without editing any files

Log into the Admin Dashboard (`/login/admin`) and open the **Standings**
or **MVP** tab in the sidebar:

- **Standings tab** — every team in a table with editable number boxes for
  Kills, Wipes, Flag Points, and Position Points. Type a new number, the
  Total column updates live, click **Save** on that row. Updates the
  Standings page, Home page, and that team's profile immediately.
- **MVP tab** — search for any player and click **Set as MVP**. Updates the
  Home page and MVP page immediately, and shows a "Manually set by
  tournament admin" badge there. Click **Clear Override** to go back to
  automatic (highest-score) selection.

This is saved to the backend (or your browser if the backend isn't
running — see "Making admin actions actually do something" below) — no
code, no files, just clicking.

## Making admin actions actually do something

The store lives in `src/lib/store.tsx` (`StoreProvider`, wraps the whole app
in `main.tsx`) and currently backs:

- **Teams** — approve / reject / lock / unlock, reflected instantly on the
  Teams directory, Standings, and each team's profile page
- **Team registration** — the Team Registration page creates a real team via
  `store.createTeam()`; it shows up immediately in the Teams directory and
  the Admin Dashboard's Teams tab as `PENDING`
- **Team logos** — both the registration form and the Admin Dashboard's
  Teams tab accept a real image upload (via `FileReader`, stored as a data
  URL on `team.logoDataUrl`); a shared `TeamBadge` component renders it
  everywhere a team appears, falling back to the colored tag badge when no
  logo has been uploaded
- **Standings** — the Admin Dashboard's Standings tab lets you type new
  kills/wipes/flag points/position points for any team and click Save; see
  "Changing standings and MVP without editing any files" above
- **Tournament MVP** — the Admin Dashboard's MVP tab lets you search for a
  player and click "Set as MVP" to override the automatic (highest-score)
  pick
- **Matches** — Recall and Hard Recall (resets timer, scoreboard, and flag
  state), Approve Results
- **Sponsors** — add / remove, reflected on the Footer and Home page
- **Highlights** — publish / unpublish, filtered out of the public
  Highlights page and Home when unpublished
- **Audit Log** — every action above (from Admin or Referee dashboards) is
  recorded with actor + timestamp, visible in the Admin Dashboard's Audit
  Logs tab
- **Bracket / group standings** (Tournaments page) — recomputes live from
  the same store, so once every match in a group is `completed`, the top 4
  teams are highlighted as advancing to Knockout

**Persistence:** when the backend (`server/`) is running, every action above
is saved there and pushed live to every connected browser via WebSocket —
genuinely shared across everyone, not per-browser. If the backend isn't
reachable, the store falls back to `localStorage` automatically (survives a
refresh, but only in that one browser) — the Admin Dashboard's connection
badge tells you which mode is active. A "Reset Demo Data" button restores
the original 100-team dataset either way.

## Swapping in real FiveM data

Everything currently reads from `src/data/mockData.ts`, which is clearly
synthetic/demo data. The intended integration path is:

```
FiveM Server → Tournament Backend → API / WebSocket → src/lib/tournamentService.ts → UI
```

Re-implement the functions in `tournamentService.ts` (`getTeams`, `getMatch`,
`subscribeLiveScoreboard`, etc.) to call your real backend instead of the static
arrays in `mockData.ts`. Because every page already goes through this service layer,
no component code needs to change. A minimal, runnable version of that backend
already exists in `server/` — see `server/README.md`.

## What's implemented

- Full navigation (desktop / tablet / mobile) with all requested links
- Cinematic homepage: hero, live match, upcoming matches, standings, featured teams,
  MVP spotlight, highlights, prize pool, roadmap, sponsors, Discord CTA
- Tournament structure page with an interactive stage/group timeline and the official
  map section (Dulang Creation's Apocalypse Map, approved flag locations)
- Live scoreboard component (sortable/filterable, reused across Home / Live / Standings
  / Match Center) matching the exact position + kill + wipe + flag scoring rules
- Team directory (100 teams, search + group filter), team profile, and a team
  registration form with the five registration states — registration now creates
  a real (locally-persisted) team with an optional uploaded logo
- Player directory and player profile pages, populated with real player names
  where matched (see "Editing team names and player rosters" above), with search,
  role filter, and sort by rank/kills/K-D/name, explicitly labelled as demo statistics
- Match Center with Upcoming / Live / Completed tabs, per-match flag & drone state,
  and a live event feed (team eliminated, team wipe, flag events, final zone, etc.)
- Tournament MVP spotlight (₹75,000) and match MVP cards, computed from the real roster
- Highlights page with all 13 requested categories, filtering, and admin publish/unpublish
- Records and Hall of Fame pages
- A full Rules page covering VDM policy, vehicle collision rules, the warning ladder,
  recall/disconnect states, zones, flag/drone rules, and consumables (Boost/Horlicks)
- Team Login / Admin Login pages, both backed by real (session-only) authentication
- **Working** Admin dashboard: approve/reject/lock/unlock teams (with logo upload),
  recall/hard-recall matches, approve results, add/remove sponsors, publish/unpublish
  highlights, a "Reset Demo Data" control, and a live audit log — see "Making admin
  actions actually do something" above. All admin tables are mobile-friendly (stacked
  layout on small screens)
- Referee dashboard with a working resolve/dismiss report queue, logged to the same
  shared audit log as the Admin dashboard
- Caster dashboard (POV switching, broadcast overlay preview)
- Team Manager dashboard (roster, schedule)
- A Dual Graphics System / Custom PED / Uniform showcase page
- Tournament bracket page with live per-group standings computed from the store,
  highlighting the top 4 teams as "advancing" once a group's matches are all completed
- A minimal, runnable backend (`server/`) — Express + WebSocket, JSON-file
  persistence, wired to the frontend by default. When it's running, every
  admin action is shared with every visitor in real time; when it's not,
  the site falls back to browser-only `localStorage` automatically
- A "Predict The Winner" fan mini-game on the homepage (`components/home/PredictionGame.tsx`)
  — shuffles through teams or players and lands on a random pick with a confetti burst
  (via `canvas-confetti`), purely for fun and clearly labelled as such
- A public report system (`/report`) — anyone can report a Player, Team, Match, or Bug,
  with dropdowns sourced live from the current roster/teams/matches. No login required to
  submit; the Admin Dashboard's Reports tab lets a referee or admin resolve/dismiss each
  one (enforced server-side — resolving without logging in returns a 401)

## Notes on scope

This is a large brief. The pages above are fully wired, responsive, and built on a
reusable component system so they're easy to extend — but a few things are
intentionally left as documented next steps rather than fully built out:

- The backend (`server/`) has no authentication on its own API — it trusts
  whatever `actor` name the frontend sends. The frontend's login screen
  gates who can *see* the Admin Dashboard, but someone who found the API
  directly could call its endpoints without logging in. Fine for a private
  or trusted deployment; add real auth (checking `credentials.ts`-style
  roles) before exposing this publicly
- The backend persists to a single JSON file, not a real database — no
  concurrency control, so two admins editing the exact same field at the
  exact same moment could race. Fine for a small event's admin team; swap
  `fileStore.js` for a real database before relying on this at scale
- Virtualized rendering for very long lists (100+ teams/players) isn't implemented —
  fine at this scale, worth revisiting if the roster grows much further
- The registration flow's roster IDs are stored as plain text on the new team, not
  linked to real `Player` records (those are generated at build time from
  `playerRoster.ts`) — a freshly-registered team's roster page shows the typed IDs
  rather than full player stats until that team's players are added to the roster file

