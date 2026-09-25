import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import { ProjectionView } from '@/features/depreciations/ProjectionView'
import { AssetDepreciationList } from '@/features/depreciations/AssetDepreciationList'

export function DepreciacionesPage() {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <TrendingDownOutlinedIcon color="primary" />
        <Typography variant="h1">Depreciaciones</Typography>
      </Stack>

      <Paper sx={{ borderRadius: 2, mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            minHeight: 48,
            '& .MuiTab-root': { minHeight: 48, textTransform: 'none', fontWeight: 500 },
          }}
        >
          <Tab icon={<TimelineOutlinedIcon fontSize="small" />} iconPosition="start" label="Proyección" />
          <Tab icon={<ListAltOutlinedIcon fontSize="small" />} iconPosition="start" label="Por activo" />
        </Tabs>
      </Paper>

      {tab === 0 ? <ProjectionView /> : <AssetDepreciationList />}
    </Box>
  )
}