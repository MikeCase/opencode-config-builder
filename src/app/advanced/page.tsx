'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import ArrayField from '../../components/ui/ArrayField'
import { useConfigStore } from '../../store/configStore'

export default function AdvancedPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const compaction = config?.compaction ?? {}
  const watcher = config?.watcher ?? {}

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Advanced</h1>
        <p className="page-description">Fine-tune advanced settings for performance and behavior.</p>
      </div>

      <Card title="Context Compaction">
        <p className="card-description">
          Control how OpenCode manages long conversations by compacting context.
        </p>

        <Toggle
          label="Auto Compaction"
          description="Automatically compact when context is full"
          checked={compaction.auto ?? true}
          onChange={(v) => update('compaction', { ...compaction, auto: v })}
        />
        <Toggle
          label="Prune Tool Outputs"
          description="Remove old tool outputs to save tokens"
          checked={compaction.prune ?? false}
          onChange={(v) => update('compaction', { ...compaction, prune: v })}
        />
        <Input
          label="Reserved Tokens"
          value={compaction.reserved ?? 10000}
          onChange={(v) => update('compaction', { ...compaction, reserved: parseInt(v) || 10000 })}
          type="number"
          description="Token buffer to maintain during compaction"
        />
      </Card>

      <Card title="File Watcher">
        <p className="card-description">
          Configure which directories to ignore when watching for file changes.
        </p>

        <ArrayField
          label="Ignore Patterns"
          values={watcher.ignore ?? ['node_modules/**', 'dist/**', '.git/**']}
          onChange={(v) => update('watcher', { ...watcher, ignore: v })}
          placeholder="**/*.log"
        />
      </Card>

      <Card title="Plugins">
        <p className="card-description">
          Load plugins from npm or local files.
        </p>

        <ArrayField
          label="Plugin Packages"
          values={config?.plugin ?? []}
          onChange={(v) => update('plugin', v)}
          placeholder="opencode-helicone-session"
        />
      </Card>

      <Card title="Instructions">
        <p className="card-description">
          Include instruction files that provide context to the model.
        </p>

        <ArrayField
          label="Instruction Files"
          values={config?.instructions ?? []}
          onChange={(v) => update('instructions', v)}
          placeholder="./CONTRIBUTING.md"
        />
      </Card>

      <Card title="Provider Restrictions">
        <p className="card-description">
          Restrict which providers can be used.
        </p>

        <ArrayField
          label="Disabled Providers"
          values={config?.disabled_providers ?? []}
          onChange={(v) => update('disabled_providers', v)}
          placeholder="openai"
          description="These providers won't be loaded even if credentials are available"
        />

        <ArrayField
          label="Enabled Providers"
          values={config?.enabled_providers ?? []}
          onChange={(v) => update('enabled_providers', v)}
          placeholder="anthropic"
          description="Only these providers will be enabled (empty = all enabled)"
        />
      </Card>
    </div>
  )
}