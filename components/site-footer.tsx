import { GithubIcon } from '@/components/icons/github-icon'
import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          {'© '}
          {new Date().getFullYear()} {siteConfig.name}. Runs entirely in your browser.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            GitHub Repository
          </a>
          <a
            href={`${siteConfig.githubUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Report an Issue
          </a>
        </nav>
      </div>
    </footer>
  )
}
