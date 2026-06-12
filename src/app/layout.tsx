'use client'

import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import WhatsNewManager from '../components/ui/WhatsNew'
import '../styles/globals.css'
import { useConfigStore } from '../store/configStore'
import { generateJsonc } from '../lib/generate-jsonc'
import { Code2 } from 'lucide-react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [previewCollapsed, setPreviewCollapsed] = useState(true)

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="main-column">
            <Header onMenuToggle={() => setSidebarOpen(true)} />
            <main className="content">{children}</main>
          </div>
        </div>
        <LivePreview collapsed={previewCollapsed} onToggle={() => setPreviewCollapsed(c => !c)} />
        <button
          className={`floating-preview-expand-btn${previewCollapsed ? '' : ' hidden'}`}
          onClick={() => setPreviewCollapsed(false)}
          aria-label="Show config preview"
        >
          <Code2 size={18} />
        </button>
        <WhatsNewManager />
      </body>
    </html>
  )
}

function LivePreview({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const config = useConfigStore((s) => s.config)
  const json = generateJsonc(config ?? {})

  return (
    <aside className={`floating-preview${collapsed ? ' collapsed' : ''}`} aria-label="live-config-preview">
      <div className="floating-preview-header">
        <span className="floating-preview-title">Live Preview</span>
        <button className="floating-preview-toggle" onClick={onToggle} aria-label={collapsed ? 'Expand preview' : 'Collapse preview'}>
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      <div className="floating-preview-content">
        <pre style={{whiteSpace:'pre-wrap', margin:0}}>{json}</pre>
      </div>
    </aside>
  )
}