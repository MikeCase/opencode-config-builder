import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export type AgentConfig = {
  description?: string
  mode?: 'primary' | 'subagent' | 'all'
  model?: string
  prompt?: string
  temperature?: number
  steps?: number
  disable?: boolean
  permission?: Record<string, any>
  hidden?: boolean
  tools?: Record<string, boolean>
  color?: string
  top_p?: number
  [key: string]: any
}

export type CommandConfig = {
  template?: string
  description?: string
  agent?: string
  model?: string
}

export type FormatterConfig = {
  disabled?: boolean
  command?: string[]
  environment?: Record<string, string>
  extensions?: string[]
}

export type OpenCodeConfig = {
  $schema?: string
  model?: string
  provider?: Record<string, any>
  small_model?: string
  autoupdate?: boolean | 'notify'
  snapshot?: boolean
  share?: 'manual' | 'auto' | 'disabled'
  server?: {
    port?: number
    hostname?: string
    mdns?: boolean
    mdnsDomain?: string
    cors?: string[]
  }
  shell?: string
  tools?: Record<string, boolean>
  agent?: Record<string, AgentConfig>
  default_agent?: string
  command?: Record<string, CommandConfig>
  formatter?: Record<string, FormatterConfig>
  permission?: Record<string, any>
  compaction?: {
    auto?: boolean
    prune?: boolean
    reserved?: number
  }
  watcher?: {
    ignore?: string[]
  }
  mcp?: Record<string, MCPServerConfig>
  plugin?: string[]
  instructions?: string[]
  disabled_providers?: string[]
  enabled_providers?: string[]
  experimental?: Record<string, any>
}

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

console.log('Store created, initial config:', JSON.stringify(defaultConfig).slice(0, 100))

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
        console.log('setConfig called with:', JSON.stringify(c).slice(0, 200))
        set({ config: c })
      },
      update: (path, value) => {
        console.log('update called:', path, value)
        set((s)=>{ const next = JSON.parse(JSON.stringify(s.config)); mergePath(next, path, value); return { config: next } })
      },
      reset: () => set({ config: JSON.parse(JSON.stringify(defaultConfig)) }),
    }),
    { name: 'opencode-config' }
  )
)
