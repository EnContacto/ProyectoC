import { useMemo } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table'
import type { AssetDto } from '@/api/dto'

interface Props {
  columns: ColumnDef<AssetDto>[]
  data: AssetDto[]
  totalCount: number
  page: number
  pageSize: number
  loading: boolean
  columnVisibility: VisibilityState
  rowSelection: RowSelectionState
  onColumnVisibilityChange: (next: VisibilityState) => void
  onRowSelectionChange: (next: RowSelectionState) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const STICKY_HEADER_BG = '#F5F7F8'

function getStickyWidth(col: ReturnType<ReturnType<typeof useReactTable<AssetDto>>['getAllLeafColumns']>[number]): number {
  return col.columnDef.meta?.minWidth ?? col.getSize() ?? 120
}

export function AssetsTable({
  columns,
  data,
  totalCount,
  page,
  pageSize,
  loading,
  columnVisibility,
  rowSelection,
  onColumnVisibilityChange,
  onRowSelectionChange,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, rowSelection },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater
      onColumnVisibilityChange(next)
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      onRowSelectionChange(next)
    },
    enableRowSelection: true,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  const visibleColumns = table.getVisibleLeafColumns()

  const stickyLeftOffsets = useMemo(() => {
    const offsets: Record<string, number> = {}
    let acc = 0
    for (const col of visibleColumns) {
      if (col.columnDef.meta?.sticky === 'left') {
        offsets[col.id] = acc
        acc += getStickyWidth(col)
      }
    }
    return offsets
  }, [visibleColumns])

  const stickyRightOffsets = useMemo(() => {
    const offsets: Record<string, number> = {}
    let acc = 0
    for (let i = visibleColumns.length - 1; i >= 0; i--) {
      const col = visibleColumns[i]
      if (col.columnDef.meta?.sticky === 'right') {
        offsets[col.id] = acc
        acc += getStickyWidth(col)
      }
    }
    return offsets
  }, [visibleColumns])

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const sticky = meta?.sticky
                  return (
                    <TableCell
                      key={header.id}
                      align={meta?.align ?? 'left'}
                      sx={{
                        ...(sticky
                          ? {
                              position: 'sticky',
                              top: 0,
                              zIndex: 4,
                              backgroundColor: STICKY_HEADER_BG,
                            }
                          : {}),
                        ...(sticky === 'left'
                          ? { left: stickyLeftOffsets[header.column.id] ?? 0 }
                          : {}),
                        ...(sticky === 'right'
                          ? { right: stickyRightOffsets[header.column.id] ?? 0 }
                          : {}),
                        minWidth: meta?.minWidth ?? 120,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                        color: 'text.secondary',
                        py: 1.25,
                        borderBottom: (t) => `1px solid ${t.palette.divider}`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.id} sx={{ py: 1.5 }}>
                      <Skeleton width="80%" height={16} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} sx={{ py: 8, textAlign: 'center' }}>
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                      No hay activos con los filtros actuales
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ajusta los filtros o limpia la búsqueda
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              table.getRowModel().rows.map((row) => {
                const isSelected = row.getIsSelected()
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    sx={{
                      '&:hover td': {
                        backgroundColor: isSelected
                          ? 'rgba(38, 166, 154, 0.10)'
                          : 'rgba(38, 166, 154, 0.04)',
                      },
                      '&.Mui-selected td': {
                        backgroundColor: 'rgba(38, 166, 154, 0.08)',
                      },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta
                      const sticky = meta?.sticky
                      const isSelectCell = cell.column.id === '__select'
                      const baseBg = isSelected
                        ? 'rgba(38, 166, 154, 0.08)'
                        : 'background.paper'
                      return (
                        <TableCell
                          key={cell.id}
                          align={meta?.align ?? 'left'}
                          sx={{
                            py: 1.25,
                            ...(sticky
                              ? {
                                  position: 'sticky',
                                  zIndex: 1,
                                  backgroundColor: baseBg,
                                }
                              : {}),
                            ...(isSelectCell
                              ? {
                                  backgroundColor: isSelected
                                    ? 'rgba(38, 166, 154, 0.08)'
                                    : 'background.paper',
                                }
                              : {}),
                            ...(sticky === 'left'
                              ? { left: stickyLeftOffsets[cell.column.id] ?? 0 }
                              : {}),
                            ...(sticky === 'right'
                              ? { right: stickyRightOffsets[cell.column.id] ?? 0 }
                              : {}),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page - 1}
        rowsPerPage={pageSize}
        onPageChange={(_, next) => onPageChange(next + 1)}
        onRowsPerPageChange={(e) => onPageSizeChange(Number(e.target.value))}
        rowsPerPageOptions={[25, 50, 100, 200]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          '.MuiTablePagination-toolbar': { px: 2, minHeight: 52 },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: 12.5,
            color: 'text.secondary',
          },
        }}
      />
      <Box sx={{ display: 'none' }}>{alpha('#000', 0.1)}</Box>
    </Paper>
  )
}

export function ColumnVisibilityMenuItems({
  allColumns,
  visibility,
  onToggle,
}: {
  allColumns: { id: string; label: string }[]
  visibility: Record<string, boolean>
  onToggle: (id: string, next: boolean) => void
}) {
  return (
    <>
      {allColumns.map((col) => {
        const visible = visibility[col.id] !== false
        return (
          <MenuItem
            key={col.id}
            onClick={() => onToggle(col.id, !visible)}
            sx={{ gap: 1, fontSize: 13 }}
          >
            <Box
              component="span"
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                border: (t) => `1.5px solid ${t.palette.divider}`,
                backgroundColor: visible ? 'primary.main' : 'transparent',
                borderColor: visible ? 'primary.main' : 'divider',
                display: 'inline-block',
              }}
            />
            {col.label}
          </MenuItem>
        )
      })}
    </>
  )
}