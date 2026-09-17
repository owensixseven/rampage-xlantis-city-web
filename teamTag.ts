// Shared by src/data/mockData.ts (initial 100 teams) and src/lib/store.tsx
// (teams registered at runtime), so new registrations get tags consistent
// with the rest of the site.
export function tagFor(name: string, usedTags: Set<string>): string {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
  let base = cleaned.length <= 4 ? cleaned.toUpperCase() : cleaned.slice(0, 3).toUpperCase()
  if (!base) base = 'TM'
  let tag = base
  let n = 2
  while (usedTags.has(tag)) {
    tag = `${base}${n}`.slice(0, 4)
    n++
  }
  usedTags.add(tag)
  return tag
}

export const TEAM_COLOR_PAIRS: [string, string][] = [
  ['#ff7a1a', '#14181c'], ['#4dc8e0', '#0a0c0e'], ['#e8b400', '#1b2025'],
  ['#ff3d3d', '#14181c'], ['#2fe0a8', '#0f1215'], ['#c7cdd6', '#14181c'],
  ['#c97a3d', '#0a0c0e'], ['#9d6bff', '#14181c'], ['#5ee6ff', '#0a0c0e'],
  ['#ff8fa3', '#14181c'],
]
