import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { AssetDto } from '@/api/dto'
import { displayValue, type ReportColumn } from './catalog'

interface Props {
  columns: ReportColumn[]
  rows: AssetDto[]
  totalCount: number
  loading: boolean
  previewLimit?: number
}

export function ReportPreview({
  columns,
  rows,
  totalCount,
  loading,
  previewLimit = 100,
}: Props) {
  const previewRows = rows.slice(0, previewLimit)
  const notShown = rows.length - previewRows.length

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Previsualización
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {loading && <CircularProgress size={16} />}
          <Typography variant="caption" color="text.secondary">
            {previewRows.length} de {totalCount} filas
          </Typography>
        </Stack>
      </Box>

      {columns.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 8, color: 'text.secondary' }}>
          <Typography variant="body2">Selecciona al menos una columna</Typography>
        </Stack>
      ) : (
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      minWidth: Math.min(col.width * 6, 220),
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        <Skeleton width="70%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && previewRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}
                  >
                    Sin resultados para los filtros actuales
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                previewRows.map((asset) => (
                  <TableRow key={asset.id} hover>
                    {columns.map((col) => {
                      const text = displayValue(col, asset)
                      const isRight = col.kind === 'money' || col.kind === 'number' || col.kind === 'percent'
                      const isCenter = col.kind === 'date' || col.kind === 'enum'
                      return (
                        <TableCell
                          key={col.id}
                          sx={{
                            fontSize: 12.5,
                            textAlign: isRight ? 'right' : isCenter ? 'center' : 'left',
                            fontVariantNumeric:
                              isRight || col.id === 'currentCode' ? 'tabular-nums' : 'normal',
                            whiteSpace: 'nowrap',
                            maxWidth: 260,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {text}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}

              {!loading && notShown > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{
                      py: 1.5,
                      textAlign: 'center',
                      bgcolor: 'background.default',
                      color: 'text.secondary',
                      fontSize: 12,
                    }}
                  >
                    y {notShown} más. Se exportarán todas al generar el archivo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  )
}