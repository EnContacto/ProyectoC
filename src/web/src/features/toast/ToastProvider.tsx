import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Alert, { type AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type ShowToast = (message: string, severity?: AlertColor) => void

const ToastContext = createContext<ShowToast>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')

  const show = useCallback<ShowToast>((msg, sev = 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }, [])

  const value = useMemo(() => show, [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}