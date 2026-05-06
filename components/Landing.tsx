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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
      {/* Top bar — terminal chrome */}
      <div className="animate-slide-up w-full max-w-2xl mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-surface border-t border-x border-brand-border text-brand-text-muted text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
          <span className="ml-3 flex-1 text-center tracking-widest opacity-50">
            DATASET_ANALYZER — v1.0.0
          </span>
        </div>
      </div>

      {/* Main terminal panel */}
      <div className="animate-slide-up delay-100 w-full max-w-2xl border border-brand-border bg-background/80 backdrop-blur-sm">
        {/* Header with professors */}
        <div className="border-b border-brand-border px-8 py-6 bg-brand-surface/40">
          <div className="flex justify-center gap-10">
            {PROFESSORS.map((p, i) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <div className="relative">
                  {/* Pixel frame — outer glow */}
                  <div
                    className="w-20 h-20 bg-brand-surface-2 overflow-hidden"
                    style={{
                      boxShadow:
                        '0 0 0 1px #f97316, 0 0 0 4px #080808, 0 0 0 5px rgba(249,115,22,0.3), 0 0 12px rgba(249,115,22,0.15)',
                    }}
                  >
                    <Image
                      src={p.src}
                      alt={`Profesor ${p.name}`}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  {/* Online indicator */}
                  <span
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500"
                    style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }}
                  />
                </div>
                <span className="font-mono text-xs text-brand-text-muted tracking-widest uppercase">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Title */}
          <div className="animate-slide-up delay-300 mb-2">
            <div className="text-brand-text-muted text-xs tracking-[0.4em] uppercase font-mono mb-3">
              ▸ Bootcamp Tool ◂
            </div>
            <h1
              className="font-arcade text-6xl sm:text-7xl leading-none animate-flicker"
              style={{
                color: '#f97316',
                textShadow:
                  '0 0 10px rgba(249,115,22,0.8), 0 0 24px rgba(249,115,22,0.4), 0 0 48px rgba(249,115,22,0.2)',
              }}
            >
              DATASET
            </h1>
            <h1
              className="font-arcade text-6xl sm:text-7xl leading-none"
              style={{
                color: '#facc15',
                textShadow:
                  '0 0 10px rgba(250,204,21,0.7), 0 0 24px rgba(250,204,21,0.4)',
              }}
            >
              ANALYZER
            </h1>
          </div>

          <div className="animate-slide-up delay-400 my-6 text-brand-text-muted text-xs tracking-widest">
            ── ── ── ── ── ── ── ── ── ── ──
          </div>

          <p className="animate-slide-up delay-500 font-mono text-brand-text-muted text-sm max-w-sm mx-auto mb-2 leading-relaxed">
            Sube tu dataset. Obtendrás un puntaje automático basado en 12 criterios de calidad de datos.
          </p>

          {/* Stats row */}
          <div className="animate-slide-up delay-600 flex justify-center gap-8 my-8">
            {[
              { value: '12', label: 'CRITERIOS' },
              { value: '04', label: 'DIMS' },
              { value: '1-10', label: 'SCORE' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span
                  className="font-arcade text-3xl"
                  style={{
                    color: '#f97316',
                    textShadow: '0 0 8px rgba(249,115,22,0.6)',
                  }}
                >
                  {s.value}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-brand-text-muted mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="animate-slide-up delay-700">
            <button
              onClick={onStart}
              className="group relative px-10 py-3 font-arcade text-2xl tracking-widest transition-all duration-150 active:scale-95"
              style={{
                color: '#080808',
                background: '#f97316',
                boxShadow: '0 0 0 2px #080808, 0 0 0 3px #f97316, 0 4px 20px rgba(249,115,22,0.4)',
              }}
            >
              <span className="relative z-10">INICIAR</span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  background: 'rgba(250,204,21,0.15)',
                }}
              />
            </button>

            <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-brand-text-muted animate-blink">
              ▸ PRESIONA PARA COMENZAR ◂
            </p>
          </div>
        </div>

        {/* Footer bar */}
        <div className="border-t border-brand-border px-6 py-2 flex justify-between text-[10px] font-mono text-brand-text-muted/40 tracking-widest bg-brand-surface/20">
          <span>©2025 BOOTCAMP</span>
          <span>ALL FILES PROCESSED LOCALLY</span>
          <span>NO SERVER</span>
        </div>
      </div>
    </div>
  )
}
