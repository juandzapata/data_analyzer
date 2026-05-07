'use client'

import { useRef, useState } from 'react'

const ACCEPTED_FORMATS = '.csv,.xlsx,.xls,.json'
const ACCEPTED_EXTENSIONS = ['csv', 'xlsx', 'xls', 'json']

interface UploadProps {
  onFileSelected: (file: File) => void
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
              background: step === 1 ? '#f97316' : '#1c1c1c',
              color: step === 1 ? '#000' : '#444',
              border: `1px solid ${step === 1 ? '#f97316' : '#2a2a2a'}`,
            }}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className="h-px w-8"
              style={{ background: '#2a2a2a' }}
            />
          )}
        </div>
      ))}
      <span className="ml-1 font-mono text-xs text-brand-text-muted">Paso 1 de 3</span>
    </div>
  )
}

export default function Upload({ onFileSelected, onBack }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateFile(file: File): string | null {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Formato .${ext} no soportado. Usa: CSV, XLSX, XLS o JSON`
    }
    if (file.size === 0) return 'El archivo está vacío.'
    if (file.size > 100 * 1024 * 1024) return 'El tamaño supera el límite de 100 MB.'
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
              <h2 className="font-mono font-bold text-brand-text">Cargar dataset</h2>
              <p className="font-mono text-[11px] text-brand-text-muted mt-0.5">
                CSV, XLSX, XLS o JSON · máx 100 MB
              </p>
            </div>
            <button
              onClick={onBack}
              className="font-mono text-xs text-brand-text-muted hover:text-brand-accent transition-colors px-2 py-1"
            >
              ← Atrás
            </button>
          </div>

          <div className="p-6">
            {/* Drop zone */}
            <div
              className="cursor-pointer select-none"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div
                className="border-2 border-dashed rounded-xl py-14 px-8 text-center transition-all duration-200"
                style={{
                  borderColor: dragging ? '#f97316' : '#2a2a2a',
                  background: dragging
                    ? 'rgba(249,115,22,0.05)'
                    : 'rgba(255,255,255,0.015)',
                }}
              >
                <div className="text-4xl mb-4" aria-hidden>
                  📂
                </div>
                <p className="font-mono text-brand-text-muted text-sm mb-1">
                  {dragging ? 'Suelta el archivo aquí' : 'Arrastra tu dataset aquí'}
                </p>
                <p className="font-mono text-brand-text-muted/40 text-xs mb-6">o</p>
                <button
                  className="font-mono text-sm px-5 py-2 rounded-lg border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.click()
                  }}
                >
                  Seleccionar archivo
                </button>
              </div>
            </div>

            {/* Format badges */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {['CSV', 'XLSX', 'XLS', 'JSON'].map((fmt) => (
                <span
                  key={fmt}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border border-brand-border text-brand-text-muted/60"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/5 font-mono text-red-400 text-xs">
                ⚠ {error}
              </div>
            )}

            <p className="mt-5 font-mono text-[10px] text-brand-text-muted/30 text-center tracking-wide">
              Procesado en tu navegador · Ningún archivo se envía a servidores
            </p>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}
