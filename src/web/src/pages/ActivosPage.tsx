import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { RowSelectionState, VisibilityState } from '@tanstack/react-table'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import type { AssetDto, AssetFilters } from '@/api/dto'
import { fetchAllFilteredIds, useAssetSummary, useAssets } from '@/api/assets'
import { AssetFiltersBar } from '@/features/assets/AssetFiltersBar'
import { AtAGlance } from '@/features/assets/AtAGlance'
import { AssetsTable, ColumnVisibilityMenuItems } from '@/features/assets/AssetsTable'
import { AssetEditModal } from '@/features/assets/AssetEditModal'
import { BulkEditBar } from '@/features/assets/BulkEditBar'
import { BulkEditModal } from '@/features/assets/BulkEditModal'
import { buildAssetColumns } from '@/features/assets/columns'
import { ImportUpload } from '@/features/imports/ImportUpload'
import { useToast } from '@/features/toast/ToastProvider'

const COLUMN_STORAGE_KEY = 'pc_assets_columns_v1'

const DEFAULT_FILTERS: AssetFilters = {
  page: 1,
  pageSize: 50,
}

const ALL_COLUMNS: { id: string; label: string }[] = [
  { id: 'currentCode', label: 'Código' },
  { id: 'name', label: 'Nombre' },
  { id: 'categoryName', label: 'Categoría' },
  { id: 'companyName', label: 'Empresa' },
  { id: 'statusName', label: 'Estado' },
  { id: 'classificationName', label: 'Clasificación' },
  { id: 'qualityFlagName', label: 'Etiquetas' },
  { id: 'acquisitionValue', label: 'Valor adquisición' },
  { id: 'accumulatedDepreciation', label: 'Dep. acumulada' },
  { id: 'netCost', label: 'Costo neto' },
  { id: 'locationName', label: 'Ubicación' },
  { id: 'custodianName', label: 'Custodio' },
  { id: 'accountingAccountCode', label: 'Cuenta contable' },
  { id: 'purchaseDate', label: 'Fecha adquisición' },
  { id: 'serial', label: 'Serie' },
  { id: 'provider', label: 'Proveedor' },
]

function loadColumnVisibility(): VisibilityState {
  const defaults: VisibilityState = {
    qualityFlagName: false,
    accumulatedDepreciation: false,
    locationName: false,
    custodianName: false,
    accountingAccountCode: false,
    purchaseDate: false,
    serial: false,
    provider: false,
  }
  try {
    const raw = localStorage.getItem(COLUMN_STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as VisibilityState
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function ActivosPage() {
  const toast = useToast()
  const [tab, setTab] = useState(0)
  const [filters, setFilters] = useState<AssetFilters>(DEFAULT_FILTERS)
  const [editingAsset, setEditingAsset] = useState<AssetDto | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    loadColumnVisibility(),
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkOpen, setBulkOpen] = useState(false)
  const [columnsAnchor, setColumnsAnchor] = useState<null | HTMLElement>(null)
  const [loadingAllFiltered, setLoadingAllFiltered] = useState(false)

  useEffect(() => {
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(columnVisibility))
  }, [columnVisibility])

  const filtersKeyForSelection = [
    filters.companyId,
    filters.categoryId,
    filters.status,
    filters.classification,
    filters.qualityFlag,
    filters.locationId,
    filters.custodianId,
    filters.minValue,
    filters.maxValue,
    filters.acquisitionYear,
    filters.search,
    filters.manualReviewOnly,
  ].join('|')

  useEffect(() => {
    setRowSelection({})
  }, [filtersKeyForSelection])

  const assetsQuery = useAssets(filters)
  const summaryQuery = useAssetSummary(filters)

  const updateFilters = (patch: Partial<AssetFilters>) => {
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

  const columns = useMemo(
    () => buildAssetColumns({ onEdit: (asset) => setEditingAsset(asset) }),
    [],
  )

  const totalCount = assetsQuery.data?.totalCount ?? 0
  const rows = assetsQuery.data?.items ?? []
  const loading = assetsQuery.isLoading || assetsQuery.isFetching

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  )
  const selectedCount = selectedIds.length

  const allPageSelected = rows.length > 0 && rows.every((r) => rowSelection[r.id] === true)
  const allFilteredSelected = totalCount > 0 && selectedCount === totalCount
  const showSelectAllFiltered = allPageSelected && !allFilteredSelected && totalCount > rows.length

  const toggleColumn = (id: string, next: boolean) => {
    setColumnVisibility((prev) => ({ ...prev, [id]: next }))
  }

  const handleSelectAllFiltered = async () => {
    setLoadingAllFiltered(true)
    try {
      const ids = await fetchAllFilteredIds(filters)
      const next: RowSelectionState = {}
      for (const id of ids) next[id] = true
      setRowSelection(next)
      toast(`${ids.length} activos seleccionados`, 'info')
    } catch {
      toast('No se pudo obtener la lista completa de activos', 'error')
    } finally {
      setLoadingAllFiltered(false)
    }
  }

  const handleClearSelection = () => setRowSelection({})

  const handleBulkSuccess = () => setRowSelection({})

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Inventory2OutlinedIcon color="primary" />
          <Typography variant="h1">Activos</Typography>
        </Stack>
        {tab === 0 && (
          <Tooltip title="Recargar datos">
            <Button
              size="small"
              onClick={() => {
                assetsQuery.refetch()
                summaryQuery.refetch()
              }}
              startIcon={<RefreshRoundedIcon fontSize="small" />}
              sx={{ color: 'text.secondary' }}
            >
              Recargar
            </Button>
          </Tooltip>
        )}
      </Stack>

      <Paper sx={{ borderRadius: 2, mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            minHeight: 48,
            '& .MuiTab-root': { minHeight: 48, textTransform: 'none', fontWeight: 500 },
          }}
        >
          <Tab label="Listado" />
          <Tab
            icon={<CloudUploadOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="Importación ETL"
          />
        </Tabs>
      </Paper>

      {tab === 0 ? (
        <Stack spacing={2}>
          <AtAGlance data={summaryQuery.data} loading={summaryQuery.isLoading} />

          <AssetFiltersBar
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
            columnsMenu={
              <Tooltip title="Columnas">
                <Button
                  size="small"
                  color="inherit"
                  onClick={(e) => setColumnsAnchor(e.currentTarget)}
                  startIcon={<ViewColumnOutlinedIcon fontSize="small" />}
                  sx={{ color: 'text.secondary' }}
                >
                  Columnas
                </Button>
              </Tooltip>
            }
          />

          <Menu
            anchorEl={columnsAnchor}
            open={Boolean(columnsAnchor)}
            onClose={() => setColumnsAnchor(null)}
            slotProps={{
              paper: { sx: { minWidth: 240, maxHeight: 420, borderRadius: 2, mt: 1 } },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: 10.5,
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                Visibilidad
              </Typography>
            </Box>
            <ColumnVisibilityMenuItems
              allColumns={ALL_COLUMNS}
              visibility={columnVisibility as Record<string, boolean>}
              onToggle={toggleColumn}
            />
          </Menu>

          <AssetsTable
            columns={columns}
            data={rows}
            totalCount={totalCount}
            page={filters.page}
            pageSize={filters.pageSize}
            loading={loading}
            columnVisibility={columnVisibility}
            rowSelection={rowSelection}
            onColumnVisibilityChange={setColumnVisibility}
            onRowSelectionChange={setRowSelection}
            onPageChange={(page) => updateFilters({ page })}
            onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
          />
        </Stack>
      ) : (
        <ImportUpload />
      )}

      <AssetEditModal
        open={Boolean(editingAsset)}
        asset={editingAsset}
        onClose={() => setEditingAsset(null)}
      />

      <BulkEditModal
        open={bulkOpen}
        selectedIds={selectedIds}
        visibleAssets={rows}
        onClose={() => setBulkOpen(false)}
        onSuccess={handleBulkSuccess}
      />

      <BulkEditBar
        selectedCount={selectedCount}
        totalFiltered={totalCount}
        showSelectAllFiltered={showSelectAllFiltered}
        loadingAllFiltered={loadingAllFiltered}
        onSelectAllFiltered={handleSelectAllFiltered}
        onClear={handleClearSelection}
        onEdit={() => setBulkOpen(true)}
      />
    </Box>
  )
}