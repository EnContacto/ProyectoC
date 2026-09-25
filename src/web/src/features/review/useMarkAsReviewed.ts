import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import { assetKeys } from '@/api/assets'

const CONCURRENCY = 5

export interface MarkAsReviewedProgress {
  done: number
  total: number
}

export interface MarkAsReviewedResult {
  ok: number
  failed: number
}

export function useMarkAsReviewed() {
  const qc = useQueryClient()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<MarkAsReviewedProgress>({ done: 0, total: 0 })

  const run = async (ids: string[]): Promise<MarkAsReviewedResult> => {
    if (ids.length === 0) return { ok: 0, failed: 0 }
    setRunning(true)
    setProgress({ done: 0, total: ids.length })

    let ok = 0
    let failed = 0

    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      const chunk = ids.slice(i, i + CONCURRENCY)
      const results = await Promise.allSettled(
        chunk.map((id) => api.put(`/assets/${id}`, { markedAsReviewed: true })),
      )
      for (const r of results) {
        if (r.status === 'fulfilled') ok++
        else failed++
      }
      setProgress({
        done: Math.min(i + CONCURRENCY, ids.length),
        total: ids.length,
      })
    }

    await qc.invalidateQueries({ queryKey: assetKeys.all })
    setRunning(false)
    return { ok, failed }
  }

  return { run, running, progress }
}