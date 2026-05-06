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
      return `Formato no soportado: .${ext}. Usa CSV, XLSX, XLS o JSON.`
    }
    if (file.size === 0) return 'El archivo está vacío.'
    if (file.size > 100 * 1024 * 1024) return 'El archivo supera el límite de 100 MB.'
    return null
  }

  function handleFile(file: File) {
    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onFileSelected(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 text-brand-text-muted hover:text-brand-text text-sm flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        <h2 className="text-3xl font-bold font-mono mb-2 text-center">
          <span className="text-brand-accent">Sube</span> tu dataset
        </h2>
        <p className="text-brand-text-muted text-center mb-8 text-sm">
          Formatos soportados: CSV, XLSX, XLS, JSON
        </p>

        <div
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${dragging
              ? 'border-brand-accent bg-orange-500/10 scale-[1.02]'
              : 'border-brand-border bg-brand-surface hover:border-brand-accent/50 hover:bg-brand-surface/80'
            }
          `}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="text-4xl mb-4">📂</div>
          <p className="text-brand-text font-medium mb-2">
            Arrastra y suelta tu archivo aquí
          </p>
          <p className="text-brand-text-muted text-sm mb-4">
            o haz clic para seleccionar
          </p>
          <span className="inline-block px-4 py-2 rounded-full border border-brand-accent text-brand-accent text-sm font-medium hover:bg-brand-accent/10 transition-colors">
            Seleccionar archivo
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FORMATS}
          className="hidden"
          onChange={onInputChange}
        />

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <p className="text-center text-brand-text-muted text-xs mt-6">
          El archivo se procesa en tu navegador. No se envía a ningún servidor.
        </p>
      </div>
    </div>
  )
}
