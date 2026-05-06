'use client'

import { useState } from 'react'
import Landing from './Landing'
import Upload from './Upload'
import Questions from './Questions'
import Analyzing from './Analyzing'
import Results from './Results'
import type { UserAnswers, AnalysisResult } from '@/lib/types'

type Step = 'landing' | 'upload' | 'questions' | 'analyzing' | 'results'

export default function DatasetAnalyzer() {
  const [step, setStep] = useState<Step>('landing')
  const [file, setFile] = useState<File | null>(null)
  const [answers, setAnswers] = useState<UserAnswers | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  function reset() {
    setStep('landing')
    setFile(null)
    setAnswers(null)
    setResult(null)
  }

  return (
    <>
      {step === 'landing' && (
        <Landing onStart={() => setStep('upload')} />
      )}

      {step === 'upload' && (
        <Upload
          onFileSelected={(f) => { setFile(f); setStep('questions') }}
          onBack={() => setStep('landing')}
        />
      )}

      {step === 'questions' && file && (
        <Questions
          fileName={file.name}
          onSubmit={(a) => { setAnswers(a); setStep('analyzing') }}
          onBack={() => setStep('upload')}
        />
      )}

      {step === 'analyzing' && file && answers && (
        <Analyzing
          file={file}
          answers={answers}
          onDone={(r) => { setResult(r); setStep('results') }}
          onError={reset}
        />
      )}

      {step === 'results' && result && file && (
        <Results
          result={result}
          fileName={file.name}
          onReset={reset}
        />
      )}
    </>
  )
}
