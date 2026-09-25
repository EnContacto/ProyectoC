import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import type { AssetDto } from '@/api/dto'
import { useAssets } from '@/api/assets'
import { ClassificationChip, StatusChip } from '@/features/assets/colors'
import { AssetEditModal } from '@/features/assets/AssetEditModal'
import { formatMoney } from '@/utils/format'

const SEARCH_FILTERS = (q: string) => ({
  search: q,
  page: 1,
  pageSize: 100,
})

export function BusquedaGlobalPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [editingAsset, setEditingAsset] = useState<AssetDto | null>(null)

  const trimmedQuery = q.trim()

  const filters = useMemo(() => SEARCH_FILTERS(trimmedQuery), [trimmedQuery])
  const enabled = trimmedQuery.length >= 2

  const query = useAssets(enabled ? filters : { page: 1, pageSize: 1 })
  const results = enabled ? query.data?.items ?? [] : []
  const totalCount = enabled ? query.data?.totalCount ?? 0 : 0
  const loading = enabled && (query.isLoading || query.isFetching)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = input.trim()
    if (next.length >= 2) {
      setParams({ q: next }, { replace: true })
    } else {
      setParams({}, { replace: true })
    }
  }

  const handleClear = () => {
    setInput('')
    setParams({}, { replace: true })
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <SearchOutlinedIcon color="primary" />
        <Typography variant="h1">Búsqueda global</Typography>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Buscar por código, nombre, serie, factura o proveedor…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {input && (
                      <IconButton size="small" onClick={handleClear} edge="end">
                        <ClearRoundedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, fontSize: 11.5 }}
        >
          Presiona Enter para buscar. Se requieren al menos 2 caracteres.
        </Typography>
      </Paper>

      {!enabled && (
        <Paper
          sx={{
            p: 5,
            borderRadius: 2,
            textAlign: 'center',
            border: (t) => `1px dashed ${t.palette.divider}`,
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: alpha('#26A69A', 0.12),
              color: 'primary.dark',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <SearchOutlinedIcon fontSize="large" />
          </Box>
          <Typography variant="h3" sx={{ mb: 0.5 }}>
            Búsqueda global
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escribe un código, nombre, serie, factura o proveedor en la barra superior o aquí
            arriba para comenzar.
          </Typography>
        </Paper>
      )}

      {enabled && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Chip
                label={`"${trimmedQuery}"`}
                size="small"
                onDelete={handleClear}
                sx={{
                  bgcolor: alpha('#26A69A', 0.12),
                  color: 'primary.dark',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {loading
                  ? 'Buscando…'
                  : `${totalCount} ${totalCount === 1 ? 'resultado' : 'resultados'}`}
              </Typography>
            </Stack>
            <Tooltip title="Ir a Activos con este filtro">
              <Button
                size="small"
                endIcon={<OpenInNewRoundedIcon fontSize="small" />}
                href={`/activos?q=${encodeURIComponent(trimmedQuery)}`}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Ver en Activos
              </Button>
            </Tooltip>
          </Stack>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 640 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                      Código
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 220 }}>
                      Nombre
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                      Empresa
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 140 }}>
                      Categoría
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 110 }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, minWidth: 110 }}>
                      Clasificación
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 11, fontWeight: 600, minWidth: 130, textAlign: 'right' }}
                    >
                      Valor
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 600, width: 60 }} align="center">
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton width="70%" height={16} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!loading && results.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Sin resultados para "{trimmedQuery}"
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Verifica la ortografía o prueba con otro término
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    results.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell
                          sx={{
                            fontFamily: 'ui-monospace, monospace',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {a.currentCode}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12.5, fontWeight: 500 }}>
                          {a.name ?? '—'}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                          {a.companyName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                          {a.categoryName}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={a.status} label={a.statusName} />
                        </TableCell>
                        <TableCell>
                          <ClassificationChip
                            classification={a.classification}
                            label={a.classificationName}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 12.5,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatMoney(a.acquisitionValue)}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => setEditingAsset(a)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {!loading && results.length > 0 && totalCount > results.length && (
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  borderTop: (t) => `1px solid ${t.palette.divider}`,
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Mostrando {results.length} de {totalCount}. Afina la búsqueda para ver menos
                  resultados.
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}

      <AssetEditModal
        open={Boolean(editingAsset)}
        asset={editingAsset}
        onClose={() => setEditingAsset(null)}
      />
    </Box>
  )
}