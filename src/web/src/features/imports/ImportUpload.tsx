import { useCallback, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import IconButton from '@mui/material/IconButton'
import type { ImportResultDto } from '@/api/dto'
import { useUploadImport } from '@/api/imports'
import { useToast } from '@/features/toast/ToastProvider'
import { ImportResultPanel } from './ImportResultPanel'

const ACCEPTED = '.xlsx,.xlsm'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function ImportUpload() {
  const toast = useToast()
  const upload = useUploadImport()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [ignoreErrors, setIgnoreErrors] = useState(true)
  const [lastResult, setLastResult] = useState<ImportResultDto | null>(null)
  const [lastWasDryRun, setLastWasDryRun] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const f = files[0]
    const lower = f.name.toLowerCase()
    if (!lower.endsWith('.xlsx') && !lower.endsWith('.xlsm')) {
      toast('Solo se aceptan archivos .xlsx o .xlsm', 'warning')
      return
    }
    setFile(f)
    setLastResult(null)
  }, [toast])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleUpload = async () => {
    if (!file) return
    try {
      const result = await upload.mutateAsync({ file, dryRun, ignoreErrors, skipDuplicates })
      setLastResult(result)
      setLastWasDryRun(dryRun)
      if (dryRun) {
        toast(`Simulación: ${result.successRows} filas válidas`, 'info')
      } else {
        toast(`Importación: ${result.successRows} filas insertadas`, 'success')
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No se pudo procesar el archivo'
      toast(message, 'error')
    }
  }

  const clearFile = () => {
    setFile(null)
    setLastResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2.5,
          border: (t) =>
            `1.5px dashed ${dragOver ? t.palette.primary.main : t.palette.divider}`,
          bgcolor: dragOver ? alpha('#26A69A', 0.04) : 'background.paper',
          transition: 'all .15s ease',
          cursor: file ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (!file) inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!file) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!file ? (
          <Stack spacing={1.5} alignItems="center" sx={{ py: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: (t) =>
                  `linear-gradient(135deg, ${alpha(t.palette.primary.light, 0.6)} 0%, ${t.palette.primary.main} 100%)`,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUploadOutlinedIcon fontSize="large" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Arrastra tu archivo aquí o haz clic para seleccionarlo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Formatos aceptados: .xlsx y .xlsm. Hojas reconocidas: INSTALACIONES, MUEBLES Y ENSERES, MAQUINARIA Y EQUIPO, EQUIPO DE COMPUTO, VEHICULOS, ADECUACIONES.
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: alpha('#2E7D32', 0.12),
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InsertDriveFileOutlinedIcon />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatSize(file.size)}
              </Typography>
            </Box>
            <Tooltip title="Quitar archivo">
              <IconButton size="small" onClick={clearFile} disabled={upload.isPending}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: 11,
            letterSpacing: 0.6,
            mb: 1.5,
          }}
        >
          Opciones
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 0.5, md: 3 }}
          divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
        >
          <Tooltip title="No inserta datos. Solo valida y cuenta.">
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="body2">Simulación</Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Stack>
              }
            />
          </Tooltip>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
              />
            }
            label={<Typography variant="body2">Omitir duplicados</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={ignoreErrors}
                onChange={(e) => setIgnoreErrors(e.target.checked)}
              />
            }
            label={<Typography variant="body2">Ignorar errores</Typography>}
          />
        </Stack>
      </Paper>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          disabled={!file || upload.isPending}
          onClick={handleUpload}
          startIcon={
            upload.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <PlayArrowRoundedIcon />
            )
          }
          sx={{ borderRadius: 2, minWidth: 200 }}
        >
          {upload.isPending
            ? 'Procesando…'
            : dryRun
              ? 'Simular importación'
              : 'Importar archivo'}
        </Button>
      </Stack>

      {lastResult && (
        <ImportResultPanel
          result={lastResult}
          isDryRun={lastWasDryRun}
          onReverted={clearFile}
        />
      )}
    </Stack>
  )
}