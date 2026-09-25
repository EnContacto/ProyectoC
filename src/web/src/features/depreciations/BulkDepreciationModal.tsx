import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { api } from '@/api/client'
import { assetKeys } from '@/api/assets'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/features/toast/ToastProvider'

interface Props {
  open: boolean
  selectedIds: string[]
  onClose: () => void
  onSuccess: () => void
}

const CONCURRENCY = 5

interface Progress {
  done: number
  total: number
}

export function BulkDepreciationModal({ open, selectedIds, onClose, onSuccess }: Props) {
  const toast = useToast()
  const qc = useQueryClient()

  const [usefulLifeEnabled, setUsefulLifeEnabled] = useState(false)
  const [usefulLife, setUsefulLife] = useState<number | ''>('')

  const [residualRateEnabled, setResidualRateEnabled] = useState(false)
  const [residualRate, setResidualRate] = useState<number | ''>('')

  const [priorResidualEnabled, setPriorResidualEnabled] = useState(false)
  const [priorResidual, setPriorResidual] = useState<number | ''>('')

  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 0 })

  const enabledCount =
    Number(usefulLifeEnabled) + Number(residualRateEnabled) + Number(priorResidualEnabled)

  const reset = () => {
    setUsefulLifeEnabled(false)
    setUsefulLife('')
    setResidualRateEnabled(false)
    setResidualRate('')
    setPriorResidualEnabled(false)
    setPriorResidual('')
    setRunning(false)
    setProgress({ done: 0, total: 0 })
  }

  const handleClose = () => {
    if (running) return
    reset()
    onClose()
  }

  const handleApply = async () => {
    if (selectedIds.length === 0) return
    if (enabledCount === 0) {
      toast('Habilita al menos un parámetro', 'warning')
      return
    }

    const payload: Record<string, number> = {}
    if (usefulLifeEnabled && usefulLife !== '') payload.usefulLifeYears = Number(usefulLife)
    if (residualRateEnabled && residualRate !== '') payload.residualRate = Number(residualRate)
    if (priorResidualEnabled && priorResidual !== '')
      payload.priorResidualValue = Number(priorResidual)

    if (Object.keys(payload).length === 0) {
      toast('Debes completar los valores habilitados', 'warning')
      return
    }

    setRunning(true)
    setProgress({ done: 0, total: selectedIds.length })

    let ok = 0
    let failed = 0

    for (let i = 0; i < selectedIds.length; i += CONCURRENCY) {
      const chunk = selectedIds.slice(i, i + CONCURRENCY)
      const results = await Promise.allSettled(
        chunk.map((id) => api.put(`/assets/${id}`, payload)),
      )
      for (const r of results) {
        if (r.status === 'fulfilled') ok++
        else failed++
      }
      setProgress({ done: Math.min(i + CONCURRENCY, selectedIds.length), total: selectedIds.length })
    }

    await qc.invalidateQueries({ queryKey: assetKeys.all })
    setRunning(false)

    if (failed === 0) {
      toast(`${ok} activos actualizados`, 'success')
    } else {
      toast(`${ok} actualizados, ${failed} fallidos`, 'warning')
    }

    onSuccess()
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: 3, backgroundImage: 'none' } } }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="h3">Editar parámetros de depreciación</Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedIds.length} {selectedIds.length === 1 ? 'activo' : 'activos'} seleccionados
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={running}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={2} divider={<Divider />}>
          <Alert
            severity="info"
            icon={<InfoOutlinedIcon fontSize="small" />}
            sx={{ borderRadius: 2 }}
          >
            Al guardar, el sistema recalculará la depreciación de los activos afectados.
          </Alert>

          <FieldRow
            label="Vida útil (años)"
            enabled={usefulLifeEnabled}
            onEnable={setUsefulLifeEnabled}
            disabled={running}
          >
            <TextField
              type="number"
              size="small"
              value={usefulLife}
              onChange={(e) => setUsefulLife(e.target.value === '' ? '' : Number(e.target.value))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">años</InputAdornment>,
                },
              }}
              fullWidth
              disabled={running}
            />
          </FieldRow>

          <FieldRow
            label="Tasa residual"
            enabled={residualRateEnabled}
            onEnable={setResidualRateEnabled}
            disabled={running}
          >
            <TextField
              type="number"
              size="small"
              value={residualRate}
              onChange={(e) =>
                setResidualRate(e.target.value === '' ? '' : Number(e.target.value))
              }
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">% (0.1 = 10%)</InputAdornment>,
                },
                htmlInput: { step: 0.01, min: 0, max: 1 },
              }}
              fullWidth
              disabled={running}
            />
          </FieldRow>

          <FieldRow
            label="Valor residual anterior"
            enabled={priorResidualEnabled}
            onEnable={setPriorResidualEnabled}
            disabled={running}
          >
            <TextField
              type="number"
              size="small"
              value={priorResidual}
              onChange={(e) =>
                setPriorResidual(e.target.value === '' ? '' : Number(e.target.value))
              }
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              fullWidth
              disabled={running}
            />
          </FieldRow>

          {running && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Procesando {progress.done} de {progress.total}…
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress.total === 0 ? 0 : (progress.done / progress.total) * 100}
                sx={{ mt: 1, borderRadius: 1, height: 6 }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} color="inherit" disabled={running}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={enabledCount === 0 || running}
          startIcon={
            running ? <CircularProgress size={16} color="inherit" /> : <SaveOutlinedIcon />
          }
        >
          Aplicar a {selectedIds.length}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface FieldRowProps {
  label: string
  enabled: boolean
  onEnable: (v: boolean) => void
  disabled?: boolean
  children: React.ReactNode
}

function FieldRow({ label, enabled, onEnable, disabled, children }: FieldRowProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: (t) => `1px solid ${enabled ? t.palette.primary.main : t.palette.divider}`,
        bgcolor: enabled ? 'rgba(38, 166, 154, 0.04)' : 'transparent',
        transition: 'all .15s ease',
      }}
    >
      <FormControlLabel
        sx={{ m: 0 }}
        control={
          <Checkbox
            size="small"
            checked={enabled}
            onChange={(e) => onEnable(e.target.checked)}
            disabled={disabled}
          />
        }
        label={label}
      />
      {enabled && <Box sx={{ mt: 1 }}>{children}</Box>}
    </Box>
  )
}