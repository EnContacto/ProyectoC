import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Typography variant="h2">Página no encontrada</Typography>
        <Button variant="contained" onClick={() => navigate('/activos')}>
          Ir a Activos
        </Button>
      </Stack>
    </Box>
  )
}