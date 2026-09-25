import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { buildListParams } from '@/api/assets'
import type { AssetDto, AssetFilters, AssetListResponse } from '@/api/dto'

const PAGE_SIZE = 500
const MAX_ROWS = 20000

async function fetchAll(filters: AssetFilters): Promise<{ rows: AssetDto[]; total: number }> {
  const collected: AssetDto[] = []
  let page = 1
  let total = 0

  while (collected.length < MAX_ROWS) {
    const { data } = await api.get<AssetListResponse>('/assets', {
      params: buildListParams({ ...filters, page, pageSize: PAGE_SIZE }),
    })
    total = data.totalCount
    if (data.items.length === 0) break
    collected.push(...data.items)
    if (page >= data.totalPages) break
    page += 1
  }

  return { rows: collected, total }
}

export function useReportData(filters: AssetFilters) {
  return useQuery({
    queryKey: ['reports', 'data', filters],
    queryFn: () => fetchAll(filters),
    staleTime: 30_000,
  })
}