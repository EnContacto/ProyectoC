import Chip, { type ChipProps } from '@mui/material/Chip'

export interface ChipStyle {
  bg: string
  fg: string
}

export const STATUS_STYLES: Record<number, ChipStyle> = {
  1: { bg: '#E8F5E9', fg: '#1B5E20' },
  2: { bg: '#FFFDE7', fg: '#8D6E00' },
  3: { bg: '#FFEBEE', fg: '#B71C1C' },
  4: { bg: '#FFE0B2', fg: '#7A3E00' },
  5: { bg: '#FFCDD2', fg: '#8E0000' },
  6: { bg: '#E3F2FD', fg: '#0D47A1' },
  7: { bg: '#F8BBD0', fg: '#880E4F' },
  99: { bg: '#ECEFF1', fg: '#455A64' },
}

export const CLASSIFICATION_STYLES: Record<number, ChipStyle> = {
  1: { bg: '#E0F2F1', fg: '#00695C' },
  2: { bg: '#ECEFF1', fg: '#37474F' },
}

export const QUALITY_FLAG_STYLES: Record<number, ChipStyle> = {
  1: { bg: '#E8F5E9', fg: '#1B5E20' },
  2: { bg: '#FFFDE7', fg: '#8D6E00' },
  3: { bg: '#FFEBEE', fg: '#B71C1C' },
  4: { bg: '#FFF3E0', fg: '#E65100' },
  5: { bg: '#EDE7F6', fg: '#4527A0' },
}

interface SoftChipProps extends Omit<ChipProps, 'color'> {
  bg: string
  fg: string
}

export function SoftChip({ bg, fg, sx, ...rest }: SoftChipProps) {
  return (
    <Chip
      size="small"
      {...rest}
      sx={{
        bgcolor: bg,
        color: fg,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
        borderRadius: '6px',
        border: 'none',
        ...(sx as object),
      }}
    />
  )
}

export function StatusChip({ status, label }: { status: number; label: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[99]
  return <SoftChip bg={style.bg} fg={style.fg} label={label} />
}

export function ClassificationChip({
  classification,
  label,
}: {
  classification: number
  label: string
}) {
  const style = CLASSIFICATION_STYLES[classification] ?? CLASSIFICATION_STYLES[2]
  return <SoftChip bg={style.bg} fg={style.fg} label={label} />
}

export function QualityFlagChip({ flag, label }: { flag: number; label: string }) {
  if (flag === 1) return null
  const style = QUALITY_FLAG_STYLES[flag] ?? QUALITY_FLAG_STYLES[2]
  return <SoftChip bg={style.bg} fg={style.fg} label={label} />
}