'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useConfigStore, AgentConfig } from '../../store/configStore'

function AgentCard({ name, agent, onUpdate, onDelete }: {
  name: string
  agent: AgentConfig
  onUpdate: (name: string, agent: AgentConfig) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="expandable-card">
      <div className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-card-header-left">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="expandable-card-header-title">{name}</span>
          <span className="expandable-card-header-subtitle">
            {agent.mode === 'primary' ? 'Primary Agent' : 'Subagent'}
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
          <Input
            label="Description"
            value={agent.description ?? ''}
            onChange={(v) => onUpdate(name, { ...agent, description: v })}
            placeholder="What this agent does"
          />
          <div className="field-row">
            <Input
              label="Model"
              value={agent.model ?? ''}
              onChange={(v) => onUpdate(name, { ...agent, model: v })}
              placeholder="anthropic/claude-sonnet-4-5"
            />
            <Select
              label="Mode"
              value={agent.mode ?? 'subagent'}
              onChange={(v) => onUpdate(name, { ...agent, mode: v as any })}
              options={[
                { value: 'primary', label: 'Primary' },
                { value: 'subagent', label: 'Subagent' },
                { value: 'all', label: 'All' },
              ]}
            />
          </div>
          <Input
            label="Temperature"
            value={agent.temperature ?? 0}
            onChange={(v) => onUpdate(name, { ...agent, temperature: parseFloat(v) || 0 })}
            type="number"
            description="Response randomness (0.0 - 1.0)"
          />
          <Input
            label="Max Steps"
            value={agent.steps ?? ''}
            onChange={(v) => onUpdate(name, { ...agent, steps: v ? parseInt(v) : undefined })}
            type="number"
            description="Maximum iterations before stopping"
          />
          <Toggle
            label="Hidden"
            description="Hide from @ autocomplete menu"
            checked={agent.hidden ?? false}
            onChange={(v) => onUpdate(name, { ...agent, hidden: v })}
          />
          <Input
            label="Color"
            value={agent.color ?? ''}
            onChange={(v) => onUpdate(name, { ...agent, color: v })}
            placeholder="#ff6b6b or accent"
            description="UI accent color for this agent"
          />
          <div className="field-row">
            <Input
              label="Top P"
              value={agent.top_p ?? ''}
              onChange={(v) => onUpdate(name, { ...agent, top_p: parseFloat(v) || undefined })}
              type="number"
              placeholder="0.9"
              description="Nucleus sampling (0.0 - 1.0)"
            />
          </div>
          <Input
            label="Prompt"
            value={typeof agent.prompt === 'string' ? agent.prompt : ''}
            onChange={(v) => onUpdate(name, { ...agent, prompt: v })}
            placeholder="{file:./prompts/build.txt}"
            description="System prompt or file reference"
            mono
          />
        </div>
      )}
    </div>
  )
}

export default function AgentsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const agents = config?.agent ?? {}

  const addAgent = () => {
    const name = `agent-${Object.keys(agents).length + 1}`
    update('agent', { ...agents, [name]: { description: '', mode: 'subagent' } })
  }

  const updateAgent = (name: string, agent: AgentConfig) => {
    update('agent', { ...agents, [name]: agent })
  }

  const deleteAgent = (name: string) => {
    const next = { ...agents }
    delete next[name]
    update('agent', next)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Agents</h1>
        <p className="page-description">Configure specialized agents for specific tasks.</p>
      </div>

      <Card title="Custom Agents">
        {Object.keys(agents).length === 0 ? (
          <div className="empty-state-inline">
            No custom agents configured. Add one to get started.
          </div>
        ) : (
          Object.entries(agents).map(([name, agent]) => (
            <AgentCard
              key={name}
              name={name}
              agent={agent}
              onUpdate={updateAgent}
              onDelete={() => deleteAgent(name)}
            />
          ))
        )}
        <button onClick={addAgent} className="add-item-btn">
          <Plus size={16} />
          Add Agent
        </button>
      </Card>

      <Card title="Default Agent">
        <Input
          label="Default Agent"
          value={config?.default_agent ?? ''}
          onChange={(v) => update('default_agent', v)}
          placeholder="build, plan..."
          description="The default agent to use when starting OpenCode"
        />
      </Card>
    </div>
  )
}