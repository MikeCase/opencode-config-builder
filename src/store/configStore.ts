import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Log Level ──────────────────────────────────────────────
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

// ─── References ─────────────────────────────────────────────
export type ReferenceGit = {
  repository: string
  branch?: string
  description?: string
  hidden?: boolean
}

export type ReferenceLocal = {
  path: string
  description?: string
  hidden?: boolean
}

export type ReferenceConfig = string | ReferenceGit | ReferenceLocal

// ─── Skills ─────────────────────────────────────────────────
export type SkillConfig = {
  paths?: string[]
  urls?: string[]
}

// ─── MCP ────────────────────────────────────────────────────
export type MCPEnabledConfig = {
  enabled: boolean
}

export type MCPServerConfig = {
  type?: 'local' | 'remote'
  command?: string[]
  url?: string
  cwd?: string
  enabled?: boolean
  headers?: Record<string, string>
  environment?: Record<string, string>
  timeout?: number
  oauth?: object | false
}

// ─── Permissions ────────────────────────────────────────────
export type PermissionAction = 'ask' | 'allow' | 'deny'

export type PermissionRule = PermissionAction | Record<string, PermissionAction>

export type PermissionConfig = PermissionAction | Record<string, PermissionRule>

// ─── Agent ──────────────────────────────────────────────────
export type AgentConfig = {
  description?: string
  mode?: 'subagent' | 'primary' | 'all'
  model?: string
  variant?: string
  prompt?: string
  temperature?: number
  top_p?: number
  steps?: number
  maxSteps?: number
  disable?: boolean
  hidden?: boolean
  color?: string
  tools?: Record<string, boolean>
  permission?: PermissionConfig
  options?: Record<string, any>
  [key: string]: any
}

// ─── Commands ───────────────────────────────────────────────
export type CommandConfig = {
  template?: string
  description?: string
  agent?: string
  model?: string
  variant?: string
  subtask?: boolean
}

// ─── Formatters ─────────────────────────────────────────────
export type FormatterConfig = {
  disabled?: boolean
  command?: string[]
  environment?: Record<string, string>
  extensions?: string[]
}

// ─── LSP ────────────────────────────────────────────────────
export type LspServerConfig = {
  disabled?: boolean
  command?: string[]
  extensions?: string[]
  env?: Record<string, string>
  initialization?: Record<string, any>
}

export type LspConfig = boolean | Record<string, LspServerConfig>

// ─── Compaction ─────────────────────────────────────────────
export type CompactionConfig = {
  auto?: boolean
  prune?: boolean
  tail_turns?: number
  preserve_recent_tokens?: number
  reserved?: number
}

// ─── Tool Output ────────────────────────────────────────────
export type ToolOutputConfig = {
  max_lines?: number
  max_bytes?: number
}

// ─── Image / Attachment ─────────────────────────────────────
export type ImageAttachmentConfig = {
  auto_resize?: boolean
  max_width?: number
  max_height?: number
  max_base64_bytes?: number
}

export type AttachmentConfig = {
  image?: ImageAttachmentConfig
}

// ─── Enterprise ─────────────────────────────────────────────
export type EnterpriseConfig = {
  url: string
}

// ─── Experimental ───────────────────────────────────────────
export type Policy = {
  action: 'provider.use'
  effect: 'allow' | 'deny'
  resource: string
}

export type ExperimentalConfig = {
  disable_paste_summary?: boolean
  batch_tool?: boolean
  openTelemetry?: boolean
  primary_tools?: string[]
  continue_loop_on_deny?: boolean
  mcp_timeout?: number
  policies?: Policy[]
}

// ─── Server ─────────────────────────────────────────────────
export type ServerConfig = {
  port?: number
  hostname?: string
  mdns?: boolean
  mdnsDomain?: string
  cors?: string[]
}

// ─── Main Config ────────────────────────────────────────────
export type OpenCodeConfig = {
  $schema?: string
  logLevel?: LogLevel
  shell?: string
  username?: string
  model?: string
  small_model?: string
  default_agent?: string
  autoupdate?: boolean | 'notify'
  snapshot?: boolean
  share?: 'manual' | 'auto' | 'disabled'
  server?: ServerConfig
  tools?: Record<string, boolean>
  provider?: Record<string, any>
  agent?: Record<string, AgentConfig>
  command?: Record<string, CommandConfig>
  formatter?: boolean | Record<string, FormatterConfig>
  lsp?: LspConfig
  permission?: PermissionConfig
  mcp?: Record<string, MCPServerConfig | MCPEnabledConfig>
  compaction?: CompactionConfig
  watcher?: {
    ignore?: string[]
  }
  attachment?: AttachmentConfig
  tool_output?: ToolOutputConfig
  enterprise?: EnterpriseConfig
  skills?: SkillConfig
  references?: Record<string, ReferenceConfig>
  plugin?: string[]
  instructions?: string[]
  disabled_providers?: string[]
  enabled_providers?: string[]
  experimental?: ExperimentalConfig
}

// ─── Store ──────────────────────────────────────────────────
type Store = {
  config: OpenCodeConfig
  setConfig: (c: OpenCodeConfig) => void
  update: (path: string, value: any) => void
  reset: () => void
}

const mergePath = (cfg: any, path: string, value: any) => {
  const parts = path.split('.')
  let cur = cfg
  for (let i = 0; i < parts.length - 1; i++){
    const p = parts[i]
    if (!(p in cur) || typeof cur[p] !== 'object') cur[p] = {}
    cur = cur[p]
  }
  cur[parts[parts.length-1]] = value
}

const defaultConfig: OpenCodeConfig = {
  $schema: 'https://opencode.ai/config.json',
  server: {
    port: 4096,
    mdns: true,
    mdnsDomain: 'opencode.local',
    cors: []
  },
  tools: {
    bash: true,
    edit: true,
    write: true,
    read: true,
    grep: true,
    glob: true,
  },
  permission: {
    '*': 'allow'
  },
  mcp: {},
  agent: {},
  command: {},
  formatter: {},
}

export const useConfigStore = create<Store>()(
  persist(
    (set) => ({
      config: {
        $schema: 'https://opencode.ai/config.json',
        server: {
          port: 4096,
          mdns: true,
          mdnsDomain: 'opencode.local',
          cors: []
        },
        tools: {
          bash: true,
          edit: true,
          write: true,
          read: true,
          grep: true,
          glob: true,
        },
        permission: {
          '*': 'allow'
        },
        mcp: {},
        agent: {},
        command: {},
        formatter: {},
      },
      setConfig: (c) => {
        set({ config: c })
      },
      update: (path, value) => {
        set((s)=>{ const next = JSON.parse(JSON.stringify(s.config)); mergePath(next, path, value); return { config: next } })
      },
      reset: () => set({ config: JSON.parse(JSON.stringify(defaultConfig)) }),
    }),
    { name: 'opencode-config' }
  )
)
