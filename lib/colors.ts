import type { Band } from './types'

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

export const JURY_REACTION: Record<string, { label: string; emoji: string }> = {
  excelente: { label: '¡Excelente dataset!', emoji: '🎉' },
  aceptable: { label: 'Puede mejorar', emoji: '🤔' },
  mejoras: { label: 'Puede mejorar', emoji: '🤔' },
  'no-viable': { label: 'Necesita trabajo', emoji: '😬' },
}
