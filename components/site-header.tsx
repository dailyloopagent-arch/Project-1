import { Braces } from 'lucide-react'
import { GithubIcon } from '@/components/icons/github-icon'
import { siteConfig } from '@/lib/site-config'

export function SiteHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Braces className="size-4 shrink-0 text-foreground" aria-hidden="true" />
        <span className="truncate text-sm font-semibold tracking-tight">{siteConfig.name}</span>
        <span className="hidden shrink-0 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          {'v1.0 • Client-Side'}
        </span>
      </div>
      <nav aria-label="External links" className="flex shrink-0 items-center gap-1">
        <a
          href={siteConfig.debuggingKitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center rounded-sm border border-border px-2.5 font-mono text-[11px] text-foreground transition-colors hover:bg-accent focus-visible:border-ring focus-visible:outline-none"
        >
          API Debugging Kit ($14)
        </a>
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <GithubIcon className="size-4" aria-hidden="true" />
        </a>
      </nav>
    </header>
  )
}
