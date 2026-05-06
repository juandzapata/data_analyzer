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

  const ready = hasDoc !== null && license !== null

  function handleSubmit() {
    if (!ready) return
    onSubmit({ hasDocumentation: hasDoc!, licenseSafe: license! })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Breadcrumb */}
        <div className="font-mono text-xs text-brand-text-muted mb-6 animate-slide-up">
          <button onClick={onBack} className="hover:text-brand-accent transition-colors">
            ~/analyzer/upload
          </button>
          <span className="text-brand-border mx-2">›</span>
          <span className="text-brand-accent">preguntas</span>
          <span className="animate-blink text-brand-accent">█</span>
        </div>

        {/* Panel */}
        <div className="border border-brand-border bg-background/80 animate-slide-up delay-100">
          {/* Title bar */}
          <div className="border-b border-brand-border px-4 py-2 flex items-center gap-3 bg-brand-surface/60">
            <span className="font-arcade text-xl text-brand-accent" style={{ textShadow: '0 0 8px rgba(249,115,22,0.6)' }}>
              INTERROGATORIO
            </span>
            <span className="ml-auto font-mono text-[10px] text-brand-text-muted tracking-widest">
              STEP 2 / 3
            </span>
          </div>

          <div className="p-8 space-y-6">
            {/* File loaded */}
            <div className="font-mono text-xs text-brand-text-muted border border-brand-border px-4 py-2 bg-brand-surface/30">
              <span className="text-brand-accent">$</span>{' '}
              <span className="text-brand-text">loaded</span>{' '}
              <span className="text-brand-highlight">&quot;{fileName}&quot;</span>
              <span className="text-green-500 ml-2">✓ OK</span>
            </div>

            <p className="font-mono text-xs text-brand-text-muted tracking-wide">
              El jurado necesita 2 respuestas antes de evaluar:
            </p>

            {/* Q1 */}
            <div
              className="border border-brand-border p-5 transition-all duration-200 animate-slide-up delay-200"
              style={{
                borderColor: hasDoc !== null ? 'rgba(249,115,22,0.5)' : '#2a2a2a',
                background: hasDoc !== null ? 'rgba(249,115,22,0.03)' : 'transparent',
              }}
            >
              <p className="font-mono text-sm text-brand-text mb-4">
                <span className="text-brand-accent font-bold">Q1.</span>{' '}
                ¿Tu dataset tiene diccionario de datos o descripción?
              </p>
              <div className="flex gap-3">
                {[
                  { value: true, label: 'SÍ', hint: '+10 pts' },
                  { value: false, label: 'NO', hint: '+3 pts' },
                ].map(({ value, label, hint }) => (
                  <button
                    key={label}
                    onClick={() => setHasDoc(value)}
                    className="flex-1 py-3 font-arcade text-xl tracking-widest transition-all duration-150 relative"
                    style={{
                      color: hasDoc === value ? '#080808' : '#888888',
                      background: hasDoc === value ? '#f97316' : 'transparent',
                      border: `1px solid ${hasDoc === value ? '#f97316' : '#2a2a2a'}`,
                      boxShadow: hasDoc === value
                        ? '0 0 12px rgba(249,115,22,0.4)'
                        : 'none',
                    }}
                  >
                    {label}
                    <span className="absolute bottom-1 right-2 font-mono text-[9px] opacity-50">
                      {hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div
              className="border border-brand-border p-5 transition-all duration-200 animate-slide-up delay-300"
              style={{
                borderColor: license !== null ? 'rgba(249,115,22,0.5)' : '#2a2a2a',
                background: license !== null ? 'rgba(249,115,22,0.03)' : 'transparent',
              }}
            >
              <p className="font-mono text-sm text-brand-text mb-4">
                <span className="text-brand-accent font-bold">Q2.</span>{' '}
                ¿Es público y libre de datos personales sensibles (PII)?
              </p>
              <div className="flex gap-3">
                {[
                  { value: 'yes' as const, label: 'SÍ', hint: '+10 pts' },
                  { value: 'unsure' as const, label: '¿?', hint: '+5 pts' },
                  { value: 'no' as const, label: 'NO', hint: '+1 pt' },
                ].map(({ value, label, hint }) => (
                  <button
                    key={value}
                    onClick={() => setLicense(value)}
                    className="flex-1 py-3 font-arcade text-xl tracking-widest transition-all duration-150 relative"
                    style={{
                      color: license === value ? '#080808' : '#888888',
                      background: license === value ? '#f97316' : 'transparent',
                      border: `1px solid ${license === value ? '#f97316' : '#2a2a2a'}`,
                      boxShadow: license === value
                        ? '0 0 12px rgba(249,115,22,0.4)'
                        : 'none',
                    }}
                  >
                    {label}
                    <span className="absolute bottom-1 right-2 font-mono text-[9px] opacity-50">
                      {hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="animate-slide-up delay-400">
              <button
                onClick={handleSubmit}
                disabled={!ready}
                className="w-full py-4 font-arcade text-2xl tracking-widest transition-all duration-150 active:scale-[0.99]"
                style={{
                  color: ready ? '#080808' : '#444',
                  background: ready ? '#f97316' : '#161616',
                  border: `1px solid ${ready ? '#f97316' : '#2a2a2a'}`,
                  boxShadow: ready ? '0 0 20px rgba(249,115,22,0.35), 0 0 0 2px #080808, 0 0 0 3px rgba(249,115,22,0.4)' : 'none',
                  cursor: ready ? 'pointer' : 'not-allowed',
                }}
              >
                {ready ? '▸ ANALIZAR DATASET' : '···'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
