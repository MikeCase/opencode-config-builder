'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import ArrayField from '../../components/ui/ArrayField'
import { Plus, Trash2, ChevronDown, ChevronRight, Code } from 'lucide-react'
import { useConfigStore, FormatterConfig } from '../../store/configStore'

function FormatterCard({ name, formatter, onUpdate, onDelete }: {
  name: string
  formatter: FormatterConfig
  onUpdate: (name: string, formatter: FormatterConfig) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="expandable-card">
      <div className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-card-header-left">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="expandable-card-header-title">{name}</span>
          {formatter.disabled && (
            <span className="expandable-card-header-badge expandable-card-header-badge-warning">
              disabled
            </span>
          )}
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
          <Input
            label="Command"
            value={(formatter.command as string[])?.join(' ') ?? ''}
            onChange={(v) => onUpdate(name, { ...formatter, command: v.split(' ').filter(Boolean) })}
            placeholder="npx prettier --write"
            description="Command and arguments to run the formatter"
          />

          <ArrayField
            label="File Extensions"
            values={formatter.extensions ?? []}
            onChange={(v) => onUpdate(name, { ...formatter, extensions: v })}
            placeholder=".js"
          />

          <Toggle
            label="Disabled"
            description="Temporarily disable this formatter"
            checked={formatter.disabled ?? false}
            onChange={(v) => onUpdate(name, { ...formatter, disabled: v })}
          />
        </div>
      )}
    </div>
  )
}

export default function FormattersPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const formatters: Record<string, any> = typeof config?.formatter === 'object' && config?.formatter !== null ? config?.formatter : {}

  const addFormatter = () => {
    const name = `formatter-${Object.keys(formatters).length + 1}`
    update('formatter', { ...formatters, [name]: { command: [], extensions: [] } } as any)
  }

  const updateFormatter = (name: string, formatter: FormatterConfig) => {
    update('formatter', { ...formatters, [name]: formatter } as any)
  }

  const deleteFormatter = (name: string) => {
    const next = { ...formatters }
    delete next[name]
    update('formatter', next as any)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Formatters</h1>
        <p className="page-description">Configure code formatters for automatic code styling.</p>
      </div>

      <Card title="Code Formatters" docUrl="https://opencode.ai/docs/config/#formatters">
        <p className="card-description">
          Configure code formatters that can be used to format code during sessions.
        </p>

        {Object.keys(formatters).length === 0 ? (
          <div className="empty-state-inline">
            <div className="empty-state-icon-wrap"><Code size={24} /></div>
            No formatters configured. Add one to get started.
          </div>
        ) : (
          Object.entries(formatters).map(([name, formatter]) => (
            <FormatterCard
              key={name}
              name={name}
              formatter={formatter}
              onUpdate={updateFormatter}
              onDelete={() => deleteFormatter(name)}
            />
          ))
        )}

        <button onClick={addFormatter} className="add-item-btn">
          <Plus size={16} />
          Add Formatter
        </button>
      </Card>

      <Card title="LSP Servers" docUrl="https://opencode.ai/docs/config/#lsp">
        <p className="card-description">
          Configure Language Server Protocol servers for code intelligence.
        </p>
        <Toggle
          label="Enable Built-in LSP"
          description="Enable or disable all built-in LSP servers"
          checked={config?.lsp === true || typeof config?.lsp === 'object'}
          onChange={(v) => {
            if (v && config?.lsp === false) update('lsp', true)
            else if (!v) update('lsp', false)
          }}
        />
        {typeof config?.lsp === 'object' && config?.lsp !== null && Object.keys(config.lsp).length > 0
          ? Object.entries(config.lsp).map(([name, lspServer]: [string, any]) => (
              <div key={name} className="expandable-card">
                <div className="expandable-card-header" onClick={(e) => { const el = e.currentTarget.parentElement?.querySelector('.expandable-card-body'); if (el) el.classList.toggle('hidden') }}>
                  <div className="expandable-card-header-left">
                    <span className="expandable-card-header-title">{name}</span>
                    {lspServer.disabled && <span className="expandable-card-header-badge expandable-card-header-badge-warning">disabled</span>}
                  </div>
                </div>
                <div className="expandable-card-body" style={{ display: 'block' }}>
                  <Input
                    label="Command"
                    value={lspServer.command?.join(' ') ?? ''}
                    onChange={(v) => update('lsp', { ...(typeof config?.lsp === 'object' && config?.lsp ? config?.lsp : {}), [name]: { ...lspServer, command: v.split(' ').filter(Boolean) } } as any)}
                    placeholder="typescript-language-server --stdio"
                    description="Command and arguments to start the LSP server"
                  />
                  <ArrayField
                    label="File Extensions"
                    values={lspServer.extensions ?? []}
                    onChange={(v) => update('lsp', { ...(typeof config?.lsp === 'object' && config?.lsp ? config?.lsp : {}), [name]: { ...lspServer, extensions: v } } as any)}
                    placeholder=".ts,.tsx"
                  />
                  <Toggle
                    label="Disabled"
                    checked={lspServer.disabled ?? false}
                    onChange={(v) => update('lsp', { ...(typeof config?.lsp === 'object' && config?.lsp ? config?.lsp : {}), [name]: { ...lspServer, disabled: v } } as any)}
                  />
                </div>
              </div>
            ))
          : (
            <div className="empty-state-inline">
              <div className="empty-state-icon-wrap"><Code size={24} /></div>
              No custom LSP servers configured.
            </div>
          )}
        <button onClick={() => {
          const name = `lsp-${Object.keys((typeof config?.lsp === 'object' && config?.lsp) || {}).length + 1}`
          update('lsp', { ...(typeof config?.lsp === 'object' ? config?.lsp : {}), [name]: { command: [] } } as any)
        }} className="add-item-btn">
          <Plus size={16} /> Add LSP Server
        </button>
      </Card>
    </div>
  )
}