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
  const toolOutput = config?.tool_output ?? {}
  const attachment = config?.attachment ?? {}
  const experimental = config?.experimental ?? {}
  const refEntries = Object.entries(config?.references ?? {}).map(([k, v]) => {
    const val = typeof v === 'string' ? v : (v as any)?.repository || (v as any)?.path || JSON.stringify(v)
    return `${k}=${val}`
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Advanced</h1>
        <p className="page-description">Fine-tune advanced settings for performance and behavior.</p>
      </div>

      <Card title="Context Compaction" docUrl="https://opencode.ai/docs/config/#compaction">
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
        <Input
          label="Tail Turns"
          value={compaction.tail_turns ?? ''}
          onChange={(v) => update('compaction', { ...compaction, tail_turns: v ? parseInt(v) : undefined })}
          type="number"
          description="Number of recent user turns to keep verbatim during compaction (default: 2)"
        />
        <Input
          label="Preserve Recent Tokens"
          value={compaction.preserve_recent_tokens ?? ''}
          onChange={(v) => update('compaction', { ...compaction, preserve_recent_tokens: v ? parseInt(v) : undefined })}
          type="number"
          description="Maximum tokens from recent turns to preserve verbatim after compaction"
        />
      </Card>

      <Card title="File Watcher" docUrl="https://opencode.ai/docs/config/#watcher">
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

      <Card title="Tool Output" docUrl="https://opencode.ai/docs/config/#tool-output">
        <p className="card-description">Control when tool output is truncated and saved to disk.</p>
        <Input
          label="Max Lines"
          type="number"
          value={toolOutput.max_lines ?? 2000}
          onChange={(v) => update('tool_output', { ...toolOutput, max_lines: parseInt(v) || 2000 })}
          description="Maximum lines before truncation (default: 2000)"
        />
        <Input
          label="Max Bytes"
          type="number"
          value={toolOutput.max_bytes ?? 51200}
          onChange={(v) => update('tool_output', { ...toolOutput, max_bytes: parseInt(v) || 51200 })}
          description="Maximum bytes before truncation (default: 51200)"
        />
      </Card>

      <Card title="Attachment" docUrl="https://opencode.ai/docs/config/#attachment">
        <p className="card-description">Configure how image attachments are processed before sending to the model.</p>
        <Toggle
          label="Auto Resize"
          description="Resize images when they exceed configured limits (default: true)"
          checked={attachment.image?.auto_resize ?? true}
          onChange={(v) => update('attachment', { ...config?.attachment, image: { ...config?.attachment?.image, auto_resize: v } })}
        />
        <div className="field-row">
          <Input
            label="Max Width"
            type="number"
            value={attachment.image?.max_width ?? 2000}
            onChange={(v) => update('attachment', { ...config?.attachment, image: { ...config?.attachment?.image, max_width: parseInt(v) || 2000 } })}
          />
          <Input
            label="Max Height"
            type="number"
            value={attachment.image?.max_height ?? 2000}
            onChange={(v) => update('attachment', { ...config?.attachment, image: { ...config?.attachment?.image, max_height: parseInt(v) || 2000 } })}
          />
        </div>
        <Input
          label="Max Base64 Bytes"
          type="number"
          value={attachment.image?.max_base64_bytes ?? 5242880}
          onChange={(v) => update('attachment', { ...config?.attachment, image: { ...config?.attachment?.image, max_base64_bytes: parseInt(v) || 5242880 } })}
          description="Maximum base64 payload for an image (default: 5242880)"
        />
      </Card>

      <Card title="Plugins" docUrl="https://opencode.ai/docs/config/#plugins">
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

      <Card title="Skills" docUrl="https://opencode.ai/docs/config/#skills">
        <p className="card-description">Additional skill folders and URLs to load skills from.</p>
        <ArrayField
          label="Skill Paths"
          values={config?.skills?.paths ?? []}
          onChange={(v) => update('skills', { ...config?.skills, paths: v })}
          placeholder="~/.config/opencode/skills"
        />
        <ArrayField
          label="Skill URLs"
          values={config?.skills?.urls ?? []}
          onChange={(v) => update('skills', { ...config?.skills, urls: v })}
          placeholder="https://example.com/.well-known/skills/"
        />
      </Card>

      <Card title="References" docUrl="https://opencode.ai/docs/config/#references">
        <p className="card-description">Named git repositories or local directory references that OpenCode can load.</p>
        <ArrayField
          label="Reference Entries"
          values={refEntries}
          onChange={(v) => update('references', Object.fromEntries(v.map(e => { const idx = e.indexOf('='); return idx > 0 ? [e.slice(0, idx), e.slice(idx + 1)] : [e, e] })))}
          placeholder="my-docs=https://github.com/user/repo"
          description="Format: name=url or name=path"
        />
      </Card>

      <Card title="Instructions" docUrl="https://opencode.ai/docs/config/#instructions">
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

      <Card title="Provider Restrictions" docUrl="https://opencode.ai/docs/config/#disabled-providers">
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

      <Card title="Experimental Features" docUrl="https://opencode.ai/docs/config/#experimental">
        <p className="card-description">Unstable features that may change or be removed.</p>
        <Toggle
          label="Disable Paste Summary"
          checked={experimental?.disable_paste_summary ?? false}
          onChange={(v) => update('experimental', { ...experimental, disable_paste_summary: v })}
        />
        <Toggle
          label="Batch Tool"
          description="Enable the batch tool for parallel operations"
          checked={experimental?.batch_tool ?? false}
          onChange={(v) => update('experimental', { ...experimental, batch_tool: v })}
        />
        <Toggle
          label="OpenTelemetry"
          description="Enable OpenTelemetry spans for AI SDK calls"
          checked={experimental?.openTelemetry ?? false}
          onChange={(v) => update('experimental', { ...experimental, openTelemetry: v })}
        />
        <Toggle
          label="Continue Loop on Deny"
          description="Continue the agent loop when a tool call is denied"
          checked={experimental?.continue_loop_on_deny ?? false}
          onChange={(v) => update('experimental', { ...experimental, continue_loop_on_deny: v })}
        />
        <ArrayField
          label="Primary Tools"
          values={experimental?.primary_tools ?? []}
          onChange={(v) => update('experimental', { ...experimental, primary_tools: v })}
          placeholder="bash"
          description="Tools restricted to primary agents only"
        />
        <Input
          label="MCP Timeout (ms)"
          type="number"
          value={experimental?.mcp_timeout ?? ''}
          onChange={(v) => update('experimental', { ...experimental, mcp_timeout: v ? parseInt(v) : undefined })}
          description="Timeout in ms for MCP requests"
        />
      </Card>
    </div>
  )
}
