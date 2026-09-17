export function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatInr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}

export function kd(kills: number, deaths: number) {
  return (deaths === 0 ? kills : kills / deaths).toFixed(2)
}
