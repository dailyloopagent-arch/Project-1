import { Heart, Search, ShoppingBag } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Search className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">{siteConfig.name}</span>
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">
              {'parse() → diagnose() → fix()'}
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-2">
          <a
            href={siteConfig.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'hidden md:inline-flex')}
          >
            <Heart className="text-destructive" aria-hidden="true" />
            Support Developer
          </a>
          <a
            href={siteConfig.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support Developer"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon-lg' }), 'md:hidden')}
          >
            <Heart className="text-destructive" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.debuggingKitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'px-3 font-semibold hover:bg-primary/85')}
          >
            <ShoppingBag aria-hidden="true" />
            <span className="hidden sm:inline">Get API Debugging Kit ($9)</span>
            <span className="sm:hidden">Kit ($9)</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
