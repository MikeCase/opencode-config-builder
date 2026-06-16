'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import ArrayField from '../../components/ui/ArrayField'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useConfigStore } from '../../store/configStore'

const PERMISSION_OPTIONS = [
  { value: 'allow', label: 'Allow - Run without approval' },
  { value: 'ask', label: 'Ask - Prompt for approval' },
  { value: 'deny', label: 'Deny - Block the action' },
]

const TOOL_PERMISSIONS = [
  'read', 'edit', 'glob', 'grep', 'list', 'bash',
  'task', 'external_directory', 'todowrite', 'webfetch',
  'websearch', 'lsp', 'skill', 'question', 'doom_loop'
]

interface PermissionRule {
  pattern: string
  action: string
}

function PermissionCard({ title, rules, onUpdate }: {
  title: string
  rules: PermissionRule[]
  onUpdate: (rules: PermissionRule[]) => void
}) {
  const [expanded, setExpanded] = useState(true)

  const updateRule = (idx: number, field: 'pattern' | 'action', value: string) => {
    const next = [...rules]
    next[idx] = { ...next[idx], [field]: value }
    onUpdate(next)
  }

  const addRule = () => {
    onUpdate([...rules, { pattern: '*', action: 'allow' }])
  }

  const removeRule = (idx: number) => {
    onUpdate(rules.filter((_, i) => i !== idx))
  }

  return (
    <div className="expandable-card">
      <div className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-card-header-left">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="expandable-card-header-title">{title}</span>
          <span className="expandable-card-header-subtitle">
            {rules.length} rule{rules.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="expandable-card-body">
          {rules.length === 0 ? (
            <p className="card-description" style={{ marginBottom: '12px' }}>
              No rules. The default action will be used.
            </p>
          ) : (
            rules.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label=""
                    value={rule.pattern}
                    onChange={(v) => updateRule(idx, 'pattern', v)}
                    placeholder="* or pattern"
                  />
                </div>
                <div style={{ width: '180px' }}>
                  <Select
                    label=""
                    value={rule.action}
                    onChange={(v) => updateRule(idx, 'action', v)}
                    options={PERMISSION_OPTIONS}
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeRule(idx)} style={{ marginTop: '18px' }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
          <Button variant="secondary" size="sm" onClick={addRule}>
            <Plus size={14} />
            Add Rule
          </Button>
        </div>
      )}
    </div>
  )
}

export default function PermissionsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const permission = config?.permission ?? {}

  const updatePermission = (tool: string, rules: PermissionRule[]) => {
    if (rules.length === 0) {
      const next = { ...permission }
      delete next[tool]
      update('permission', next)
    } else {
      const ruleObj: Record<string, string> = {}
      rules.forEach(r => { ruleObj[r.pattern] = r.action })
      update('permission', { ...permission, [tool]: ruleObj })
    }
  }

  const globalDefault = permission?.['*'] ?? 'allow'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Permissions</h1>
        <p className="page-description">Control which actions require approval to run.</p>
      </div>

      <Card title="Global Default" docUrl="https://opencode.ai/docs/permissions/">
        <Select
          label="Default Permission"
          value={globalDefault}
          onChange={(v) => update('permission', { ...permission, '*': v })}
          options={PERMISSION_OPTIONS}
          description="Applied to all tools that don't have specific rules"
        />
      </Card>

      <Card title="Tool Permissions" docUrl="https://opencode.ai/docs/permissions/">
        <p className="card-description">
          Configure granular permissions for each tool. Last matching rule wins.
        </p>

        {TOOL_PERMISSIONS.map((tool) => {
          const toolPerm = permission?.[tool]
          const rules: PermissionRule[] = toolPerm
            ? (typeof toolPerm === 'string'
                ? [{ pattern: '*', action: toolPerm }]
                : Object.entries(toolPerm).map(([pattern, action]) => ({ pattern, action: action as string })))
            : []

          return (
            <PermissionCard
              key={tool}
              title={tool.charAt(0).toUpperCase() + tool.slice(1).replace(/_/g, ' ')}
              rules={rules}
              onUpdate={(newRules) => updatePermission(tool, newRules)}
            />
          )
        })}
      </Card>

      <Card title="External Directories" docUrl="https://opencode.ai/docs/permissions/">
        <p className="card-description">
          Allow tool calls that touch paths outside your project working directory.
        </p>
        <ArrayField
          label="Allowed Directories"
          values={(permission?.external_directory && typeof permission.external_directory === 'object')
            ? Object.keys(permission.external_directory)
            : []
          }
          onChange={(dirs) => {
            const extDir: Record<string, string> = {}
            dirs.forEach(d => { extDir[d] = 'allow' })
            update('permission', { ...permission, external_directory: extDir })
          }}
          placeholder="~/projects/personal/**"
        />
      </Card>
    </div>
  )
}