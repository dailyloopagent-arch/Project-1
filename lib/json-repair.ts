export type Fix = {
  message: string
  line: number
  column: number
}

export type AnalysisResult =
  | { status: 'empty' }
  | { status: 'valid'; value: unknown }
  | { status: 'repaired'; value: unknown; fixes: Fix[] }
  | { status: 'invalid'; error: string; line?: number; column?: number }

type Frame = {
  type: '{' | '['
  expect: 'key' | 'colon' | 'value' | 'commaOrEnd'
  openedAt: number
}

const NUMBER_PATTERN = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y
const VALID_JSON_NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/
const IDENTIFIER_PATTERN = /[A-Za-z_$][\w$-]*/y

function createLocator(input: string) {
  const lineStarts = [0]
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '\n') lineStarts.push(i + 1)
  }
  return (index: number) => {
    let low = 0
    let high = lineStarts.length - 1
    while (low < high) {
      const mid = (low + high + 1) >> 1
      if (lineStarts[mid] <= index) low = mid
      else high = mid - 1
    }
    return { line: low + 1, column: index - lineStarts[low] + 1 }
  }
}

export function repairJson(input: string): { output: string; fixes: Fix[] } {
  const locate = createLocator(input)
  const fixes: Fix[] = []
  const stack: Frame[] = []
  const n = input.length
  let out = ''
  let i = 0

  const addFix = (message: string, at: number) => {
    const { line, column } = locate(Math.min(at, Math.max(n - 1, 0)))
    fixes.push({ message, line, column })
  }

  const top = () => stack[stack.length - 1]

  const skipWhitespaceAndComments = (from: number) => {
    let j = from
    while (j < n) {
      const ch = input[j]
      if (/\s/.test(ch)) j++
      else if (ch === '/' && input[j + 1] === '/') {
        while (j < n && input[j] !== '\n') j++
      } else if (ch === '/' && input[j + 1] === '*') {
        const end = input.indexOf('*/', j + 2)
        j = end === -1 ? n : end + 2
      } else break
    }
    return j
  }

  const isKeyPosition = () => {
    const frame = top()
    return frame?.type === '{' && (frame.expect === 'key' || frame.expect === 'commaOrEnd')
  }

  const beforeKey = (at: number) => {
    const frame = top()
    if (!frame) return
    if (frame.expect === 'commaOrEnd') {
      out += ','
      addFix('Inserted missing comma before property', at)
    }
    frame.expect = 'colon'
  }

  const beforeValue = (at: number) => {
    const frame = top()
    if (!frame) return
    if (frame.type === '[') {
      if (frame.expect === 'commaOrEnd') {
        out += ','
        addFix('Inserted missing comma between array items', at)
      }
    } else if (frame.expect === 'colon') {
      out += ':'
      addFix('Inserted missing colon after property name', at)
    }
    frame.expect = 'commaOrEnd'
  }

  const closeFrame = (frame: Frame, at: number, reason: 'missing' | 'mismatch') => {
    if (frame.type === '{' && (frame.expect === 'value' || frame.expect === 'colon')) {
      out += frame.expect === 'colon' ? ':null' : 'null'
      addFix('Added null for property with no value', at)
    }
    out += frame.type === '{' ? '}' : ']'
    const opened = locate(frame.openedAt)
    const label = frame.type === '{' ? 'object' : 'array'
    const bracket = frame.type === '{' ? '}' : ']'
    addFix(
      reason === 'missing'
        ? `Added missing closing ${bracket} for ${label} opened at line ${opened.line}`
        : `Closed unclosed ${label} (opened at line ${opened.line}) before mismatched bracket`,
      at,
    )
  }

  let singleQuoteReported = false

  while (i < n) {
    const ch = input[i]

    if (/\s/.test(ch)) {
      i++
      continue
    }

    if (ch === '/' && (input[i + 1] === '/' || input[i + 1] === '*')) {
      const end = skipWhitespaceAndComments(i)
      addFix('Removed comment (comments are not allowed in JSON)', i)
      i = end
      continue
    }

    if (ch === '{' || ch === '[') {
      beforeValue(i)
      out += ch
      stack.push({ type: ch, expect: ch === '{' ? 'key' : 'value', openedAt: i })
      i++
      continue
    }

    if (ch === '}' || ch === ']') {
      const expected = ch === '}' ? '{' : '['
      const matchIndex = stack.map((f) => f.type).lastIndexOf(expected)
      if (matchIndex === -1) {
        addFix(`Removed unexpected closing ${ch}`, i)
        i++
        continue
      }
      while (stack.length - 1 > matchIndex) {
        closeFrame(stack.pop()!, i, 'mismatch')
      }
      const frame = stack.pop()!
      if (frame.type === '{' && (frame.expect === 'value' || frame.expect === 'colon')) {
        out += frame.expect === 'colon' ? ':null' : 'null'
        addFix('Added null for property with no value', i)
      }
      out += ch
      i++
      continue
    }

    if (ch === ',') {
      const next = skipWhitespaceAndComments(i + 1)
      const nextChar = input[next]
      const frame = top()
      if (next >= n || nextChar === '}' || nextChar === ']') {
        addFix('Removed trailing comma', i)
      } else if (frame && frame.expect !== 'commaOrEnd') {
        addFix('Removed extra comma', i)
      } else {
        out += ','
        if (frame) frame.expect = frame.type === '{' ? 'key' : 'value'
      }
      i++
      continue
    }

    if (ch === ':') {
      const frame = top()
      if (frame?.type === '{' && frame.expect === 'colon') {
        out += ':'
        frame.expect = 'value'
      } else {
        addFix('Removed unexpected colon', i)
      }
      i++
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      const start = i
      const quote = ch
      if (quote !== '"' && !singleQuoteReported) {
        singleQuoteReported = true
        addFix(
          quote === "'"
            ? 'Replaced single quotes with double quotes'
            : 'Replaced backticks with double quotes',
          start,
        )
      }
      let text = '"'
      let escapedNewlineReported = false
      i++
      let terminated = false
      while (i < n) {
        const c = input[i]
        if (c === '\\') {
          const nextChar = input[i + 1]
          if (nextChar === undefined) {
            i++
            break
          }
          if (nextChar === "'" && quote !== '"') text += "'"
          else if (/["\\/bfnrtu]/.test(nextChar)) text += c + nextChar
          else text += nextChar
          i += 2
          continue
        }
        if (c === quote) {
          terminated = true
          i++
          break
        }
        if (c === '"') text += '\\"'
        else if (c === '\n' || c === '\r' || c === '\t') {
          text += c === '\n' ? '\\n' : c === '\r' ? '\\r' : '\\t'
          if (!escapedNewlineReported) {
            escapedNewlineReported = true
            addFix('Escaped raw line break / tab inside string', i)
          }
        } else text += c
        i++
      }
      text += '"'
      if (!terminated) addFix('Closed unterminated string', start)

      if (isKeyPosition()) beforeKey(start)
      else beforeValue(start)
      out += text
      continue
    }

    NUMBER_PATTERN.lastIndex = i
    const numberMatch = /[-+.\d]/.test(ch) ? NUMBER_PATTERN.exec(input) : null
    if (numberMatch) {
      const raw = numberMatch[0]
      const start = i
      i += raw.length
      if (isKeyPosition()) {
        beforeKey(start)
        out += JSON.stringify(raw)
        addFix(`Added double quotes around numeric key ${raw}`, start)
        continue
      }
      beforeValue(start)
      if (VALID_JSON_NUMBER.test(raw)) {
        out += raw
      } else {
        out += String(Number(raw))
        addFix(`Normalized invalid number "${raw}"`, start)
      }
      continue
    }

    IDENTIFIER_PATTERN.lastIndex = i
    const identMatch = IDENTIFIER_PATTERN.exec(input)
    if (identMatch) {
      const word = identMatch[0]
      const start = i
      i += word.length
      if (isKeyPosition()) {
        beforeKey(start)
        out += JSON.stringify(word)
        addFix(`Added double quotes around key "${word}"`, start)
        continue
      }
      beforeValue(start)
      if (word === 'true' || word === 'false' || word === 'null') {
        out += word
      } else if (word === 'True' || word === 'False' || word === 'TRUE' || word === 'FALSE') {
        out += word.toLowerCase()
        addFix(`Converted ${word} to ${word.toLowerCase()}`, start)
      } else if (['None', 'undefined', 'NaN', 'Infinity', 'NULL', 'Null', 'nil'].includes(word)) {
        out += 'null'
        addFix(`Replaced ${word} with null`, start)
      } else {
        out += JSON.stringify(word)
        addFix(`Wrapped unquoted value "${word}" in double quotes`, start)
      }
      continue
    }

    addFix(`Removed unexpected character "${ch}"`, i)
    i++
  }

  while (stack.length) {
    closeFrame(stack.pop()!, n, 'missing')
  }

  return { output: out, fixes }
}

function locateParseError(input: string, message: string) {
  const position = message.match(/position (\d+)/)
  if (position) return createLocator(input)(Number(position[1]))
  const lineCol = message.match(/line (\d+) column (\d+)/)
  if (lineCol) return { line: Number(lineCol[1]), column: Number(lineCol[2]) }
  return undefined
}

export function analyzeJson(input: string): AnalysisResult {
  if (!input.trim()) return { status: 'empty' }

  try {
    return { status: 'valid', value: JSON.parse(input) }
  } catch (originalError) {
    const message = originalError instanceof Error ? originalError.message : 'Invalid JSON'
    const { output, fixes } = repairJson(input)
    if (fixes.length > 0) {
      try {
        return { status: 'repaired', value: JSON.parse(output), fixes }
      } catch {
        // fall through to report the original parse error
      }
    }
    const location = locateParseError(input, message)
    return {
      status: 'invalid',
      error: message.replace(/\s*\(line \d+ column \d+\)/, ''),
      ...location,
    }
  }
}

export const SAMPLE_BROKEN_JSON = `{
  "name": "JSON Error Detective",
  'version': '1.0.0',
  features: ["repair", "format", "download",],
  "settings": {
    "strict": False,
    "indent": 2,
  },
  // TODO: remove before shipping
  "maintainer": None
}`
