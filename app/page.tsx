import { JsonWorkspace } from '@/components/json-workspace'
import { SiteHeader } from '@/components/site-header'
import { UtilityBar } from '@/components/utility-bar'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:min-h-[480px]">
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <h1 className="sr-only">JSON Error Detective: find and fix malformed JSON</h1>
        <JsonWorkspace />
      </main>
      <UtilityBar />
    </div>
  )
}
