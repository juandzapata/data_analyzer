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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <div className="flex gap-6 mb-10 justify-center">
        {PROFESSORS.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border overflow-hidden flex items-center justify-center">
              <Image
                src={p.src}
                alt={`Profesor ${p.name}`}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <span className="text-sm text-brand-text-muted font-mono">{p.name}</span>
          </div>
        ))}
      </div>

      <h1 className="text-5xl font-bold font-mono mb-4">
        <span className="text-brand-highlight">Dataset</span>{' '}
        <span className="text-brand-accent">Analyzer</span>
      </h1>

      <p className="text-brand-text-muted text-lg max-w-md mb-3">
        Sube tu dataset y descubre si es viable para tu proyecto de bootcamp.
      </p>
      <p className="text-brand-text-muted text-sm max-w-sm mb-10">
        Evaluamos 12 criterios de calidad y te damos un puntaje del 1 al 10 con recomendaciones personalizadas.
      </p>

      <button
        onClick={onStart}
        className="px-8 py-4 rounded-full font-semibold text-lg bg-brand-accent hover:bg-orange-400 text-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
      >
        Comenzar análisis
      </button>

      <div className="mt-16 flex gap-8 text-center">
        {[
          { value: '12', label: 'Criterios' },
          { value: '4', label: 'Dimensiones' },
          { value: '1–10', label: 'Puntaje final' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="font-mono text-2xl font-bold text-brand-accent">{stat.value}</span>
            <span className="text-sm text-brand-text-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
