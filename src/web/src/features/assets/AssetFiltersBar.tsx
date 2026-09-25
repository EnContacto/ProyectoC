import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import { useState } from 'react'
import type { AssetFilters } from '@/api/dto'
import {
  useCategories,
  useCompanies,
  useCustodians,
  useLocations,
} from '@/api/catalogs'

interface Props {
  filters: AssetFilters
  onChange: (patch: Partial<AssetFilters>) => void
  onClear: () => void
  columnsMenu?: React.ReactNode
}

const STATUS_OPTIONS = [
  { value: 1, label: 'Bueno' },
  { value: 2, label: 'Regular' },
  { value: 3, label: 'Malo' },
  { value: 4, label: 'Dar de baja' },
  { value: 5, label: 'Faltante' },
  { value: 6, label: 'Cambio de serie' },
  { value: 7, label: 'Vendido' },
  { value: 99, label: 'ND' },
]

const CLASSIFICATION_OPTIONS = [
  { value: 1, label: 'Activo' },
  { value: 2, label: 'Inventario' },
]

const QUALITY_FLAG_OPTIONS = [
  { value: 1, label: 'Verde' },
  { value: 2, label: 'Amarillo' },
  { value: 3, label: 'Rojo' },
  { value: 4, label: 'Naranja' },
  { value: 5, label: 'Menor a 500' },
]

export function AssetFiltersBar({ filters, onChange, onClear, columnsMenu }: Props) {
  const companies = useCompanies()
  const categories = useCategories()
  const locations = useLocations()
  const custodians = useCustodians()

  const [advancedAnchor, setAdvancedAnchor] = useState<null | HTMLElement>(null)

  const activeFilters = useMemo(() => {
    let count = 0
    if (filters.companyId) count++
    if (filters.categoryId) count++
    if (filters.status !== undefined) count++
    if (filters.classification !== undefined) count++
    if (filters.qualityFlag !== undefined) count++
    if (filters.locationId) count++
    if (filters.custodianId) count++
    if (filters.minValue !== undefined) count++
    if (filters.maxValue !== undefined) count++
    if (filters.manualReviewOnly) count++
    return count
  }, [filters])

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <TextField
          placeholder="Buscar código, serie, factura, proveedor…"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value || undefined })}
          fullWidth
          sx={{ maxWidth: 420 }}
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

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Revisión manual">
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
              bgcolor: filters.manualReviewOnly ? 'warning.50' : 'transparent',
            }}
          >
            <RuleOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              Solo revisión
            </Typography>
            <Switch
              size="small"
              checked={Boolean(filters.manualReviewOnly)}
              onChange={(e) => onChange({ manualReviewOnly: e.target.checked || undefined })}
            />
          </Stack>
        </Tooltip>

        {activeFilters > 0 && (
          <Tooltip title="Limpiar filtros">
            <Button
              onClick={onClear}
              size="small"
              color="inherit"
              startIcon={<FilterAltOffOutlinedIcon fontSize="small" />}
              sx={{ color: 'text.secondary' }}
            >
              Limpiar ({activeFilters})
            </Button>
          </Tooltip>
        )}

        {columnsMenu}
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        <TextField
          select
          label="Empresa"
          value={filters.companyId ?? ''}
          onChange={(e) => onChange({ companyId: e.target.value || undefined })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true },
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {(companies.data ?? []).map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Categoría"
          value={filters.categoryId ?? ''}
          onChange={(e) => onChange({ categoryId: e.target.value || undefined })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true },
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {(categories.data ?? []).map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Estado"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({ status: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="">Todos</MenuItem>
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Clasificación"
          value={filters.classification ?? ''}
          onChange={(e) =>
            onChange({
              classification: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="">Todas</MenuItem>
          {CLASSIFICATION_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button
          size="small"
          onClick={(e) => setAdvancedAnchor(e.currentTarget)}
          startIcon={<BadgeOutlinedIcon fontSize="small" />}
          sx={{ color: 'text.secondary' }}
        >
          Más filtros
        </Button>
      </Box>

      <Menu
        anchorEl={advancedAnchor}
        open={Boolean(advancedAnchor)}
        onClose={() => setAdvancedAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 320, p: 2, borderRadius: 2 } } }}
      >
        <Stack spacing={1.75}>
          <TextField
            select
            size="small"
            label="Ubicación"
            value={filters.locationId ?? ''}
            onChange={(e) => onChange({ locationId: e.target.value || undefined })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(locations.data ?? []).map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Custodio"
            value={filters.custodianId ?? ''}
            onChange={(e) => onChange({ custodianId: e.target.value || undefined })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {(custodians.data ?? []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Etiqueta"
            value={filters.qualityFlag ?? ''}
            onChange={(e) =>
              onChange({ qualityFlag: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          >
            <MenuItem value="">Todas</MenuItem>
            {QUALITY_FLAG_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Valor mín."
              type="number"
              value={filters.minValue ?? ''}
              onChange={(e) =>
                onChange({ minValue: e.target.value === '' ? undefined : Number(e.target.value) })
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              label="Valor máx."
              type="number"
              value={filters.maxValue ?? ''}
              onChange={(e) =>
                onChange({ maxValue: e.target.value === '' ? undefined : Number(e.target.value) })
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>

          <TextField
            size="small"
            label="Año adquisición"
            type="number"
            value={filters.acquisitionYear ?? ''}
            onChange={(e) =>
              onChange({
                acquisitionYear: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </Menu>
    </Box>
  )
}
