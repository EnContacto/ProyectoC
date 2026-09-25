import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { alpha } from '@mui/material/styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAssetDepreciation } from '@/api/depreciations'
import { formatDate, formatMoney, formatNumber } from '@/utils/format'
import { monthLabel } from './months'

interface Props {
  open: boolean
  assetId: string | null
  onClose: () => void
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ py: 0.75 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: 10.5,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: 'text.secondary',
          mb: 1,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  )
}

export function AssetDepreciationModal({ open, assetId, onClose }: Props) {
  const query = useAssetDepreciation(open ? assetId : null)

  const data = query.data
  const chartData =
    data?.monthlySchedule.map((m) => ({
      label: `${monthLabel(m.month)} ${String(m.year).slice(2)}`,
      depreciationAmount: m.depreciationAmount,
      accumulatedDepreciation: m.accumulatedDepreciation,
    })) ?? []

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{ paper: { sx: { borderRadius: 3, backgroundImage: 'none' } } }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="h3">{data?.assetName ?? 'Detalle de depreciación'}</Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: 0.3,
            }}
          >
            {data?.currentCode ?? ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {query.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {data && (
          <Stack spacing={2.5}>
            {data.manualReviewRequired && (
              <Alert
                severity="warning"
                icon={<InfoOutlinedIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                {data.manualReviewReason ?? 'Este activo requiere revisión manual.'}
              </Alert>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              <Section title="Datos generales">
                <StatRow label="Empresa" value={data.companyName} />
                <StatRow label="Categoría" value={data.categoryName} />
                <StatRow label="Valor adquisición" value={formatMoney(data.acquisitionValue)} />
                <StatRow label="Vida útil" value={`${data.usefulLifeYears ?? '—'} años`} />
                <StatRow
                  label="Tasa residual"
                  value={data.residualRate !== null ? `${data.residualRate * 100}%` : '—'}
                />
                <StatRow label="Valor residual" value={formatMoney(data.residualValue)} />
              </Section>

              <Section title="Depreciación">
                <StatRow label="Base depreciable" value={formatMoney(data.depreciableAmount)} />
                <StatRow label="Tasa diaria" value={formatMoney(data.dailyRate)} />
                <StatRow
                  label="Días totales"
                  value={data.totalDaysToDepreciate ? formatNumber(data.totalDaysToDepreciate) : '—'}
                />
                <StatRow
                  label="Días pendientes"
                  value={data.daysPending !== null ? formatNumber(data.daysPending) : '—'}
                />
                <StatRow
                  label="Dep. acumulada"
                  value={
                    <Box component="span" sx={{ color: '#C62828', fontWeight: 600 }}>
                      {formatMoney(data.accumulatedDepreciation)}
                    </Box>
                  }
                />
                <StatRow
                  label="Costo neto"
                  value={
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {formatMoney(data.netCost)}
                    </Box>
                  }
                />
              </Section>

              <Section title="Fechas y proyección">
                <StatRow
                  label="Inicio depreciación"
                  value={formatDate(data.depreciationStartDate)}
                />
                <StatRow
                  label="Fin depreciación"
                  value={formatDate(data.finalDepreciationDate)}
                />
                <StatRow
                  label="Depreciación año actual"
                  value={formatMoney(data.currentYearDepreciation)}
                />
                <StatRow
                  label="Depreciación año siguiente"
                  value={formatMoney(data.nextYearDepreciation)}
                />
              </Section>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                Depreciación mensual
              </Typography>
              {chartData.length === 0 ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: 200, color: 'text.secondary' }}
                >
                  <Typography variant="body2">
                    No hay calendario mensual disponible para este activo
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 8, right: 20, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#5A6570' }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                        interval="preserveStartEnd"
                        minTickGap={24}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#5A6570' }}
                        tickFormatter={(v) =>
                          new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1,
                          }).format(v as number)
                        }
                        tickLine={false}
                        axisLine={false}
                        width={60}
                      />
                      <RechartsTooltip
                        formatter={(value: number, name: string) =>
                          [
                            formatMoney(value),
                            name === 'depreciationAmount' ? 'Cuota' : 'Acumulada',
                          ]
                        }
                        contentStyle={{
                          borderRadius: 10,
                          border: '1px solid rgba(0,0,0,0.08)',
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="depreciationAmount"
                        fill={alpha('#26A69A', 0.85)}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={22}
                      />
                      <Line
                        type="monotone"
                        dataKey="accumulatedDepreciation"
                        stroke="#C62828"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>

            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: (t) => `1px solid ${t.palette.divider}`,
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Calendario mensual
                </Typography>
              </Box>
              <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Año</TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>Mes</TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                        Cuota
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                        Acumulada
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                        Costo neto
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.monthlySchedule.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}
                        >
                          Sin calendario disponible
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.monthlySchedule.map((m) => (
                        <TableRow key={`${m.year}-${m.month}`} hover>
                          <TableCell sx={{ fontSize: 12.5, fontWeight: 500 }}>{m.year}</TableCell>
                          <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                            {monthLabel(m.month)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 12.5,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {formatMoney(m.depreciationAmount)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 12.5,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                              color: 'text.secondary',
                            }}
                          >
                            {formatMoney(m.accumulatedDepreciation)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 12.5,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                              fontWeight: 600,
                            }}
                          >
                            {formatMoney(m.netCost)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
