export type ColumnType = 'numeric' | 'categorical' | 'date' | 'mixed' | 'unknown'

export type FileFormat = 'csv' | 'xlsx' | 'xls' | 'json' | 'other'

export interface ColumnInfo {
  name: string
  type: ColumnType
  nullPct: number
  isMixed: boolean
}

export interface DatasetStats {
  rowCount: number
  columnCount: number
  columns: ColumnInfo[]
  duplicatePct: number
  completenessPct: number
  fileFormat: FileFormat
  hasTargetColumn: boolean
}

export interface UserAnswers {
  hasDocumentation: boolean
  licenseSafe: 'yes' | 'unsure' | 'no'
}

export interface ParsedFile {
  rows: Record<string, unknown>[]
  headers: string[]
  format: FileFormat
}

export type Band = 'excelente' | 'aceptable' | 'mejoras' | 'no-viable'

export type DimensionId = 'calidad' | 'estructura' | 'potencial' | 'practico'

export interface DimensionScore {
  id: DimensionId
  label: string
  score: number
  weight: number
}

export type CriterionId =
  | 'completeness'
  | 'consistency'
  | 'duplicates'
  | 'adequate_size'
  | 'column_variety'
  | 'target_column'
  | 'answerable_questions'
  | 'variable_relationships'
  | 'visualization_potential'
  | 'accessible_format'
  | 'documentation'
  | 'license_ethics'

export interface CriterionScore {
  id: CriterionId
  label: string
  weight: number
  score: number
  dimension: DimensionId
}

export interface AnalysisResult {
  final: number
  band: Band
  dimensions: DimensionScore[]
  criteria: CriterionScore[]
  recommendations: string[]
}
