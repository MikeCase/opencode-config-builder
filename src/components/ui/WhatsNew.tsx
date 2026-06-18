'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

const CURRENT_VERSION = '0.2.2'

const CHANGELOG: Record<string, { title: string; items: string[] }> = {
  '0.1.0': {
    title: 'Initial Release',
    items: [
      'Visual configuration editor for OpenCode',
      '10 configuration sections with live preview',
      'Import/export your config as JSONC',
      'Mobile responsive design',
    ],
  },
  '0.2.0': {
    title: 'Config Alignment & Bug Fixes',
    items: [
      'Autoupdate now supports notify-only mode',
      'Fixed compaction.prune default to match OpenCode docs',
      'Per-provider configuration with expandable cards',
      'Added MCP fields: working directory, environment variables, headers, OAuth',
      'Added agent fields: color, top_p, prompt',
    ],
  },
  '0.2.1': {
    title: 'Clipboard Copy & Doc Links',
    items: [
      'Live Preview now includes a Copy button to copy your config to clipboard',
      'Documentation links added to every config option — click the ⓘ icon next to any field label to open the docs',
    ],
  },
  '0.2.2': {
    title: 'Design Refinement & UX Polish',
    items: [
      'Live Preview now includes JSON syntax highlighting (keys, strings, numbers, booleans in color)',
      'Added Cmd+S / Ctrl+S shortcut to quickly export your config',
      'Toast notifications appear for export, copy, and reset actions',
      'Expanded card headers now keyboard-accessible with aria labels',
      'Empty states now include contextual icons across all pages',
      'Improved card contrast and refined accent color usage',
      'What\'s New modal is smarter — only shows once per 24 hours after dismissal',
    ],
  },
}

interface WhatsNewProps {
  onClose: () => void
}

function WhatsNew({ onClose }: WhatsNewProps) {
  const changes = CHANGELOG[CURRENT_VERSION]

  return (
    <div className="whatsnew-overlay" onClick={onClose}>
      <div className="whatsnew-modal" onClick={(e) => e.stopPropagation()}>
        <div className="whatsnew-header">
          <div className="whatsnew-title-row">
            <Sparkles size={18} />
            <span>What&apos;s New in v{CURRENT_VERSION}</span>
          </div>
          <button className="whatsnew-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="whatsnew-body">
          <h3 className="whatsnew-section-title">{changes.title}</h3>
          <ul className="whatsnew-list">
            {changes.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="whatsnew-footer">
          <button className="whatsnew-dismiss" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WhatsNewManager() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('opencode-config-version')
    if (!stored) {
      setVisible(true)
      return
    }
    try {
      const parsed = JSON.parse(stored)
      if (parsed.version !== CURRENT_VERSION) {
        setVisible(true)
      } else if (parsed.dismissedAt) {
        const elapsed = Date.now() - new Date(parsed.dismissedAt).getTime()
        if (elapsed > 24 * 60 * 60 * 1000) {
          setVisible(true)
        }
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('opencode-config-version', JSON.stringify({
      version: CURRENT_VERSION,
      dismissedAt: new Date().toISOString(),
    }))
    setVisible(false)
  }

  if (!visible) return null

  return <WhatsNew onClose={handleDismiss} />
}