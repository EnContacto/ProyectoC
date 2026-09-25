import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Sidebar, DRAWER_WIDTH } from './Sidebar'
import { TopBar } from './TopBar'

export function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
        <TopBar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}