import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined'
import { useToast } from '@/features/toast/ToastProvider'
import { COLUMN_MAP, type ReportColumn } from '@/features/reports/catalog'
import { ColumnBuilder } from '@/features/reports/ColumnBuilder'
import { FiltersPanel } from '@/features/reports/FiltersPanel'
import { ReportPreview } from '@/features/reports/ReportPreview'
import { exportAssetsToExcel } from '@/features/reports/exportToExcel'
import { useReportData } from '@/features/reports/useReportData'
import type { AssetFilters } from '@/api/dto'

const DEFAULT_COLUMNS: string[] = [
  'currentCode',
  'name',
  'companyName',
  'categoryName',
  'classificationName',
  'statusName',
  'acquisitionValue',
  'accumulatedDepreciation',
  'netCost',
  'purchaseDate',
  'locationName',
  'custodianName',
]

const DEFAULT_FILTERS: AssetFilters = {
  page: 1,
  pageSize: 50,
}

export function ReportesPage() {
  const toast = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState<AssetFilters>(DEFAULT_FILTERS)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading, isFetching } = useReportData(filters)

  const rows = data?.rows ?? []
  const totalCount = data?.total ?? 0

  const columns: ReportColumn[] = useMemo(
    () =>
      selectedIds
        .map((id) => COLUMN_MAP.get(id))
        .filter((c): c is ReportColumn => Boolean(c)),
    [selectedIds],
  )

  const updateFilters = (patch: Partial<AssetFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const handleResetColumns = () => setSelectedIds(DEFAULT_COLUMNS)

  const handleResetAll = () => {
    setSelectedIds(DEFAULT_COLUMNS)
    setFilters(DEFAULT_FILTERS)
  }

  const handleExport = async () => {
    if (columns.length === 0) {
      toast('Debes seleccionar al menos una columna', 'warning')
      return
    }
    if (rows.length === 0) {
      toast('No hay datos para exportar', 'warning')
      return
    }
    setExporting(true)
    try {
      await exportAssetsToExcel({
        fileName: 'activos-fijos',
        columns,
        rows,
        title: 'Reporte de activos fijos',
      })
      toast(`${rows.length} filas exportadas`, 'success')
    } catch {
      toast('No se pudo generar el archivo', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <InsertChartOutlinedIcon color="primary" />
          <Typography variant="h1">Reportes</Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="inherit"
            onClick={handleResetAll}
            startIcon={<RestartAltRoundedIcon fontSize="small" />}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Reiniciar
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={exporting || isLoading || rows.length === 0 || columns.length === 0}
            startIcon={
              exporting ? <CircularProgress size={16} color="inherit" /> : <DownloadOutlinedIcon />
            }
            sx={{ borderRadius: 2 }}
          >
            Exportar a Excel
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <SectionHeader
          icon={<ViewColumnOutlinedIcon fontSize="small" />}
          title="Columnas del reporte"
          subtitle="Selecciona, ordena y reorganiza qué información se incluye"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={handleResetColumns}
              sx={{ color: 'text.secondary', textTransform: 'none', fontSize: 12 }}
            >
              Restaurar
            </Button>
          }
        />
        <ColumnBuilder selectedIds={selectedIds} onChange={setSelectedIds} />

        <SectionHeader
          icon={<FilterAltOutlinedIcon fontSize="small" />}
          title="Filtros del reporte"
          subtitle="Aplica el mismo conjunto de filtros a la previsualización y la exportación"
        />
        <FiltersPanel filters={filters} onChange={updateFilters} />

        <SectionHeader
          icon={<PreviewOutlinedIcon fontSize="small" />}
          title="Previsualización"
          subtitle="Muestra las primeras 100 filas del resultado final"
        />
        <ReportPreview
          columns={columns}
          rows={rows}
          totalCount={totalCount}
          loading={isLoading || isFetching}
          previewLimit={100}
        />

        <Paper
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: (t) => `1px dashed ${t.palette.divider}`,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            La exportación incluye todas las filas filtradas ({totalCount}), no solo las de la
            previsualización. El archivo Excel lleva encabezados con estilo, autofiltro y formatos
            de fecha y moneda.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  )
}

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: '8px',
            bgcolor: 'rgba(38, 166, 154, 0.12)',
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      {action}
    </Stack>
  )
}