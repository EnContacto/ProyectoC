import ExcelJS from 'exceljs'
import type { AssetDto } from '@/api/dto'
import type { ReportColumn } from './catalog'
import { excelValue } from './catalog'

const HEADER_FILL = 'FF26A69A'
const HEADER_FONT_COLOR = 'FFFFFFFF'
const BORDER_COLOR = 'FFE0E0E0'

interface ExportOptions {
  fileName: string
  columns: ReportColumn[]
  rows: AssetDto[]
  title?: string
}

const MONEY_FORMAT = '"$"#,##0.00'
const PERCENT_FORMAT = '0.00%'
const DATE_FORMAT = 'dd/mm/yyyy'
const NUMBER_FORMAT = '#,##0'

function buildFileName(base: string): string {
  const stamp = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const datePart = `${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}_${pad(stamp.getHours())}${pad(stamp.getMinutes())}`
  const safe = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${safe || 'reporte'}_${datePart}.xlsx`
}

export async function exportAssetsToExcel({
  fileName,
  columns,
  rows,
  title,
}: ExportOptions): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ProyectoC'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Reporte', {
    views: [{ state: 'frozen', ySplit: title ? 3 : 1 }],
  })

  let headerRowIndex = 1

  if (title) {
    sheet.mergeCells(1, 1, 1, columns.length)
    const titleCell = sheet.getCell(1, 1)
    titleCell.value = title
    titleCell.font = { size: 14, bold: true, color: { argb: 'FF1B1F23' } }
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' }
    sheet.getRow(1).height = 24
    sheet.addRow([])
    headerRowIndex = 3
  }

  const headerRow = sheet.getRow(headerRowIndex)
  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = col.label
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_FILL },
    }
    cell.font = { color: { argb: HEADER_FONT_COLOR }, bold: true, size: 11 }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = {
      top: { style: 'thin', color: { argb: BORDER_COLOR } },
      bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
      left: { style: 'thin', color: { argb: BORDER_COLOR } },
      right: { style: 'thin', color: { argb: BORDER_COLOR } },
    }
    sheet.getColumn(index + 1).width = col.width
  })
  headerRow.height = 22

  rows.forEach((asset) => {
    const row = sheet.addRow(
      columns.map((col) => excelValue(col, asset)),
    )
    columns.forEach((col, index) => {
      const cell = row.getCell(index + 1)
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } },
      }
      switch (col.kind) {
        case 'money':
          cell.numFmt = MONEY_FORMAT
          cell.alignment = { horizontal: 'right', vertical: 'middle' }
          break
        case 'percent':
          cell.numFmt = PERCENT_FORMAT
          cell.alignment = { horizontal: 'right', vertical: 'middle' }
          break
        case 'number':
          cell.numFmt = NUMBER_FORMAT
          cell.alignment = { horizontal: 'right', vertical: 'middle' }
          break
        case 'date':
          cell.numFmt = DATE_FORMAT
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          break
        default:
          cell.alignment = { vertical: 'middle' }
      }
    })
  })

  sheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: headerRowIndex, column: columns.length },
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = buildFileName(fileName)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}