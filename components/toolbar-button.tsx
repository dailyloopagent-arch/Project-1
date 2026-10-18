import { cn } from '@/lib/utils'

export function ToolbarButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-sm border border-transparent px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}
