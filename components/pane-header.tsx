export function PaneHeader({
  id,
  title,
  hint,
  children,
}: {
  id: string
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
      <h2 id={id} className="truncate font-mono text-[11px] font-medium tracking-wider text-foreground uppercase">
        {title} <span className="text-muted-foreground normal-case tracking-normal">({hint})</span>
      </h2>
      <div className="flex shrink-0 items-center gap-0.5">{children}</div>
    </div>
  )
}
