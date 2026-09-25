import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  AssetDto,
  AssetFilters,
  AssetListResponse,
  AssetSummaryDto,
  BulkUpdateRequest,
  BulkUpdateResponse,
  UpdateAssetRequest,
} from './dto'

export const assetKeys = {
  all: ['assets'] as const,
  list: (filters: AssetFilters) => [...assetKeys.all, 'list', filters] as const,
  summary: (filters: AssetFilters) => [...assetKeys.all, 'summary', filters] as const,
  detail: (id: string) => [...assetKeys.all, 'detail', id] as const,
}

export function buildListParams(f: AssetFilters): Record<string, unknown> {
  const p: Record<string, unknown> = {
    Page: f.page,
    PageSize: f.pageSize,
  }
  if (f.companyId) p.CompanyId = f.companyId
  if (f.categoryId) p.CategoryId = f.categoryId
  if (f.status !== undefined) p.Status = f.status
  if (f.classification !== undefined) p.Classification = f.classification
  if (f.qualityFlag !== undefined) p.QualityFlag = f.qualityFlag
  if (f.custodianId) p.CustodianId = f.custodianId
  if (f.locationId) p.LocationId = f.locationId
  if (f.acquisitionYear !== undefined) p.AcquisitionYear = f.acquisitionYear
  if (f.minValue !== undefined) p.MinValue = f.minValue
  if (f.maxValue !== undefined) p.MaxValue = f.maxValue
  if (f.search) p.Search = f.search
  if (f.manualReviewOnly !== undefined) p.ManualReviewOnly = f.manualReviewOnly
  if (f.sortBy) p.SortBy = f.sortBy
  if (f.sortDirection) p.SortDirection = f.sortDirection
  return p
}

function buildSummaryParams(f: AssetFilters): Record<string, unknown> {
  const { page: _page, pageSize: _pageSize, sortBy: _sb, sortDirection: _sd, ...rest } = f
  void _page
  void _pageSize
  void _sb
  void _sd
  return buildListParams({ ...rest, page: 1, pageSize: 1 })
}

export function useAssets(filters: AssetFilters) {
  return useQuery({
    queryKey: assetKeys.list(filters),
    queryFn: async () =>
      (await api.get<AssetListResponse>('/assets', { params: buildListParams(filters) })).data,
    placeholderData: keepPreviousData,
  })
}

export function useAssetSummary(filters: AssetFilters) {
  return useQuery({
    queryKey: assetKeys.summary(filters),
    queryFn: async () =>
      (await api.get<AssetSummaryDto>('/assets/summary', { params: buildSummaryParams(filters) }))
        .data,
  })
}

export function useAssetDetail(id: string | null) {
  return useQuery({
    queryKey: assetKeys.detail(id ?? ''),
    queryFn: async () => (await api.get<AssetDto>(`/assets/${id}`)).data,
    enabled: Boolean(id),
  })
}

export function useUpdateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateAssetRequest }) =>
      (await api.put<AssetDto>(`/assets/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}

export function useBulkUpdateAssets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: BulkUpdateRequest) =>
      (await api.patch<BulkUpdateResponse>('/assets/bulk', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}

export function useRecalculateAssets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      (await api.post<{ recalculated: number }>('/assets/recalculate')).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}

export async function fetchAllFilteredIds(filters: AssetFilters): Promise<string[]> {
  const ids: string[] = []
  const pageSize = 200
  let page = 1
  while (true) {
    const { data } = await api.get<AssetListResponse>('/assets', {
      params: buildListParams({ ...filters, page, pageSize }),
    })
    for (const item of data.items) ids.push(item.id)
    if (page >= data.totalPages || data.items.length === 0) break
    page += 1
  }
  return ids
}