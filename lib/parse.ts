import type { ParsedFile, FileFormat } from './types'

function getFormat(filename: string): FileFormat {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return 'csv'
  if (ext === 'xlsx') return 'xlsx'
  if (ext === 'xls') return 'xls'
  if (ext === 'json') return 'json'
  return 'other'
}

async function parseCSV(file: File): Promise<Record<string, unknown>[]> {
  const Papa = (await import('papaparse')).default
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => resolve(result.data as Record<string, unknown>[]),
      error: (err) => reject(new Error(err.message)),
    })
  })
}

async function parseXLSX(file: File): Promise<Record<string, unknown>[]> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })
}

async function parseJSON(file: File): Promise<Record<string, unknown>[]> {
  const text = await file.text()
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) {
    throw new Error('El archivo JSON debe contener un array de objetos')
  }
  if (parsed.length > 0 && typeof parsed[0] !== 'object') {
    throw new Error('El archivo JSON debe contener objetos en cada elemento del array')
  }
  return parsed as Record<string, unknown>[]
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const format = getFormat(file.name)
  let rows: Record<string, unknown>[]

  if (format === 'csv') {
    rows = await parseCSV(file)
  } else if (format === 'xlsx' || format === 'xls') {
    rows = await parseXLSX(file)
  } else if (format === 'json') {
    rows = await parseJSON(file)
  } else {
    throw new Error(`Formato no soportado: .${file.name.split('.').pop()}`)
  }

  if (rows.length === 0) {
    throw new Error('El archivo está vacío o no contiene datos válidos')
  }

  const headers = Object.keys(rows[0])
  return { rows, headers, format }
}
