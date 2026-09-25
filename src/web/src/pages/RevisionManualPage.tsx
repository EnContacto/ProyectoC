import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import type { AssetDto } from '@/api/dto'
import { useAssets } from '@/api/assets'
import { ReviewQueueTable } from '@/features/review/ReviewQueueTable'
import { ReviewBulkBar } from '@/features/review/ReviewBulkBar'
import { useMarkAsReviewed } from '@/features/review/useMarkAsReviewed'
import { AssetEditModal } from '@/features/assets/AssetEditModal'
import { BulkEditModal } from '@/features/assets/BulkEditModal'
import { useToast } from '@/features/toast/ToastProvider'

const COUNT_FILTERS = { page: 1, pageSize: 1, manualReviewOnly: true } as const

export function RevisionManualPage() {
  const toast = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingAsset, setEditingAsset] = useState<AssetDto | null>(null)
  const [bulkEditOpen, setBulkEditOpen] = useState(false)

  const counter = useAssets(COUNT_FILTERS)
  const mark = useMarkAsReviewed()

  const totalPending = counter.data?.totalCount ?? 0

  const handleMarkOne = async (asset: AssetDto) => {
    const res = await mark.run([asset.id])
    if (res.failed === 0) toast('Activo marcado como revisado', 'success')
    else toast('No se pudo marcar el activo', 'error')
  }

  const handleMarkSelected = async () => {
    if (selectedIds.length === 0) return
    const res = await mark.run(selectedIds)
    setSelectedIds([])
    if (res.failed === 0) {
      toast(`${res.ok} ${res.ok === 1 ? 'activo marcado' : 'activos marcados'} como revisados`, 'success')
    } else {
      toast(`${res.ok} marcados, ${res.failed} fallidos`, 'warning')
    }
  }

  const headerStats = useMemo(
    () => [
      { label: 'Pendientes', value: totalPending, tone: '#ED6C02' },
      { label: 'Seleccionados', value: selectedIds.length, tone: '#26A69A' },
    ],
    [totalPending, selectedIds.length],
  )

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <RuleOutlinedIcon color="primary" />
          <Typography variant="h1">Revisión manual</Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {headerStats.map((s) => (
            <Paper
              key={s.label}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(s.tone, 0.18)}`,
                background: `linear-gradient(135deg, ${alpha(s.tone, 0.08)} 0%, transparent 70%)`,
                minWidth: 110,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: 10.5,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {s.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: s.tone,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>

      <ReviewQueueTable
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onEdit={(a) => setEditingAsset(a)}
        onMarkOne={handleMarkOne}
      />

      <ReviewBulkBar
        selectedCount={selectedIds.length}
        running={mark.running}
        progress={mark.progress}
        onMarkReviewed={handleMarkSelected}
        onEdit={() => setBulkEditOpen(true)}
        onClear={() => setSelectedIds([])}
      />

      <AssetEditModal
        open={Boolean(editingAsset)}
        asset={editingAsset}
        onClose={() => setEditingAsset(null)}
      />

      <BulkEditModal
        open={bulkEditOpen}
        selectedIds={selectedIds}
        visibleAssets={[]}
        onClose={() => setBulkEditOpen(false)}
        onSuccess={() => setSelectedIds([])}
      />
    </Box>
  )
}
