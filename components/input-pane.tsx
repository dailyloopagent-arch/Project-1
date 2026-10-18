'use client'

import { useRef } from 'react'
import { ClipboardPaste, FlaskConical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function InputPane({
  value,
  onChange,
  onSample,
  onClear,
  onPaste,
  flaggedLines,
  errorLine,
}: InputPaneProps) {
  const gutterRef = useRef<HTMLDivElement>(null)
  const lineCount = Math.max(value.split('\n').length, 1)

  return (
    <section
      aria-labelledby="input-title"
      className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-[620px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          <h2 id="input-title" className="text-sm font-semibold">
            Paste Raw or Malformed JSON
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={onSample}>
            <FlaskConical aria-hidden="true" />
            Sample Broken JSON
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} disabled={!value}>
            <Trash2 aria-hidden="true" />
            Clear
          </Button>
          <Button variant="secondary" size="sm" onClick={onPaste}>
            <ClipboardPaste aria-hidden="true" />
            Paste from Clipboard
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 bg-editor">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 shrink-0 overflow-hidden border-r border-border bg-gutter py-3 font-mono text-[13px] leading-6"
        >
          {Array.from({ length: lineCount }, (_, index) => {
            const line = index + 1
            const isError = line === errorLine
            const isFlagged = flaggedLines.has(line)
            return (
              <div
                key={line}
                className={cn(
                  'relative pr-3 text-right text-muted-foreground/50',
                  isFlagged && 'bg-warning/10 text-warning',
                  isError && 'bg-destructive/15 text-destructive',
                )}
              >
                {(isFlagged || isError) && (
                  <span
                    className={cn(
                      'absolute top-1/2 left-1.5 size-1.5 -translate-y-1/2 rounded-full',
                      isError ? 'bg-destructive' : 'bg-warning',
                    )}
                  />
                )}
                {line}
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
          onScroll={(event) => {
            if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          placeholder={'{\n  "paste": "your broken JSON here",\n}'}
          className="min-h-0 flex-1 resize-none overflow-auto bg-transparent px-4 py-3 font-mono text-[13px] leading-6 text-foreground caret-primary outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <span>
          {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {value.length.toLocaleString()} chars
        </span>
        <span>UTF-8 · JSON</span>
      </div>
    </section>
  )
}
