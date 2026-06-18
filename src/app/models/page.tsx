'use client'

import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import { Plus, Trash2, Cpu } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useConfigStore } from '../../store/configStore'

export default function ModelsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const provider: Record<string, any> = (config?.provider ?? {}) as Record<string, any>
  const providerNames = Object.keys(provider).filter(k => k !== 'options')

  const addProvider = () => {
    const name = `provider-${providerNames.length + 1}`
    update('provider', { ...provider, [name]: { options: {} } })
  }

  const deleteProvider = (name: string) => {
    const next = { ...provider }
    delete next[name]
    update('provider', next)
  }

  const updateProviderOpt = (name: string, key: string, value: any) => {
    update('provider', {
      ...provider,
      [name]: { ...(provider[name] ?? {}), options: { ...((provider[name] as any)?.options ?? {}), [key]: value } }
    })
  }

  const updateProviderFlat = (name: string, key: string, value: any) => {
    update('provider', {
      ...provider,
      [name]: { ...(provider[name] ?? {}), [key]: value }
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Models</h1>
        <p className="page-description">Configure provider options and model-specific settings.</p>
      </div>

      <Card title="Provider Configurations" docUrl="https://opencode.ai/docs/config/#models">
        <p className="card-description">
          Configure per-provider options like timeout and chunk timeout. Add a provider entry for each service you use (e.g., anthropic, openai).
        </p>

        {providerNames.length === 0 ? (
          <div className="empty-state-inline">
            <div className="empty-state-icon-wrap"><Cpu size={24} /></div>
            No provider configurations. Add one to configure timeouts and options.
          </div>
        ) : (
          providerNames.map((name) => {
            const opts = (provider[name] as any)?.options ?? {}
            return (
              <div key={name} className="expandable-card">
                <div className="expandable-card-header">
                  <div className="expandable-card-header-left">
                    <span className="expandable-card-header-title">{name}</span>
                  </div>
                  <button onClick={() => deleteProvider(name)} className="expandable-card-delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="expandable-card-body">
                  <Input
                    label="Provider Name"
                    value={name}
                    onChange={(v) => {
                      const next = { ...provider }
                      next[v] = next[name]
                      delete next[name]
                      update('provider', next)
                    }}
                    placeholder="anthropic"
                  />
                  <div className="field-row">
                    <Input
                      label="Timeout (ms)"
                      value={opts.timeout ?? 300000}
                      onChange={(v) => updateProviderOpt(name, 'timeout', parseInt(v) || 300000)}
                      type="number"
                      description="Request timeout (default: 300000)"
                    />
                    <Input
                      label="Chunk Timeout (ms)"
                      value={opts.chunkTimeout ?? 30000}
                      onChange={(v) => updateProviderOpt(name, 'chunkTimeout', parseInt(v) || 30000)}
                      type="number"
                      description="Timeout between streamed chunks (default: 30000)"
                    />
                  </div>
                  <Toggle
                    label="Set Cache Key"
                    description="Ensure a cache key is always set"
                    checked={!!opts.setCacheKey}
                    onChange={(v) => updateProviderOpt(name, 'setCacheKey', v)}
                  />
                </div>
              </div>
            )
          })
        )}

        <button onClick={addProvider} className="add-item-btn">
          <Plus size={16} />
          Add Provider Config
        </button>
      </Card>

      <Card title="Model Variants" docUrl="https://opencode.ai/docs/models/">
        <p className="card-description">
          Many models support multiple variants with different configurations.
        </p>

        <div className="info-block">
          <p>Built-in variants:</p>
          <ul>
            <li><strong>Anthropic:</strong> high (default), max</li>
            <li><strong>OpenAI:</strong> none, minimal, low, medium, high, xhigh</li>
            <li><strong>Google:</strong> low, high</li>
          </ul>
        </div>
      </Card>

      <Card title="Provider-Specific" docUrl="https://opencode.ai/docs/config/#amazon-bedrock">
        <p className="card-description">
          Advanced options for specific providers like Amazon Bedrock.
        </p>

        <Input
          label="AWS Region (Bedrock)"
          value={(provider as any)?.['amazon-bedrock']?.options?.region ?? ''}
          onChange={(v) => updateProviderOpt('amazon-bedrock', 'region', v)}
          placeholder="us-east-1"
          description="AWS region for Bedrock"
        />

        <Input
          label="AWS Profile"
          value={(provider as any)?.['amazon-bedrock']?.options?.profile ?? ''}
          onChange={(v) => updateProviderOpt('amazon-bedrock', 'profile', v)}
          placeholder="default"
          description="AWS credentials profile"
        />

        <Input
          label="AWS Endpoint"
          value={(provider as any)?.['amazon-bedrock']?.options?.endpoint ?? ''}
          onChange={(v) => updateProviderOpt('amazon-bedrock', 'endpoint', v)}
          placeholder="https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
          description="Custom endpoint URL for VPC endpoints"
        />
      </Card>
    </div>
  )
}