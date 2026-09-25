import type { ColumnDef } from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { AssetDto } from '@/api/dto'
import { formatDate, formatMoney } from '@/utils/format'
import { ClassificationChip, QualityFlagChip, StatusChip } from './colors'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    label: string
    align?: 'left' | 'right' | 'center'
    defaultHidden?: boolean
    minWidth?: number
    sticky?: 'left' | 'right'
  }
}

interface BuildColumnsParams {
  onEdit: (asset: AssetDto) => void
}

export function buildAssetColumns({ onEdit }: BuildColumnsParams): ColumnDef<AssetDto>[] {
  return [
    {
      id: '__select',
      size: 44,
      header: ({ table }) => (
        <Checkbox
          size="small"
          indeterminate={table.getIsSomePageRowsSelected()}
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          sx={{ p: 0.5 }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          size="small"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          sx={{ p: 0.5 }}
        />
      ),
      enableSorting: false,
      meta: { label: '', minWidth: 44, align: 'center', sticky: 'left' },
    },
    {
      id: 'currentCode',
      accessorKey: 'currentCode',
      header: 'Código',
      enableSorting: true,
      meta: { label: 'Código', minWidth: 140, sticky: 'left' },
      cell: ({ row }) => (
        <Box
          sx={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12.5,
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: 0.2,
          }}
        >
          {row.original.currentCode}
        </Box>
      ),
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nombre',
      enableSorting: true,
      meta: { label: 'Nombre', minWidth: 200 },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
          {row.original.name ?? '—'}
        </Box>
      ),
    },
    {
      id: 'categoryName',
      accessorKey: 'categoryName',
      header: 'Categoría',
      meta: { label: 'Categoría', minWidth: 150 },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>{row.original.categoryName}</Box>
      ),
    },
    {
      id: 'companyName',
      accessorKey: 'companyName',
      header: 'Empresa',
      meta: { label: 'Empresa', minWidth: 140 },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>{row.original.companyName}</Box>
      ),
    },
    {
      id: 'statusName',
      accessorKey: 'status',
      header: 'Estado',
      meta: { label: 'Estado', minWidth: 120 },
      cell: ({ row }) => <StatusChip status={row.original.status} label={row.original.statusName} />,
    },
    {
      id: 'classificationName',
      accessorKey: 'classification',
      header: 'Clasificación',
      meta: { label: 'Clasificación', minWidth: 120 },
      cell: ({ row }) => (
        <ClassificationChip
          classification={row.original.classification}
          label={row.original.classificationName}
        />
      ),
    },
    {
      id: 'qualityFlagName',
      accessorKey: 'qualityFlag',
      header: 'Etiquetas',
      meta: { label: 'Etiquetas', minWidth: 130, defaultHidden: true },
      cell: ({ row }) => (
        <QualityFlagChip
          flag={row.original.qualityFlag}
          label={row.original.qualityFlagName}
        />
      ),
    },
    {
      id: 'acquisitionValue',
      accessorKey: 'acquisitionValue',
      header: 'Valor adquisición',
      enableSorting: true,
      meta: { label: 'Valor adquisición', align: 'right', minWidth: 140 },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
          {formatMoney(row.original.acquisitionValue)}
        </Box>
      ),
    },
    {
      id: 'accumulatedDepreciation',
      accessorKey: 'accumulatedDepreciation',
      header: 'Dep. acumulada',
      meta: { label: 'Dep. acumulada', align: 'right', minWidth: 140, defaultHidden: true },
      cell: ({ row }) => (
        <Box
          sx={{
            fontSize: 13,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
            color: 'text.secondary',
          }}
        >
          {formatMoney(row.original.accumulatedDepreciation)}
        </Box>
      ),
    },
    {
      id: 'netCost',
      accessorKey: 'netCost',
      header: 'Costo neto',
      enableSorting: true,
      meta: { label: 'Costo neto', align: 'right', minWidth: 140 },
      cell: ({ row }) => (
        <Box
          sx={{
            fontSize: 13,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
            textAlign: 'right',
          }}
        >
          {formatMoney(row.original.netCost)}
        </Box>
      ),
    },
    {
      id: 'locationName',
      accessorKey: 'locationName',
      header: 'Ubicación',
      meta: { label: 'Ubicación', minWidth: 160, defaultHidden: true },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>{row.original.locationName ?? '—'}</Box>
      ),
    },
    {
      id: 'custodianName',
      accessorKey: 'custodianName',
      header: 'Custodio',
      meta: { label: 'Custodio', minWidth: 160, defaultHidden: true },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
          {row.original.custodianName ?? '—'}
        </Box>
      ),
    },
    {
      id: 'accountingAccountCode',
      accessorKey: 'accountingAccountCode',
      header: 'Cuenta',
      meta: { label: 'Cuenta contable', minWidth: 140, defaultHidden: true },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 12.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
          {row.original.accountingAccountCode ?? '—'}
        </Box>
      ),
    },
    {
      id: 'purchaseDate',
      accessorKey: 'purchaseDate',
      header: 'Fecha adquisición',
      enableSorting: true,
      meta: { label: 'Fecha adquisición', minWidth: 140, defaultHidden: true },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
          {formatDate(row.original.purchaseDate)}
        </Box>
      ),
    },
    {
      id: 'serial',
      accessorKey: 'serial',
      header: 'Serie',
      meta: { label: 'Serie', minWidth: 140, defaultHidden: true },
      cell: ({ row }) => (
        <Box
          sx={{
            fontSize: 12.5,
            fontFamily: 'ui-monospace, monospace',
            color: 'text.secondary',
          }}
        >
          {row.original.serial ?? '—'}
        </Box>
      ),
    },
    {
      id: 'provider',
      accessorKey: 'provider',
      header: 'Proveedor',
      meta: { label: 'Proveedor', minWidth: 170, defaultHidden: true },
      cell: ({ row }) => (
        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>{row.original.provider ?? '—'}</Box>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      meta: { label: 'Acciones', minWidth: 64, align: 'center', sticky: 'right' },
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(row.original)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]
}