import type { ReactNode } from 'react'

export function Panel({
  children,
  className = '',
  clip = true,
  raised = false,
}: {
  children: ReactNode
  className?: string
  clip?: boolean
  raised?: boolean
}) {
  return (
    <div
      className={`border border-line ${raised ? 'bg-panel-raised' : 'bg-panel'} ${clip ? 'clip-tactical-sm' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        {eyebrow && (
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            {eyebrow}
          </div>
        )}
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
          {title}
        </h3>
      </div>
      {action}
    </div>
  )
}
