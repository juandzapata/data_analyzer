'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { AnalysisResult } from '@/lib/types'
import { BAND_CONFIG, JURY_REACTION, scoreColor } from '@/lib/colors'

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
  const band = BAND_CONFIG[result.band]
  const jury = JURY_REACTION[result.band]
  const finalDisplay = result.final.toFixed(1)
  const finalColor = scoreColor(result.final)

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      {/* ─── SCORE REVEAL ─── */}
      <div className="text-center mb-2 animate-score-reveal">
        <div className="font-mono text-[10px] tracking-[0.4em] text-brand-text-muted uppercase mb-4">
          ── RESULTADO FINAL ──
        </div>

        {/* Giant score */}
        <div
          className="font-arcade leading-none mb-3"
          style={{
            fontSize: 'clamp(6rem, 20vw, 9rem)',
            color: finalColor,
            textShadow: `0 0 20px ${finalColor}99, 0 0 40px ${finalColor}55, 0 0 80px ${finalColor}22`,
          }}
        >
          {finalDisplay}
          <span
            className="font-arcade text-3xl ml-1"
            style={{ color: finalColor + '55' }}
          >
            /10
          </span>
        </div>

        {/* Band badge */}
        <div
          className="inline-block font-mono text-xs tracking-widest px-4 py-1.5 border mb-6"
          style={{
            color: finalColor,
            borderColor: finalColor + '66',
            background: finalColor + '11',
            boxShadow: `0 0 12px ${finalColor}22`,
          }}
        >
          {band.label.toUpperCase()}
        </div>

        {/* File name */}
        <div className="font-mono text-[10px] text-brand-text-muted tracking-wider">
          📄 {fileName}
        </div>
      </div>

      {/* ─── JURY PANEL ─── */}
      <div className="border border-brand-border bg-background/80 mb-6 animate-slide-up delay-200">
        <div className="border-b border-brand-border px-4 py-2 bg-brand-surface/60">
          <span className="font-arcade text-lg text-brand-accent" style={{ textShadow: '0 0 6px rgba(249,115,22,0.5)' }}>
            VEREDICTO DEL JURADO
          </span>
        </div>
        <div className="flex justify-around py-6 px-4">
          {PROFESSORS.map((p, i) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div
                className="w-16 h-16 bg-brand-surface-2 overflow-hidden"
                style={{
                  boxShadow: `0 0 0 1px ${finalColor}, 0 0 0 4px #080808, 0 0 0 5px ${finalColor}55, 0 0 16px ${finalColor}22`,
                }}
              >
                <Image
                  src={p.src}
                  alt={`Profesor ${p.name}`}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <span className="font-mono text-[10px] text-brand-text-muted tracking-widest uppercase">
                {p.name}
              </span>
              <div
                className="font-mono text-xs text-center max-w-[90px] leading-tight border px-2 py-1"
                style={{
                  color: finalColor,
                  borderColor: finalColor + '44',
                  background: finalColor + '08',
                }}
              >
                {jury.emoji} {jury.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DIMENSIONS ─── */}
      <div className="border border-brand-border bg-background/80 mb-6 animate-slide-up delay-400">
        <div className="border-b border-brand-border px-4 py-2 bg-brand-surface/60">
          <span className="font-arcade text-lg text-brand-accent" style={{ textShadow: '0 0 6px rgba(249,115,22,0.5)' }}>
            DIMENSIONES
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.dimensions.map((dim, i) => {
            const dColor = scoreColor(dim.score)
            return (
              <div
                key={dim.id}
                className="p-4 border border-brand-border animate-slide-up"
                style={{
                  animationDelay: `${500 + i * 80}ms`,
                  borderColor: '#2a2a2a',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: dColor }}>{DIMENSION_EMOJI[dim.id]}</span>
                    <span className="font-mono text-xs text-brand-text-muted tracking-wide">
                      {dim.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-brand-text-muted/50">
                      {dim.weight}%
                    </span>
                    <span
                      className="font-arcade text-2xl"
                      style={{
                        color: dColor,
                        textShadow: `0 0 8px ${dColor}66`,
                      }}
                    >
                      {dim.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                {/* Bar */}
                <div className="h-1.5 bg-brand-surface border border-brand-border overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(dim.score / 10) * 100}%`,
                      background: `linear-gradient(90deg, ${dColor}, ${dColor}bb)`,
                      boxShadow: `0 0 6px ${dColor}88`,
                      animationDelay: `${600 + i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── CRITERIA COLLAPSIBLE ─── */}
      <div className="border border-brand-border bg-background/80 mb-6 animate-slide-up delay-600">
        <button
          onClick={() => setCriteriaOpen((o) => !o)}
          className="w-full border-b border-brand-border px-4 py-2 bg-brand-surface/60 flex items-center justify-between hover:bg-brand-surface/80 transition-colors"
        >
          <span className="font-arcade text-lg text-brand-accent" style={{ textShadow: '0 0 6px rgba(249,115,22,0.5)' }}>
            CRITERIOS (12)
          </span>
          <span className="font-mono text-xs text-brand-text-muted">
            {criteriaOpen ? '▲ CERRAR' : '▼ VER TODOS'}
          </span>
        </button>

        {criteriaOpen && (
          <div className="overflow-hidden">
            {result.criteria.map((c, i) => {
              const cColor = scoreColor(c.score)
              return (
                <div
                  key={c.id}
                  className="flex items-center px-4 py-2.5 border-b border-brand-border/40 last:border-0"
                  style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                >
                  <span className="font-mono text-xs text-brand-text-muted/50 w-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs text-brand-text-muted flex-1 ml-3">
                    {c.label.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-brand-text-muted/40 mr-4">
                    ×{c.weight}%
                  </span>
                  <span
                    className="font-arcade text-xl w-8 text-right"
                    style={{ color: cColor, textShadow: `0 0 6px ${cColor}66` }}
                  >
                    {c.score}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── RECOMMENDATIONS ─── */}
      {result.recommendations.length > 0 && (
        <div className="border border-brand-border bg-background/80 mb-8 animate-slide-up delay-700">
          <div className="border-b border-brand-border px-4 py-2 bg-brand-surface/60">
            <span className="font-arcade text-lg text-brand-highlight" style={{ textShadow: '0 0 6px rgba(250,204,21,0.5)' }}>
              MEJORAS SUGERIDAS
            </span>
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
      <div className="text-center animate-slide-up delay-800">
        <button
          onClick={onReset}
          className="px-10 py-4 font-arcade text-2xl tracking-widest text-black bg-brand-accent hover:bg-yellow-400 transition-all duration-150 active:scale-95"
          style={{
            boxShadow: '0 0 0 2px #080808, 0 0 0 3px #f97316, 0 4px 24px rgba(249,115,22,0.4)',
          }}
        >
          ▸ NUEVO DATASET
        </button>
        <p className="mt-4 font-mono text-[10px] text-brand-text-muted/30 tracking-widest animate-blink">
          INSERT COIN
        </p>
      </div>
    </div>
  )
}
