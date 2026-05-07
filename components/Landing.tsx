'use client'

import Image from 'next/image'

const PROFESSORS = [
  { src: '/avatars/alejo.svg', name: 'Alejo' },
  { src: '/avatars/cris.svg', name: 'Cris' },
  { src: '/avatars/juan.svg', name: 'Juan' },
]

interface LandingProps {
  onStart: () => void
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,0.1) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Professor avatars */}
        <div className="flex justify-center gap-8 mb-10">
          {PROFESSORS.map((p, i) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Image
                src={p.src}
                alt={`Profesor ${p.name}`}
                width={100}
                height={100}
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="font-mono text-[10px] text-brand-text-muted tracking-widest uppercase">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* Bootcamp badge */}
        <div className="animate-slide-up delay-100 mb-5">
          <span className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full">
            Bootcamp Tool
          </span>
        </div>

        {/* Title */}
        <div className="animate-slide-up delay-200 mb-3">
          <h1
            className="font-mono font-bold leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316 20%, #facc15 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dataset
            </span>{' '}
            <span className="text-brand-text">Analyzer</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="animate-slide-up delay-300 font-mono text-brand-text-muted text-sm leading-relaxed max-w-xs mx-auto mb-10">
          Sube tu dataset y recibe un puntaje de viabilidad basado en 12
          criterios de calidad de datos.
        </p>

        {/* Stats pills */}
        <div className="animate-slide-up delay-400 flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { value: '12', label: 'Criterios' },
            { value: '4', label: 'Dimensiones' },
            { value: '1–10', label: 'Puntaje' },
          ].map((s) => (
            <div
              key={s.label}
              className="px-5 py-3 bg-brand-surface border border-brand-border rounded-xl text-center min-w-[80px]"
            >
              <div className="font-mono font-bold text-brand-accent text-lg leading-none">
                {s.value}
              </div>
              <div className="font-mono text-[10px] text-brand-text-muted tracking-wide mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div className="animate-slide-up delay-500">
          <button
            onClick={onStart}
            className="font-mono font-bold text-sm px-10 py-3.5 rounded-xl tracking-wide transition-all duration-200 active:scale-95 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              boxShadow:
                '0 0 0 1px rgba(249,115,22,0.3), 0 4px 20px rgba(249,115,22,0.35)',
            }}
          >
            Comenzar análisis →
          </button>
        </div>

        {/* Privacy note */}
        <p className="animate-slide-up delay-600 mt-8 font-mono text-[10px] text-brand-text-muted/40 tracking-widest">
          Todo el procesamiento ocurre en tu navegador · Sin servidores
        </p>
      </div>
    </div>
  )
}
