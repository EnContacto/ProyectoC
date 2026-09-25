import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

interface Props {
  selectedCount: number
  running: boolean
  progress: { done: number; total: number }
  onMarkReviewed: () => void
  onEdit: () => void
  onClear: () => void
}

export function ReviewBulkBar({
  selectedCount,
  running,
  progress,
  onMarkReviewed,
  onEdit,
  onClear,
}: Props) {
  if (selectedCount === 0) return null

  const percent = progress.total === 0 ? 0 : (progress.done / progress.total) * 100

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        animation: 'reviewBarIn .22s ease',
        '@keyframes reviewBarIn': {
          from: { opacity: 0, transform: 'translate(-50%, 12px)' },
          to: { opacity: 1, transform: 'translate(-50%, 0)' },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          boxShadow: (t) => `0 12px 40px ${t.palette.primary.main}22`,
          background: (t) =>
            `linear-gradient(135deg, ${t.palette.background.paper} 0%, ${t.palette.background.default} 100%)`,
          minWidth: 480,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'warning.main',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              minWidth: 40,
              textAlign: 'center',
            }}
          >
            {selectedCount}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {selectedCount === 1 ? 'pendiente' : 'pendientes'}
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={onMarkReviewed}
            disabled={running}
            startIcon={
              running ? <CircularProgress size={14} color="inherit" /> : <TaskAltRoundedIcon fontSize="small" />
            }
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Marcar como revisado
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={onEdit}
            disabled={running}
            startIcon={<EditOutlinedIcon fontSize="small" />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Editar
          </Button>

          <Tooltip title="Limpiar selección">
            <span>
              <IconButton size="small" onClick={onClear} disabled={running}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {running && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Procesando {progress.done} de {progress.total}…
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{ mt: 0.5, borderRadius: 1, height: 4 }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  )
}