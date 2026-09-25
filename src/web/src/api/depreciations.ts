import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type {
  AssetDepreciationDto,
  ProjectionRequest,
  ProjectionResponseDto,
} from './dto'

export const depreciationKeys = {
  all: ['depreciations'] as const,
  asset: (assetId: string) => [...depreciationKeys.all, 'asset', assetId] as const,
  projection: (req: ProjectionRequest) =>
    [...depreciationKeys.all, 'projection', req] as const,
}

export function useAssetDepreciation(assetId: string | null) {
  return useQuery({
    queryKey: depreciationKeys.asset(assetId ?? ''),
    queryFn: async () =>
      (await api.get<AssetDepreciationDto>(`/depreciations/asset/${assetId}`)).data,
    enabled: Boolean(assetId),
  })
}

export function useDepreciationProjection(request: ProjectionRequest) {
  return useQuery({
    queryKey: depreciationKeys.projection(request),
    queryFn: async () =>
      (await api.post<ProjectionResponseDto>('/depreciations/projection', request)).data,
  })
}