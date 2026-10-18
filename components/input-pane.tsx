'use client'

import { ClipboardPaste, FlaskConical, X } from 'lucide-react'
import { PaneHeader } from '@/components/pane-header'
import { ToolbarButton } from '@/components/toolbar-button'
import { cn } from '@/lib/utils'

type InputPaneProps = {
  value: string
  onChange: (value: string) => void
  onSample: () => void
  onClear: () => void
  onPaste: () => void
  flaggedLines: Set<number>
  errorLine?: number
}

const TEXT_METRICS = 'font-mono text-xs leading-5 whitespace-pre-wrap [overflow-wrap:anywhere]'

export function InputPane({
  value,
  onChange,
  onSample,
  onClear,
  onPaste,
  flaggedLines,
  errorLine,
}: InputPaneProps) {
  const lines = value.split('\n')

  return (
    <section aria-labelledby="input-title" className="flex min-h-0 flex-col">
      <PaneHeader id="input-title" title="Input" hint="Malformed JSON">
        <ToolbarButton onClick={onSample}>
          <FlaskConical aria-hidden="true" />
          Sample
        </ToolbarButton>
        <ToolbarButton onClick={onClear} disabled={!value}>
          <X aria-hidden="true" />
          Clear
        </ToolbarButton>
        <ToolbarButton onClick={onPaste}>
          <ClipboardPaste aria-hidden="true" />
          Paste
        </ToolbarButton>
      </PaneHeader>

      <div className="min-h-0 flex-1 overflow-auto bg-editor">
        <div className="relative min-h-full py-2">
          <div aria-hidden="true">
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const isError = lineNumber === errorLine
              const isFlagged = flaggedLines.has(lineNumber)
              return (
                <div
                  key={index}
                  className={cn('flex', isFlagged && 'bg-warning/5', isError && 'bg-destructive/10')}
                >
                  <span
                    className={cn(
                      'w-10 shrink-0 select-none border-r border-border pr-2 text-right font-mono text-xs leading-5 text-muted-foreground/50',
                      isFlagged && 'text-warning',
                      isError && 'text-destructive',
                    )}
                  >
                    {lineNumber}
                  </span>
                  <span className={cn(TEXT_METRICS, 'invisible min-w-0 flex-1 px-3')}>{line || ' '}</span>
                </div>
              )
            })}
          </div>
          <label htmlFor="json-input" className="sr-only">
            JSON input
          </label>
          <textarea
            id="json-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder={'{ "paste": "your broken JSON here", }'}
            className={cn(
              TEXT_METRICS,
              'absolute inset-y-0 right-0 left-10 resize-none overflow-hidden bg-transparent px-3 py-2 text-foreground caret-foreground outline-none placeholder:text-muted-foreground/40',
            )}
          />
        </div>
      </div>

      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border px-3 font-mono text-[10px] text-muted-foreground">
        <span>
          {lines.length} {lines.length === 1 ? 'line' : 'lines'} · {value.length.toLocaleString()} chars
        </span>
        <span>UTF-8</span>
      </div>
    </section>
  )
}
