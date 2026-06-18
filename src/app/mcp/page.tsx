'use client'

import React, { useState, useRef, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import ArrayField from '../../components/ui/ArrayField'
import { Plus, Trash2, ChevronDown, ChevronRight, HardDrive } from 'lucide-react'
import { useConfigStore, MCPServerConfig } from '../../store/configStore'

function objToStrings(obj: Record<string, string> | undefined, sep: string): string[] {
  return Object.entries(obj ?? {}).map(([k, v]) => `${k}${sep}${v}`)
}

function stringsToObj(entries: string[], sep: string): Record<string, string> {
  const out: Record<string, string> = {}
  entries.forEach((entry) => {
    const idx = entry.indexOf(sep)
    if (idx > 0) out[entry.slice(0, idx)] = entry.slice(idx + 1)
  })
  return out
}

function MCPServerCard({ name, server, onUpdate, onDelete }: {
  name: string
  server: MCPServerConfig
  onUpdate: (name: string, server: MCPServerConfig) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [envStrings, setEnvStrings] = useState<string[]>(() => objToStrings(server.environment, '='))
  const [hdrStrings, setHdrStrings] = useState<string[]>(() => objToStrings(server.headers, ': '))
  const prevType = useRef(server.type)
  // Reset local string buffers when switching between local/remote
  useEffect(() => {
    if (prevType.current !== server.type) {
      setEnvStrings(objToStrings(server.environment, '='))
      setHdrStrings(objToStrings(server.headers, ': '))
      prevType.current = server.type
    }
  }, [server.type])

  return (
    <div className="expandable-card">
      <div className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-card-header-left">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="expandable-card-header-title">{name}</span>
          <span className={`expandable-card-header-badge ${server.type === 'local' ? 'expandable-card-header-badge-accent' : 'expandable-card-header-badge-success'}`}>
            {server.type || 'local'}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="expandable-card-delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {expanded && (
        <div className="expandable-card-body">
          <div className="field-row">
            <Input
              label="Name"
              value={name}
              onChange={(v) => onUpdate(v, server)}
              placeholder="my-mcp-server"
            />
            <Select
              label="Type"
              value={server.type ?? 'local'}
              onChange={(v) => onUpdate(name, { ...server, type: v as 'local' | 'remote' })}
              options={[
                { value: 'local', label: 'Local - Runs on your machine' },
                { value: 'remote', label: 'Remote - Connects via URL' },
              ]}
            />
          </div>

          {server.type === 'local' ? (
            <>
              <Input
                label="Command"
                value={(server.command as string[])?.join(' ') ?? ''}
                onChange={(v) => onUpdate(name, { ...server, command: v.split(' ').filter(Boolean) })}
                placeholder="npx -y @modelcontextprotocol/server-everything"
                description="Command and arguments to run the MCP server"
              />
              <Input
                label="Working Directory (cwd)"
                value={server.cwd ?? ''}
                onChange={(v) => onUpdate(name, { ...server, cwd: v })}
                placeholder="./mcp-server"
                description="Working directory for the MCP server process. Relative paths resolve from workspace."
              />
              <ArrayField
                label="Environment Variables"
                values={envStrings}
                onChange={(v) => {
                  setEnvStrings(v)
                  const env = stringsToObj(v, '=')
                  if (Object.keys(env).length > 0) {
                    onUpdate(name, { ...server, environment: env })
                  } else if (v.length === 0) {
                    onUpdate(name, { ...server, environment: undefined })
                  }
                }}
                placeholder="KEY=VALUE"
              />
            </>
          ) : (
            <>
              <Input
                label="URL"
                value={server.url ?? ''}
                onChange={(v) => onUpdate(name, { ...server, url: v })}
                placeholder="https://mcp.example.com/mcp"
                description="URL of the remote MCP server"
              />
              <ArrayField
                label="Headers"
                values={hdrStrings}
                onChange={(v) => {
                  setHdrStrings(v)
                  const hdrs = stringsToObj(v, ': ')
                  if (Object.keys(hdrs).length > 0) {
                    onUpdate(name, { ...server, headers: hdrs })
                  } else if (v.length === 0) {
                    onUpdate(name, { ...server, headers: undefined })
                  }
                }}
                placeholder="Authorization: Bearer MY_KEY"
              />
              <Toggle
                label="OAuth Enabled"
                description="Enable OAuth authentication for this server"
                checked={server.oauth !== false && server.oauth !== undefined}
                onChange={(v) => onUpdate(name, { ...server, oauth: v ? {} : false })}
              />
            </>
          )}

          <Toggle
            label="Enabled"
            description="Start this server on app launch"
            checked={server.enabled ?? true}
            onChange={(v) => onUpdate(name, { ...server, enabled: v })}
          />

          <Input
            label="Timeout (ms)"
            value={server.timeout ?? 5000}
            onChange={(v) => onUpdate(name, { ...server, timeout: parseInt(v) || 5000 })}
            type="number"
            description="Request timeout in milliseconds (default: 5000)"
          />
        </div>
      )}
    </div>
  )
}

export default function MCPPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const mcpServers = config?.mcp ?? {}

  const addServer = () => {
    const name = `server-${Object.keys(mcpServers).length + 1}`
    update('mcp', { ...mcpServers, [name]: { type: 'local', command: [], enabled: true } })
  }

  const updateServer = (name: string, server: MCPServerConfig) => {
    const next = { ...mcpServers }
    if (next[name] !== server) {
      next[name] = server
      update('mcp', next)
    }
  }

  const deleteServer = (name: string) => {
    const next = { ...mcpServers }
    delete next[name]
    update('mcp', next)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">MCP Servers</h1>
        <p className="page-description">Add Model Context Protocol servers for external tools and integrations.</p>
      </div>

      <Card title="MCP Configurations" docUrl="https://opencode.ai/docs/mcp-servers/">
        <p className="card-description">
          MCP servers add external tools to OpenCode. Once added, they're available as tools in your prompts.
        </p>

        {Object.keys(mcpServers).length === 0 ? (
          <div className="empty-state-inline">
            <div className="empty-state-icon-wrap"><HardDrive size={24} /></div>
            No MCP servers configured. Add one to get started.
          </div>
        ) : (
          Object.entries(mcpServers).map(([name, server]) => (
            <MCPServerCard
              key={name}
              name={name}
              server={server}
              onUpdate={updateServer}
              onDelete={() => deleteServer(name)}
            />
          ))
        )}

        <button onClick={addServer} className="add-item-btn">
          <Plus size={16} />
          Add MCP Server
        </button>
      </Card>
    </div>
  )
}