import { createTheme, alpha } from '@mui/material/styles'

const seed = '#26A69A'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: seed,
      light: alpha(seed, 0.7),
      dark: '#00897B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4DB6AC',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1F23',
      secondary: '#5A6570',
    },
    divider: alpha('#1B1F23', 0.08),
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#C62828' },
    info: { main: '#0277BD' },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: 28, fontWeight: 600, letterSpacing: -0.2 },
    h2: { fontSize: 22, fontWeight: 600, letterSpacing: -0.2 },
    h3: { fontSize: 18, fontWeight: 600 },
    subtitle1: { fontSize: 14, fontWeight: 500 },
    subtitle2: { fontSize: 12, fontWeight: 500, letterSpacing: 0.2 },
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha('#1B1F23', 0.2)} transparent`,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha('#1B1F23', 0.06)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 16 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10, backgroundColor: '#FFFFFF' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          color: '#5A6570',
          backgroundColor: '#F5F7F8',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        slotProps: {
          tooltip: { sx: { fontSize: 12 } },
        },
      },
    },
  },
})