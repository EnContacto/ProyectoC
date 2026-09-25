import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
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
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCategories, useCompanies } from '@/api/catalogs'
import { useDepreciationProjection } from '@/api/depreciations'
import type { ProjectionRequest } from '@/api/dto'
import { formatMoney, formatNumber } from '@/utils/format'

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

const CURRENT_YEAR = new Date().getFullYear()

function money(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

interface SummaryCardProps {
  icon: React.ReactNode
  label: string
  value: string
  tone: string
}

function SummaryCard({ icon, label, value, tone }: SummaryCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: (t) => `1px solid ${alpha(tone, 0.18)}`,
        background: `linear-gradient(135deg, ${alpha(tone, 0.08)} 0%, ${alpha(tone, 0.01)} 100%)`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            bgcolor: alpha(tone, 0.16),
            color: tone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -0.4,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

export function ProjectionView() {
  const [request, setRequest] = useState<ProjectionRequest>({
    untilYear: CURRENT_YEAR + 5,
  })

  const companies = useCompanies()
  const categories = useCategories()
  const projection = useDepreciationProjection(request)

  const chartData = useMemo(
    () =>
      (projection.data?.years ?? []).map((y) => ({
        year: y.year,
        depreciation: Math.round(y.depreciation * 100) / 100,
        netCost: Math.round(y.netCost * 100) / 100,
      })),
    [projection.data],
  )

  const update = (patch: Partial<ProjectionRequest>) =>
    setRequest((prev) => ({ ...prev, ...patch }))

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
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
            value={request.companyId ?? ''}
            onChange={(e) => update({ companyId: e.target.value || undefined })}
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
            value={request.categoryId ?? ''}
            onChange={(e) => update({ categoryId: e.target.value || undefined })}
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
            label="Hasta año"
            type="number"
            value={request.untilYear ?? ''}
            onChange={(e) =>
              update({
                untilYear: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlinedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
              htmlInput: { min: CURRENT_YEAR, max: CURRENT_YEAR + 20 },
            }}
          />

          <TextField
            select
            label="Estado"
            value={request.status ?? ''}
            onChange={(e) =>
              update({ status: e.target.value === '' ? undefined : Number(e.target.value) })
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
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        {projection.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Paper key={i} sx={{ p: 2, borderRadius: 2.5 }}>
              <Skeleton width={100} height={12} />
              <Skeleton width={140} height={26} sx={{ mt: 1 }} />
            </Paper>
          ))
        ) : (
          <>
            <SummaryCard
              icon={<Inventory2OutlinedIcon fontSize="small" />}
              label="Activos en proyección"
              value={formatNumber(projection.data?.assetCount ?? 0)}
              tone="#26A69A"
            />
            <SummaryCard
              icon={<TrendingDownOutlinedIcon fontSize="small" />}
              label="Depreciación proyectada"
              value={formatMoney(projection.data?.totalProjectedDepreciation ?? 0)}
              tone="#C62828"
            />
            <SummaryCard
              icon={<SavingsOutlinedIcon fontSize="small" />}
              label={`Costo neto en ${projection.data?.untilYear ?? ''}`}
              value={formatMoney(projection.data?.totalNetCostAtEnd ?? 0)}
              tone="#2E7D32"
            />
          </>
        )}
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Proyección anual
        </Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          {projection.isLoading ? (
            <Skeleton variant="rounded" width="100%" height={320} />
          ) : chartData.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: '100%', color: 'text.secondary' }}
            >
              <Typography variant="body2">
                No hay datos de proyección con los filtros actuales
              </Typography>
            </Stack>
          ) : (
            <ResponsiveContainer>
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#5A6570' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => money(v as number)}
                  tick={{ fontSize: 11, fill: '#5A6570' }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => money(v as number)}
                  tick={{ fontSize: 11, fill: '#5A6570' }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <RechartsTooltip
                  formatter={(value: number, name: string) =>
                    [formatMoney(value), name === 'depreciation' ? 'Depreciación' : 'Costo neto']
                  }
                  labelFormatter={(label) => `Año ${label}`}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(value) => (value === 'depreciation' ? 'Depreciación' : 'Costo neto')}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="depreciation"
                  fill="#26A69A"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={54}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="netCost"
                  stroke="#C62828"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#C62828' }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 420 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Año</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Depreciación
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Dep. acumulada
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                  Costo neto
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projection.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton width="70%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!projection.isLoading &&
                (projection.data?.years ?? []).map((y) => (
                  <TableRow key={y.year} hover>
                    <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{y.year}</TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                        textAlign: 'right',
                        color: '#C62828',
                        fontWeight: 500,
                      }}
                    >
                      {formatMoney(y.depreciation)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                        textAlign: 'right',
                        color: 'text.secondary',
                      }}
                    >
                      {formatMoney(y.accumulatedDepreciation)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                        textAlign: 'right',
                        fontWeight: 600,
                      }}
                    >
                      {formatMoney(y.netCost)}
                    </TableCell>
                  </TableRow>
                ))}

              {!projection.isLoading && (projection.data?.years ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    No hay datos para mostrar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  )
}