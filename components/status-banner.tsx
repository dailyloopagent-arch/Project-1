import { CircleCheck, CircleDashed, OctagonX, Wrench } from 'lucide-react'
import type { AnalysisResult } from '@/lib/json-repair'
import { cn } from '@/lib/utils'

const MAX_VISIBLE_FIXES = 4

export function StatusBanner({ result }: { result: AnalysisResult }) {
  return (
    <div role="status" aria-live="polite" className="border-b border-border px-4 py-3">
      {result.status === 'empty' && (
        <div className="flex items-center gap-3">
          <Badge className="bg-muted text-muted-foreground ring-border">
            <CircleDashed aria-hidden="true" />
            Waiting for input
          </Badge>
          <p className="text-sm text-muted-foreground">Paste JSON on the left to start the investigation.</p>
        </div>
      )}

      {result.status === 'valid' && (
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-success/15 text-success ring-success/30">
            <CircleCheck aria-hidden="true" />
            Valid JSON
          </Badge>
          <p className="text-sm text-muted-foreground">No issues found. Your JSON is already spec-compliant.</p>
        </div>
      )}

      {result.status === 'repaired' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-warning/15 text-warning ring-warning/30">
              <Wrench aria-hidden="true" />
              JSON Repaired
            </Badge>
            <p className="text-sm text-muted-foreground">
              {result.fixes.length} {result.fixes.length === 1 ? 'issue' : 'issues'} fixed automatically.
            </p>
          </div>
          <ul className="flex flex-col gap-1 rounded-md bg-warning/5 p-2.5 ring-1 ring-warning/15">
            {result.fixes.slice(0, MAX_VISIBLE_FIXES).map((fix, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
                <span>
                  <span className="font-medium text-warning">Fixed:</span> {fix.message} at{' '}
                  <span className="font-mono text-xs text-foreground">
                    line {fix.line}, column {fix.column}
                  </span>
                </span>
              </li>
            ))}
            {result.fixes.length > MAX_VISIBLE_FIXES && (
              <li className="pl-3.5 text-xs text-muted-foreground">
                +{result.fixes.length - MAX_VISIBLE_FIXES} more fixes (highlighted in the input gutter)
              </li>
            )}
          </ul>
        </div>
      )}

      {result.status === 'invalid' && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-destructive/15 text-destructive ring-destructive/30">
              <OctagonX aria-hidden="true" />
              Could not repair
            </Badge>
            {result.line !== undefined && (
              <span className="font-mono text-xs text-muted-foreground">
                line {result.line}, column {result.column}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{result.error}</p>
        </div>
      )}
    </div>
  )
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 [&_svg]:size-3.5',
        className,
      )}
    >
      {children}
    </span>
  )
}
