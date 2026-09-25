import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import type { ImportResultDto } from '@/api/dto'
import { useImportBatch, useImportBatches, useRevertImport } from '@/api/imports'
import { BatchStatusChip } from './status'
import { ImportResultPanel } from './ImportResultPanel'
import { useToast } from '@/features/toast/ToastProvider'
import { formatDate } from '@/utils/format'

export function ImportHistoryTable() {
  const toast = useToast()
  const batches = useImportBatches()
  const revert = useRevertImport()
  const [detailId, setDetailId] = useState<string | null>(null)
  const [confirmRevert, setConfirmRevert] = useState<ImportResultDto | null>(null)
  const detail = useImportBatch(detailId)

  const loading = batches.isLoading

  const handleRevert = async (batch: ImportResultDto) => {
    try {
      await revert.mutateAsync(batch.batchId)
      toast('Lote revertido', 'success')
      setConfirmRevert(null)
      if (detailId === batch.batchId) setDetailId(null)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No se pudo revertir el lote'
      toast(message, 'error')
    }
  }

  return (
    <>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, width: 60 }}>Estado</TableCell>
                <TableCell sx={{ fontSize: 11 }}>Archivo</TableCell>
                <TableCell sx={{ fontSize: 11, width: 140 }}>Inicio</TableCell>
                <TableCell sx={{ fontSize: 11, width: 90, align: 'right' }}>Filas</TableCell>
                <TableCell sx={{ fontSize: 11, width: 90, align: 'right' }}>OK</TableCell>
                <TableCell sx={{ fontSize: 11, width: 90, align: 'right' }}>Errores</TableCell>
                <TableCell sx={{ fontSize: 11, width: 110, align: 'right' }}>Duplicados</TableCell>
                <TableCell sx={{ fontSize: 11, width: 120, align: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton width="80%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && (batches.data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Aún no hay importaciones registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                (batches.data ?? []).map((b) => (
                  <TableRow key={b.batchId} hover>
                    <TableCell>
                      <BatchStatusChip status={b.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                        {b.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                      {formatDate(b.startedAt)}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {b.totalRows}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        color: '#2E7D32',
                        fontWeight: 600,
                      }}
                    >
                      {b.successRows}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        color: b.errorRows > 0 ? '#C62828' : 'text.secondary',
                        fontWeight: b.errorRows > 0 ? 600 : 400,
                      }}
                    >
                      {b.errorRows}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        color: b.duplicateRows > 0 ? '#ED6C02' : 'text.secondary',
                      }}
                    >
                      {b.duplicateRows}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalle">
                          <IconButton size="small" onClick={() => setDetailId(b.batchId)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {b.status !== 6 && (
                          <Tooltip title="Revertir">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setConfirmRevert(b)}
                            >
                              <UndoOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={Boolean(detailId)}
        onClose={() => setDetailId(null)}
        fullWidth
        maxWidth="md"
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
          <Typography variant="h3">Detalle del lote</Typography>
          <IconButton size="small" onClick={() => setDetailId(null)}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {detail.isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {detail.data && (
            <ImportResultPanel result={detail.data} isDryRun={false} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(confirmRevert)}
        onClose={() => setConfirmRevert(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, backgroundImage: 'none' } } }}
      >
        <DialogTitle sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          ¿Revertir importación?
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Se eliminarán los activos asociados al archivo{' '}
            <strong>{confirmRevert?.fileName}</strong>. Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setConfirmRevert(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={revert.isPending}
            onClick={() => confirmRevert && handleRevert(confirmRevert)}
            startIcon={
              revert.isPending ? <CircularProgress size={14} color="inherit" /> : <UndoOutlinedIcon />
            }
          >
            Revertir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}