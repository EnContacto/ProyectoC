import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ImportResultDto } from '@/api/dto'
import { SeverityChip } from './status'
import { useRevertImport } from '@/api/imports'
import { useToast } from '@/features/toast/ToastProvider'
import { formatDate } from '@/utils/format'

interface Props {
  result: ImportResultDto
  isDryRun: boolean
  onReverted?: () => void
}

interface CounterProps {
  label: string
  value: number
  tone: string
}

function Counter({ label, value, tone }: CounterProps) {
  return (
    <Paper
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: (t) => `1px solid ${alpha(tone, 0.18)}`,
        background: `linear-gradient(135deg, ${alpha(tone, 0.06)} 0%, transparent 70%)`,
        minWidth: 110,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: tone,
          lineHeight: 1.1,
          mt: 0.25,
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

export function ImportResultPanel({ result, isDryRun, onReverted }: Props) {
  const toast = useToast()
  const revert = useRevertImport()
  const [copied, setCopied] = useState(false)

  const hasErrors = result.errorRows > 0 || result.errors.length > 0
  const hasDuplicates = result.duplicateRows > 0

  const summaryTone = result.status === 5 ? '#C62828' : hasErrors ? '#ED6C02' : '#2E7D32'
  const SummaryIcon =
    result.status === 5
      ? ErrorOutlineRoundedIcon
      : hasErrors
        ? WarningAmberRoundedIcon
        : CheckCircleOutlineRoundedIcon

  const handleRevert = async () => {
    try {
      await revert.mutateAsync(result.batchId)
      toast('Lote revertido. Los activos asociados fueron eliminados.', 'success')
      onReverted?.()
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No se pudo revertir el lote'
      toast(message, 'error')
    }
  }

  const handleCopyErrors = async () => {
    const lines = [
      `Lote: ${result.batchId}`,
      `Archivo: ${result.fileName}`,
      `Filas: ${result.totalRows}`,
      `Errores: ${result.errorRows}`,
      '',
      ...result.errors.map(
        (e) =>
          `Fila ${e.rowNumber}${e.columnName ? ` · ${e.columnName}` : ''} · ${e.message}${
            e.rawValue ? ` · valor: ${e.rawValue}` : ''
          }`,
      ),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 2.5,
          border: (t) => `1px solid ${alpha(summaryTone, 0.22)}`,
          background: `linear-gradient(135deg, ${alpha(summaryTone, 0.06)} 0%, ${alpha(summaryTone, 0.01)} 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: alpha(summaryTone, 0.16),
              color: summaryTone,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SummaryIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3">
              {isDryRun ? 'Simulación completada' : 'Importación completada'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {result.fileName} · {formatDate(result.startedAt)}
            </Typography>
          </Box>
          {!isDryRun && result.status !== 6 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={
                revert.isPending ? <CircularProgress size={14} color="inherit" /> : <UndoOutlinedIcon />
              }
              disabled={revert.isPending}
              onClick={handleRevert}
              sx={{ textTransform: 'none' }}
            >
              Revertir
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
            gap: 1.25,
          }}
        >
          <Counter label="Filas" value={result.totalRows} tone="#0277BD" />
          <Counter label="Procesadas" value={result.processedRows} tone="#26A69A" />
          <Counter label="OK" value={result.successRows} tone="#2E7D32" />
          <Counter label="Errores" value={result.errorRows} tone="#C62828" />
          <Counter label="Duplicados" value={result.duplicateRows} tone="#ED6C02" />
          <Counter
            label={isDryRun ? 'Simulación' : 'Insertados'}
            value={isDryRun ? result.successRows : result.successRows - result.duplicateRows}
            tone="#4527A0"
          />
        </Box>

        {result.errorMessage && (
          <Typography
            variant="body2"
            sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#FFEBEE', color: '#B71C1C' }}
          >
            {result.errorMessage}
          </Typography>
        )}
      </Paper>

      {hasErrors && (
        <Accordion
          disableGutters
          sx={{
            borderRadius: '12px !important',
            border: (t) => `1px solid ${t.palette.divider}`,
            '&:before': { display: 'none' },
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
              <ErrorOutlineRoundedIcon sx={{ color: '#C62828' }} fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Errores detectados ({result.errors.length})
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyErrors()
                }}
                startIcon={<ContentCopyOutlinedIcon fontSize="small" />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Divider />
            <Box sx={{ maxHeight: 380, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: 11, width: 70 }}>Fila</TableCell>
                    <TableCell sx={{ fontSize: 11, width: 100 }}>Severidad</TableCell>
                    <TableCell sx={{ fontSize: 11, width: 160 }}>Columna</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>Mensaje</TableCell>
                    <TableCell sx={{ fontSize: 11, width: 200 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.errors.map((e) => (
                    <TableRow key={e.id} hover>
                      <TableCell sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                        {e.rowNumber}
                      </TableCell>
                      <TableCell>
                        <SeverityChip severity={e.severity} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {e.columnName ?? '—'}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{e.message}</TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12,
                          fontFamily: 'ui-monospace, monospace',
                          color: 'text.secondary',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {e.rawValue ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {hasDuplicates && !hasErrors && (
        <Paper
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha('#ED6C02', 0.06),
            border: (t) => `1px solid ${alpha('#ED6C02', 0.22)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {result.duplicateRows}{' '}
            {result.duplicateRows === 1 ? 'fila duplicada fue omitida' : 'filas duplicadas fueron omitidas'}.
          </Typography>
        </Paper>
      )}
    </Stack>
  )
}