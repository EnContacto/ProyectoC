const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

export function monthLabel(month: number): string {
  const m = MONTHS_ES[month - 1]
  return m ?? `M${month}`
}

export function monthFullLabel(year: number, month: number): string {
  return `${monthLabel(month)} ${year}`
}