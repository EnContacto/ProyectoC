import type { AssetDto } from '@/api/dto'
import { formatDate, formatMoney } from '@/utils/format'

export type ColumnKind = 'text' | 'money' | 'date' | 'number' | 'percent' | 'enum'

export interface ReportColumn {
  id: string
  label: string
  group: string
  kind: ColumnKind
  width: number
  accessor: (a: AssetDto) => string | number | null
  enumName?: (a: AssetDto) => string | null
}

const yesNo = (v: boolean | null | undefined): string =>
  v === true ? 'Sí' : v === false ? 'No' : '—'

export const REPORT_COLUMNS: ReportColumn[] = [
  {
    id: 'currentCode',
    label: 'Código',
    group: 'Identificación',
    kind: 'text',
    width: 16,
    accessor: (a) => a.currentCode,
  },
  {
    id: 'name',
    label: 'Nombre',
    group: 'Identificación',
    kind: 'text',
    width: 32,
    accessor: (a) => a.name ?? '',
  },
  {
    id: 'detail',
    label: 'Detalle',
    group: 'Identificación',
    kind: 'text',
    width: 40,
    accessor: (a) => a.detail ?? '',
  },
  {
    id: 'brand',
    label: 'Marca',
    group: 'Identificación',
    kind: 'text',
    width: 18,
    accessor: (a) => a.brand ?? '',
  },
  {
    id: 'model',
    label: 'Modelo',
    group: 'Identificación',
    kind: 'text',
    width: 18,
    accessor: (a) => a.model ?? '',
  },
  {
    id: 'serial',
    label: 'Serie',
    group: 'Identificación',
    kind: 'text',
    width: 20,
    accessor: (a) => a.serial ?? '',
  },
  {
    id: 'companyName',
    label: 'Empresa',
    group: 'Clasificación',
    kind: 'text',
    width: 20,
    accessor: (a) => a.companyName,
  },
  {
    id: 'categoryName',
    label: 'Categoría',
    group: 'Clasificación',
    kind: 'text',
    width: 22,
    accessor: (a) => a.categoryName,
  },
  {
    id: 'classificationName',
    label: 'Clasificación',
    group: 'Clasificación',
    kind: 'enum',
    width: 14,
    accessor: (a) => a.classificationName,
  },
  {
    id: 'statusName',
    label: 'Estado',
    group: 'Clasificación',
    kind: 'enum',
    width: 14,
    accessor: (a) => a.statusName,
  },
  {
    id: 'qualityFlagName',
    label: 'Etiqueta calidad',
    group: 'Clasificación',
    kind: 'enum',
    width: 16,
    accessor: (a) => a.qualityFlagName,
  },
  {
    id: 'manualReviewRequired',
    label: 'Revisión manual',
    group: 'Clasificación',
    kind: 'enum',
    width: 14,
    accessor: (a) => yesNo(a.manualReviewRequired),
  },
  {
    id: 'manualReviewReason',
    label: 'Motivo revisión',
    group: 'Clasificación',
    kind: 'text',
    width: 30,
    accessor: (a) => a.manualReviewReason ?? '',
  },
  {
    id: 'acquisitionValue',
    label: 'Valor de adquisición',
    group: 'Económico',
    kind: 'money',
    width: 18,
    accessor: (a) => a.acquisitionValue,
  },
  {
    id: 'priorResidualValue',
    label: 'Valor residual anterior',
    group: 'Económico',
    kind: 'money',
    width: 20,
    accessor: (a) => a.priorResidualValue,
  },
  {
    id: 'residualRate',
    label: 'Tasa residual',
    group: 'Económico',
    kind: 'percent',
    width: 14,
    accessor: (a) => a.residualRate,
  },
  {
    id: 'depreciableAmount',
    label: 'Importe depreciable',
    group: 'Económico',
    kind: 'money',
    width: 18,
    accessor: (a) => a.depreciableAmount,
  },
  {
    id: 'accumulatedDepreciation',
    label: 'Dep. acumulada',
    group: 'Económico',
    kind: 'money',
    width: 18,
    accessor: (a) => a.accumulatedDepreciation,
  },
  {
    id: 'netCost',
    label: 'Costo neto',
    group: 'Económico',
    kind: 'money',
    width: 16,
    accessor: (a) => a.netCost,
  },
  {
    id: 'usefulLifeYears',
    label: 'Vida útil (años)',
    group: 'Depreciación',
    kind: 'number',
    width: 14,
    accessor: (a) => a.usefulLifeYears,
  },
  {
    id: 'depreciationRate',
    label: 'Tasa depreciación',
    group: 'Depreciación',
    kind: 'percent',
    width: 16,
    accessor: (a) => a.depreciationRate,
  },
  {
    id: 'depreciationStartDate',
    label: 'Inicio depreciación',
    group: 'Depreciación',
    kind: 'date',
    width: 16,
    accessor: (a) => a.depreciationStartDate,
  },
  {
    id: 'finalDepreciationDate',
    label: 'Fin depreciación',
    group: 'Depreciación',
    kind: 'date',
    width: 16,
    accessor: (a) => a.finalDepreciationDate,
  },
  {
    id: 'totalDaysToDepreciate',
    label: 'Días totales',
    group: 'Depreciación',
    kind: 'number',
    width: 12,
    accessor: (a) => a.totalDaysToDepreciate,
  },
  {
    id: 'purchaseDate',
    label: 'Fecha de adquisición',
    group: 'Adquisición',
    kind: 'date',
    width: 18,
    accessor: (a) => a.purchaseDate,
  },
  {
    id: 'acquisitionYear',
    label: 'Año de adquisición',
    group: 'Adquisición',
    kind: 'number',
    width: 14,
    accessor: (a) => a.acquisitionYear,
  },
  {
    id: 'invoiceNumber',
    label: 'No. factura',
    group: 'Adquisición',
    kind: 'text',
    width: 16,
    accessor: (a) => a.invoiceNumber ?? '',
  },
  {
    id: 'provider',
    label: 'Proveedor',
    group: 'Adquisición',
    kind: 'text',
    width: 28,
    accessor: (a) => a.provider ?? '',
  },
  {
    id: 'locationName',
    label: 'Ubicación',
    group: 'Ubicación',
    kind: 'text',
    width: 22,
    accessor: (a) => a.locationName ?? '',
  },
  {
    id: 'specificLocation',
    label: 'Ubicación específica',
    group: 'Ubicación',
    kind: 'text',
    width: 26,
    accessor: (a) => a.specificLocation ?? '',
  },
  {
    id: 'custodianName',
    label: 'Custodio',
    group: 'Ubicación',
    kind: 'text',
    width: 22,
    accessor: (a) => a.custodianName ?? '',
  },
  {
    id: 'accountingAccountCode',
    label: 'Cuenta contable',
    group: 'Ubicación',
    kind: 'text',
    width: 18,
    accessor: (a) => a.accountingAccountCode ?? '',
  },
  {
    id: 'notes',
    label: 'Notas',
    group: 'Otros',
    kind: 'text',
    width: 30,
    accessor: (a) => a.notes ?? '',
  },
]

export const COLUMN_MAP = new Map(REPORT_COLUMNS.map((c) => [c.id, c]))

export function displayValue(col: ReportColumn, asset: AssetDto): string {
  const raw = col.accessor(asset)
  switch (col.kind) {
    case 'money':
      return raw === null || raw === undefined || raw === ''
        ? '—'
        : formatMoney(Number(raw))
    case 'date':
      return raw ? formatDate(String(raw)) : '—'
    case 'percent':
      return raw === null || raw === undefined || raw === ''
        ? '—'
        : `${(Number(raw) * 100).toFixed(2)}%`
    case 'number':
      return raw === null || raw === undefined || raw === ''
        ? '—'
        : new Intl.NumberFormat('en-US').format(Number(raw))
    default:
      return raw === null || raw === undefined || raw === '' ? '—' : String(raw)
  }
}

export function excelValue(col: ReportColumn, asset: AssetDto): string | number | Date {
  const raw = col.accessor(asset)
  if (raw === null || raw === undefined || raw === '') return ''
  switch (col.kind) {
    case 'money':
    case 'number':
      return Number(raw)
    case 'percent':
      return Number(raw)
    case 'date':
      return new Date(String(raw))
    default:
      return String(raw)
  }
}