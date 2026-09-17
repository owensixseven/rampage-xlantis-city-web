import { NavLink } from 'react-router-dom'
import { ChevronRight, Radio } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatCounter } from '../ui/StatCounter'
import { LiveDot } from '../ui/Badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(18,152,237,0.14),transparent_55%)]"
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="grid-overlay absolute inset-0 opacity-40"
        animate={{ backgroundPosition: ['0 0', '42px 42px'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <div className="scanlines absolute inset-0" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 border border-hazard/40 bg-hazard/10 px-3 py-1.5"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <LiveDot />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-hazard">
            Match 24 is live now — Group F
          </span>
        </motion.div>

        <motion.div
          className="mb-3 font-mono text-sm uppercase tracking-[0.4em] text-ink-dim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Xlantis City Presents
        </motion.div>
        <motion.h1
          className="font-display text-6xl font-black uppercase leading-[0.92] tracking-tight text-ink text-shadow-glow sm:text-7xl md:text-8xl lg:text-9xl"
          initial={{ opacity: 0, y: 26, letterSpacing: '0.08em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.025em' }}
          transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Rampage
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl font-mono text-base uppercase tracking-[0.15em] text-signal md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          Fight. Survive. Dominate.
        </motion.p>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <StatCounter value={1000000} prefix="₹" label="Prize Pool" />
          <StatCounter value={100} label="Registered Teams" />
          <StatCounter value={10} label="Teams Per Match" />
          <StatCounter value={10} label="Grand Final Teams" />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.55 }}
        >
          <NavLink to="/live" className="flex items-center gap-2 bg-signal px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-void clip-tactical-sm hover:bg-signal-dim">
            <Radio size={14} /> Watch Live
          </NavLink>
          <NavLink to="/tournaments" className="flex items-center gap-2 border border-line px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:border-ink">
            View Tournament <ChevronRight size={14} />
          </NavLink>
          <NavLink to="/teams" className="flex items-center gap-2 border border-line px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink-dim hover:border-ink hover:text-ink">
            View Teams
          </NavLink>
          <NavLink to="/standings" className="flex items-center gap-2 border border-line px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink-dim hover:border-ink hover:text-ink">
            View Standings
          </NavLink>
        </motion.div>
      </div>
    </section>
  )
}
