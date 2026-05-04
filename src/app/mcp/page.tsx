'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import ArrayField from '../../components/ui/ArrayField'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useConfigStore, MCPServerConfig } from '../../store/configStore'

function MCPServerCard({ name, server, onUpdate, onDelete }: {
  name: string
  server: MCPServerConfig
  onUpdate: (name: string, server: MCPServerConfig) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(true)

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
            <Input
              label="Command"
              value={(server.command as string[])?.join(' ') ?? ''}
              onChange={(v) => onUpdate(name, { ...server, command: v.split(' ').filter(Boolean) })}
              placeholder="npx -y @modelcontextprotocol/server-everything"
              description="Command and arguments to run the MCP server"
            />
          ) : (
            <Input
              label="URL"
              value={server.url ?? ''}
              onChange={(v) => onUpdate(name, { ...server, url: v })}
              placeholder="https://mcp.example.com/mcp"
              description="URL of the remote MCP server"
            />
          )}

          <Toggle
            label="Enabled"
            description="Start this server on app launch"
            checked={server.enabled ?? true}
            onChange={(v) => onUpdate(name, { ...server, enabled: v })}
          />

          {server.type === 'remote' && (
            <Input
              label="Timeout (ms)"
              value={server.timeout ?? 5000}
              onChange={(v) => onUpdate(name, { ...server, timeout: parseInt(v) || 5000 })}
              type="number"
              description="Request timeout in milliseconds"
            />
          )}
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

      <Card title="MCP Configurations">
        <p className="card-description">
          MCP servers add external tools to OpenCode. Once added, they're available as tools in your prompts.
        </p>

        {Object.keys(mcpServers).length === 0 ? (
          <div className="empty-state-inline">
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