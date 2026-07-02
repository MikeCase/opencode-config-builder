'use client'

import React, { useRef } from 'react'
import Button from '../ui/Button'
import { useConfigStore } from '../../store/configStore'
import { generateJsonc } from '../../lib/generate-jsonc'
import { parseJsonc } from '../../lib/import-config'
import { Menu, Sparkles } from 'lucide-react'

interface HeaderProps {
  onMenuToggle?: () => void
  onWhatsNewClick?: () => void
  hasNewVersion?: boolean
}

export default function Header({ onMenuToggle, onWhatsNewClick, hasNewVersion }: HeaderProps){
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
    const { plain } = generateJsonc(config ?? {})
    const blob = new Blob([plain], { type: 'application/jsonc' })
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
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="logo">OpenCode Config Builder</span>
      </div>
      <div className="header-actions">
        <button
          className="whatsnew-icon-btn"
          onClick={onWhatsNewClick}
          aria-label="What's New"
          title="What's New"
        >
          <Sparkles size={16} />
          {hasNewVersion && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--error)',
                boxShadow: '0 0 0 2px var(--bg-primary)',
              }}
            />
          )}
        </button>
        <Button variant="primary" size="sm" onClick={doImport}>Import</Button>
        <input ref={fileInput} type="file" accept=".jsonc,.json" onChange={onFileChosen} style={{display:'none'}} />
        <Button variant="secondary" size="sm" onClick={doExport}>Export</Button>
        <Button variant="ghost" size="sm" onClick={doReset}>Reset</Button>
      </div>
    </header>
  )
}
