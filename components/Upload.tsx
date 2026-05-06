'use client'

import { useRef, useState } from 'react'

const ACCEPTED_FORMATS = '.csv,.xlsx,.xls,.json'
const ACCEPTED_EXTENSIONS = ['csv', 'xlsx', 'xls', 'json']

interface UploadProps {
  onFileSelected: (file: File) => void
  onBack: () => void
}

export default function Upload({ onFileSelected, onBack }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateFile(file: File): string | null {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ACCEPTED_EXTENSIONS.includes(ext)) {
      return `ERR: formato .${ext} no soportado. Usa: CSV / XLSX / XLS / JSON`
    }
    if (file.size === 0) return 'ERR: el archivo está vacío.'
    if (file.size > 100 * 1024 * 1024) return 'ERR: tamaño supera 100 MB.'
    return null
  }

  function handleFile(file: File) {
    const err = validateFile(file)
    if (err) { setError(err); return }
    setError(null)
    onFileSelected(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Terminal breadcrumb */}
        <div className="font-mono text-xs text-brand-text-muted mb-6 animate-slide-up">
          <button onClick={onBack} className="hover:text-brand-accent transition-colors">
            ~/analyzer
          </button>
          <span className="text-brand-border mx-2">›</span>
          <span className="text-brand-accent">upload</span>
          <span className="animate-blink text-brand-accent">█</span>
        </div>

        {/* Panel */}
        <div className="border border-brand-border bg-background/80 animate-slide-up delay-100">
          {/* Title bar */}
          <div className="border-b border-brand-border px-4 py-2 flex items-center gap-2 bg-brand-surface/60">
            <span className="font-arcade text-xl text-brand-accent" style={{ textShadow: '0 0 8px rgba(249,115,22,0.6)' }}>
              FILE SELECT
            </span>
            <span className="ml-auto font-mono text-[10px] text-brand-text-muted tracking-widest">
              STEP 1 / 3
            </span>
          </div>

          <div className="p-8">
            {/* Supported formats */}
            <div className="font-mono text-xs text-brand-text-muted mb-6 flex gap-4 flex-wrap">
              {['CSV', 'XLSX', 'XLS', 'JSON'].map((fmt) => (
                <span key={fmt} className="px-2 py-0.5 border border-brand-border text-brand-accent/70">
                  .{fmt.toLowerCase()}
                </span>
              ))}
              <span className="text-brand-border">|</span>
              <span>max 100 MB</span>
            </div>

            {/* Drop zone */}
            <div
              className="relative cursor-pointer select-none transition-all duration-150"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div
                className="border-2 border-dashed py-16 px-8 text-center transition-all duration-150"
                style={{
                  borderColor: dragging ? '#f97316' : '#2a2a2a',
                  background: dragging ? 'rgba(249,115,22,0.05)' : 'transparent',
                  boxShadow: dragging
                    ? '0 0 0 1px rgba(249,115,22,0.2), 0 0 20px rgba(249,115,22,0.08) inset'
                    : 'none',
                }}
              >
                {/* Terminal prompt */}
                <div className="font-mono text-brand-text-muted text-sm mb-6 space-y-1">
                  <p className="text-[10px] tracking-widest text-brand-text-muted/50">
                    ┌─ CONSOLA DE CARGA ─────────────────┐
                  </p>
                  <p>
                    <span className="text-brand-accent">$</span>{' '}
                    {dragging ? (
                      <span className="text-brand-highlight">SOLTANDO ARCHIVO...</span>
                    ) : (
                      <>
                        DRAG{' '}
                        <span className="text-brand-text">&amp;&amp;</span>{' '}
                        DROP tu dataset
                      </>
                    )}
                    <span className="animate-blink">_</span>
                  </p>
                  <p className="text-[10px] tracking-widest text-brand-text-muted/50">
                    └────────────────────────────────────┘
                  </p>
                </div>

                <div className="font-arcade text-4xl text-brand-border mb-6" aria-hidden>
                  📂
                </div>

                <button
                  className="font-mono text-xs px-6 py-2 border border-brand-accent text-brand-accent tracking-widest hover:bg-brand-accent hover:text-black transition-all duration-150"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                >
                  ▸ SELECCIONAR ARCHIVO
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 px-4 py-3 border border-red-500/40 bg-red-500/5 font-mono text-red-400 text-xs">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            <p className="mt-4 font-mono text-[10px] text-brand-text-muted/40 text-center tracking-wider">
              PROCESADO EN TU NAVEGADOR — NINGÚN ARCHIVO SE ENVÍA A NINGÚN SERVIDOR
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FORMATS}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>
    </div>
  )
}
