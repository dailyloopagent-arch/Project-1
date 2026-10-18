'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { InputPane } from '@/components/input-pane'
import { OutputPane, type FormatMode } from '@/components/output-pane'
import { analyzeJson, SAMPLE_BROKEN_JSON } from '@/lib/json-repair'

export function JsonWorkspace() {
  const [input, setInput] = useState(SAMPLE_BROKEN_JSON)
  const [mode, setMode] = useState<FormatMode>('pretty')
  const [notice, setNotice] = useState<string | null>(null)
  const deferredInput = useDeferredValue(input)

  const result = useMemo(() => analyzeJson(deferredInput), [deferredInput])

  const output = useMemo(() => {
    if (result.status !== 'valid' && result.status !== 'repaired') return null
    return mode === 'pretty' ? JSON.stringify(result.value, null, 2) : JSON.stringify(result.value)
  }, [result, mode])

  const flaggedLines = useMemo(
    () => new Set(result.status === 'repaired' ? result.fixes.map((fix) => fix.line) : []),
    [result],
  )

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      setNotice(null)
    } catch {
      setNotice('Clipboard access was blocked. Press Ctrl/Cmd + V inside the editor instead.')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {notice && (
        <p role="alert" className="shrink-0 border-b border-warning/40 bg-warning/5 px-3 py-1 font-mono text-[11px] text-warning">
          {notice}
        </p>
      )}
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[70dvh_80dvh] divide-y divide-border md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-y-0">
        <InputPane
          value={input}
          onChange={setInput}
          onSample={() => setInput(SAMPLE_BROKEN_JSON)}
          onClear={() => setInput('')}
          onPaste={handlePaste}
          flaggedLines={flaggedLines}
          errorLine={result.status === 'invalid' ? result.line : undefined}
        />
        <OutputPane result={result} output={output} mode={mode} onModeChange={setMode} />
      </div>
    </div>
  )
}
