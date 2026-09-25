import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import type { AssetDto, AssetFilters } from '@/api/dto'
import { useAssets } from '@/api/assets'
import { useCategories, useCompanies } from '@/api/catalogs'
import { formatMoney } from '@/utils/format'
import { StatusChip } from '@/features/assets/colors'

const STATUS_OPTIONS = [
  { value: 1, label: 'Bueno' },
  { value: 2, label: 'Regular' },
  { value: 3, label: 'Malo' },
  { value: 4, label: 'Dar de baja' },
  { value: 5, label: 'Faltante' },
  { value: 6, label: 'Cambio de serie' },
  { value: 7, label: 'Vendido' },
  { value: 99, label: 'ND' },
]

const DEFAULT_FILTERS: AssetFilters = {
  page: 1,
  pageSize: 50,
  manualReviewOnly: true,
}

interface Props {
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  onEdit: (asset: AssetDto) => void
  onMarkOne: (asset: AssetDto) => void
}

export function ReviewQueueTable({
  selectedIds,
  onSelectedIdsChange,
  onEdit,
  onMarkOne,
}: Props) {
  const [filters, setFilters] = useState<AssetFilters>(DEFAULT_FILTERS)
  const companies = useCompanies()
  const categories = useCategories()
  const query = useAssets(filters)

  const items = query.data?.items ?? []
  const totalCount = query.data?.totalCount ?? 0
  const loading = query.isLoading || query.isFetching

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const allVisibleSelected =
    items.length > 0 && items.every((a) => selectedSet.has(a.id))
  const someVisibleSelected = items.some((a) => selectedSet.has(a.id))

  const update = (patch: Partial<AssetFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch, manualReviewOnly: true }
      if (
        patch.page === undefined &&
        Object.keys(patch).some((k) => k !== 'page' && k !== 'pageSize')
      ) {
        next.page = 1
      }
      return next
    })
    onSelectedIdsChange([])
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    onSelectedIdsChange([])
  }

  const toggleAllVisible = (checked: boolean) => {
    const next = new Set(selectedIds)
    for (const a of items) {
      if (checked) next.add(a.id)
      else next.delete(a.id)
    }
    onSelectedIdsChange(Array.from(next))
  }

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) next.add(id)
    else next.delete(id)
    onSelectedIdsChange(Array.from(next))
  }

  const activeFiltersCount = [
    filters.companyId,
    filters.categoryId,
    filters.status,
    filters.search,
  ].filter(Boolean).length

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Buscar código, serie, factura, proveedor…"
            value={filters.search ?? ''}
            onChange={(e) => update({ search: e.target.value || undefined })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Empresa"
            value={filters.companyId ?? ''}
            onChange={(e) => update({ companyId: e.target.value || undefined })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(companies.data ?? []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Categoría"
            value={filters.categoryId ?? ''}
            onChange={(e) => update({ categoryId: e.target.value || undefined })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(categories.data ?? []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Estado"
            value={filters.status ?? ''}
            onChange={(e) =>
              update({ status: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          >
            <MenuItem value="">Todos</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {activeFiltersCount > 0 && (
          <Stack direction="row" sx={{ mt: 1.5 }}>
            <Button
              size="small"
              onClick={clearFilters}
              startIcon={<FilterAltOffOutlinedIcon fontSize="small" />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Limpiar filtros ({activeFiltersCount})
            </Button>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 44, p: 0.5 }} align="center">
                  <Checkbox
                    size="small"
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected && !allVisibleSelected}
                    onChange={(e) => toggleAllVisible(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                  Código
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 200 }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                  Empresa
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                  Categoría
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 110 }}>
                  Estado
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 260 }}>
                  Motivo de revisión
                </TableCell>
                <TableCell
                  sx={{ fontSize: 11, fontWeight: 600, minWidth: 130, textAlign: 'right' }}
                >
                  Valor
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, width: 110 }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton width="70%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ py: 8, textAlign: 'center' }}>
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '14px',
                          bgcolor: alpha('#2E7D32', 0.1),
                          color: '#2E7D32',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TaskAltRoundedIcon />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        No hay activos pendientes de revisión
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Todo está en orden con los filtros actuales
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                items.map((a) => {
                  const isSelected = selectedSet.has(a.id)
                  return (
                    <TableRow
                      key={a.id}
                      hover
                      selected={isSelected}
                      sx={{
                        '&:hover td': {
                          backgroundColor: isSelected
                            ? 'rgba(38, 166, 154, 0.10)'
                            : 'rgba(38, 166, 154, 0.04)',
                        },
                        '&.Mui-selected td': {
                          backgroundColor: 'rgba(38, 166, 154, 0.08)',
                        },
                      }}
                    >
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={(e) => toggleOne(a.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {a.currentCode}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12.5 }}>{a.name ?? '—'}</TableCell>
                      <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                        {a.companyName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                        {a.categoryName}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={a.status} label={a.statusName} />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12,
                          color: 'text.secondary',
                          maxWidth: 340,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.manualReviewReason ?? '—'}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12.5,
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatMoney(a.acquisitionValue)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => onEdit(a)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Marcar como revisado">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => onMarkOne(a)}
                            >
                              <TaskAltRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={filters.page - 1}
          rowsPerPage={filters.pageSize}
          onPageChange={(_, next) => update({ page: next + 1 })}
          onRowsPerPageChange={(e) =>
            update({ pageSize: Number(e.target.value), page: 1 })
          }
          rowsPerPageOptions={[25, 50, 100, 200]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            '.MuiTablePagination-toolbar': { px: 2, minHeight: 52 },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: 12.5,
              color: 'text.secondary',
            },
          }}
        />
      </Paper>
    </Stack>
  )
}