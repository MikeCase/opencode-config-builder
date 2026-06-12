'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

const CURRENT_VERSION = '0.1.0'

const CHANGELOG: Record<string, { title: string; items: string[] }> = {
  '0.1.0': {
    title: 'Initial Release',
    items: [
      'Visual configuration editor for OpenCode',
      '10 configuration sections with live preview',
      'Import/export your config as JSONC',
      'Mobile responsive design',
      'Oh My OpenAgent support',
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
    const lastSeen = localStorage.getItem('opencode-config-version')
    if (lastSeen !== CURRENT_VERSION) {
      setVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('opencode-config-version', CURRENT_VERSION)
    setVisible(false)
  }

  if (!visible) return null

  return <WhatsNew onClose={handleDismiss} />
}