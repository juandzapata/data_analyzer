'use client'

import { useState } from 'react'
import type { UserAnswers } from '@/lib/types'

interface QuestionsProps {
  fileName: string
  onSubmit: (answers: UserAnswers) => void
  onBack: () => void
}

function StepBar() {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold"
            style={{
              background: step <= 2 ? '#f97316' : '#1c1c1c',
              color: step <= 2 ? '#000' : '#444',
              border: `1px solid ${step <= 2 ? '#f97316' : '#2a2a2a'}`,
            }}
          >
            {step < 2 ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className="h-px w-8"
              style={{ background: step < 2 ? '#f97316' : '#2a2a2a' }}
            />
          )}
        </div>
      ))}
      <span className="ml-1 font-mono text-xs text-brand-text-muted">Paso 2 de 3</span>
    </div>
  )
}

export default function Questions({ fileName, onSubmit, onBack }: QuestionsProps) {
  const [hasDoc, setHasDoc] = useState<boolean | null>(null)
  const [license, setLicense] = useState<'yes' | 'unsure' | 'no' | null>(null)

  const ready = hasDoc !== null && license !== null

  function handleSubmit() {
    if (!ready) return
    onSubmit({ hasDocumentation: hasDoc!, licenseSafe: license! })
  }

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
          <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
            <div>
              <h2 className="font-mono font-bold text-brand-text">
                Dos preguntas rápidas
              </h2>
              <p className="font-mono text-[11px] text-brand-text-muted mt-0.5 truncate max-w-[240px]">
                📄 {fileName}
              </p>
            </div>
            <button
              onClick={onBack}
              className="font-mono text-xs text-brand-text-muted hover:text-brand-accent transition-colors px-2 py-1"
            >
              ← Atrás
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Q1 */}
            <div
              className="rounded-xl border p-5 transition-all duration-200 animate-slide-up delay-200"
              style={{
                borderColor: hasDoc !== null ? 'rgba(249,115,22,0.4)' : '#2a2a2a',
                background:
                  hasDoc !== null
                    ? 'rgba(249,115,22,0.03)'
                    : 'rgba(255,255,255,0.01)',
              }}
            >
              <p className="font-mono text-sm text-brand-text mb-4 leading-relaxed">
                <span className="text-brand-accent font-bold mr-2">Q1</span>
                ¿Tu dataset tiene diccionario de datos o descripción?
              </p>
              <div className="flex gap-3">
                {[
                  { value: true, label: 'Sí', hint: '+10 pts' },
                  { value: false, label: 'No', hint: '+3 pts' },
                ].map(({ value, label, hint }) => (
                  <button
                    key={label}
                    onClick={() => setHasDoc(value)}
                    className="flex-1 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-150 relative"
                    style={{
                      color: hasDoc === value ? '#000' : '#666',
                      background: hasDoc === value ? '#f97316' : 'transparent',
                      border: `1px solid ${hasDoc === value ? '#f97316' : '#2a2a2a'}`,
                      boxShadow:
                        hasDoc === value ? '0 0 16px rgba(249,115,22,0.3)' : 'none',
                    }}
                  >
                    {label}
                    <span className="absolute bottom-1 right-2 text-[9px] opacity-50 font-normal">
                      {hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div
              className="rounded-xl border p-5 transition-all duration-200 animate-slide-up delay-300"
              style={{
                borderColor: license !== null ? 'rgba(249,115,22,0.4)' : '#2a2a2a',
                background:
                  license !== null
                    ? 'rgba(249,115,22,0.03)'
                    : 'rgba(255,255,255,0.01)',
              }}
            >
              <p className="font-mono text-sm text-brand-text mb-4 leading-relaxed">
                <span className="text-brand-accent font-bold mr-2">Q2</span>
                ¿Es público y libre de datos personales sensibles (PII)?
              </p>
              <div className="flex gap-3">
                {[
                  { value: 'yes' as const, label: 'Sí', hint: '+10 pts' },
                  { value: 'unsure' as const, label: 'No sé', hint: '+5 pts' },
                  { value: 'no' as const, label: 'No', hint: '+1 pt' },
                ].map(({ value, label, hint }) => (
                  <button
                    key={value}
                    onClick={() => setLicense(value)}
                    className="flex-1 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-150 relative"
                    style={{
                      color: license === value ? '#000' : '#666',
                      background: license === value ? '#f97316' : 'transparent',
                      border: `1px solid ${license === value ? '#f97316' : '#2a2a2a'}`,
                      boxShadow:
                        license === value ? '0 0 16px rgba(249,115,22,0.3)' : 'none',
                    }}
                  >
                    {label}
                    <span className="absolute bottom-1 right-2 text-[9px] opacity-50 font-normal">
                      {hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!ready}
              className="w-full py-4 rounded-xl font-mono font-bold text-sm tracking-wide transition-all duration-150 active:scale-[0.99] animate-slide-up delay-400"
              style={{
                color: ready ? '#fff' : '#444',
                background: ready
                  ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                  : '#161616',
                border: `1px solid ${ready ? 'rgba(249,115,22,0.4)' : '#2a2a2a'}`,
                boxShadow: ready ? '0 0 20px rgba(249,115,22,0.25)' : 'none',
                cursor: ready ? 'pointer' : 'not-allowed',
              }}
            >
              {ready ? 'Analizar dataset →' : 'Responde ambas preguntas para continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
