'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { AnalysisResult } from '@/lib/types'
import { BAND_CONFIG, CRITERION_INFO, JURY_REACTIONS, scoreColor } from '@/lib/colors'

const PROFESSORS = [
  { src: '/avatars/alejo.svg', name: 'Alejo' },
  { src: '/avatars/cris.svg', name: 'Cris' },
  { src: '/avatars/juan.svg', name: 'Juan' },
]

const DIMENSION_EMOJI: Record<string, string> = {
  calidad: '◈',
  estructura: '◇',
  potencial: '◆',
  practico: '◉',
}

interface ResultsProps {
  result: AnalysisResult
  fileName: string
  onReset: () => void
}

export default function Results({ result, fileName, onReset }: ResultsProps) {
  const [criteriaOpen, setCriteriaOpen] = useState(false)
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null)
  const band = BAND_CONFIG[result.band]
  const finalDisplay = result.final.toFixed(1)
  const finalColor = scoreColor(result.final)

  const juryPhrases = useMemo(() => {
    const pool = JURY_REACTIONS[result.band]
    const indices = [...Array(pool.length).keys()]
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return PROFESSORS.map((_, i) => pool[indices[i]])
  }, [result.band])

  return (
    <div className="min-h-screen px-4 py-12 max-w-lg mx-auto">
      {/* Dynamic ambient glow based on score */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${finalColor}18 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        {/* ─── SCORE REVEAL ─── */}
        <div className="text-center mb-8 animate-score-reveal">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-text-muted uppercase mb-4">
            Resultado final
          </div>

          <div
            className="font-mono font-bold leading-none mb-4"
            style={{
              fontSize: 'clamp(5rem, 18vw, 8rem)',
              color: finalColor,
              textShadow: `0 0 30px ${finalColor}66, 0 0 60px ${finalColor}33`,
            }}
          >
            {finalDisplay}
            <span className="text-3xl ml-2" style={{ color: finalColor + '55' }}>
              /10
            </span>
          </div>

          <div
            className="inline-block font-mono text-xs font-bold tracking-widest px-4 py-1.5 rounded-full border mb-4"
            style={{
              color: finalColor,
              borderColor: finalColor + '55',
              background: finalColor + '15',
            }}
          >
            {band.label.toUpperCase()}
          </div>

          <div className="font-mono text-[10px] text-brand-text-muted">
            📄 {fileName}
          </div>
        </div>

        {/* ─── JURY PANEL ─── */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl mb-4 animate-slide-up delay-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-brand-border">
            <h3 className="font-mono font-bold text-sm text-brand-text">
              Veredicto del jurado
            </h3>
          </div>
          <div className="flex justify-around py-6 px-4 gap-4">
            {PROFESSORS.map((p, i) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <Image
                  src={p.src}
                  alt={`Profesor ${p.name}`}
                  width={88}
                  height={88}
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="font-mono text-[10px] text-brand-text-muted tracking-widest uppercase">
                  {p.name}
                </span>
                <div
                  className="font-mono text-xs text-center px-3 py-1.5 rounded-lg border max-w-[120px] leading-snug"
                  style={{
                    color: finalColor,
                    borderColor: finalColor + '33',
                    background: finalColor + '0D',
                  }}
                >
                  {juryPhrases[i].emoji} {juryPhrases[i].label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── DIMENSIONS ─── */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl mb-4 animate-slide-up delay-400 overflow-hidden">
          <div className="px-6 py-3 border-b border-brand-border">
            <h3 className="font-mono font-bold text-sm text-brand-text">Dimensiones</h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.dimensions.map((dim, i) => {
              const dColor = scoreColor(dim.score)
              return (
                <div
                  key={dim.id}
                  className="p-4 rounded-xl border border-brand-border animate-slide-up"
                  style={{ animationDelay: `${500 + i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: dColor }}>{DIMENSION_EMOJI[dim.id]}</span>
                      <span className="font-mono text-xs text-brand-text-muted">
                        {dim.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-brand-text-muted/40">
                        {dim.weight}%
                      </span>
                      <span
                        className="font-mono font-bold text-xl"
                        style={{ color: dColor }}
                      >
                        {dim.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-brand-surface-2 rounded-full overflow-hidden border border-brand-border">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(dim.score / 10) * 100}%`,
                        background: `linear-gradient(90deg, ${dColor}cc, ${dColor})`,
                        boxShadow: `0 0 6px ${dColor}66`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── CRITERIA COLLAPSIBLE ─── */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl mb-4 animate-slide-up delay-600 overflow-hidden">
          <button
            onClick={() => setCriteriaOpen((o) => !o)}
            className="w-full px-6 py-3 border-b border-brand-border flex items-center justify-between hover:bg-brand-surface-2 transition-colors"
          >
            <h3 className="font-mono font-bold text-sm text-brand-text">
              Criterios (12)
            </h3>
            <span className="font-mono text-[10px] text-brand-text-muted">
              {criteriaOpen ? '▲ cerrar' : '▼ ver todos'}
            </span>
          </button>

          {criteriaOpen && (
            <div>
              {result.criteria.map((c, i) => {
                const cColor = scoreColor(c.score)
                const info = CRITERION_INFO[c.id]
                const isExpanded = expandedCriterion === c.id
                return (
                  <div
                    key={c.id}
                    className="border-b border-brand-border/30 last:border-0"
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                  >
                    {/* Row — clickable */}
                    <button
                      onClick={() => setExpandedCriterion(isExpanded ? null : c.id)}
                      className="w-full flex items-center px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="font-mono text-[10px] text-brand-text-muted/40 w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-xs text-brand-text-muted flex-1 ml-3">
                        {c.label}
                      </span>
                      <span className="font-mono text-[10px] text-brand-text-muted/30 mr-3">
                        ×{c.weight}%
                      </span>
                      <span
                        className="font-mono font-bold text-base w-6 text-right shrink-0"
                        style={{ color: cColor }}
                      >
                        {c.score}
                      </span>
                      <span
                        className="ml-3 text-[10px] text-brand-text-muted/40 shrink-0 transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        ▾
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div
                        className="px-5 pb-4 pt-1 ml-8 border-l-2 animate-slide-up"
                        style={{ borderColor: cColor + '44' }}
                      >
                        <p className="font-mono text-xs text-brand-text-muted leading-relaxed mb-2">
                          {info.what}
                        </p>
                        <div
                          className="font-mono text-[10px] px-3 py-1.5 rounded-lg inline-block"
                          style={{
                            color: cColor,
                            background: cColor + '12',
                            border: `1px solid ${cColor}30`,
                          }}
                        >
                          {info.how}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ─── RECOMMENDATIONS ─── */}
        {result.recommendations.length > 0 && (
          <div className="bg-brand-surface border border-brand-border rounded-2xl mb-6 animate-slide-up delay-700 overflow-hidden">
            <div className="px-6 py-3 border-b border-brand-border">
              <h3 className="font-mono font-bold text-sm text-brand-highlight">
                Mejoras sugeridas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 font-mono text-xs text-brand-text-muted">
                  <span className="text-brand-accent shrink-0 mt-0.5">›</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RESET ─── */}
        <div className="text-center animate-slide-up delay-800 pb-8">
          <button
            onClick={onReset}
            className="font-mono font-bold text-sm px-10 py-3.5 rounded-xl tracking-wide transition-all duration-200 active:scale-95 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              boxShadow:
                '0 0 0 1px rgba(249,115,22,0.3), 0 4px 20px rgba(249,115,22,0.3)',
            }}
          >
            Analizar otro dataset →
          </button>
        </div>
      </div>
    </div>
  )
}
