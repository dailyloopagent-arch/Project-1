import { Fragment, memo } from 'react'

const TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g

function highlightLine(line: string) {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(line.slice(lastIndex, index))
    const [full, str, colon, bool, nul, num, punct] = match
    if (str !== undefined) {
      nodes.push(
        colon !== undefined ? (
          <Fragment key={key++}>
            <span className="text-syntax-key">{str}</span>
            <span className="text-muted-foreground">{colon}</span>
          </Fragment>
        ) : (
          <span key={key++} className="text-syntax-string">
            {str}
          </span>
        ),
      )
    } else if (bool !== undefined || nul !== undefined) {
      nodes.push(
        <span key={key++} className="text-syntax-literal">
          {full}
        </span>,
      )
    } else if (num !== undefined) {
      nodes.push(
        <span key={key++} className="text-syntax-number">
          {full}
        </span>,
      )
    } else if (punct !== undefined) {
      nodes.push(
        <span key={key++} className="text-muted-foreground">
          {full}
        </span>,
      )
    }
    lastIndex = index + full.length
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex))
  return nodes
}

export const JsonHighlight = memo(function JsonHighlight({ code }: { code: string }) {
  return (
    <pre className="font-mono text-xs leading-5">
      <code className="block">
        {code.split('\n').map((line, index) => (
          <span key={index} className="flex">
            <span
              aria-hidden="true"
              className="w-10 shrink-0 select-none border-r border-border pr-2 text-right text-muted-foreground/50"
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 px-3 whitespace-pre-wrap [overflow-wrap:anywhere]">
              {highlightLine(line)}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
})
