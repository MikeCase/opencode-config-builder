'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Server, Wrench, Code, Users, Shield, HardDrive, Settings, Bot, Cpu, Terminal, Sparkles, X } from 'lucide-react'
import { useConfigStore } from '../../store/configStore'

type Item = { key: string; label: string; icon: React.ReactNode; href: string; badge?: string }

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const config = useConfigStore((s) => s.config)
  const hasOhMy = config?.plugin?.some((p: string) => p.includes('oh-my-openagent') || p.includes('oh-my-opencode'))

  const sections: { label: string; items: Item[] }[] = [
    {
      label: 'Core',
      items: [
        { key: 'general', label: 'General', href: '/general', icon: <Settings /> },
        { key: 'server', label: 'Server', href: '/server', icon: <Server /> },
        { key: 'agents', label: 'Agents', href: '/agents', icon: <Users /> },
        { key: 'permissions', label: 'Permissions', href: '/permissions', icon: <Shield /> },
      ],
    },
    {
      label: 'Extensions',
      items: [
        { key: 'tools', label: 'Tools', href: '/tools', icon: <Wrench /> },
        { key: 'mcp', label: 'MCP Servers', href: '/mcp', icon: <HardDrive /> },
        { key: 'models', label: 'Models', href: '/models', icon: <Cpu /> },
        { key: 'formatters', label: 'Formatters', href: '/formatters', icon: <Code /> },
        { key: 'commands', label: 'Commands', href: '/commands', icon: <Terminal /> },
      ],
    },
    ...(hasOhMy
      ? [
          {
            label: 'Plugins',
            items: [
              {
                key: 'oh-my-openagent',
                label: 'Oh My OpenAgent',
                href: '/oh-my-openagent',
                icon: <Sparkles />,
                badge: 'NEW',
              },
            ],
          },
        ]
      : []),
    {
      label: 'Advanced',
      items: [{ key: 'advanced', label: 'Advanced', href: '/advanced', icon: <Bot /> }],
    },
  ]

  const handleNavClick = (href: string) => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar with mobile drawer support */}
      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">OC</div>
            <span className="sidebar-logo-text">OpenCode Config</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.label} className="nav-section">
              <div className="nav-section-label">{section.label}</div>
              {section.items.map((it) => {
                const isActive = pathname === it.href || pathname?.startsWith(it.href + '/')
                return (
                  <a
                    key={it.key}
                    href={it.href}
                    className={`nav-item${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleNavClick(it.href)}
                  >
                    <span className="nav-item-icon">{it.icon}</span>
                    <span className="nav-item-label">{it.label}</span>
                    {it.badge && <span className="nav-item-badge">{it.badge}</span>}
                  </a>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}