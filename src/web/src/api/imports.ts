import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import { assetKeys } from './assets'
import type { ImportResultDto } from './dto'

export const importKeys = {
  all: ['imports'] as const,
  batches: () => [...importKeys.all, 'batches'] as const,
  batch: (id: string) => [...importKeys.all, 'batch', id] as const,
}

interface UploadArgs {
  file: File
  dryRun: boolean
  ignoreErrors: boolean
  skipDuplicates: boolean
}

export function useUploadImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, dryRun, ignoreErrors, skipDuplicates }: UploadArgs) => {
      const form = new FormData()
      form.append('file', file)
      form.append('dryRun', String(dryRun))
      form.append('ignoreErrors', String(ignoreErrors))
      form.append('skipDuplicates', String(skipDuplicates))
      const { data } = await api.post<ImportResultDto>('/imports/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: importKeys.all })
      if (!vars.dryRun) {
        qc.invalidateQueries({ queryKey: assetKeys.all })
      }
    },
  })
}

export function useImportBatches() {
  return useQuery({
    queryKey: importKeys.batches(),
    queryFn: async () => (await api.get<ImportResultDto[]>('/imports/batches')).data,
  })
}

export function useImportBatch(batchId: string | null) {
  return useQuery({
    queryKey: importKeys.batch(batchId ?? ''),
    queryFn: async () => (await api.get<ImportResultDto>(`/imports/batches/${batchId}`)).data,
    enabled: Boolean(batchId),
  })
}

export function useRevertImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (batchId: string) =>
      (await api.post<{ reverted: boolean }>(`/imports/batches/${batchId}/revert`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: importKeys.all })
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}
