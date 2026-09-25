import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, alpha } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { useLocation, useNavigate } from 'react-router-dom'

const DRAWER_WIDTH = 248

const items = [
  { label: 'Activos', path: '/activos', icon: <Inventory2OutlinedIcon /> },
  { label: 'Depreciaciones', path: '/depreciaciones', icon: <TrendingDownOutlinedIcon /> },
  { label: 'Reportes', path: '/reportes', icon: <InsertChartOutlinedIcon /> },
  { label: 'Revisión manual', path: '/revision-manual', icon: <RuleOutlinedIcon /> },
  { label: 'Historial de importaciones', path: '/historial-importaciones', icon: <HistoryOutlinedIcon /> },
  { label: 'Búsqueda global', path: '/busqueda', icon: <SearchOutlinedIcon /> },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: (t) => `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
          background: (t) =>
            `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.06)} 0%, ${t.palette.background.paper} 220px)`,
        },
      }}
    >
      <Toolbar sx={{ px: 3, minHeight: '72px !important' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            background: (t) => `linear-gradient(135deg, ${t.palette.primary.light} 0%, ${t.palette.primary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            mr: 1.5,
          }}
        >
          PC
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          ProyectoC
        </Typography>
      </Toolbar>

      <Box sx={{ px: 2, py: 1 }}>
        <List disablePadding>
          {items.map((item) => {
            const selected =
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            return (
              <ListItemButton
                key={item.path}
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: (t) => alpha(t.palette.primary.main, 0.14),
                    color: 'primary.dark',
                    '&:hover': {
                      backgroundColor: (t) => alpha(t.palette.primary.main, 0.2),
                    },
                    '& .MuiListItemIcon-root': { color: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: selected ? 600 : 500 }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}

export { DRAWER_WIDTH }