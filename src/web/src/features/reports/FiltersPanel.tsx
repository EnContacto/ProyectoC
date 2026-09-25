import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import {
  useCategories,
  useCompanies,
  useCustodians,
  useLocations,
} from '@/api/catalogs'
import type { AssetFilters } from '@/api/dto'

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

interface Props {
  filters: AssetFilters
  onChange: (patch: Partial<AssetFilters>) => void
}

export function FiltersPanel({ filters, onChange }: Props) {
  const companies = useCompanies()
  const categories = useCategories()
  const locations = useLocations()
  const custodians = useCustodians()

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Filtros
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        <TextField
          label="Búsqueda"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value || undefined })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true },
          }}
          sx={{ gridColumn: { xs: '1', md: 'span 2' } }}
        />

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

        <TextField
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

        <TextField
          label="Valor mín."
          type="number"
          value={filters.minValue ?? ''}
          onChange={(e) =>
            onChange({ minValue: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Valor máx."
          type="number"
          value={filters.maxValue ?? ''}
          onChange={(e) =>
            onChange({ maxValue: e.target.value === '' ? undefined : Number(e.target.value) })
          }
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          select
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
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 11, alignSelf: 'center' }}
        >
          Filtros aplicados se reflejan en la previsualización y la exportación.
        </Typography>
      </Stack>
    </Paper>
  )
}