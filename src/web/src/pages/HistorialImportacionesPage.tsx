import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useImportBatches } from '@/api/imports'
import { ImportHistoryTable } from '@/features/imports/ImportHistoryTable'

export function HistorialImportacionesPage() {
  const batches = useImportBatches()

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <HistoryOutlinedIcon color="primary" />
          <Typography variant="h1">Historial de importaciones</Typography>
        </Stack>
        <Tooltip title="Recargar">
          <Button
            size="small"
            onClick={() => batches.refetch()}
            startIcon={<RefreshRoundedIcon fontSize="small" />}
            sx={{ color: 'text.secondary' }}
          >
            Recargar
          </Button>
        </Tooltip>
      </Stack>

      <ImportHistoryTable />
    </Box>
  )
}