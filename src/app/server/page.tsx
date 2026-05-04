'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import ArrayField from '../../components/ui/ArrayField'
import { useConfigStore } from '../../store/configStore'

export default function ServerPage() {
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)

  const server = config?.server ?? {}

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Server</h1>
        <p className="page-description">Configure the OpenCode server for web and CLI access.</p>
      </div>

      <Card title="Network">
        <div className="field-row">
          <Input
            label="Port"
            value={server.port ?? 4096}
            onChange={(v) => update('server.port', parseInt(v) || 4096)}
            type="number"
            description="Port to listen on"
          />
          <Input
            label="Hostname"
            value={server.hostname ?? ''}
            onChange={(v) => update('server.hostname', v)}
            placeholder="0.0.0.0"
            description="Host to bind to"
          />
        </div>
      </Card>

      <Card title="Service Discovery">
        <Toggle
          label="mDNS"
          description="Enable to discover OpenCode servers on your network"
          checked={server.mdns ?? true}
          onChange={(v) => update('server.mdns', v)}
        />
        <Input
          label="mDNS Domain"
          value={server.mdnsDomain ?? 'opencode.local'}
          onChange={(v) => update('server.mdnsDomain', v)}
          placeholder="opencode.local"
          description="Custom domain for mDNS discovery"
        />
      </Card>

      <Card title="CORS">
        <ArrayField
          label="Allowed Origins"
          values={server.cors ?? []}
          onChange={(v) => update('server.cors', v)}
          placeholder="https://app.example.com"
        />
        <p className="card-description" style={{ marginTop: '8px' }}>
          Additional origins to allow for CORS when using the HTTP server from a browser client.
        </p>
      </Card>
    </div>
  )
}