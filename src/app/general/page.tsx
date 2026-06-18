'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import { useConfigStore } from '../../store/configStore'

export default function GeneralPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">General</h1>
        <p className="page-description">Configure your OpenCode provider, model, and general settings.</p>
      </div>

      <Card title="Model & Provider" docUrl="https://opencode.ai/docs/config/#models">
        <Input
          label="$schema"
          value={config?.$schema ?? 'https://opencode.ai/config.json'}
          onChange={(v) => update('$schema', v)}
          mono
          description="JSON Schema for validation"
        />
        <div className="field-row">
          <Input
            label="Model"
            value={config?.model ?? ''}
            onChange={(v) => update('model', v)}
            placeholder="anthropic/claude-sonnet-4-5"
            description="The main model to use"
          />
          <Input
            label="Small Model"
            value={config?.small_model ?? ''}
            onChange={(v) => update('small_model', v)}
            placeholder="anthropic/claude-haiku-4-5"
            description="Fallback model for lightweight tasks"
          />
        </div>
      </Card>

      <Card title="General Settings" docUrl="https://opencode.ai/docs/config/">
        <Select
          label="Autoupdate"
          value={config?.autoupdate === true ? 'true' : config?.autoupdate === 'notify' ? 'notify' : 'false'}
          onChange={(v) => update('autoupdate', v === 'true' ? true : v === 'notify' ? 'notify' : false)}
          options={[
            { value: 'true', label: 'Enabled - Automatically download updates' },
            { value: 'notify', label: 'Notify - Show when updates are available' },
            { value: 'false', label: 'Disabled - No update checks' },
          ]}
        />
        <Toggle
          label="Snapshot"
          description="Track file changes for config state rollback"
          checked={config?.snapshot ?? true}
          onChange={(v) => update('snapshot', v)}
        />
        <Select
          label="Share"
          value={config?.share ?? 'manual'}
          onChange={(v) => update('share', v)}
          options={[
            { value: 'manual', label: 'Manual - Only share when you choose' },
            { value: 'auto', label: 'Auto - Automatically share conversations' },
            { value: 'disabled', label: 'Disabled - Sharing is turned off' },
          ]}
        />
      </Card>

      <Card title="Shell" docUrl="https://opencode.ai/docs/config/#shell">
        <Input
          label="Shell"
          value={config?.shell ?? ''}
          onChange={(v) => update('shell', v)}
          placeholder="pwsh, bash, zsh..."
          description="Specify the shell to use for interactive terminal (default: auto-detect)"
        />
      </Card>
    </div>
  )
}