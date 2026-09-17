import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className = '',
}: {
  eyebrow?: string
  title?: string
  description?: string
  action?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <motion.section
      className={`mx-auto max-w-[1400px] px-5 py-14 md:px-8 lg:py-20 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {(eyebrow || title) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            {eyebrow && (
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-signal">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
                {title}
              </h2>
            )}
            {description && <p className="mt-2 max-w-xl text-sm text-ink-dim">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.section>
  )
}
