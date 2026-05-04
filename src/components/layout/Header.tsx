'use client'

import React, { useRef } from 'react'
import Button from '../ui/Button'
import { useConfigStore } from '../../store/configStore'
import { generateJsonc } from '../../lib/generate-jsonc'
import { parseJsonc } from '../../lib/import-config'

export default function Header(){
  const fileInput = useRef<HTMLInputElement | null>(null)
  const config = useConfigStore((s) => s.config)
  const update = useConfigStore((s) => s.update)
  const reset = useConfigStore((s) => s.reset)

  const doImport = () => {
    fileInput.current?.click()
  }

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const data = parseJsonc(text)
      if (data && typeof data === 'object') {
        const store = useConfigStore.getState()
        Object.keys(data).forEach((k) => {
          store.update(k, data[k])
        })
      } else {
        alert('Failed to parse config file')
      }
    }
    reader.readAsText(f)
  }

  const doExport = () => {
    const content = generateJsonc(config ?? {}, ['oh_my_openagent'])
    const blob = new Blob([content], { type: 'application/jsonc' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'config.jsonc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const doReset = () => {
    if (confirm('Reset all config to defaults?')) {
      reset()
    }
  }

  return (
    <header className="header">
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <span className="logo">OpenCode Config Builder</span>
      </div>
      <div style={{display:'flex', gap:8}}>
        <Button variant="primary" size="sm" onClick={doImport}>Import</Button>
        <input ref={fileInput} type="file" accept=".jsonc,.json" onChange={onFileChosen} style={{display:'none'}} />
        <Button variant="secondary" size="sm" onClick={doExport}>Export</Button>
        <Button variant="ghost" size="sm" onClick={doReset}>Reset</Button>
      </div>
    </header>
  )
}