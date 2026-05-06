'use client'

import { useState } from 'react'
import type { UserAnswers } from '@/lib/types'

interface QuestionsProps {
  fileName: string
  onSubmit: (answers: UserAnswers) => void
  onBack: () => void
}

export default function Questions({ fileName, onSubmit, onBack }: QuestionsProps) {
  const [hasDoc, setHasDoc] = useState<boolean | null>(null)
  const [license, setLicense] = useState<'yes' | 'unsure' | 'no' | null>(null)

  function handleSubmit() {
    if (hasDoc === null || license === null) return
    onSubmit({ hasDocumentation: hasDoc, licenseSafe: license })
  }

  const ready = hasDoc !== null && license !== null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 text-brand-text-muted hover:text-brand-text text-sm flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        <div className="mb-2 text-brand-text-muted text-sm font-mono text-center">
          📄 {fileName}
        </div>
        <h2 className="text-3xl font-bold font-mono mb-2 text-center">
          Dos <span className="text-brand-accent">preguntas</span> rápidas
        </h2>
        <p className="text-brand-text-muted text-center mb-10 text-sm">
          Antes de analizar, necesitamos saber un poco más sobre tu dataset.
        </p>

        {/* Pregunta 1 */}
        <div className="mb-8 p-6 rounded-2xl bg-brand-surface border border-brand-border">
          <p className="font-medium mb-4 text-brand-text">
            1. ¿Tu dataset tiene un diccionario de datos o descripción?
          </p>
          <div className="flex gap-3">
            {[{ value: true, label: 'Sí' }, { value: false, label: 'No' }].map(({ value, label }) => (
              <button
                key={label}
                onClick={() => setHasDoc(value)}
                className={`
                  flex-1 py-3 rounded-xl border font-medium transition-all duration-150
                  ${hasDoc === value
                    ? 'border-brand-accent bg-orange-500/15 text-brand-accent'
                    : 'border-brand-border bg-brand-surface-2 text-brand-text-muted hover:border-brand-accent/40 hover:text-brand-text'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pregunta 2 */}
        <div className="mb-10 p-6 rounded-2xl bg-brand-surface border border-brand-border">
          <p className="font-medium mb-4 text-brand-text">
            2. ¿Es público y libre de datos personales sensibles (PII)?
          </p>
          <div className="flex gap-3">
            {[
              { value: 'yes' as const, label: 'Sí' },
              { value: 'unsure' as const, label: 'No estoy seguro' },
              { value: 'no' as const, label: 'No' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLicense(value)}
                className={`
                  flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-150
                  ${license === value
                    ? 'border-brand-accent bg-orange-500/15 text-brand-accent'
                    : 'border-brand-border bg-brand-surface-2 text-brand-text-muted hover:border-brand-accent/40 hover:text-brand-text'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!ready}
          className={`
            w-full py-4 rounded-full font-semibold text-lg transition-all duration-200
            ${ready
              ? 'bg-brand-accent hover:bg-orange-400 text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20'
              : 'bg-brand-border text-brand-text-muted cursor-not-allowed'
            }
          `}
        >
          Analizar dataset
        </button>
      </div>
    </div>
  )
}
