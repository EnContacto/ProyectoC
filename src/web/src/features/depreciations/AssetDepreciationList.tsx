import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import type { RowSelectionState } from '@tanstack/react-table'
import type { AssetFilters, DepreciationFilters } from '@/api/dto'
import { useAssets } from '@/api/assets'
import { useCategories, useCompanies } from '@/api/catalogs'
import { formatMoney, formatNumber } from '@/utils/format'
import { StatusChip } from '@/features/assets/colors'
import { BulkEditBar } from '@/features/assets/BulkEditBar'
import { BulkDepreciationModal } from './BulkDepreciationModal'
import { AssetDepreciationModal } from './AssetDepreciationModal'

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

const DEFAULT_FILTERS: DepreciationFilters = {
  page: 1,
  pageSize: 50,
}

function toAssetFilters(f: DepreciationFilters): AssetFilters {
  return {
    companyId: f.companyId,
    categoryId: f.categoryId,
    status: f.status,
    acquisitionYear: f.acquisitionYear,
    minValue: f.minValue,
    maxValue: f.maxValue,
    manualReviewOnly: f.manualReviewOnly,
    page: f.page,
    pageSize: f.pageSize,
  }
}

export function AssetDepreciationList() {
  const [filters, setFilters] = useState<DepreciationFilters>(DEFAULT_FILTERS)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkOpen, setBulkOpen] = useState(false)
  const [detailAssetId, setDetailAssetId] = useState<string | null>(null)

  const companies = useCompanies()
  const categories = useCategories()

  const assetsQuery = useAssets(toAssetFilters(filters))

  const update = (patch: Partial<DepreciationFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch }
      if (
        patch.page === undefined &&
        Object.keys(patch).some((k) => k !== 'page' && k !== 'pageSize')
      ) {
        next.page = 1
      }
      return next
    })
  }

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  useEffect(() => {
    setRowSelection({})
  }, [
    filters.companyId,
    filters.categoryId,
    filters.status,
    filters.acquisitionYear,
    filters.minValue,
    filters.maxValue,
    filters.manualReviewOnly,
  ])

  const rawItems = assetsQuery.data?.items ?? []

  const items = useMemo(() => {
    return rawItems.filter((a) => {
      if (filters.minUsefulLife !== undefined) {
        if ((a.usefulLifeYears ?? 0) < filters.minUsefulLife) return false
      }
      if (filters.maxUsefulLife !== undefined) {
        if ((a.usefulLifeYears ?? 0) > filters.maxUsefulLife) return false
      }
      if (filters.minResidualRate !== undefined) {
        if ((a.residualRate ?? 0) < filters.minResidualRate) return false
      }
      if (filters.maxResidualRate !== undefined) {
        if ((a.residualRate ?? 0) > filters.maxResidualRate) return false
      }
      return true
    })
  }, [rawItems, filters.minUsefulLife, filters.maxUsefulLife, filters.minResidualRate, filters.maxResidualRate])

  const totalCount = assetsQuery.data?.totalCount ?? 0
  const loading = assetsQuery.isLoading || assetsQuery.isFetching

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  )
  const selectedCount = selectedIds.length

  const allVisibleSelected =
    items.length > 0 && items.every((a) => rowSelection[a.id] === true)

  const toggleAllVisible = (next: boolean) => {
    setRowSelection((prev) => {
      const copy = { ...prev }
      for (const a of items) {
        if (next) copy[a.id] = true
        else delete copy[a.id]
      }
      return copy
    })
  }

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
            gap: 1.5,
            mb: 1.5,
          }}
        >
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

          <TextField
            label="Año adquisición"
            type="number"
            value={filters.acquisitionYear ?? ''}
            onChange={(e) =>
              update({
                acquisitionYear: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(6, minmax(0, 1fr))' },
            gap: 1.5,
          }}
        >
          <TextField
            label="Vida útil mín."
            type="number"
            value={filters.minUsefulLife ?? ''}
            onChange={(e) =>
              update({
                minUsefulLife: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Vida útil máx."
            type="number"
            value={filters.maxUsefulLife ?? ''}
            onChange={(e) =>
              update({
                maxUsefulLife: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Valor mín."
            type="number"
            value={filters.minValue ?? ''}
            onChange={(e) =>
              update({ minValue: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Valor máx."
            type="number"
            value={filters.maxValue ?? ''}
            onChange={(e) =>
              update({ maxValue: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Residual mín."
            type="number"
            value={filters.minResidualRate ?? ''}
            onChange={(e) =>
              update({
                minResidualRate: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { step: 0.01, min: 0, max: 1 },
            }}
          />
          <TextField
            label="Residual máx."
            type="number"
            value={filters.maxResidualRate ?? ''}
            onChange={(e) =>
              update({
                maxResidualRate: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { step: 0.01, min: 0, max: 1 },
            }}
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Box />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 11, alignSelf: 'center' }}
          >
            Vida útil y residual se filtran sobre la página actual
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, width: 44, p: 0.5 }} align="center">
                  <Checkbox
                    size="small"
                    checked={allVisibleSelected}
                    indeterminate={
                      !allVisibleSelected && items.some((a) => rowSelection[a.id])
                    }
                    onChange={(e) => toggleAllVisible(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Vida útil
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Valor
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Residual
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Dep. acumulada
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Costo neto
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, width: 44 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 11 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton width="70%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    No hay activos con los filtros actuales
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                items.map((a) => {
                  const selected = Boolean(rowSelection[a.id])
                  return (
                    <TableRow key={a.id} hover selected={selected}>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Checkbox
                          size="small"
                          checked={selected}
                          onChange={(e) =>
                            setRowSelection((prev) => {
                              const copy = { ...prev }
                              if (e.target.checked) copy[a.id] = true
                              else delete copy[a.id]
                              return copy
                            })
                          }
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12,
                          fontFamily: 'ui-monospace, monospace',
                          fontWeight: 600,
                        }}
                      >
                        {a.currentCode}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12.5 }}>{a.name ?? '—'}</TableCell>
                      <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                        {a.categoryName}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={a.status} label={a.statusName} />
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 12.5, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {a.usefulLifeYears ?? '—'}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 12.5, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatMoney(a.acquisitionValue)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12.5,
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          color: 'text.secondary',
                        }}
                      >
                        {a.residualRate !== null && a.residualRate !== undefined
                          ? `${(a.residualRate * 100).toFixed(1)}%`
                          : '—'}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12.5,
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#C62828',
                        }}
                      >
                        {formatMoney(a.accumulatedDepreciation)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12.5,
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                        }}
                      >
                        {formatMoney(a.netCost)}
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }} align="center">
                        <Stack direction="row" spacing={0.25} justifyContent="center">
                          {a.manualReviewRequired && (
                            <Tooltip title={a.manualReviewReason ?? 'Requiere revisión'}>
                              <WarningAmberRoundedIcon
                                sx={{ fontSize: 18, color: '#ED6C02' }}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Ver depreciación">
                            <IconButton size="small" onClick={() => setDetailAssetId(a.id)}>
                              <VisibilityOutlinedIcon fontSize="small" />
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
          page={(filters.page ?? 1) - 1}
          rowsPerPage={filters.pageSize ?? 50}
          onPageChange={(_, next) => update({ page: next + 1 })}
          onRowsPerPageChange={(e) => update({ pageSize: Number(e.target.value), page: 1 })}
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

      <BulkEditBar
        selectedCount={selectedCount}
        totalFiltered={totalCount}
        showSelectAllFiltered={false}
        loadingAllFiltered={false}
        onSelectAllFiltered={() => undefined}
        onClear={() => setRowSelection({})}
        onEdit={() => setBulkOpen(true)}
      />

      <BulkDepreciationModal
        open={bulkOpen}
        selectedIds={selectedIds}
        onClose={() => setBulkOpen(false)}
        onSuccess={() => setRowSelection({})}
      />

      <AssetDepreciationModal
        open={Boolean(detailAssetId)}
        assetId={detailAssetId}
        onClose={() => setDetailAssetId(null)}
      />

      <Box sx={{ display: 'none' }}>{formatNumber(0)}</Box>
    </Stack>
  )
}