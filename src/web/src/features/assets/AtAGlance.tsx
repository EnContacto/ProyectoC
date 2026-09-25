import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import type { AssetSummaryDto } from '@/api/dto'
import { formatMoney, formatNumber } from '@/utils/format'

interface CardProps {
  icon: React.ReactNode
  label: string
  value: string
  tone: string
}

function Card({ icon, label, value, tone }: CardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2.5,
        position: 'relative',
        overflow: 'hidden',
        background: (t) =>
          `linear-gradient(135deg, ${alpha(tone, 0.08)} 0%, ${t.palette.background.paper} 60%)`,
        border: (t) => `1px solid ${alpha(tone, 0.16)}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            bgcolor: alpha(tone, 0.18),
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
            fontWeight: 600,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            fontSize: 10.5,
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
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

function LoadingCard() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2.5 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Skeleton variant="rounded" width={32} height={32} />
        <Skeleton width={80} height={12} />
      </Stack>
      <Skeleton width={130} height={26} />
    </Paper>
  )
}

export function AtAGlance({
  data,
  loading,
}: {
  data: AssetSummaryDto | undefined
  loading: boolean
}) {
  const items: CardProps[] = data
    ? [
        {
          icon: <Inventory2OutlinedIcon fontSize="small" />,
          label: 'Total registros',
          value: formatNumber(data.totalCount),
          tone: '#26A69A',
        },
        {
          icon: <Inventory2OutlinedIcon fontSize="small" />,
          label: 'Activos',
          value: formatNumber(data.activoCount),
          tone: '#00695C',
        },
        {
          icon: <ShoppingBagOutlinedIcon fontSize="small" />,
          label: 'Inventario',
          value: formatNumber(data.inventarioCount),
          tone: '#5A6570',
        },
        {
          icon: <PaymentsOutlinedIcon fontSize="small" />,
          label: 'Valor adquisición',
          value: formatMoney(data.totalAcquisitionValue),
          tone: '#0277BD',
        },
        {
          icon: <TrendingDownOutlinedIcon fontSize="small" />,
          label: 'Dep. acumulada',
          value: formatMoney(data.totalAccumulatedDepreciation),
          tone: '#C62828',
        },
        {
          icon: <SavingsOutlinedIcon fontSize="small" />,
          label: 'Costo neto',
          value: formatMoney(data.totalNetCost),
          tone: '#2E7D32',
        },
        {
          icon: <RuleOutlinedIcon fontSize="small" />,
          label: 'Revisión manual',
          value: formatNumber(data.manualReviewCount),
          tone: '#ED6C02',
        },
      ]
    : []

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))',
          xl: 'repeat(7, minmax(0, 1fr))',
        },
        gap: 1.5,
      }}
    >
      {loading
        ? Array.from({ length: 7 }).map((_, i) => <LoadingCard key={i} />)
        : items.map((it) => <Card key={it.label} {...it} />)}
    </Box>
  )
}