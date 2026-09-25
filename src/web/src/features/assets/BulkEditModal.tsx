import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import type { AssetDto, BulkUpdateRequest } from '@/api/dto'
import { useBulkUpdateAssets } from '@/api/assets'
import {
  useAccountingAccounts,
  useCategories,
  useCompanies,
  useLocations,
} from '@/api/catalogs'
import { useToast } from '@/features/toast/ToastProvider'

interface Props {
  open: boolean
  selectedIds: string[]
  visibleAssets: AssetDto[]
  onClose: () => void
  onSuccess: () => void
}

interface FieldState {
  enabled: boolean
  value: string
}

const initialField: FieldState = { enabled: false, value: '' }

export function BulkEditModal({
  open,
  selectedIds,
  visibleAssets,
  onClose,
  onSuccess,
}: Props) {
  const toast = useToast()
  const bulkUpdate = useBulkUpdateAssets()
  const companies = useCompanies()
  const categories = useCategories()
  const locations = useLocations()
  const accounts = useAccountingAccounts()

  const [company, setCompany] = useState<FieldState>(initialField)
  const [category, setCategory] = useState<FieldState>(initialField)
  const [location, setLocation] = useState<FieldState>(initialField)
  const [account, setAccount] = useState<FieldState>(initialField)

  useEffect(() => {
    if (open) {
      setCompany(initialField)
      setCategory(initialField)
      setLocation(initialField)
      setAccount(initialField)
    }
  }, [open])

  const enabledCount =
    Number(company.enabled) +
    Number(category.enabled) +
    Number(location.enabled) +
    Number(account.enabled)

  const recodesAssets = company.enabled || category.enabled

  const previewAssets = useMemo(() => {
    const selectedSet = new Set(selectedIds)
    return visibleAssets.filter((a) => selectedSet.has(a.id)).slice(0, 10)
  }, [visibleAssets, selectedIds])

  const notVisibleCount = selectedIds.length - previewAssets.length

  const handleSubmit = async () => {
    const fields: BulkUpdateRequest['fields'] = {}
    if (company.enabled) fields.companyId = company.value
    if (category.enabled) fields.categoryId = category.value
    if (location.enabled) fields.locationId = location.value
    if (account.enabled) fields.accountingAccountId = account.value

    if (Object.keys(fields).length === 0) {
      toast('Debes habilitar al menos un campo', 'warning')
      return
    }

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        toast(`Falta seleccionar valor para ${labelFor(key)}`, 'warning')
        return
      }
    }

    try {
      const res = await bulkUpdate.mutateAsync({ ids: selectedIds, fields })
      if (res.failed.length === 0) {
        toast(
          `${res.updated} ${res.updated === 1 ? 'activo actualizado' : 'activos actualizados'}`,
          'success',
        )
      } else {
        toast(
          `${res.updated} actualizados, ${res.failed.length} no encontrados`,
          'warning',
        )
      }
      onSuccess()
      onClose()
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No se pudo completar la edición masiva'
      toast(message, 'error')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={bulkUpdate.isPending ? undefined : onClose}
      fullWidth
      maxWidth="md"
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
          <Typography variant="h3">Edición masiva</Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedIds.length} {selectedIds.length === 1 ? 'activo' : 'activos'} seleccionados
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={bulkUpdate.isPending}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3} divider={<Divider />}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 1.5,
                fontSize: 11,
                letterSpacing: 0.6,
              }}
            >
              Campos a modificar
            </Typography>

            <Stack spacing={1.5}>
              <BulkField
                icon={<BusinessOutlinedIcon fontSize="small" />}
                label="Empresa"
                state={company}
                onChange={setCompany}
                options={(companies.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
                loading={companies.isLoading}
                warning={company.enabled ? 'Cambiar la empresa genera un nuevo código de activo.' : undefined}
              />
              <BulkField
                icon={<CategoryOutlinedIcon fontSize="small" />}
                label="Categoría"
                state={category}
                onChange={setCategory}
                options={(categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
                loading={categories.isLoading}
                warning={
                  category.enabled
                    ? 'Cambiar la categoría genera un nuevo código de activo.'
                    : undefined
                }
              />
              <BulkField
                icon={<PlaceOutlinedIcon fontSize="small" />}
                label="Ubicación"
                state={location}
                onChange={setLocation}
                options={(locations.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
                loading={locations.isLoading}
              />
              <BulkField
                icon={<AccountBalanceOutlinedIcon fontSize="small" />}
                label="Cuenta contable"
                state={account}
                onChange={setAccount}
                options={(accounts.data ?? []).map((c) => ({
                  value: c.id,
                  label: `${c.code} — ${c.name}`,
                }))}
                loading={accounts.isLoading}
              />
            </Stack>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 1.5,
                fontSize: 11,
                letterSpacing: 0.6,
              }}
            >
              Previsualización
            </Typography>

            {enabledCount === 0 ? (
              <Alert
                severity="info"
                icon={<InfoOutlinedIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                Habilita al menos un campo para ver qué se va a modificar.
              </Alert>
            ) : (
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {company.enabled && (
                    <ChangeChip
                      label="Empresa"
                      value={
                        (companies.data ?? []).find((c) => c.id === company.value)?.name ?? '—'
                      }
                    />
                  )}
                  {category.enabled && (
                    <ChangeChip
                      label="Categoría"
                      value={
                        (categories.data ?? []).find((c) => c.id === category.value)?.name ?? '—'
                      }
                    />
                  )}
                  {location.enabled && (
                    <ChangeChip
                      label="Ubicación"
                      value={
                        (locations.data ?? []).find((c) => c.id === location.value)?.name ?? '—'
                      }
                    />
                  )}
                  {account.enabled && (
                    <ChangeChip
                      label="Cuenta contable"
                      value={
                        (accounts.data ?? []).find((c) => c.id === account.value)?.code ?? '—'
                      }
                    />
                  )}
                </Box>

                {recodesAssets && (
                  <Alert
                    severity="warning"
                    icon={<InfoOutlinedIcon fontSize="small" />}
                    sx={{ borderRadius: 2 }}
                  >
                    Cambiar empresa o categoría generará nuevos códigos de activo para los{' '}
                    {selectedIds.length} seleccionados.
                  </Alert>
                )}

                {previewAssets.length > 0 && (
                  <Box
                    sx={{
                      border: (t) => `1px solid ${t.palette.divider}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ py: 1 }}>Código</TableCell>
                          <TableCell sx={{ py: 1 }}>Nombre</TableCell>
                          <TableCell sx={{ py: 1 }}>Categoría actual</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewAssets.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell
                              sx={{
                                py: 0.75,
                                fontFamily: 'ui-monospace, monospace',
                                fontSize: 12,
                              }}
                            >
                              {a.currentCode}
                            </TableCell>
                            <TableCell sx={{ py: 0.75, fontSize: 12.5 }}>
                              {a.name ?? '—'}
                            </TableCell>
                            <TableCell sx={{ py: 0.75, fontSize: 12.5, color: 'text.secondary' }}>
                              {a.categoryName}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {notVisibleCount > 0 && (
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderTop: (t) => `1px solid ${t.palette.divider}`,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          y {notVisibleCount} más no visibles en la página actual
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          gap: 1,
        }}
      >
        <Button onClick={onClose} color="inherit" disabled={bulkUpdate.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={enabledCount === 0 || bulkUpdate.isPending}
          startIcon={
            bulkUpdate.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveOutlinedIcon />
            )
          }
        >
          Aplicar a {selectedIds.length}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function labelFor(field: string): string {
  switch (field) {
    case 'companyId':
      return 'empresa'
    case 'categoryId':
      return 'categoría'
    case 'locationId':
      return 'ubicación'
    case 'accountingAccountId':
      return 'cuenta contable'
    default:
      return field
  }
}

function ChangeChip({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 2,
        bgcolor: 'primary.50',
        color: 'primary.dark',
        fontSize: 12,
        fontWeight: 600,
        border: (t) => `1px solid ${t.palette.primary.main}33`,
      }}
    >
      <Typography component="span" sx={{ fontSize: 11, opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography component="span" sx={{ fontSize: 12 }}>
        {value}
      </Typography>
    </Box>
  )
}

interface BulkFieldProps {
  icon: React.ReactNode
  label: string
  state: FieldState
  onChange: (next: FieldState) => void
  options: { value: string; label: string }[]
  loading: boolean
  warning?: string
}

function BulkField({
  icon,
  label,
  state,
  onChange,
  options,
  loading,
  warning,
}: BulkFieldProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: (t) => `1px solid ${state.enabled ? t.palette.primary.main : t.palette.divider}`,
        bgcolor: state.enabled ? 'rgba(38, 166, 154, 0.04)' : 'transparent',
        transition: 'all .15s ease',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <FormControlLabel
          sx={{ m: 0, mr: 1 }}
          control={
            <Checkbox
              size="small"
              checked={state.enabled}
              onChange={(e) => onChange({ ...state, enabled: e.target.checked })}
            />
          }
          label={label}
        />
        <Box sx={{ flex: 1 }} />
        {icon}
      </Stack>
      {state.enabled && (
        <>
          <TextField
            select
            fullWidth
            size="small"
            value={state.value}
            onChange={(e) => onChange({ ...state, value: e.target.value })}
            disabled={loading}
            sx={{ mt: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          {warning && (
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.75, color: 'warning.dark' }}
            >
              {warning}
            </Typography>
          )}
        </>
      )}
    </Box>
  )
}