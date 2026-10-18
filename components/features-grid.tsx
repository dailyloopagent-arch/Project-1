import { Download, ShieldCheck, Wand2 } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: '100% Local & Private',
    description:
      'Data never leaves your browser. Parsing and repair run entirely on your device — no uploads, no logs, no servers.',
    accent: 'text-success bg-success/10 ring-success/25',
  },
  {
    icon: Wand2,
    title: 'Auto-Fixes Trailing Commas & Single Quotes',
    description:
      'Also handles unquoted keys, comments, missing commas, Python-style True/None and unclosed brackets — with line-by-line explanations.',
    accent: 'text-warning bg-warning/10 ring-warning/25',
  },
  {
    icon: Download,
    title: 'Instant Format & Download',
    description:
      'Toggle between prettified and minified output, copy it in one click, or download a clean .json file ready to ship.',
    accent: 'text-primary bg-primary/10 ring-primary/25',
  },
]

export function FeaturesGrid() {
  return (
    <section aria-labelledby="features-title" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="features-title" className="text-xl font-semibold tracking-tight text-balance">
          Built for developers who debug APIs all day
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground text-pretty">
          Stop squinting at <code className="font-mono text-foreground">Unexpected token</code> errors. Paste
          the payload, read the diagnosis, ship the fix.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <li key={feature.title} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <span className={`flex size-10 items-center justify-center rounded-lg ring-1 ${feature.accent}`}>
              <feature.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold leading-snug">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
