import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Stack, TextField, Typography, alpha, CircularProgress } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { useAuth } from '@/auth/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) return <Navigate to="/activos" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/activos', { replace: true })
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (t) =>
          `radial-gradient(1200px 600px at 10% -10%, ${alpha(t.palette.primary.main, 0.18)} 0%, transparent 60%),
           radial-gradient(900px 500px at 110% 110%, ${alpha(t.palette.primary.light, 0.22)} 0%, transparent 60%),
           ${t.palette.background.default}`,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.06)}`,
          boxShadow: (t) => `0 12px 40px ${alpha(t.palette.primary.main, 0.08)}`,
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: (t) => `linear-gradient(135deg, ${t.palette.primary.light} 0%, ${t.palette.primary.main} 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h2">ProyectoC</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              InputProps={{
                startAdornment: <PersonOutlineRoundedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <Typography variant="body2" color="error.main">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !username || !password}
              sx={{ py: 1.25, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Ingresar'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}