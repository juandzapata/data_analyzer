'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const PROFESSORS = [
  { src: '/avatars/alejo.svg', name: 'Alejo' },
  { src: '/avatars/cris.svg', name: 'Cris' },
  { src: '/avatars/juan.svg', name: 'Juan' },
]

interface LandingProps {
  onStart: () => void
}

export default function Landing({ onStart }: LandingProps) {
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([])
  const [offsets, setOffsets] = useState(PROFESSORS.map(() => ({ x: 0, y: 0 })))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setOffsets(
        avatarRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 }
          const rect = el.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = e.clientX - cx
          const dy = e.clientY - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const factor = Math.min(dist / 200, 1)
          return dist > 0
            ? { x: (dx / dist) * factor * 5, y: (dy / dist) * factor * 5 }
            : { x: 0, y: 0 }
        })
      )
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

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
              <div
                ref={(el) => { avatarRefs.current[i] = el }}
                style={{
                  transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)`,
                  transition: 'transform 0.12s ease-out',
                }}
              >
                <Image
                  src={p.src}
                  alt={`Profesor ${p.name}`}
                  width={100}
                  height={100}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
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

        {/* Scroll cue */}
        <div className="animate-slide-up delay-700 mt-10 flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.25em] text-brand-text-muted/40 uppercase">
            Busca tu dataset
          </span>
          <svg
            className="text-brand-text-muted/30 animate-bounce"
            width="20" height="20" viewBox="0 0 20 20" fill="none"
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Dataset repositories — below the fold */}
      <div className="relative z-10 w-full max-w-md mt-8 pb-16 px-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { src: '/repositories/kaggle.svg',        alt: 'Kaggle',         href: 'https://kaggle.com/datasets',   desc: 'Datasets de la comunidad' },
            { src: '/repositories/UC%20Irvine.svg',   alt: 'UC Irvine',      href: 'https://archive.ics.uci.edu',   desc: 'Repositorio académico' },
            { src: '/repositories/datosabiertos.svg', alt: 'Datos Abiertos', href: 'https://datos.gov.co',          desc: 'Portal de datos Colombia' },
          ].map(({ src, alt, href, desc }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Image
                src={src}
                alt={alt}
                width={110}
                height={40}
                className="object-contain opacity-50 group-hover:opacity-95 transition-opacity duration-200"
                style={{ maxHeight: 36 }}
              />
              <span className="font-mono text-[10px] text-brand-text-muted/50 group-hover:text-brand-text-muted/80 transition-colors text-center leading-tight">
                {desc}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
