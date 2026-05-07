'use client'

import { useEffect, useState } from 'react'
import type { UserAnswers, AnalysisResult } from '@/lib/types'
import { parseFile } from '@/lib/parse'
import { computeStats, scoreDataset } from '@/lib/analyze'

const STEPS = [
  { id: 'read',  label: 'Leyendo archivo',         addr: '0x0010' },
  { id: 'types', label: 'Infiriendo tipos',         addr: '0x0024' },
  { id: 'nulls', label: 'Calculando completitud',   addr: '0x0038' },
  { id: 'dupes', label: 'Detectando duplicados',    addr: '0x004C' },
  { id: 'score', label: 'Evaluando potencial',      addr: '0x0060' },
  { id: 'final', label: 'Calculando puntaje final', addr: '0x0074' },
]

interface AnalyzingProps {
  file: File
  answers: UserAnswers
  onDone: (result: AnalysisResult) => void
  onError: () => void
}

function StepBar() {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold"
            style={{
              background: '#f97316',
              color: '#000',
              border: '1px solid #f97316',
            }}
          >
            {step < 3 ? '✓' : step}
          </div>
          {step < 3 && (
            <div className="h-px w-8" style={{ background: '#f97316' }} />
          )}
        </div>
      ))}
      <span className="ml-1 font-mono text-xs text-brand-text-muted">Paso 3 de 3</span>
    </div>
  )
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
        }, 280)

        const parsed = await parseFile(file)
        const stats = computeStats(parsed)
        const result = scoreDataset(stats, answers)

        clearInterval(interval)
        if (!cancelled) {
          setStepIndex(STEPS.length - 1)
          await new Promise((r) => setTimeout(r, 500))
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
        <div className="w-full max-w-lg bg-brand-surface border border-red-500/30 rounded-2xl p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="font-mono font-bold text-red-400 text-lg mb-2">Error al procesar</p>
          <p className="font-mono text-sm text-red-400/70 mb-6">{errorMsg}</p>
          <button
            onClick={onError}
            className="font-mono font-bold text-sm px-8 py-3 rounded-xl transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(249,115,22,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        <div className="animate-slide-up">
          <StepBar />
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden animate-slide-up delay-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-mono font-bold text-brand-text flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              Analizando dataset
            </h2>
            <p className="font-mono text-[11px] text-brand-text-muted mt-0.5 truncate max-w-[280px]">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>

          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between font-mono text-[10px] text-brand-text-muted mb-2">
                <span>Progreso</span>
                <span className="text-brand-accent">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-brand-surface-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #f97316, #facc15)',
                    boxShadow: '0 0 8px rgba(249,115,22,0.5)',
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 transition-all duration-200"
                    style={{ opacity: done ? 0.4 : active ? 1 : 0.2 }}
                  >
                    <span className="font-mono text-[10px] text-brand-text-muted/50 w-14 shrink-0">
                      {step.addr}
                    </span>
                    <span
                      className="w-4 text-center text-sm"
                      style={{
                        color: done ? '#22c55e' : active ? '#f97316' : '#333',
                      }}
                    >
                      {done ? '✓' : active ? '›' : '·'}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{
                        color: done ? '#444' : active ? '#f5f5f5' : '#333',
                      }}
                    >
                      {step.label}
                      {active && <span className="animate-blink ml-0.5">_</span>}
                    </span>
                  </div>
                )
              })}
            </div>

            <p className="mt-8 font-mono text-[10px] text-brand-text-muted/25 text-center">
              Procesado en tu navegador · Sin envío a servidores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
