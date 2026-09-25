import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SelectAllOutlinedIcon from '@mui/icons-material/SelectAllOutlined'

interface Props {
  selectedCount: number
  totalFiltered: number
  showSelectAllFiltered: boolean
  loadingAllFiltered: boolean
  onSelectAllFiltered: () => void
  onClear: () => void
  onEdit: () => void
}

export function BulkEditBar({
  selectedCount,
  totalFiltered,
  showSelectAllFiltered,
  loadingAllFiltered,
  onSelectAllFiltered,
  onClear,
  onEdit,
}: Props) {
  if (selectedCount === 0) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        animation: 'bulkBarIn .22s ease',
        '@keyframes bulkBarIn': {
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
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
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
            {selectedCount === 1 ? 'seleccionado' : 'seleccionados'}
          </Typography>

          {showSelectAllFiltered && (
            <>
              <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
              <Button
                size="small"
                onClick={onSelectAllFiltered}
                disabled={loadingAllFiltered}
                startIcon={
                  loadingAllFiltered ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <SelectAllOutlinedIcon fontSize="small" />
                  )
                }
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Seleccionar los {totalFiltered}
              </Button>
            </>
          )}

          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

          <Button
            size="small"
            variant="contained"
            onClick={onEdit}
            startIcon={<EditOutlinedIcon fontSize="small" />}
            sx={{ borderRadius: 2 }}
          >
            Editar
          </Button>

          <Tooltip title="Limpiar selección">
            <IconButton size="small" onClick={onClear}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  )
}