import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import Live from './pages/Live'
import Tournaments from './pages/Tournaments'
import Teams from './pages/Teams'
import TeamProfile from './pages/TeamProfile'
import TeamRegister from './pages/TeamRegister'
import Players from './pages/Players'
import PlayerProfile from './pages/PlayerProfile'
import Matches from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import Standings from './pages/Standings'
import Mvp from './pages/Mvp'
import Highlights from './pages/Highlights'
import Records from './pages/Records'
import HallOfFame from './pages/HallOfFame'
import Sponsors from './pages/Sponsors'
import Rules from './pages/Rules'
import Report from './pages/Report'
import Experience from './pages/Experience'
import { LoginPage } from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import RefereeDashboard from './pages/dashboards/RefereeDashboard'
import CasterDashboard from './pages/dashboards/CasterDashboard'
import TeamManagerDashboard from './pages/dashboards/TeamManagerDashboard'
import NotFound from './pages/NotFound'
import { RequireRole } from './components/RequireRole'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const pageTransition = {
  initial: { opacity: 0, y: 14, scale: 0.985, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, scale: 1.01, filter: 'blur(2px)' },
}

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
    <div className="tactical-background flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
          <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/register" element={<TeamRegister />} />
          <Route path="/teams/:id" element={<TeamProfile />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerProfile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/mvp" element={<Mvp />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/records" element={<Records />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/report" element={<Report />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/login/team" element={<LoginPage variant="team" />} />
          <Route path="/login/admin" element={<LoginPage variant="admin" />} />
          <Route
            path="/admin"
            element={
              <RequireRole roles={['admin', 'super_admin']}>
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/referee"
            element={
              <RequireRole roles={['referee', 'admin', 'super_admin']}>
                <RefereeDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/caster"
            element={
              <RequireRole roles={['caster', 'admin', 'super_admin']}>
                <CasterDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/team-manager"
            element={
              <RequireRole roles={['team_manager', 'admin', 'super_admin']}>
                <TeamManagerDashboard />
              </RequireRole>
            }
          />
          <Route path="*" element={<NotFound />} />
          </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
    </MotionConfig>
  )
}
