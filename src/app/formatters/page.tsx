'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import ArrayField from '../../components/ui/ArrayField'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
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

  const formatters = config?.formatter ?? {}

  const addFormatter = () => {
    const name = `formatter-${Object.keys(formatters).length + 1}`
    update('formatter', { ...formatters, [name]: { command: [], extensions: [] } })
  }

  const updateFormatter = (name: string, formatter: FormatterConfig) => {
    update('formatter', { ...formatters, [name]: formatter })
  }

  const deleteFormatter = (name: string) => {
    const next = { ...formatters }
    delete next[name]
    update('formatter', next)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Formatters</h1>
        <p className="page-description">Configure code formatters for automatic code styling.</p>
      </div>

      <Card title="Code Formatters">
        <p className="card-description">
          Configure code formatters that can be used to format code during sessions.
        </p>

        {Object.keys(formatters).length === 0 ? (
          <div className="empty-state-inline">
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
    </div>
  )
}