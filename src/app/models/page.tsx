'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import { useConfigStore } from '../../store/configStore'

export default function ModelsPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const provider = config?.provider ?? {} as any

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Models</h1>
        <p className="page-description">Configure provider options and model-specific settings.</p>
      </div>

      <Card title="Provider Options">
        <p className="card-description">
          Configure timeouts and options for API providers. These apply to all requests unless overridden.
        </p>

        <Input
          label="Provider Timeout (ms)"
          value={provider?.options?.timeout ?? 300000}
          onChange={(v) => update('provider', {
            ...provider,
            options: { ...(provider as any)?.options, timeout: parseInt(v) || 300000 }
          })}
          type="number"
          description="Request timeout in milliseconds (default: 300000)"
        />

        <Input
          label="Chunk Timeout (ms)"
          value={provider?.options?.chunkTimeout ?? 30000}
          onChange={(v) => update('provider', {
            ...provider,
            options: { ...(provider as any)?.options, chunkTimeout: parseInt(v) || 30000 }
          })}
          type="number"
          description="Timeout between streamed response chunks"
        />
      </Card>

      <Card title="Model Variants">
        <p className="card-description">
          Many models support multiple variants with different configurations.
        </p>

        <Toggle
          label="Variants Support"
          description="Enable variant selection for models that support it"
          checked={true}
          onChange={() => {}}
        />

        <div className="info-block">
          <p>Built-in variants:</p>
          <ul>
            <li><strong>Anthropic:</strong> high (default), max</li>
            <li><strong>OpenAI:</strong> none, minimal, low, medium, high, xhigh</li>
            <li><strong>Google:</strong> low, high</li>
          </ul>
        </div>
      </Card>

      <Card title="Provider-Specific">
        <p className="card-description">
          Advanced options for specific providers.
        </p>

        <Input
          label="AWS Region (Bedrock)"
          value={(provider as any)?.amazon_bedrock?.region ?? ''}
          onChange={(v) => update('provider', {
            ...provider,
            'amazon-bedrock': { ...(provider as any)?.['amazon-bedrock'], region: v }
          })}
          placeholder="us-east-1"
          description="AWS region for Bedrock"
        />

        <Input
          label="AWS Profile"
          value={(provider as any)?.amazon_bedrock?.profile ?? ''}
          onChange={(v) => update('provider', {
            ...provider,
            'amazon-bedrock': { ...(provider as any)?.['amazon-bedrock'], profile: v }
          })}
          placeholder="default"
          description="AWS credentials profile"
        />
      </Card>
    </div>
  )
}