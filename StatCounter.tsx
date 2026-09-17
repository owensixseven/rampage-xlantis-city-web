import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 800
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value])

  return <span ref={ref}>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>
}

export function StatCounter({
  value,
  label,
  prefix = '',
  suffix = '',
}: {
  value: number
  label: string
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="border-l-2 border-signal/60 pl-4">
      <div className="font-mono text-3xl font-semibold tabular text-ink md:text-4xl">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
        {label}
      </div>
    </div>
  )
}
