import type { Band, CriterionId } from './types'

export function scoreColor(score: number): string {
  if (score >= 8) return '#22c55e'
  if (score >= 6) return '#facc15'
  if (score >= 4) return '#f97316'
  return '#ef4444'
}

export function scoreGradient(score: number): string {
  if (score >= 8) return 'from-green-400 to-green-600'
  if (score >= 6) return 'from-yellow-400 to-orange-400'
  if (score >= 4) return 'from-orange-400 to-red-500'
  return 'from-red-500 to-red-700'
}

export const BAND_CONFIG: Record<Band, { label: string; color: string; bgClass: string; textClass: string }> = {
  excelente: {
    label: 'Excelente — listo para el proyecto',
    color: '#22c55e',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
  },
  aceptable: {
    label: 'Aceptable — con pequeños ajustes',
    color: '#facc15',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
  },
  mejoras: {
    label: 'Necesita mejoras significativas',
    color: '#f97316',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-400',
  },
  'no-viable': {
    label: 'No viable para el proyecto',
    color: '#ef4444',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
  },
}

export const CRITERION_INFO: Record<CriterionId, { what: string; how: string }> = {
  completeness: {
    what: 'Mide qué porcentaje de las celdas de tu dataset tienen datos (no están vacías o nulas).',
    how: '≥95% completo → 10 · 85–94% → 7 · 70–84% → 4 · <70% → 1',
  },
  consistency: {
    what: 'Evalúa si cada columna contiene valores del mismo tipo de dato (p. ej., que una columna de números no mezcle texto con números).',
    how: 'Todas consistentes → 10 · 1–2 columnas mixtas → 6 · 3+ columnas mixtas → 2',
  },
  duplicates: {
    what: 'Detecta qué porcentaje de las filas son duplicados exactos. Los duplicados distorsionan los modelos y los análisis estadísticos.',
    how: '<1% duplicados → 10 · 1–5% → 7 · 5–15% → 4 · >15% → 1',
  },
  adequate_size: {
    what: 'Verifica que el dataset tenga suficientes filas para entrenar modelos o hacer análisis estadísticamente significativos.',
    how: '1k–100k filas → 10 · 500–999 o 100k–500k → 7 · 100–499 → 4 · <100 o >500k → 1',
  },
  column_variety: {
    what: 'Comprueba si el dataset tiene columnas de diferentes tipos: numéricas, categóricas y de fecha. La variedad permite más tipos de análisis.',
    how: 'Los 3 tipos presentes → 10 · 2 tipos → 6 · Solo 1 tipo → 3',
  },
  answerable_questions: {
    what: 'Estima cuántas preguntas analíticas se pueden responder con el dataset, según la combinación de número de columnas y cantidad de filas.',
    how: '≥8 columnas y ≥1k filas → 10 · 5–7 columnas o 500–999 filas → 7 · 3–4 columnas → 4 · <3 columnas → 1',
  },
  variable_relationships: {
    what: 'Verifica si hay al menos dos columnas numéricas, lo que permite explorar correlaciones, regresiones y relaciones entre variables.',
    how: '≥3 numéricas → 10 · 2 numéricas → 6 · 1 numérica → 3 · 0 numéricas → 1',
  },
  visualization_potential: {
    what: 'Evalúa qué tan fácil es visualizar los datos según los tipos de columnas disponibles (series de tiempo, barras, scatter plots, etc.).',
    how: 'Fecha + numérica → 10 · Categórica + numérica → 8 · Solo una de las dos → 4 · Ninguna → 1',
  },
  accessible_format: {
    what: 'Puntúa el formato del archivo. Los formatos estándar como CSV son universalmente compatibles y fáciles de cargar en cualquier herramienta.',
    how: '.csv → 10 · .xlsx/.xls → 9 · .json → 7 · Otro → 2',
  },
  documentation: {
    what: 'Evalúa si el dataset viene acompañado de un diccionario de datos, README o descripción de las columnas. Esto es crucial para entender qué representa cada variable.',
    how: 'Respondiste "Sí" → 10 · Respondiste "No" → 3',
  },
  license_ethics: {
    what: 'Considera si el dataset es de uso libre y no contiene datos personales sensibles (PII como nombres, cédulas, emails, ubicaciones precisas). El uso ético de los datos es fundamental.',
    how: 'Público y sin PII → 10 · No sé → 5 · No es público o tiene PII → 1',
  },
}

export const JURY_REACTIONS: Record<string, Array<{ label: string; emoji: string }>> = {
  excelente: [
    { label: '¡Excelente dataset!', emoji: '🎉' },
    { label: '¡Esto es lo que quería ver!', emoji: '🙌' },
    { label: '¡Muy buen trabajo!', emoji: '⭐' },
    { label: '¡Listo para producción!', emoji: '🚀' },
    { label: '¡Sobresaliente!', emoji: '🏆' },
    { label: '¡Me encanta este dataset!', emoji: '❤️' },
    { label: '¡Impresionante calidad!', emoji: '💎' },
    { label: '¡Definitivamente aprobado!', emoji: '✅' },
    { label: '¡Datos de primera!', emoji: '🔥' },
    { label: '¡Felicitaciones!', emoji: '🎊' },
  ],
  aceptable: [
    { label: 'Puede mejorar un poco', emoji: '🤔' },
    { label: 'Va por buen camino', emoji: '👍' },
    { label: 'Le falta algo de trabajo', emoji: '🛠️' },
    { label: 'Aceptable, pero hay margen', emoji: '📊' },
    { label: 'Con ajustes puede funcionar', emoji: '⚙️' },
    { label: 'No está mal, pero...', emoji: '🤨' },
    { label: 'Tiene potencial', emoji: '💡' },
    { label: 'Casi, casi', emoji: '👀' },
    { label: 'Revisaría algunos criterios', emoji: '📋' },
    { label: 'Pase... por esta vez', emoji: '😏' },
  ],
  mejoras: [
    { label: 'Necesita bastante trabajo', emoji: '😬' },
    { label: 'Hay que mejorar esto', emoji: '🔧' },
    { label: 'Me preocupa la calidad', emoji: '😟' },
    { label: 'Falta mucho por hacer', emoji: '📉' },
    { label: 'No te rindas, pero trabaja más', emoji: '💪' },
    { label: 'Esto necesita revisión', emoji: '🔍' },
    { label: 'Hay que limpiar los datos', emoji: '🧹' },
    { label: 'Podría ser mejor', emoji: '😐' },
    { label: 'Revisa las recomendaciones', emoji: '📌' },
    { label: 'Con esfuerzo puede mejorar', emoji: '🏗️' },
  ],
  'no-viable': [
    { label: 'No está listo para el proyecto', emoji: '❌' },
    { label: 'Necesita reconstrucción', emoji: '💥' },
    { label: 'Busca otro dataset', emoji: '🚫' },
    { label: 'Muy por debajo del mínimo', emoji: '📉' },
    { label: 'No recomiendo usarlo así', emoji: '🙅' },
    { label: 'Empezaría desde cero', emoji: '😔' },
    { label: 'No pasa la prueba', emoji: '😤' },
    { label: 'Hay problemas serios aquí', emoji: '⚠️' },
    { label: 'Necesita trabajo urgente', emoji: '🚨' },
    { label: 'No apto para el bootcamp', emoji: '📛' },
  ],
}
