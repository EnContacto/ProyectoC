import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { useAuth } from '@/auth/useAuth'
import { DRAWER_WIDTH } from './Sidebar'

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.06),
  },
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingLeft: 14,
  paddingRight: 14,
  height: 40,
  width: '100%',
  maxWidth: 420,
  transition: 'background-color .15s ease',
}))

export function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [query, setQuery] = useState('')

  const open = Boolean(anchorEl)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault()
        document.getElementById('global-search')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/busqueda') return
    const url = new URLSearchParams(location.search)
    const q = url.get('q') ?? ''
    setQuery(q)
  }, [location.pathname, location.search])

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmed = query.trim()
    if (event.key !== 'Enter' || trimmed.length < 2) return
    navigate(`/busqueda?q=${encodeURIComponent(trimmed)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: (t) => alpha(t.palette.background.paper, 0.85),
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        borderBottom: (t) => `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
        <SearchBox>
          <SearchRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <InputBase
            id="global-search"
            placeholder="Buscar código, serie, factura, proveedor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ flex: 1, fontSize: 14 }}
            inputProps={{ 'aria-label': 'búsqueda global' }}
          />
          <Box
            component="span"
            sx={{
              fontSize: 11,
              color: 'text.secondary',
              border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
              borderRadius: 1,
              px: 0.75,
              py: 0.25,
              lineHeight: 1,
            }}
          >
            /
          </Box>
        </SearchBox>

        <Box sx={{ flex: 1 }} />

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
          <AccountCircleOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 220, mt: 1, borderRadius: 2 } } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.fullName ?? user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.username}
            </Typography>
          </Box>
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
            <LogoutRoundedIcon fontSize="small" />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}