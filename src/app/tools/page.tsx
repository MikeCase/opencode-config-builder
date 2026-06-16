'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import Toggle from '../../components/ui/Toggle'
import { useConfigStore } from '../../store/configStore'

const BUILT_IN_TOOLS = [
  { key: 'bash', label: 'bash', description: 'Execute shell commands' },
  { key: 'edit', label: 'edit', description: 'Modify existing files' },
  { key: 'write', label: 'write', description: 'Create or overwrite files' },
  { key: 'read', label: 'read', description: 'Read file contents' },
  { key: 'grep', label: 'grep', description: 'Search using regular expressions' },
  { key: 'glob', label: 'glob', description: 'Find files by pattern' },
  { key: 'lsp', label: 'lsp', description: 'Language server protocol (experimental)' },
  { key: 'apply_patch', label: 'apply_patch', description: 'Apply patches to files' },
  { key: 'skill', label: 'skill', description: 'Load and use skills' },
  { key: 'todowrite', label: 'todowrite', description: 'Manage todo lists' },
  { key: 'webfetch', label: 'webfetch', description: 'Fetch web content' },
  { key: 'websearch', label: 'websearch', description: 'Search the web' },
  { key: 'question', label: 'question', description: 'Ask user questions' },
]

export default function ToolsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const tools = config?.tools ?? {}

  const toggleTool = (key: string, enabled: boolean) => {
    update('tools', { ...tools, [key]: enabled })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tools</h1>
        <p className="page-description">Enable or disable built-in tools that the LLM can use.</p>
      </div>

      <Card title="Built-in Tools" docUrl="https://opencode.ai/docs/tools/">
        <p className="card-description">
          These tools allow the LLM to perform actions in your codebase.
        </p>

        {BUILT_IN_TOOLS.map((tool) => (
          <Toggle
            key={tool.key}
            label={tool.label}
            description={tool.description}
            checked={tool.key in tools ? !!tools[tool.key] : true}
            onChange={(v) => toggleTool(tool.key, v)}
          />
        ))}
      </Card>
    </div>
  )
}