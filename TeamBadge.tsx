import type { Team } from '../../data/types'

const SIZE_CLASSES: Record<string, string> = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-[10px]',
  lg: 'h-11 w-11 text-base',
  xl: 'h-20 w-20 text-2xl',
}

export function TeamBadge({
  team,
  size = 'md',
  className = '',
}: {
  team: Pick<Team, 'tag' | 'colors' | 'logoDataUrl'>
  size?: keyof typeof SIZE_CLASSES
  className?: string
}) {
  if (team.logoDataUrl) {
    return (
      <img
        src={team.logoDataUrl}
        alt=""
        className={`shrink-0 border border-line object-cover ${SIZE_CLASSES[size]} ${className}`}
      />
    )
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-display font-bold text-void ${SIZE_CLASSES[size]} ${className}`}
      style={{ backgroundColor: team.colors.primary }}
    >
      {team.tag}
    </span>
  )
}
