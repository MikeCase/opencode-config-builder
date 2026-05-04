'use client'

import React from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import '../styles/globals.css'
import { useConfigStore } from '../store/configStore'
import { generateJsonc } from '../lib/generate-jsonc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell" style={{display:'grid', gridTemplateColumns:'260px 1fr', height:'100vh', overflow:'hidden'}}>
          <Sidebar />
          <div style={{display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden'}}>
            <Header />
            <main className="content" style={{flex:1, overflow:'auto'}}>{children}</main>
          </div>
        </div>
        <LivePreview />
      </body>
    </html>
  )
}

function LivePreview(){
  const config = useConfigStore((s) => s.config)
  const json = generateJsonc(config ?? {})

  return (
    <aside className="floating-preview" aria-label="live-config-preview">
      <pre style={{whiteSpace:'pre-wrap', margin:0}}>{json}</pre>
    </aside>
  )
}