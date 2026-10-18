import { CircleCheck, CircleDashed, OctagonX, TriangleAlert } from 'lucide-react'
import type { AnalysisResult } from '@/lib/json-repair'
import { cn } from '@/lib/utils'

const MAX_VISIBLE_FIXES = 3

const TONES = {
  empty: 'border-border bg-muted/40 text-muted-foreground',
  valid: 'border-success/40 bg-success/5 text-success',
  repaired: 'border-warning/40 bg-warning/5 text-warning',
  invalid: 'border-destructive/40 bg-destructive/5 text-destructive',
} as const

export function StatusBanner({ result }: { result: AnalysisResult }) {
  return (
    <div className="shrink-0 border-b border-border p-2">
      <div
        role="status"
        aria-live="polite"
        className={cn('flex items-start gap-2 rounded-sm border px-2.5 py-1.5 font-mono text-[11px] leading-5', TONES[result.status])}
      >
        {result.status === 'empty' && (
          <>
            <CircleDashed className="mt-1 size-3 shrink-0" aria-hidden="true" />
            <p>Awaiting input.</p>
          </>
        )}

        {result.status === 'valid' && (
          <>
            <CircleCheck className="mt-1 size-3 shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold">Syntax Valid</span>
              <span className="text-muted-foreground"> — no repairs needed.</span>
            </p>
          </>
        )}

        {result.status === 'repaired' && (
          <>
            <TriangleAlert className="mt-1 size-3 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                Repaired {result.fixes.length} {result.fixes.length === 1 ? 'issue' : 'issues'}
              </p>
              <ul className="text-foreground/85">
                {result.fixes.slice(0, MAX_VISIBLE_FIXES).map((fix, index) => (
                  <li key={index} className="truncate">
                    <span className="text-warning">
                      Line {fix.line}:{fix.column}
                    </span>{' '}
                    {fix.message}.
                  </li>
                ))}
                {result.fixes.length > MAX_VISIBLE_FIXES && (
                  <li className="text-muted-foreground">
                    +{result.fixes.length - MAX_VISIBLE_FIXES} more (marked in input gutter)
                  </li>
                )}
              </ul>
            </div>
          </>
        )}

        {result.status === 'invalid' && (
          <>
            <OctagonX className="mt-1 size-3 shrink-0" aria-hidden="true" />
            <p className="min-w-0">
              <span className="font-semibold">
                {result.line !== undefined ? `Line ${result.line}:${result.column}` : 'Unrepairable'}
              </span>{' '}
              <span className="text-foreground/85">{result.error}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
