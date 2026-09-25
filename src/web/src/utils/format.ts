const DATE_FORMATTER = new Intl.DateTimeFormat('es-EC', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Guayaquil',
})

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return DATE_FORMATTER.format(date)
}

export function formatMoney(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return CURRENCY_FORMATTER.format(value)
}

export function formatNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return NUMBER_FORMATTER.format(value)
}