export function generateJsonc(
  cfg: any,
  excludeKeys: string[] = []
): { html: string; plain: string } {
  const filtered = Object.fromEntries(
    Object.entries(cfg).filter(([k]) => !excludeKeys.includes(k))
  )
  const plain = JSON.stringify(filtered, null, 2)
  const html = highlightJson(plain)
  return { html, plain }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightJson(json: string): string {
  let result = ''
  let i = 0
  const len = json.length

  while (i < len) {
    const ch = json[i]

    // Preserve whitespace as-is
    if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      result += ch
      i++
      continue
    }

    // Strings — keys or values
    if (ch === '"') {
      i++
      let content = ''
      while (i < len) {
        if (json[i] === '\\') {
          content += json[i] + (json[i + 1] ?? '')
          i += 2
          continue
        }
        if (json[i] === '"') {
          i++
          break
        }
        content += json[i]
        i++
      }

      // Check if this string is a key (followed by colon with optional whitespace)
      let j = i
      while (j < len && json[j] === ' ') j++
      const isKey = json[j] === ':'

      const escaped = escapeHtml(`"${content}"`)
      if (isKey) {
        result += `<span class="key">${escaped}</span>`
      } else {
        result += `<span class="string">${escaped}</span>`
      }
      continue
    }

    // Numbers (including negatives and scientific notation)
    if ((ch >= '0' && ch <= '9') || ch === '-') {
      let num = ch
      i++
      while (
        i < len &&
        ((json[i] >= '0' && json[i] <= '9') ||
          json[i] === '.' ||
          json[i] === 'e' ||
          json[i] === 'E' ||
          json[i] === '+' ||
          json[i] === '-')
      ) {
        num += json[i]
        i++
      }
      result += `<span class="number">${escapeHtml(num)}</span>`
      continue
    }

    // Boolean: true
    if (json.slice(i, i + 4) === 'true' && !isAlphanumeric(json[i + 4])) {
      result += '<span class="boolean">true</span>'
      i += 4
      continue
    }

    // Boolean: false
    if (json.slice(i, i + 5) === 'false' && !isAlphanumeric(json[i + 5])) {
      result += '<span class="boolean">false</span>'
      i += 5
      continue
    }

    // Null
    if (json.slice(i, i + 4) === 'null' && !isAlphanumeric(json[i + 4])) {
      result += '<span class="keyword">null</span>'
      i += 4
      continue
    }

    // Punctuation (colons, commas, brackets, braces)
    result += escapeHtml(ch)
    i++
  }

  return result
}

function isAlphanumeric(ch: string | undefined): boolean {
  if (!ch) return false
  return /[a-zA-Z0-9_]/.test(ch)
}
