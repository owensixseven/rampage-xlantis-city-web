import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, X, Radio, MessageCircle, ShieldCheck, UserCircle2, Sun, Moon } from 'lucide-react'
import { LiveDot } from '../ui/Badge'
import { useAuth } from '../../lib/auth'
import { homeRouteForRole } from '../../data/credentials'

const PRIMARY_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/live', label: 'Live' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/teams', label: 'Teams' },
  { to: '/teams/register', label: 'Register' },
  { to: '/players', label: 'Players' },
  { to: '/matches', label: 'Matches' },
  { to: '/standings', label: 'Standings' },
  { to: '/mvp', label: 'MVP' },
  { to: '/highlights', label: 'Highlights' },
  { to: '/records', label: 'Records' },
  { to: '/hall-of-fame', label: 'Hall of Fame' },
  { to: '/rules', label: 'Rules' },
  { to: '/report', label: 'Report' },
]

const linkMotion = {
  whileHover: { y: -2, scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: { type: 'spring' as const, stiffness: 450, damping: 24 },
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('rampage-theme')
    const enabled = savedTheme !== 'light'
    setDarkMode(enabled)
    document.documentElement.dataset.theme = enabled ? 'dark' : 'light'
  }, [])

  const toggleTheme = () => {
    const enabled = !darkMode
    setDarkMode(enabled)
    document.documentElement.dataset.theme = enabled ? 'dark' : 'light'
    window.localStorage.setItem('rampage-theme', enabled ? 'dark' : 'light')
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-line bg-void/95 backdrop-blur' : 'border-transparent bg-void/70 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-8">
        <motion.div {...linkMotion}>
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src="/xlantis-city-logo.png.png" alt="Xlantis City Rampage" className="h-11 w-auto max-w-[190px] object-contain" />
        </NavLink>
        </motion.div>

        <nav className="hidden items-center gap-5 xl:flex">
          {PRIMARY_LINKS.map((l) => (
            <motion.div key={l.to} {...linkMotion}>
            <NavLink
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                  isActive ? 'text-signal' : 'text-ink-dim hover:text-ink'
                }`
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <motion.button {...linkMotion} onClick={toggleTheme} aria-label={darkMode ? 'Use light mode' : 'Use dark mode'} title={darkMode ? 'Use light mode' : 'Use dark mode'} className="flex h-8 w-8 items-center justify-center border border-line text-ink-dim hover:border-signal hover:text-signal">
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
          <motion.div {...linkMotion}><NavLink
            to="/live"
            className="flex items-center gap-2 border border-hazard/50 bg-hazard/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-hazard clip-tactical-sm"
          >
            <LiveDot /> Watch Live
          </NavLink></motion.div>
          <motion.a {...linkMotion}
            href="https://discord.gg/GxV9SAkvx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-dim hover:border-data hover:text-data"
          >
            <MessageCircle size={13} /> Discord
          </motion.a>
          {session ? (
            <>
              <motion.div {...linkMotion}><NavLink
                to={homeRouteForRole(session.role)}
                className="flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-signal"
              >
                <ShieldCheck size={13} /> {session.label}
              </NavLink></motion.div>
              <motion.button {...linkMotion}
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-dim hover:border-hazard hover:text-hazard"
              >
                <LogOut size={13} /> Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.div {...linkMotion}><NavLink
                to="/login/team"
                className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-dim hover:border-signal hover:text-signal"
              >
                <UserCircle2 size={13} /> Team Login
              </NavLink></motion.div>
              <motion.div {...linkMotion}><NavLink
                to="/login/admin"
                className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-dim hover:border-ink hover:text-ink"
              >
                <ShieldCheck size={13} /> Admin
              </NavLink></motion.div>
            </>
          )}
        </div>

        <motion.button {...linkMotion}
          className="flex h-9 w-9 items-center justify-center border border-line text-ink xl:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className="border-t border-line bg-void px-5 pb-6 pt-2 xl:hidden"
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <nav className="grid grid-cols-2 gap-1">
            {PRIMARY_LINKS.map((l) => (
              <motion.div key={l.to} {...linkMotion}><NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border border-line px-3 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider ${
                    isActive ? 'border-signal/50 text-signal' : 'text-ink-dim'
                  }`
                }
                end={l.to === '/'}
              >
                {l.label}
              </NavLink></motion.div>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <motion.button {...linkMotion} onClick={toggleTheme} className="flex items-center justify-center gap-2 border border-line py-2.5 font-mono text-[11px] font-semibold uppercase text-ink-dim">
              {darkMode ? <Sun size={13} /> : <Moon size={13} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.button>
            <motion.div {...linkMotion}><NavLink to="/live" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 border border-hazard/50 bg-hazard/10 py-2.5 font-mono text-[11px] font-semibold uppercase text-hazard">
              <Radio size={13} /> Watch Live
            </NavLink></motion.div>
            <motion.a {...linkMotion} href="https://discord.gg/GxV9SAkvx" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-line py-2.5 font-mono text-[11px] font-semibold uppercase text-ink-dim">
              <MessageCircle size={13} /> Discord
            </motion.a>
            {session ? (
              <>
                <motion.div {...linkMotion}><NavLink to={homeRouteForRole(session.role)} onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 border border-signal/40 bg-signal/10 py-2.5 font-mono text-[11px] font-semibold uppercase text-signal">
                  {session.label}
                </NavLink></motion.div>
                <motion.button {...linkMotion}
                  onClick={() => { setOpen(false); handleLogout() }}
                  className="flex items-center justify-center gap-2 border border-line py-2.5 font-mono text-[11px] font-semibold uppercase text-ink-dim"
                >
                  <LogOut size={13} /> Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.div {...linkMotion}><NavLink to="/login/team" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 border border-line py-2.5 font-mono text-[11px] font-semibold uppercase text-ink-dim">
                  Team Login
                </NavLink></motion.div>
                <motion.div {...linkMotion}><NavLink to="/login/admin" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 border border-line py-2.5 font-mono text-[11px] font-semibold uppercase text-ink-dim">
                  Admin Login
                </NavLink></motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  )
}
