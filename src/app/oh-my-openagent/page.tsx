'use client'
import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Select from '../../components/ui/Select'
import ArrayField from '../../components/ui/ArrayField'
import Button from '../../components/ui/Button'
import { useConfigStore } from '../../store/configStore'
import { generateJsonc } from '../../lib/generate-jsonc'

type AnyObj = Record<string, any>

function SectionCard({ title, children, defaultExpanded = false }: { title: string; children: React.ReactNode; defaultExpanded?: boolean }) {
  const [open, setOpen] = useState<boolean>(defaultExpanded)
  return (
    <Card>
      <div
        onClick={() => setOpen((v) => !v)}
        className="expandable-card-header"
        style={{
          padding: '16px 24px',
          margin: '-24px -24px 0',
          borderBottom: open ? '1px solid var(--border-subtle)' : 'none',
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
          background: 'var(--bg-secondary)',
        }}
      >
        <span className="expandable-card-header-title">{title}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{ paddingTop: '16px' }}>{children}</div>}
    </Card>
  )
}

const defaultAgent = () => ({
  model: '',
  fallback_models: [],
  temperature: 0,
  top_p: 0,
  prompt: '',
  prompt_append: '',
  tools: [],
  disable: false,
  mode: 'primary',
  color: '#000000',
  permission: '',
  category: '',
  variant: '',
  maxTokens: 512,
  thinking: '',
  reasoningEffort: '',
  textVerbosity: '',
  providerOptions: {},
})

const builtInCategories = [
  'visual-engineering',
  'ultrabrain',
  'deep',
  'artistry',
  'quick',
  'unspecified-low',
  'unspecified-high',
  'writing',
] as const

export default function OhMyOpenAgentPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const omo: AnyObj = config?.oh_my_openagent ?? {}
  const agents: AnyObj = omo?.agents ?? {}
  const categories: AnyObj = omo?.categories ?? {}

  const [importKey, setImportKey] = useState('imported-ohmy')
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        update('oh_my_openagent', parsed)
      } catch (err) {
        console.error('Invalid OhMy JSON', err)
      }
    }
    reader.readAsText(file)
  }

  const upAgents = (newAgents: AnyObj) => update('oh_my_openagent.agents', newAgents)
  const patchAgent = (name: string, patch: AnyObj) => {
    const curr = { ...(omo?.agents ?? {}) }
    curr[name] = { ...(curr[name] ?? {}), ...patch }
    upAgents(curr)
  }
  const addAgent = (key: string) => {
    if (!key) return
    const curr = { ...(omo?.agents ?? {}) }
    if (curr[key]) return
    curr[key] = defaultAgent()
    upAgents(curr)
    setNewAgentKey('')
  }
  const [newAgentKey, setNewAgentKey] = useState('')

  const upCategories = (newCategories: AnyObj) => update('oh_my_openagent.categories', newCategories)
  const patchCategory = (name: string, patch: AnyObj) => {
    const curr = { ...(omo?.categories ?? {}) }
    curr[name] = { ...(curr[name] ?? {}), ...patch }
    upCategories(curr)
  }

  const AgentCard = ({ name, agent }: { name: string; agent: AnyObj }) => {
    const [open, setOpen] = useState(false)
    return (
      <Card>
        <div className="expandable-card-header" onClick={() => setOpen((v) => !v)} style={{
          padding: '16px 24px',
          margin: '-24px -24px 0',
          borderBottom: open ? '1px solid var(--border-subtle)' : 'none',
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
          background: 'var(--bg-secondary)',
        }}>
          <div className="expandable-card-header-left">
            <span className="expandable-card-header-title">{name}</span>
          </div>
          <span style={{ opacity: 0.6, userSelect: 'none' }}>{open ? '−' : '+'}</span>
        </div>
        <div style={{ paddingTop: open ? '16px' : '0' }}>{!open ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Model: {agent?.model ?? ''}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Model" value={agent?.model ?? ''} onChange={(v: string) => patchAgent(name, { model: v })} />
            <Toggle label="Disabled" checked={!!agent?.disable} onChange={(v) => patchAgent(name, { disable: v })} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Select label="Mode" value={agent?.mode ?? 'primary'} onChange={(v: string) => patchAgent(name, { mode: v })} options={[
                  { value: 'primary', label: 'primary' },
                  { value: 'subagent', label: 'subagent' },
                  { value: 'all', label: 'all' },
                ]} />
            </div>
            <Input label="Color" value={agent?.color ?? ''} onChange={(v: string) => patchAgent(name, { color: v })} />
            <ArrayField label="Tools" values={agent?.tools ?? []} onChange={(v: string[]) => patchAgent(name, { tools: v })} />
            <Input label="Variant" value={agent?.variant ?? ''} onChange={(v: string) => patchAgent(name, { variant: v })} />
            <Input label="Temperature" value={String(agent?.temperature ?? 0)} onChange={(v: string) => patchAgent(name, { temperature: Number(v) })} />
            <Input label="Top_p" value={String(agent?.top_p ?? 0)} onChange={(v: string) => patchAgent(name, { top_p: Number(v) })} />
            <Input label="Max Tokens" value={String(agent?.maxTokens ?? 0)} onChange={(v: string) => patchAgent(name, { maxTokens: Number(v) })} />
            <Input label="Reasoning Effort" value={agent?.reasoningEffort ?? ''} onChange={(v: string) => patchAgent(name, { reasoningEffort: v })} />
            <Input label="Text Verbosity" value={agent?.textVerbosity ?? ''} onChange={(v: string) => patchAgent(name, { textVerbosity: v })} placeholder="low / medium / high" />
            <Input label="Thinking" value={agent?.thinking ? (typeof agent.thinking === 'string' ? agent.thinking : JSON.stringify(agent.thinking)) : ''} onChange={(v: string) => patchAgent(name, { thinking: v ? { type: 'enabled', budgetTokens: parseInt(v) || 16000 } : undefined })} placeholder='16000' description="Anthropic thinking budget tokens" />
            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayField label="Fallback Models" values={agent?.fallback_models ?? []} onChange={(v: string[]) => patchAgent(name, { fallback_models: v })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Prompt Append" value={agent?.prompt_append ?? ''} onChange={(v: string) => patchAgent(name, { prompt_append: v })} placeholder="file://./additional-context.md" description="Text appended to system prompt. Supports file:// URIs." mono />
            </div>
          </div>
        )}</div>
      </Card>
    )
  }

  const CategoryCard = ({ name, cat }: { name: string; cat: AnyObj }) => {
    const [open, setOpen] = useState(false)
    return (
      <Card>
        <div className="expandable-card-header" onClick={() => setOpen((v) => !v)} style={{
          padding: '16px 24px',
          margin: '-24px -24px 0',
          borderBottom: open ? '1px solid var(--border-subtle)' : 'none',
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
          background: 'var(--bg-secondary)',
        }}>
          <div className="expandable-card-header-left">
            <span className="expandable-card-header-title">{name}</span>
          </div>
          <span style={{ opacity: 0.6, userSelect: 'none' }}>{open ? '−' : '+'}</span>
        </div>
        {!open ? (
          <div style={{ paddingTop: 6, color: 'var(--text-tertiary)', fontSize: '13px' }}>
            Model: {cat?.model ?? ''}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: '16px' }}>
            <Input label="Model" value={cat?.model ?? ''} onChange={(v: string) => patchCategory(name, { model: v })} />
            <Input label="Variant" value={cat?.variant ?? ''} onChange={(v: string) => patchCategory(name, { variant: v })} />
            <Input label="Temperature" value={String(cat?.temperature ?? 0)} onChange={(v: string) => patchCategory(name, { temperature: Number(v) })} />
            <Input label="Top_p" value={String(cat?.top_p ?? 0)} onChange={(v: string) => patchCategory(name, { top_p: Number(v) })} />
            <Input label="Max Tokens" value={String(cat?.maxTokens ?? 0)} onChange={(v: string) => patchCategory(name, { maxTokens: Number(v) })} />
            <ArrayField label="Tools" values={cat?.tools ?? []} onChange={(v: string[]) => patchCategory(name, { tools: v })} />
            <Input label="Description" value={cat?.description ?? ''} onChange={(v: string) => patchCategory(name, { description: v })} />
            <Toggle label="Is Unstable" checked={!!cat?.is_unstable_agent} onChange={(v) => patchCategory(name, { is_unstable_agent: v })} />
          </div>
        )}
      </Card>
    )
  }

  function patchContextSafe(path: string, value: any) {
    update(path, value)
  }

  const builtInAgents = Object.entries(agents)
  const builtInCategoriesEntries = Object.entries(categories)

  return (
    <div>
      <div className="omo-header">
        <h1>Oh My OpenAgent Configuration</h1>
        <div className="omo-header-actions">
          <Button variant="secondary" onClick={handleImportClick}>Import OhMy</Button>
          <input ref={fileInputRef} type="file" accept=".jsonc,.json" style={{ display: 'none' }} onChange={handleFileImport} />
          <Button variant="secondary" onClick={() => {
            const omo = config?.oh_my_openagent
            if (!omo) { alert('No config to export'); return }
            const { plain } = generateJsonc(omo)
            const blob = new Blob([plain], { type: 'application/jsonc' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'oh-my-openagent.jsonc'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }}>Export OhMy</Button>
        </div>
      </div>

      <SectionCard title="Agents" defaultExpanded={true}>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          {builtInAgents.map(([name, agent]) => (
            <AgentCard key={name} name={name} agent={agent ?? {}} />
          ))}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Input label="" placeholder="New agent key" value={newAgentKey} onChange={(v: string) => setNewAgentKey(v)} />
            <Button variant="secondary" onClick={() => addAgent(newAgentKey)}>Add Agent</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Categories" defaultExpanded={false}>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          {builtInCategories.map((cat) => {
            const c = categories?.[cat] ?? {}
            return <CategoryCard key={cat} name={cat} cat={c} />
          })}
        </div>
      </SectionCard>

      <SectionCard title="Background Task" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Input label="Default Concurrency" value={String((omo?.background_task?.defaultConcurrency) ?? 1)} onChange={(v: string) => update('oh_my_openagent.background_task.defaultConcurrency', Number(v))} />
          <Input label="Stale Timeout Ms" value={String((omo?.background_task?.staleTimeoutMs) ?? 1000)} onChange={(v: string) => update('oh_my_openagent.background_task.staleTimeoutMs', Number(v))} />
          <ArrayField label="Provider Concurrency" values={(omo?.background_task?.providerConcurrency ?? {}) as any} onChange={(v: any) => update('oh_my_openagent.background_task.providerConcurrency', v)} />
          <ArrayField label="Model Concurrency" values={(omo?.background_task?.modelConcurrency ?? {}) as any} onChange={(v: any) => update('oh_my_openagent.background_task.modelConcurrency', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Sisyphus Agent" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Disabled" checked={!!omo?.sisyphus_agent?.disabled} onChange={(v: boolean) => update('oh_my_openagent.sisyphus_agent.disabled', v)} />
          <Toggle label="Default Builder Enabled" checked={!!omo?.sisyphus_agent?.default_builder_enabled} onChange={(v: boolean) => update('oh_my_openagent.sisyphus_agent.default_builder_enabled', v)} />
          <Toggle label="Planner Enabled" checked={!!omo?.sisyphus_agent?.planner_enabled} onChange={(v: boolean) => update('oh_my_openagent.sisyphus_agent.planner_enabled', v)} />
          <Toggle label="Replace Plan" checked={!!omo?.sisyphus_agent?.replace_plan} onChange={(v: boolean) => update('oh_my_openagent.sisyphus_agent.replace_plan', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Sisyphus (Tasks)" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.sisyphus?.tasks?.enabled} onChange={(v: boolean) => update('oh_my_openagent.sisyphus.tasks.enabled', v)} />
          <Input label="Storage Path" value={omo?.sisyphus?.tasks?.storage_path ?? ''} onChange={(v: string) => update('oh_my_openagent.sisyphus.tasks.storage_path', v)} />
          <Toggle label="Claude Code Compat" checked={!!omo?.sisyphus?.tasks?.claude_code_compat} onChange={(v: boolean) => update('oh_my_openagent.sisyphus.tasks.claude_code_compat', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Skills" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <ArrayField label="Sources" values={(omo?.skills?.sources ?? []) as any} onChange={(v: any) => update('oh_my_openagent.skills.sources', v)} />
          <ArrayField label="Enable" values={(omo?.skills?.enable ?? []) as any} onChange={(v: any) => update('oh_my_openagent.skills.enable', v)} />
          <ArrayField label="Disable" values={(omo?.skills?.disable ?? []) as any} onChange={(v: any) => update('oh_my_openagent.skills.disable', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Hooks" defaultExpanded={false}>
        <ArrayField label="Disabled Hooks" values={omo?.hooks?.disabled_hooks ?? []} onChange={(v: any) => update('oh_my_openagent.hooks.disabled_hooks', v)} />
      </SectionCard>

      <SectionCard title="Commands" defaultExpanded={false}>
        <ArrayField label="Disabled Commands" values={omo?.commands?.disabled_commands ?? []} onChange={(v: any) => update('oh_my_openagent.commands.disabled_commands', v)} />
      </SectionCard>

      <SectionCard title="Disabled Agents & Categories" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <ArrayField label="Disabled Agents" values={omo?.disabled_agents ?? []} onChange={(v: any) => update('oh_my_openagent.disabled_agents', v)} />
          <ArrayField label="Disabled Categories" values={omo?.disabled_categories ?? []} onChange={(v: any) => update('oh_my_openagent.disabled_categories', v)} />
        </div>
        <div style={{ marginTop: '12px' }}>
          <ArrayField label="Disabled Skills" values={omo?.disabled_skills ?? []} onChange={(v: any) => update('oh_my_openagent.disabled_skills', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Browser Automation" defaultExpanded={false}>
        <Select label="Provider" value={omo?.browser_automation_engine?.provider ?? 'playwright'} onChange={(v: string) => patchContextSafe('oh_my_openagent.browser_automation_engine.provider', v)} options={[
            { value: 'playwright', label: 'playwright' },
            { value: 'agent-browser', label: 'agent-browser' },
          ]} />
      </SectionCard>

      <SectionCard title="Team Mode" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.team_mode?.enabled} onChange={(v: boolean) => update('oh_my_openagent.team_mode.enabled', v)} />
          <Input label="Max Parallel Members" value={String(omo?.team_mode?.max_parallel_members ?? 4)} onChange={(v: string) => update('oh_my_openagent.team_mode.max_parallel_members', Number(v))} />
          <Toggle label="Tmux Visualization" checked={!!omo?.team_mode?.tmux_visualization} onChange={(v: boolean) => update('oh_my_openagent.team_mode.tmux_visualization', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Tmux" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.tmux?.enabled} onChange={(v: boolean) => update('oh_my_openagent.tmux.enabled', v)} />
          <Select label="Layout" value={omo?.tmux?.layout ?? 'tiled'} onChange={(v: string) => update('oh_my_openagent.tmux.layout', v)} options={[
              { value: 'tiled', label: 'tiled' },
              { value: 'stacked', label: 'stacked' },
            ]} />
          <Input label="Main Pane Size" value={String(omo?.tmux?.main_pane_size ?? 80)} onChange={(v: string) => update('oh_my_openagent.tmux.main_pane_size', Number(v))} />
          <Input label="Main Pane Min Width" value={String(omo?.tmux?.main_pane_min_width ?? 60)} onChange={(v: string) => update('oh_my_openagent.tmux.main_pane_min_width', Number(v))} />
          <Input label="Agent Pane Min Width" value={String(omo?.tmux?.agent_pane_min_width ?? 40)} onChange={(v: string) => update('oh_my_openagent.tmux.agent_pane_min_width', Number(v))} />
        </div>
      </SectionCard>

      <SectionCard title="Git Master" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Commit Footer" checked={!!omo?.git_master?.commit_footer} onChange={(v: boolean) => update('oh_my_openagent.git_master.commit_footer', v)} />
          <Toggle label="Include Co-Authored-By" checked={!!omo?.git_master?.include_co_authored_by} onChange={(v: boolean) => update('oh_my_openagent.git_master.include_co_authored_by', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Comment Checker" defaultExpanded={false}>
        <Input label="Custom Prompt" value={omo?.comment_checker?.custom_prompt ?? ''} onChange={(v: string) => update('oh_my_openagent.comment_checker.custom_prompt', v)} />
      </SectionCard>

      <SectionCard title="Notification" defaultExpanded={false}>
        <Toggle label="Force Enable" checked={!!omo?.notification?.force_enable} onChange={(v: boolean) => update('oh_my_openagent.notification.force_enable', v)} />
      </SectionCard>

      <SectionCard title="Disabled MCPs" defaultExpanded={false}>
        <ArrayField label="Disabled MCPs" values={omo?.disabled_mcps ?? []} onChange={(v: any) => update('oh_my_openagent.disabled_mcps', v)} />
      </SectionCard>

      <SectionCard title="LSP" defaultExpanded={false}>
        <div className="card-description" style={{ padding: '12px 0', lineHeight: 1.6 }}>
          The top-level <code>lsp</code> config block in oh-my-openagent is <strong>deprecated</strong> and automatically stripped on startup.
          LSP tools are now provided by the built-in <code>lsp</code> MCP server.
        </div>
        <div className="card-description" style={{ paddingBottom: '8px', lineHeight: 1.6 }}>
          To disable it, add <code>&quot;lsp&quot;</code> to the <strong>Disabled MCPs</strong> section above.
          For custom language servers, create <code>.opencode/lsp.json</code> at the project root instead.
        </div>
      </SectionCard>

      <SectionCard title="Runtime Fallback" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.runtime_fallback?.enabled} onChange={(v: boolean) => update('oh_my_openagent.runtime_fallback.enabled', v)} />
          <ArrayField label="Retry On Errors" values={omo?.runtime_fallback?.retry_on_errors ?? []} onChange={(v: any) => update('oh_my_openagent.runtime_fallback.retry_on_errors', v)} />
          <Input label="Max Fallback Attempts" value={String(omo?.runtime_fallback?.max_fallback_attempts ?? 3)} onChange={(v: string) => update('oh_my_openagent.runtime_fallback.max_fallback_attempts', Number(v))} />
          <Input label="Cooldown Seconds" value={String(omo?.runtime_fallback?.cooldown_seconds ?? 30)} onChange={(v: string) => update('oh_my_openagent.runtime_fallback.cooldown_seconds', Number(v))} />
          <Input label="Timeout Seconds" value={String(omo?.runtime_fallback?.timeout_seconds ?? 60)} onChange={(v: string) => update('oh_my_openagent.runtime_fallback.timeout_seconds', Number(v))} />
          <Toggle label="Notify On Fallback" checked={!!omo?.runtime_fallback?.notify_on_fallback} onChange={(v: boolean) => update('oh_my_openagent.runtime_fallback.notify_on_fallback', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Model Capabilities" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.model_capabilities?.enabled} onChange={(v: boolean) => update('oh_my_openagent.model_capabilities.enabled', v)} />
          <Toggle label="Auto Refresh On Start" checked={!!omo?.model_capabilities?.auto_refresh_on_start} onChange={(v: boolean) => update('oh_my_openagent.model_capabilities.auto_refresh_on_start', v)} />
          <Input label="Refresh Timeout Ms" value={String(omo?.model_capabilities?.refresh_timeout_ms ?? 1000)} onChange={(v: string) => update('oh_my_openagent.model_capabilities.refresh_timeout_ms', Number(v))} />
          <Input label="Source URL" value={omo?.model_capabilities?.source_url ?? ''} onChange={(v: string) => update('oh_my_openagent.model_capabilities.source_url', v)} />
        </div>
      </SectionCard>

      <SectionCard title="Experimental" defaultExpanded={false}>
        <ArrayField label="Key-Value" values={omo?.experimental ?? []} onChange={(v: any) => update('oh_my_openagent.experimental', v)} />
      </SectionCard>

      <SectionCard title="Hashline Edit" defaultExpanded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Toggle label="Enabled" checked={!!omo?.hashline_edit?.enabled} onChange={(v: boolean) => update('oh_my_openagent.hashline_edit.enabled', v)} />
          <Input label="Debounce MS" value={String(omo?.hashline_edit?.debounce_ms ?? 250)} onChange={(v: string) => update('oh_my_openagent.hashline_edit.debounce_ms', Number(v))} />
        </div>
      </SectionCard>
    </div>
  )
}