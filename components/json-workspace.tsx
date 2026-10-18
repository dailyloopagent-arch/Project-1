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
    <div className="flex flex-col gap-3">
      {notice && (
        <p role="alert" className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning ring-1 ring-warning/20">
          {notice}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
