'use client'

import { useState } from 'react'
import { Check, Copy, Download, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JsonHighlight } from '@/components/json-highlight'
import { StatusBanner } from '@/components/status-banner'
import type { AnalysisResult } from '@/lib/json-repair'
import { cn } from '@/lib/utils'

export type FormatMode = 'pretty' | 'minify'

type OutputPaneProps = {
  result: AnalysisResult
  output: string | null
  mode: FormatMode
  onModeChange: (mode: FormatMode) => void
}

export function OutputPane({ result, output, mode, onModeChange }: OutputPaneProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clean.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section
      aria-labelledby="output-title"
      className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-[620px]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2 rounded-full bg-success" aria-hidden="true" />
        <h2 id="output-title" className="text-sm font-semibold">
          Output &amp; Diagnosis
        </h2>
      </div>

      <StatusBanner result={result} />

      <div className="min-h-0 flex-1 overflow-auto bg-editor py-3">
        {output ? (
          <JsonHighlight code={output} wrap={mode === 'minify'} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileSearch className="size-6" aria-hidden="true" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground text-pretty">
              {result.status === 'invalid'
                ? 'This one is beyond automatic repair. Check the highlighted line in the input.'
                : 'Clean, formatted JSON will appear here.'}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button size="sm" onClick={handleCopy} disabled={!output} className="font-semibold">
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy Clean JSON'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
            <Download aria-hidden="true" />
            Download .json File
          </Button>
        </div>
        <div
          role="group"
          aria-label="Output format"
          className="inline-flex rounded-lg bg-muted p-0.5 ring-1 ring-border"
        >
          {(['pretty', 'minify'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => onModeChange(option)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                mode === option
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option === 'pretty' ? 'Prettify' : 'Minify'}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
