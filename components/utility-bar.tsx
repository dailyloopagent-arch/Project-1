import { FileOutput, Lock, Zap } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const INDICATORS = [
  { icon: Lock, label: '100% Client-Side Parsing', detail: 'Data never hits a server' },
  { icon: Zap, label: 'Auto-fixes trailing commas, single quotes & unquoted keys' },
  { icon: FileOutput, label: 'Instant formatting & export' },
]

export function UtilityBar() {
  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t border-border px-3 py-2 font-mono text-[11px] text-muted-foreground sm:px-4 lg:h-9 lg:flex-row lg:items-center lg:justify-between lg:py-0">
      <ul className="flex flex-col gap-1.5 md:flex-row md:flex-wrap md:items-center md:gap-x-5">
        {INDICATORS.map(({ icon: Icon, label, detail }) => (
          <li key={label} className="flex items-center gap-1.5">
            <Icon className="size-3 shrink-0" aria-hidden="true" />
            <span>
              <span className="text-foreground/80">{label}</span>
              {detail && <span> ({detail})</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="shrink-0">
        {'© '}
        {new Date().getFullYear()} {siteConfig.name}
      </p>
    </footer>
  )
}
