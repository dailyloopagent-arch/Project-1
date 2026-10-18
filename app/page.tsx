import { FeaturesGrid } from '@/components/features-grid'
import { JsonWorkspace } from '@/components/json-workspace'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-14 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Find and fix broken JSON in seconds
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground text-pretty sm:text-base">
              Paste a malformed payload and get a plain-English diagnosis plus a repaired, formatted result —
              processed instantly and privately in your browser.
            </p>
          </div>
          <JsonWorkspace />
        </div>
        <FeaturesGrid />
      </main>
      <SiteFooter />
    </div>
  )
}
