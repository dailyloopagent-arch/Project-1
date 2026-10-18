'use client'

import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { JsonHighlight } from '@/components/json-highlight'
import { PaneHeader } from '@/components/pane-header'
import { StatusBanner } from '@/components/status-banner'
import { ToolbarButton } from '@/components/toolbar-button'
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
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const handleDownload = () => {
    if (!output) return
    const url = URL.createObjectURL(new Blob([output], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'clean.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="output-title" className="flex min-h-0 flex-col">
      <PaneHeader id="output-title" title="Output" hint="Repaired JSON">
        <ToolbarButton onClick={handleCopy} disabled={!output} className="text-foreground">
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy Clean JSON'}
        </ToolbarButton>
        <ToolbarButton onClick={handleDownload} disabled={!output}>
          <Download aria-hidden="true" />
          Download .json
        </ToolbarButton>
      </PaneHeader>

      <StatusBanner result={result} />

      <div className="min-h-0 flex-1 overflow-auto bg-editor py-2">
        {output ? (
          <JsonHighlight code={output} />
        ) : (
          <p className="px-3 font-mono text-xs text-muted-foreground">
            {result.status === 'invalid'
              ? '// Unable to repair automatically. Check the highlighted input line.'
              : '// Clean, formatted JSON will appear here.'}
          </p>
        )}
      </div>

      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border px-3 font-mono text-[10px] text-muted-foreground">
        <span>{output ? `${output.length.toLocaleString()} chars` : '—'}</span>
        <div role="group" aria-label="Output format" className="flex items-center gap-2">
          {(['pretty', 'minify'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => onModeChange(option)}
              className={cn(
                'transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none',
                mode === option && 'text-foreground underline underline-offset-2',
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
