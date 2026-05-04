export const schemaUrl = "$schema: https://opencode.example/schema.json" // placeholder

export type OpenCodeFullSchema = {
  $schema?: string
  model?: string
  provider?: string
  small_model?: string
  autoupdate?: boolean
  snapshot?: boolean
  share?: boolean
  server?: {
    port?: number
    hostname?: string
    mdns?: boolean
    mdnsDomain?: string
    cors?: boolean
  }
  shell?: any
  tools?: any
  agent?: any
  default_agent?: string
  command?: any
  formatter?: any
  permission?: any
  compaction?: any
  watcher?: any
  mcp?: any
  plugin?: any
  instructions?: string
  disabled_providers?: string[]
  enabled_providers?: string[]
  experimental?: boolean
}

export function isValidConfig(cfg: any): cfg is OpenCodeFullSchema {
  // Minimal validation: ensure top-level is an object
  return cfg && typeof cfg === 'object'
}
