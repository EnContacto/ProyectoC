import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { COLUMN_MAP, REPORT_COLUMNS, type ReportColumn } from './catalog'

interface Props {
  selectedIds: string[]
  onChange: (next: string[]) => void
}

export function ColumnBuilder({ selectedIds, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const selectedColumns: ReportColumn[] = useMemo(
    () => selectedIds.map((id) => COLUMN_MAP.get(id)).filter((c): c is ReportColumn => Boolean(c)),
    [selectedIds],
  )

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase()
    const map = new Map<string, ReportColumn[]>()
    for (const col of REPORT_COLUMNS) {
      if (term && !col.label.toLowerCase().includes(term) && !col.group.toLowerCase().includes(term)) {
        continue
      }
      const arr = map.get(col.group) ?? []
      arr.push(col)
      map.set(col.group, arr)
    }
    return Array.from(map.entries())
  }, [search])

  const addColumn = (id: string) => {
    if (selectedSet.has(id)) return
    onChange([...selectedIds, id])
  }

  const removeColumn = (id: string) => {
    onChange(selectedIds.filter((x) => x !== id))
  }

  const moveColumn = (from: number, to: number) => {
    if (from === to) return
    if (to < 0 || to >= selectedIds.length) return
    const copy = [...selectedIds]
    const [moved] = copy.splice(from, 1)
    copy.splice(to, 0, moved)
    onChange(copy)
  }

  const onDragStart = (index: number) => setDragIndex(index)
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  const onDrop = (index: number) => {
    if (dragIndex === null) return
    moveColumn(dragIndex, index)
    setDragIndex(null)
    setDragOverIndex(null)
  }
  const onDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.1fr)' },
        gap: 2,
      }}
    >
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Columnas disponibles
          </Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar columna…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ p: 2, maxHeight: 460, overflow: 'auto' }}>
          <Stack spacing={2} divider={<Divider />}>
            {grouped.map(([group, cols]) => (
              <Box key={group}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 10.5,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {group}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.75,
                    mt: 1,
                  }}
                >
                  {cols.map((col) => {
                    const selected = selectedSet.has(col.id)
                    return (
                      <Chip
                        key={col.id}
                        label={col.label}
                        size="small"
                        onClick={() => (selected ? removeColumn(col.id) : addColumn(col.id))}
                        icon={selected ? undefined : <AddRoundedIcon />}
                        sx={{
                          fontSize: 12,
                          borderRadius: '8px',
                          bgcolor: selected ? 'primary.main' : 'transparent',
                          color: selected ? 'primary.contrastText' : 'text.primary',
                          border: (t) =>
                            selected
                              ? 'none'
                              : `1px solid ${t.palette.divider}`,
                          '& .MuiChip-icon': {
                            color: 'text.secondary',
                            fontSize: 16,
                          },
                          '&:hover': {
                            bgcolor: selected
                              ? 'primary.dark'
                              : alpha('#26A69A', 0.08),
                          },
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>
            ))}

            {grouped.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Sin resultados
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Columnas del reporte
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedColumns.length} {selectedColumns.length === 1 ? 'columna' : 'columnas'}
          </Typography>
        </Box>

        <Box sx={{ p: 2, maxHeight: 460, overflow: 'auto' }}>
          {selectedColumns.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: 8, color: 'text.secondary' }}
              spacing={1}
            >
              <Typography variant="body2">
                Selecciona columnas del panel izquierdo
              </Typography>
              <Typography variant="caption">
                Puedes reordenarlas arrastrando o con las flechas
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={0.75}>
              {selectedColumns.map((col, index) => {
                const isDragTarget = dragOverIndex === index && dragIndex !== null && dragIndex !== index
                return (
                  <Box
                    key={col.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDrop={() => onDrop(index)}
                    onDragEnd={onDragEnd}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: isDragTarget ? alpha('#26A69A', 0.1) : 'background.default',
                      border: (t) =>
                        `1px solid ${isDragTarget ? t.palette.primary.main : t.palette.divider}`,
                      cursor: 'grab',
                      transition: 'all .12s ease',
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    <DragIndicatorRoundedIcon
                      sx={{ color: 'text.secondary', fontSize: 18 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, fontWeight: 500, fontSize: 13 }}
                    >
                      {col.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: 10.5,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: (t) => `1px solid ${t.palette.divider}`,
                      }}
                    >
                      {col.group}
                    </Typography>
                    <Tooltip title="Subir">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => moveColumn(index, index - 1)}
                          disabled={index === 0}
                        >
                          <KeyboardArrowUpRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Bajar">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => moveColumn(index, index + 1)}
                          disabled={index === selectedColumns.length - 1}
                        >
                          <KeyboardArrowDownRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Quitar">
                      <IconButton size="small" onClick={() => removeColumn(col.id)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  )
}