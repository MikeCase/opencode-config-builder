'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { Plus, Trash2, ChevronDown, ChevronRight, Terminal } from 'lucide-react'
import { useConfigStore, CommandConfig } from '../../store/configStore'

function CommandCard({ name, command, onUpdate, onDelete }: {
  name: string
  command: CommandConfig
  onUpdate: (name: string, command: CommandConfig) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="expandable-card">
      <div className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-card-header-left">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="expandable-card-header-title">/{name}</span>
          {command.description && (
            <span className="expandable-card-header-subtitle">
              — {command.description}
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
            label="Description"
            value={command.description ?? ''}
            onChange={(v) => onUpdate(name, { ...command, description: v })}
            placeholder="What this command does"
          />

          <Input
            label="Template"
            value={command.template ?? ''}
            onChange={(v) => onUpdate(name, { ...command, template: v })}
            placeholder="Run tests with coverage..."
            description="The prompt template for this command. Use $ARGUMENTS for parameters."
            mono
          />

          <div className="field-row">
            <Select
              label="Agent"
              value={command.agent ?? 'build'}
              onChange={(v) => onUpdate(name, { ...command, agent: v })}
              options={[
                { value: 'build', label: 'Build - Full development' },
                { value: 'plan', label: 'Plan - Analysis only' },
                { value: 'general', label: 'General - Multi-step tasks' },
              ]}
            />
            <Input
              label="Model"
              value={command.model ?? ''}
              onChange={(v) => onUpdate(name, { ...command, model: v })}
              placeholder="anthropic/claude-haiku-4-5"
              description="Override default model"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function CommandsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const commands = config?.command ?? {}

  const addCommand = () => {
    const name = `cmd-${Object.keys(commands).length + 1}`
    update('command', { ...commands, [name]: { template: '', description: '', agent: 'build' } })
  }

  const updateCommand = (name: string, command: CommandConfig) => {
    update('command', { ...commands, [name]: command })
  }

  const deleteCommand = (name: string) => {
    const next = { ...commands }
    delete next[name]
    update('command', next)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Commands</h1>
        <p className="page-description">Create custom commands for repetitive tasks.</p>
      </div>

      <Card title="Custom Commands" docUrl="https://opencode.ai/docs/config/#commands">
        <p className="card-description">
          Define custom commands that can be invoked with <code className="code-inline">/command-name</code> in the chat.
        </p>

        {Object.keys(commands).length === 0 ? (
          <div className="empty-state-inline">
            <div className="empty-state-icon-wrap"><Terminal size={24} /></div>
            No custom commands configured. Add one to get started.
          </div>
        ) : (
          Object.entries(commands).map(([name, command]) => (
            <CommandCard
              key={name}
              name={name}
              command={command}
              onUpdate={updateCommand}
              onDelete={() => deleteCommand(name)}
            />
          ))
        )}

        <button onClick={addCommand} className="add-item-btn">
          <Plus size={16} />
          Add Command
        </button>
      </Card>
    </div>
  )
}