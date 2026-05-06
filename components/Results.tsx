'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AnalysisResult } from '@/lib/types'
import { BAND_CONFIG, JURY_REACTION, scoreColor } from '@/lib/colors'

const PROFESSORS = [
  { src: '/avatars/alejo.svg', name: 'Alejo' },
  { src: '/avatars/cris.svg', name: 'Cris' },
  { src: '/avatars/juan.svg', name: 'Juan' },
]

const DIMENSION_EMOJI: Record<string, string> = {
  calidad: '📊',
  estructura: '📐',
  potencial: '🔍',
  practico: '📁',
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
  const finalRounded = result.final.toFixed(1)
  const finalColor = scoreColor(result.final)

  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-brand-text-muted text-sm font-mono mb-4">📄 {fileName}</div>

        {/* Score display */}
        <div
          className="font-mono text-[7rem] font-bold leading-none mb-4"
          style={{ color: finalColor }}
        >
          {finalRounded}
          <span className="text-3xl text-brand-text-muted">/10</span>
        </div>

        <Badge
          className={`text-sm px-4 py-1.5 font-medium border-0 ${band.bgClass} ${band.textClass}`}
        >
          {band.label}
        </Badge>
      </div>

      {/* Jury */}
      <div className="flex justify-center gap-8 mb-12">
        {PROFESSORS.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border overflow-hidden flex items-center justify-center">
              <Image
                src={p.src}
                alt={`Profesor ${p.name}`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <span className="text-xs text-brand-text-muted font-mono">{p.name}</span>
            <span className="text-xs text-center text-brand-text font-medium max-w-[80px] leading-tight">
              {jury.emoji} {jury.label}
            </span>
          </div>
        ))}
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {result.dimensions.map((dim) => (
          <Card key={dim.id} className="bg-brand-surface border-brand-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-brand-text-muted flex items-center gap-2">
                <span>{DIMENSION_EMOJI[dim.id]}</span>
                {dim.label}
                <span className="ml-auto text-xs text-brand-text-muted">peso {dim.weight}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(dim.score / 10) * 100}%`,
                      backgroundColor: scoreColor(dim.score),
                    }}
                  />
                </div>
                <span
                  className="font-mono font-bold text-sm w-8 text-right"
                  style={{ color: scoreColor(dim.score) }}
                >
                  {dim.score.toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Criteria collapsible */}
      <div className="mb-8">
        <button
          onClick={() => setCriteriaOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-sm font-medium text-brand-text hover:border-brand-accent/40 transition-colors"
        >
          <span>Desglose de criterios (12)</span>
          <span className="text-brand-text-muted">{criteriaOpen ? '▲' : '▼'}</span>
        </button>

        {criteriaOpen && (
          <div className="mt-2 rounded-xl border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-surface text-brand-text-muted">
                  <th className="text-left px-4 py-2 font-medium">Criterio</th>
                  <th className="text-center px-4 py-2 font-medium">Peso</th>
                  <th className="text-right px-4 py-2 font-medium">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {result.criteria.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-t border-brand-border ${i % 2 === 0 ? 'bg-background' : 'bg-brand-surface'}`}
                  >
                    <td className="px-4 py-2.5 text-brand-text">{c.label}</td>
                    <td className="px-4 py-2.5 text-center text-brand-text-muted font-mono">{c.weight}%</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold" style={{ color: scoreColor(c.score) }}>
                      {c.score.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="mb-10 p-6 rounded-2xl bg-brand-surface border border-brand-border">
          <h3 className="font-semibold font-mono mb-4 text-brand-accent">💡 Recomendaciones</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-brand-text">
                <span className="text-brand-accent font-mono mt-0.5">›</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-8 py-4 rounded-full font-semibold text-lg bg-brand-accent hover:bg-orange-400 text-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
        >
          Analizar otro dataset
        </button>
      </div>
    </div>
  )
}
