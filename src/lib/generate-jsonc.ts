export function generateJsonc(cfg: any, excludeKeys: string[] = []): string {
  const filtered = Object.fromEntries(
    Object.entries(cfg).filter(([k]) => !excludeKeys.includes(k))
  )
  return JSON.stringify(filtered, null, 2)
}
