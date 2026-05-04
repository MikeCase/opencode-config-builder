export function removeComments(input: string): string {
  return input
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
}

export function parseJsonc(text: string): any {
  const trimmed = text.trim().replace(/^\uFEFF/, '')
  try {
    return JSON.parse(trimmed)
  } catch {
    const stripped = removeComments(trimmed)
    try {
      return JSON.parse(stripped)
    } catch (e: any) {
      const fixed = stripped.replace(/,\s*([}\]])/g, '$1')
      try {
        return JSON.parse(fixed)
      } catch (e2: any) {
        return null
      }
    }
  }
}

export function validateConfig(cfg: any): boolean {
  return cfg && typeof cfg === 'object'
}