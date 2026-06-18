'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2000)
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.defer = true
    script.dataset.cfBeacon = '{"token": "2984ef4785d24779ab3fe194236cce12"}'
    document.body.appendChild(script)
  }, [])

  // Cmd+S export shortcut + show-toast custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        const config = useConfigStore.getState().config
        const { plain } = generateJsonc(config ?? {}, ['oh_my_openagent'])
        const blob = new Blob([plain], { type: 'application/jsonc' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'config.jsonc'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        showToast('Exported!')
      }
    }

    const handleToastEvent = (e: CustomEvent) => {
      showToast(e.detail)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('show-toast', handleToastEvent as EventListener)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('show-toast', handleToastEvent as EventListener)
    }
  }, [showToast])

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <div className="app-shell">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="main-column">
            <Header onMenuToggle={() => setSidebarOpen(true)} />
            <main className="content">{children}</main>
          </div>
        </div>
        <LivePreview
          collapsed={previewCollapsed}
          onToggle={() => setPreviewCollapsed(c => !c)}
          showToast={showToast}
        />
        <button
          className={`floating-preview-expand-btn${previewCollapsed ? '' : ' hidden'}`}
          onClick={() => setPreviewCollapsed(false)}
          aria-label="Show config preview"
        >
          <Code2 size={18} />
        </button>
        <WhatsNewManager />
        <Toast message={toastMessage} />
      </body>
    </html>
  )
}

function LivePreview({ collapsed, onToggle, showToast }: { collapsed: boolean; onToggle: () => void; showToast: (msg: string) => void }) {
  const config = useConfigStore((s) => s.config)
  const { html, plain } = generateJsonc(config ?? {})
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      showToast('Copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <aside className={`floating-preview${collapsed ? ' collapsed' : ''}`} aria-label="live-config-preview">
      <div className="floating-preview-header">
        <span className="floating-preview-title">Live Preview</span>
        <div className="floating-preview-actions">
          <button className={`floating-preview-copy${copied ? ' copied' : ''}`} onClick={handleCopy} aria-label="Copy config to clipboard">
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="floating-preview-toggle" onClick={onToggle} aria-label={collapsed ? 'Expand preview' : 'Collapse preview'}>
            {collapsed ? 'Show' : 'Hide'}
          </button>
        </div>
      </div>
      <div className="preview-content">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </aside>
  )
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: 'var(--shadow-lg)',
          animation: 'toastIn 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        {message}
      </div>
    </>
  )
}