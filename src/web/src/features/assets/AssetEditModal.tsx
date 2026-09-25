import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import IconButton from '@mui/material/IconButton'
import { useUpdateAsset } from '@/api/assets'
import {
  useAccountingAccounts,
  useCustodians,
  useLocations,
} from '@/api/catalogs'
import type { AssetDto, UpdateAssetRequest } from '@/api/dto'
import { useToast } from '@/features/toast/ToastProvider'

const STATUS_OPTIONS = [
  { value: 1, label: 'Bueno' },
  { value: 2, label: 'Regular' },
  { value: 3, label: 'Malo' },
  { value: 4, label: 'Dar de baja' },
  { value: 5, label: 'Faltante' },
  { value: 6, label: 'Cambio de serie' },
  { value: 7, label: 'Vendido' },
  { value: 99, label: 'ND' },
]

const CLASSIFICATION_OPTIONS = [
  { value: 1, label: 'Activo' },
  { value: 2, label: 'Inventario' },
]

const schema = z.object({
  name: z.string().max(200).nullable().optional(),
  detail: z.string().max(500).nullable().optional(),
  brand: z.string().max(120).nullable().optional(),
  model: z.string().max(120).nullable().optional(),
  serial: z.string().max(120).nullable().optional(),
  components: z.string().max(500).nullable().optional(),
  capacity: z.string().max(120).nullable().optional(),
  dimensions: z.string().max(120).nullable().optional(),
  material: z.string().max(120).nullable().optional(),
  color: z.string().max(80).nullable().optional(),
  status: z.number().int(),
  invoiceNumber: z.string().max(80).nullable().optional(),
  provider: z.string().max(200).nullable().optional(),
  purchaseDate: z.string().nullable().optional(),
  acquisitionValue: z.number().nullable().optional(),
  priorResidualValue: z.number().nullable().optional(),
  residualRate: z.number().nullable().optional(),
  usefulLifeYears: z.number().int().nullable().optional(),
  locationId: z.string().nullable().optional(),
  specificLocation: z.string().max(200).nullable().optional(),
  custodianId: z.string().nullable().optional(),
  accountingAccountId: z.string().nullable().optional(),
  classification: z.number().int(),
  notes: z.string().max(1000).nullable().optional(),
  manualReviewReason: z.string().max(500).nullable().optional(),
  markedAsReviewed: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  asset: AssetDto | null
  onClose: () => void
}

function trimOrNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

function toDateInput(value: string | null | undefined): string {
  if (!value) return ''
  return value.slice(0, 10)
}

function fromDateInput(value: string | null | undefined): string | null {
  if (!value) return null
  return `${value}T00:00:00`
}

export function AssetEditModal({ open, asset, onClose }: Props) {
  const toast = useToast()
  const updateAsset = useUpdateAsset()
  const locations = useLocations()
  const custodians = useCustodians()
  const accounts = useAccountingAccounts()

  const defaults = useMemo<FormValues>(
    () => ({
      name: asset?.name ?? '',
      detail: asset?.detail ?? '',
      brand: asset?.brand ?? '',
      model: asset?.model ?? '',
      serial: asset?.serial ?? '',
      components: asset?.components ?? '',
      capacity: asset?.capacity ?? '',
      dimensions: asset?.dimensions ?? '',
      material: asset?.material ?? '',
      color: asset?.color ?? '',
      status: asset?.status ?? 99,
      invoiceNumber: asset?.invoiceNumber ?? '',
      provider: asset?.provider ?? '',
      purchaseDate: toDateInput(asset?.purchaseDate),
      acquisitionValue: asset?.acquisitionValue ?? null,
      priorResidualValue: asset?.priorResidualValue ?? null,
      residualRate: asset?.residualRate ?? null,
      usefulLifeYears: asset?.usefulLifeYears ?? null,
      locationId: asset?.locationId ?? '',
      specificLocation: asset?.specificLocation ?? '',
      custodianId: asset?.custodianId ?? '',
      accountingAccountId: asset?.accountingAccountId ?? '',
      classification: asset?.classification ?? 1,
      notes: asset?.notes ?? '',
      manualReviewReason: asset?.manualReviewReason ?? '',
      markedAsReviewed: asset?.markedAsReviewed ?? false,
    }),
    [asset],
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(defaults)
  }, [defaults, reset])

  const onSubmit = handleSubmit(async (values) => {
    if (!asset) return
    const payload: UpdateAssetRequest = {
      name: trimOrNull(values.name),
      detail: trimOrNull(values.detail),
      brand: trimOrNull(values.brand),
      model: trimOrNull(values.model),
      serial: trimOrNull(values.serial),
      components: trimOrNull(values.components),
      capacity: trimOrNull(values.capacity),
      dimensions: trimOrNull(values.dimensions),
      material: trimOrNull(values.material),
      color: trimOrNull(values.color),
      status: values.status,
      invoiceNumber: trimOrNull(values.invoiceNumber),
      provider: trimOrNull(values.provider),
      purchaseDate: fromDateInput(values.purchaseDate),
      acquisitionValue: values.acquisitionValue ?? null,
      priorResidualValue: values.priorResidualValue ?? null,
      residualRate: values.residualRate ?? null,
      usefulLifeYears: values.usefulLifeYears ?? null,
      locationId: values.locationId || null,
      specificLocation: trimOrNull(values.specificLocation),
      custodianId: values.custodianId || null,
      accountingAccountId: values.accountingAccountId || null,
      classification: values.classification,
      notes: trimOrNull(values.notes),
      manualReviewReason: trimOrNull(values.manualReviewReason),
      markedAsReviewed: values.markedAsReviewed ?? false,
    }
    try {
      await updateAsset.mutateAsync({ id: asset.id, body: payload })
      toast('Activo actualizado', 'success')
      onClose()
    } catch {
      toast('No se pudo guardar el activo', 'error')
    }
  })

  const sections = [
    {
      title: 'Identificación',
      fields: (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Nombre" />
            )}
          />
          <Controller
            name="detail"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Detalle" />
            )}
          />
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Marca" />
            )}
          />
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Modelo" />
            )}
          />
          <Controller
            name="serial"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Serie" />
            )}
          />
          <Controller
            name="components"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Componentes" />
            )}
          />
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Capacidad" />
            )}
          />
          <Controller
            name="dimensions"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Dimensiones" />
            )}
          />
          <Controller
            name="material"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Material" />
            )}
          />
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Color" />
            )}
          />
        </Box>
      ),
    },
    {
      title: 'Clasificación y estado',
      fields: (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <Controller
            name="classification"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Clasificación"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {CLASSIFICATION_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Estado"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
      ),
    },
    {
      title: 'Ubicación y responsable',
      fields: (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <Controller
            name="locationId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Ubicación"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || '')}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                <MenuItem value="">Sin ubicación</MenuItem>
                {(locations.data ?? []).map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="specificLocation"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Ubicación específica" />
            )}
          />
          <Controller
            name="custodianId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Custodio"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || '')}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                <MenuItem value="">Sin custodio</MenuItem>
                {(custodians.data ?? []).map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="accountingAccountId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Cuenta contable"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || '')}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                <MenuItem value="">Sin cuenta</MenuItem>
                {(accounts.data ?? []).map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.code} — {a.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
      ),
    },
    {
      title: 'Adquisición',
      fields: (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <Controller
            name="purchaseDate"
            control={control}
            render={({ field }) => (
              <TextField
                type="date"
                label="Fecha de adquisición"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <Controller
            name="acquisitionValue"
            control={control}
            render={({ field }) => (
              <TextField
                label="Valor de adquisición"
                type="number"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                  inputLabel: { shrink: true },
                }}
              />
            )}
          />
          <Controller
            name="invoiceNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="No. factura" />
            )}
          />
          <Controller
            name="provider"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Proveedor" />
            )}
          />
        </Box>
      ),
    },
    {
      title: 'Depreciación',
      fields: (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 1.75,
          }}
        >
          <Controller
            name="usefulLifeYears"
            control={control}
            render={({ field }) => (
              <TextField
                label="Vida útil (años)"
                type="number"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <Controller
            name="residualRate"
            control={control}
            render={({ field }) => (
              <TextField
                label="Tasa residual"
                type="number"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <Controller
            name="priorResidualValue"
            control={control}
            render={({ field }) => (
              <TextField
                label="Valor residual anterior"
                type="number"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                  inputLabel: { shrink: true },
                }}
              />
            )}
          />
        </Box>
      ),
    },
    {
      title: 'Notas y revisión',
      fields: (
        <Stack spacing={1.75}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Notas"
                multiline
                minRows={2}
              />
            )}
          />
          {asset?.manualReviewRequired && (
            <>
              <Controller
                name="manualReviewReason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    label="Motivo de revisión"
                    multiline
                    minRows={2}
                  />
                )}
              />
              <Controller
                name="markedAsReviewed"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Marcar como revisado"
                  />
                )}
              />
            </>
          )}
        </Stack>
      ),
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            backgroundImage: 'none',
          },
        },
      }}
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
          <Typography variant="h3">
            {asset?.name ?? asset?.currentCode ?? 'Activo'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: 0.3,
            }}
          >
            {asset?.currentCode}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3} divider={<Divider />}>
          {sections.map((s) => (
            <Box key={s.title}>
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
                {s.title}
              </Typography>
              {s.fields}
            </Box>
          ))}
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
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting || !isDirty}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SaveOutlinedIcon />}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}