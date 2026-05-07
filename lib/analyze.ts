import type {
  ColumnType,
  ColumnInfo,
  DatasetStats,
  UserAnswers,
  ParsedFile,
  AnalysisResult,
  CriterionScore,
  DimensionScore,
  Band,
  CriterionId,
} from './types'

const DATE_REGEXES = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{2}-\d{2}-\d{4}$/,
  /^\d{4}\/\d{2}\/\d{2}$/,
]

function isDateString(val: string): boolean {
  if (DATE_REGEXES.some((r) => r.test(val))) return true
  const d = Date.parse(val)
  return !isNaN(d)
}

function inferColumnType(values: unknown[]): { type: ColumnType; isMixed: boolean } {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '')
  if (nonNull.length === 0) return { type: 'unknown', isMixed: false }

  let numericCount = 0
  let dateCount = 0

  for (const v of nonNull) {
    const str = String(v).trim()
    if (!isNaN(Number(str)) && str !== '') {
      numericCount++
    } else if (isDateString(str)) {
      dateCount++
    }
  }

  const total = nonNull.length
  const numericPct = numericCount / total
  const datePct = dateCount / total

  if (numericPct >= 0.9) return { type: 'numeric', isMixed: false }
  if (datePct >= 0.8) return { type: 'date', isMixed: false }

  const mixedPct = (numericCount + dateCount) / total
  if (mixedPct > 0.1 && mixedPct < 0.9) {
    return { type: 'mixed', isMixed: true }
  }

  return { type: 'categorical', isMixed: false }
}

function computeNullPct(values: unknown[]): number {
  if (values.length === 0) return 1
  const nullCount = values.filter(
    (v) => v === null || v === undefined || v === ''
  ).length
  return nullCount / values.length
}

function computeDuplicatePct(rows: Record<string, unknown>[]): number {
  if (rows.length === 0) return 0
  const seen = new Set<string>()
  let dupes = 0
  for (const row of rows) {
    const key = JSON.stringify(row)
    if (seen.has(key)) {
      dupes++
    } else {
      seen.add(key)
    }
  }
  return dupes / rows.length
}

export function computeStats(parsed: ParsedFile): DatasetStats {
  const { rows, headers, format } = parsed

  const columns: ColumnInfo[] = headers.map((name) => {
    const values = rows.map((r) => r[name])
    const { type, isMixed } = inferColumnType(values)
    const nullPct = computeNullPct(values)
    return { name, type, nullPct, isMixed }
  })

  const totalCells = rows.length * headers.length
  const nullCells = columns.reduce((acc, col) => acc + col.nullPct * rows.length, 0)
  const completenessPct = totalCells > 0 ? 1 - nullCells / totalCells : 0

  const duplicatePct = computeDuplicatePct(rows)

  return {
    rowCount: rows.length,
    columnCount: headers.length,
    columns,
    duplicatePct,
    completenessPct,
    fileFormat: format,
  }
}

function scoreCompleteness(pct: number): number {
  if (pct >= 0.95) return 10
  if (pct >= 0.85) return 7
  if (pct >= 0.7) return 4
  return 1
}

function scoreDuplicates(pct: number): number {
  if (pct < 0.01) return 10
  if (pct <= 0.05) return 7
  if (pct <= 0.15) return 4
  return 1
}

function scoreAdequateSize(rowCount: number): number {
  if (rowCount >= 1000 && rowCount <= 100000) return 10
  if ((rowCount >= 500 && rowCount < 1000) || (rowCount > 100000 && rowCount <= 500000)) return 7
  if (rowCount >= 100) return 4
  return 1
}

function scoreColumnVariety(columns: ColumnInfo[]): number {
  const hasNumeric = columns.some((c) => c.type === 'numeric')
  const hasCategorical = columns.some((c) => c.type === 'categorical')
  const hasDate = columns.some((c) => c.type === 'date')
  const count = [hasNumeric, hasCategorical, hasDate].filter(Boolean).length
  if (count >= 3) return 10
  if (count === 2) return 6
  return 3
}

function scoreConsistency(columns: ColumnInfo[]): number {
  const inconsistent = columns.filter((c) => c.isMixed).length
  if (inconsistent === 0) return 10
  if (inconsistent <= 2) return 6
  return 2
}

function scoreAnswerableQuestions(columnCount: number, rowCount: number): number {
  if (columnCount >= 8 && rowCount >= 1000) return 10
  if (columnCount >= 5 || rowCount >= 500) return 7
  if (columnCount >= 3) return 4
  return 1
}

function scoreVariableRelationships(columns: ColumnInfo[]): number {
  const numericCount = columns.filter((c) => c.type === 'numeric').length
  if (numericCount >= 3) return 10
  if (numericCount === 2) return 6
  if (numericCount === 1) return 3
  return 1
}

function scoreVisualizationPotential(columns: ColumnInfo[]): number {
  const hasDate = columns.some((c) => c.type === 'date')
  const hasNumeric = columns.some((c) => c.type === 'numeric')
  const hasCategorical = columns.some((c) => c.type === 'categorical')

  if (hasDate && hasNumeric) return 10
  if (hasCategorical && hasNumeric) return 8
  if (hasDate || hasNumeric || hasCategorical) return 4
  return 1
}

function scoreAccessibleFormat(format: string): number {
  if (format === 'csv') return 10
  if (format === 'xlsx' || format === 'xls') return 9
  if (format === 'json') return 7
  return 2
}

function scoreDocumentation(hasDoc: boolean): number {
  return hasDoc ? 10 : 3
}

function scoreLicense(safe: 'yes' | 'unsure' | 'no'): number {
  if (safe === 'yes') return 10
  if (safe === 'unsure') return 5
  return 1
}

export function bandFor(score: number): Band {
  if (score >= 8) return 'excelente'
  if (score >= 6) return 'aceptable'
  if (score >= 4) return 'mejoras'
  return 'no-viable'
}

const RECOMMENDATIONS: Record<CriterionId, string> = {
  completeness:
    'Limpia los valores nulos: elimina filas incompletas o imputa valores con la media/moda de cada columna.',
  consistency:
    'Revisa las columnas con tipos mixtos y estandariza el formato de datos (ej: todos los números como número, no texto).',
  duplicates:
    'Elimina filas duplicadas. En pandas: `df.drop_duplicates(inplace=True)`.',
  adequate_size:
    'El dataset tiene pocas filas para un análisis robusto. Busca más datos o combina fuentes adicionales.',
  column_variety:
    'Añade columnas de distintos tipos (numéricas, categóricas, fechas) para enriquecer el análisis.',
  answerable_questions:
    'El dataset tiene pocas columnas. Añade más variables para poder formular preguntas analíticas interesantes.',
  variable_relationships:
    'Agrega columnas numéricas para poder calcular correlaciones y construir modelos descriptivos.',
  visualization_potential:
    'Incluye columnas numéricas y/o categóricas para habilitar gráficas de barras, dispersión e histogramas.',
  accessible_format:
    'Convierte el dataset a CSV para mayor compatibilidad con todas las herramientas de análisis.',
  documentation:
    'Agrega un diccionario de datos que describa qué significa cada columna y sus valores posibles.',
  license_ethics:
    'Verifica la licencia del dataset y asegúrate de no incluir datos personales sensibles (PII).',
}

export function scoreDataset(stats: DatasetStats, answers: UserAnswers): AnalysisResult {
  const raw: { id: CriterionId; score: number; weight: number; dimension: string }[] = [
    { id: 'completeness',           score: scoreCompleteness(stats.completenessPct),              weight: 9,  dimension: 'calidad'    },
    { id: 'consistency',            score: scoreConsistency(stats.columns),                        weight: 10, dimension: 'calidad'    },
    { id: 'duplicates',             score: scoreDuplicates(stats.duplicatePct),                    weight: 5,  dimension: 'calidad'    },
    { id: 'adequate_size',          score: scoreAdequateSize(stats.rowCount),                      weight: 18, dimension: 'estructura' },
    { id: 'column_variety',         score: scoreColumnVariety(stats.columns),                      weight: 8,  dimension: 'estructura' },
    { id: 'answerable_questions',   score: scoreAnswerableQuestions(stats.columnCount, stats.rowCount), weight: 14, dimension: 'potencial'  },
    { id: 'variable_relationships', score: scoreVariableRelationships(stats.columns),              weight: 10, dimension: 'potencial'  },
    { id: 'visualization_potential',score: scoreVisualizationPotential(stats.columns),             weight: 8,  dimension: 'potencial'  },
    { id: 'accessible_format',      score: scoreAccessibleFormat(stats.fileFormat),                weight: 5,  dimension: 'practico'   },
    { id: 'documentation',          score: scoreDocumentation(answers.hasDocumentation),           weight: 8,  dimension: 'practico'   },
    { id: 'license_ethics',         score: scoreLicense(answers.licenseSafe),                      weight: 5,  dimension: 'practico'   },
  ]

  const CRITERION_LABELS: Record<CriterionId, string> = {
    completeness:           'Completitud',
    consistency:            'Consistencia',
    duplicates:             'Duplicados',
    adequate_size:          'Tamaño adecuado',
    column_variety:         'Variedad de columnas',
    answerable_questions:   'Preguntas respondibles',
    variable_relationships: 'Relaciones entre variables',
    visualization_potential:'Potencial de visualización',
    accessible_format:      'Formato accesible',
    documentation:          'Documentación',
    license_ethics:         'Licencia y ética',
  }

  const criteria: CriterionScore[] = raw.map((r) => ({
    id: r.id,
    label: CRITERION_LABELS[r.id],
    weight: r.weight,
    score: r.score,
    dimension: r.dimension as never,
  }))

  const DIMENSION_META: { id: string; label: string; weight: number }[] = [
    { id: 'calidad',    label: 'Calidad de datos',    weight: 24 },
    { id: 'estructura', label: 'Estructura',           weight: 26 },
    { id: 'potencial',  label: 'Potencial analítico',  weight: 32 },
    { id: 'practico',   label: 'Aspectos prácticos',   weight: 18 },
  ]

  const dimensions: DimensionScore[] = DIMENSION_META.map(({ id, label, weight }) => {
    const dimCriteria = criteria.filter((c) => c.dimension === id)
    const dimWeightTotal = dimCriteria.reduce((a, c) => a + c.weight, 0)
    const dimScore = dimWeightTotal > 0
      ? dimCriteria.reduce((a, c) => a + c.score * c.weight, 0) / dimWeightTotal
      : 0
    return { id: id as never, label, score: dimScore, weight }
  })

  const weightTotal = criteria.reduce((a, c) => a + c.weight, 0)
  const final = criteria.reduce((a, c) => a + c.score * c.weight, 0) / weightTotal

  const lowestCriteria = [...criteria].sort((a, b) => a.score - b.score).slice(0, 3)
  const recommendations = lowestCriteria.map((c) => RECOMMENDATIONS[c.id])

  return {
    final,
    band: bandFor(final),
    dimensions,
    criteria,
    recommendations,
  }
}
