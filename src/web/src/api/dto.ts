// DTOs alineados al backend. Si ejecutas `npm run gen:api`, puedes
// reemplazar por los tipos generados desde Swagger cuando lo necesites.

export interface CompanyDto {
  id: string
  name: string
  code: string
}

export interface CategoryDto {
  id: string
  name: string
  code: string
}

export interface LocationDto {
  id: string
  name: string
}

export interface CustodianDto {
  id: string
  name: string
}

export interface AccountingAccountDto {
  id: string
  code: string
  name: string
}

export interface AssetDto {
  id: string
  currentCode: string
  companyId: string
  companyName: string
  categoryId: string
  categoryName: string
  name: string | null
  detail: string | null
  brand: string | null
  model: string | null
  serial: string | null
  components: string | null
  capacity: string | null
  dimensions: string | null
  material: string | null
  color: string | null
  status: number
  statusName: string
  invoiceNumber: string | null
  provider: string | null
  purchaseDate: string | null
  acquisitionYear: number | null
  acquisitionValue: number | null
  priorResidualValue: number | null
  residualRate: number | null
  depreciableAmount: number | null
  usefulLifeYears: number | null
  depreciationRate: number | null
  depreciationStartDate: string | null
  finalDepreciationDate: string | null
  totalDaysToDepreciate: number | null
  accumulatedDepreciation: number | null
  netCost: number | null
  locationId: string | null
  locationName: string | null
  specificLocation: string | null
  custodianId: string | null
  custodianName: string | null
  accountingAccountId: string | null
  accountingAccountCode: string | null
  classification: number
  classificationName: string
  qualityFlag: number
  qualityFlagName: string
  manualReviewRequired: boolean
  manualReviewReason: string | null
  markedAsReviewed: boolean
  notes: string | null
  createdAt: string
  updatedAt: string | null
}

export interface AssetListResponse {
  items: AssetDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AssetSummaryDto {
  totalCount: number
  activoCount: number
  inventarioCount: number
  manualReviewCount: number
  totalAcquisitionValue: number
  totalAccumulatedDepreciation: number
  totalNetCost: number
}

export interface UpdateAssetRequest {
  name?: string | null
  detail?: string | null
  brand?: string | null
  model?: string | null
  serial?: string | null
  components?: string | null
  capacity?: string | null
  dimensions?: string | null
  material?: string | null
  color?: string | null
  status?: number
  invoiceNumber?: string | null
  provider?: string | null
  purchaseDate?: string | null
  acquisitionValue?: number | null
  priorResidualValue?: number | null
  residualRate?: number | null
  usefulLifeYears?: number | null
  locationId?: string | null
  specificLocation?: string | null
  custodianId?: string | null
  accountingAccountId?: string | null
  classification?: number
  markedAsReviewed?: boolean | null
  notes?: string | null
  manualReviewReason?: string | null
}

export interface AssetFilters {
  companyId?: string
  categoryId?: string
  status?: number
  classification?: number
  qualityFlag?: number
  custodianId?: string
  locationId?: string
  acquisitionYear?: number
  minValue?: number
  maxValue?: number
  search?: string
  manualReviewOnly?: boolean
  page: number
  pageSize: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}
export interface BulkUpdateRequest {
  ids: string[]
  fields: {
    categoryId?: string
    accountingAccountId?: string
    locationId?: string
    companyId?: string
  }
}

export interface BulkUpdateResponse {
  updated: number
  failed: string[]
}

export interface ImportErrorDto {
  id: string
  rowNumber: number
  columnName: string | null
  severity: number
  message: string
  rawValue: string | null
}

export interface ImportResultDto {
  batchId: string
  fileName: string
  status: number
  totalRows: number
  processedRows: number
  successRows: number
  errorRows: number
  duplicateRows: number
  errorMessage: string | null
  startedAt: string
  completedAt: string | null
  errors: ImportErrorDto[]
}


export interface DepreciationMonthDto {
  year: number
  month: number
  depreciationAmount: number
  accumulatedDepreciation: number
  netCost: number
}

export interface AssetDepreciationDto {
  assetId: string
  currentCode: string
  assetName: string | null
  companyName: string
  categoryName: string
  acquisitionValue: number | null
  residualRate: number | null
  residualValue: number | null
  depreciableAmount: number | null
  usefulLifeYears: number | null
  depreciationStartDate: string | null
  finalDepreciationDate: string | null
  totalDaysToDepreciate: number | null
  daysPending: number | null
  dailyRate: number | null
  accumulatedDepreciation: number | null
  netCost: number | null
  currentYearDepreciation: number | null
  nextYearDepreciation: number | null
  status: number
  qualityFlag: number
  manualReviewRequired: boolean
  manualReviewReason: string | null
  monthlySchedule: DepreciationMonthDto[]
}

export interface ProjectionRequest {
  companyId?: string
  categoryId?: string
  untilYear?: number
  status?: number
}

export interface ProjectionYearDto {
  year: number
  depreciation: number
  accumulatedDepreciation: number
  netCost: number
}

export interface ProjectionResponseDto {
  untilYear: number
  years: ProjectionYearDto[]
  totalProjectedDepreciation: number
  totalNetCostAtEnd: number
  assetCount: number
}

export interface DepreciationFilters {
  companyId?: string
  categoryId?: string
  status?: number
  acquisitionYear?: number
  minValue?: number
  maxValue?: number
  minUsefulLife?: number
  maxUsefulLife?: number
  minResidualRate?: number
  maxResidualRate?: number
  manualReviewOnly?: boolean
  page: number
  pageSize: number
}