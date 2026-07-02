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
        <Select
          label="Log Level"
          value={config?.logLevel ?? 'INFO'}
          onChange={(v) => update('logLevel', v)}
          options={[
            { value: 'DEBUG', label: 'Debug - Verbose logging' },
            { value: 'INFO', label: 'Info - Standard logging' },
            { value: 'WARN', label: 'Warn - Warnings and errors only' },
            { value: 'ERROR', label: 'Error - Errors only' },
          ]}
        />
        <Input
          label="Username"
          value={config?.username ?? ''}
          onChange={(v) => update('username', v)}
          placeholder="Your display name"
          description="Custom display name for conversations"
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

      <Card title="Enterprise" docUrl="https://opencode.ai/docs/config/#enterprise">
        <p className="card-description">Enterprise configuration for organizational deployments.</p>
        <Input
          label="Enterprise URL"
          value={config?.enterprise?.url ?? ''}
          onChange={(v) => update('enterprise', { url: v })}
          placeholder="https://enterprise.acme.com"
          description="Enterprise API endpoint URL"
        />
      </Card>
    </div>
  )
}