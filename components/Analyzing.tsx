'use client'

import { useEffect, useState } from 'react'
import type { UserAnswers, AnalysisResult } from '@/lib/types'
import { parseFile } from '@/lib/parse'
import { computeStats, scoreDataset } from '@/lib/analyze'

const STEPS = [
  { id: 'read',    label: 'LEYENDO ARCHIVO',             addr: '0x0010' },
  { id: 'types',   label: 'INFIRIENDO TIPOS',            addr: '0x0024' },
  { id: 'nulls',   label: 'CALCULANDO COMPLETITUD',      addr: '0x0038' },
  { id: 'dupes',   label: 'DETECTANDO DUPLICADOS',       addr: '0x004C' },
  { id: 'score',   label: 'EVALUANDO POTENCIAL',         addr: '0x0060' },
  { id: 'final',   label: 'CALCULANDO PUNTAJE FINAL',    addr: '0x0074' },
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
  const [dots, setDots] = useState('')

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => d.length >= 3 ? '' : d + '.')
    }, 300)
    return () => clearInterval(dotInterval)
  }, [])

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
        <div className="w-full max-w-2xl border border-red-500/30 bg-red-500/5 p-8">
          <p className="font-arcade text-3xl text-red-500 mb-4" style={{ textShadow: '0 0 12px rgba(239,68,68,0.6)' }}>
            ERROR
          </p>
          <p className="font-mono text-sm text-red-400/80 mb-6">{errorMsg}</p>
          <button
            onClick={onError}
            className="px-8 py-3 font-arcade text-xl tracking-widest text-black bg-brand-accent hover:bg-yellow-400 transition-colors"
            style={{ boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}
          >
            REINTENTAR
          </button>
        </div>
      </div>
    )
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Panel */}
        <div className="border border-brand-border bg-background/80">
          {/* Title bar */}
          <div className="border-b border-brand-border px-4 py-2 flex items-center gap-3 bg-brand-surface/60">
            <span
              className="font-arcade text-xl text-brand-accent animate-glow-pulse"
              style={{ textShadow: '0 0 8px rgba(249,115,22,0.6)' }}
            >
              ANALIZANDO{dots}
            </span>
            <span className="ml-auto font-mono text-[10px] text-brand-text-muted tracking-widest">
              STEP 3 / 3
            </span>
          </div>

          <div className="p-8">
            {/* File info */}
            <div className="font-mono text-xs text-brand-text-muted mb-6 flex gap-4 flex-wrap">
              <span className="text-brand-accent">$</span>
              <span className="text-brand-text truncate max-w-xs">{file.name}</span>
              <span className="text-brand-text-muted">
                ({(file.size / 1024).toFixed(0)} KB)
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="font-mono text-[10px] text-brand-text-muted flex justify-between mb-2">
                <span>PROGRESO</span>
                <span className="text-brand-accent">{Math.round(progress)}%</span>
              </div>
              <div
                className="h-2 bg-brand-surface border border-brand-border overflow-hidden"
              >
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #f97316, #facc15)',
                    boxShadow: '0 0 8px rgba(249,115,22,0.6)',
                  }}
                />
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2 font-mono text-sm">
              {STEPS.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 transition-all duration-200"
                    style={{
                      opacity: done ? 0.5 : active ? 1 : 0.25,
                    }}
                  >
                    <span className="text-brand-text-muted text-[10px] w-14 shrink-0">
                      {step.addr}
                    </span>
                    <span
                      className="w-4 text-center"
                      style={{
                        color: done ? '#22c55e' : active ? '#f97316' : '#2a2a2a',
                        textShadow: done
                          ? '0 0 6px rgba(34,197,94,0.6)'
                          : active
                          ? '0 0 6px rgba(249,115,22,0.6)'
                          : 'none',
                      }}
                    >
                      {done ? '✓' : active ? '›' : '·'}
                    </span>
                    <span
                      className="tracking-wider text-xs"
                      style={{
                        color: done ? '#444' : active ? '#f97316' : '#333',
                      }}
                    >
                      {step.label}
                      {active && <span className="animate-blink">_</span>}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 font-mono text-[10px] text-brand-text-muted/30 text-center tracking-widest">
              PROCESANDO EN TU NAVEGADOR · SIN ENVÍO A SERVIDORES
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
