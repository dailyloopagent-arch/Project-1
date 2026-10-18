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
      if (colon !== undefined) {
        nodes.push(
          <Fragment key={key++}>
            <span className="text-syntax-key">{str}</span>
            <span className="text-muted-foreground">{colon}</span>
          </Fragment>,
        )
      } else {
        nodes.push(
          <span key={key++} className="text-syntax-string">
            {str}
          </span>,
        )
      }
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

export const JsonHighlight = memo(function JsonHighlight({
  code,
  wrap,
}: {
  code: string
  wrap: boolean
}) {
  const lines = code.split('\n')
  return (
    <pre className="font-mono text-[13px] leading-6">
      <code className="table w-full">
        {lines.map((line, index) => (
          <span key={index} className="table-row">
            <span
              aria-hidden="true"
              className="table-cell w-12 select-none bg-gutter pr-3 text-right text-muted-foreground/50"
            >
              {index + 1}
            </span>
            <span
              className={
                wrap
                  ? 'table-cell whitespace-pre-wrap break-all pl-4 pr-4'
                  : 'table-cell whitespace-pre pl-4 pr-4'
              }
            >
              {highlightLine(line)}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
})
