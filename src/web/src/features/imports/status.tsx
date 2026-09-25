import { SoftChip } from '@/features/assets/colors'

export const BATCH_STATUS_STYLES: Record<
  number,
  { bg: string; fg: string; label: string }
> = {
  1: { bg: '#FFFDE7', fg: '#8D6E00', label: 'Pendiente' },
  2: { bg: '#E3F2FD', fg: '#0D47A1', label: 'Procesando' },
  3: { bg: '#E8F5E9', fg: '#1B5E20', label: 'Completado' },
  4: { bg: '#FFF3E0', fg: '#E65100', label: 'Con errores' },
  5: { bg: '#FFEBEE', fg: '#B71C1C', label: 'Fallido' },
  6: { bg: '#ECEFF1', fg: '#455A64', label: 'Revertido' },
}

export const SEVERITY_STYLES: Record<
  number,
  { bg: string; fg: string; label: string }
> = {
  1: { bg: '#E1F5FE', fg: '#01579B', label: 'Info' },
  2: { bg: '#FFFDE7', fg: '#8D6E00', label: 'Advertencia' },
  3: { bg: '#FFEBEE', fg: '#B71C1C', label: 'Error' },
  4: { bg: '#FCE4EC', fg: '#880E4F', label: 'Crítico' },
}

export function BatchStatusChip({ status }: { status: number }) {
  const s = BATCH_STATUS_STYLES[status] ?? BATCH_STATUS_STYLES[5]
  return <SoftChip bg={s.bg} fg={s.fg} label={s.label} />
}

export function SeverityChip({ severity }: { severity: number }) {
  const s = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES[3]
  return <SoftChip bg={s.bg} fg={s.fg} label={s.label} />
}