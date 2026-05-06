'use client'

import { useEffect, useState } from 'react'
import type { UserAnswers, AnalysisResult } from '@/lib/types'
import { parseFile } from '@/lib/parse'
import { computeStats, scoreDataset } from '@/lib/analyze'

const STEPS = [
  'Leyendo archivo…',
  'Infiriendo tipos de columnas…',
  'Calculando completitud…',
  'Detectando duplicados…',
  'Evaluando potencial analítico…',
  'Calculando puntaje final…',
]

interface AnalyzingProps {
  file: File
  answers: UserAnswers
  onDone: (result: AnalysisResult) => void
  onError: () => void
}

export default function Analyzing({ file, answers, onDone, onError }: AnalyzingProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const interval = setInterval(() => {
          setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
        }, 300)

        const parsed = await parseFile(file)
        const stats = computeStats(parsed)
        const result = scoreDataset(stats, answers)

        clearInterval(interval)
        if (!cancelled) {
          setStepIndex(STEPS.length - 1)
          await new Promise((r) => setTimeout(r, 400))
          if (!cancelled) onDone(result)
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el archivo')
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [file, answers, onDone])

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold font-mono mb-3 text-red-400">Error al analizar</h2>
        <p className="text-brand-text-muted max-w-sm mb-8">{errorMsg}</p>
        <button
          onClick={onError}
          className="px-6 py-3 rounded-full bg-brand-accent text-black font-semibold hover:bg-orange-400 transition-all"
        >
          Intentar con otro archivo
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
        <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-brand-accent text-xl">
          📊
        </div>
      </div>

      <h2 className="text-2xl font-bold font-mono mb-2">Analizando dataset</h2>
      <p className="text-brand-text-muted text-sm mb-8">
        <span className="font-mono text-brand-accent">{file.name}</span>
      </p>

      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`
              flex items-center gap-3 text-sm transition-all duration-200
              ${i <= stepIndex ? 'text-brand-text' : 'text-brand-border'}
            `}
          >
            <span className="font-mono w-4 text-center">
              {i < stepIndex ? '✓' : i === stepIndex ? '›' : '·'}
            </span>
            <span className={i === stepIndex ? 'text-brand-accent' : ''}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
