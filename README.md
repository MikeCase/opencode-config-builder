# OpenCode Config Builder

A visual configuration editor for [OpenCode](https://opencode.ai/) AI coding agent. Export `opencode.jsonc` for all OpenCode settings.

## Features

- **Visual Config Editor** - Point-and-click interface for all OpenCode settings
- **10 Config Sections** - General, Server, Agents, Permissions, Tools, MCP Servers, Models, Formatters, Commands, Advanced
- **Oh My OpenAgent Support** - Conditional UI for [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) plugin with separate config file
- **Import/Export** - Load existing configs or export your configuration
- **Live Preview** - Floating panel shows generated JSONC as you configure
- **Dark Theme** - Blue/purple accent colors on dark background
- **Persistent Storage** - Config saved to browser localStorage

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Zustand (state management with persist middleware)
- TypeScript
- CSS Modules

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration Sections

| Section | Description |
|---------|-------------|
| **General** | Model, provider, autoupdate, snapshot, share, shell |
| **Server** | Port, hostname, mDNS, CORS |
| **Agents** | Custom agent configurations with model, temperature, tools |
| **Permissions** | Tool permission rules |
| **Tools** | Enable/disable built-in tools |
| **MCP Servers** | Local/remote MCP server configurations |
| **Models** | Provider options, variants, AWS Bedrock settings |
| **Formatters** | Code formatter configurations |
| **Commands** | Custom command templates |
| **Advanced** | Compaction, watcher, plugins, instructions, providers |
| **Oh My OpenAgent** | Separate config (shown when plugin detected) |

## Oh My OpenAgent

When your config includes `oh-my-openagent` or `oh-my-opencode` in the plugins list, a new section appears in the sidebar. This plugin has its own separate configuration file with support for:

- **Agents** - Customize Sisyphus, Oracle, Librarian, and other agents
- **Categories** - Domain-specific model delegation
- **Background Tasks** - Concurrency limits
- **Skills** - Custom skill sources
- **Hooks** - Disable/enable built-in hooks
- **Browser Automation** - Playwright or agent-browser
- **Tmux Integration** - Background subagent panes
- **Git Master** - Commit conventions
- **LSP** - Language server configurations
- **Runtime Fallback** - Auto-switch models on API errors
- **And more...**

Import/Export for Oh My OpenAgent uses a separate `oh-my-openagent.jsonc` file.

## File Structure

```
src/
├── app/                    # Route pages
│   ├── general/
│   ├── server/
│   ├── agents/
│   ├── permissions/
│   ├── tools/
│   ├── mcp/
│   ├── models/
│   ├── formatters/
│   ├── commands/
│   ├── advanced/
│   └── oh-my-openagent/
├── components/
│   ├── layout/            # Sidebar, Header
│   └── ui/               # Input, Toggle, Select, Card, ArrayField, Button
├── lib/                   # generate-jsonc, import-config, schema
├── store/                 # Zustand configStore
├── styles/               # globals.css
└── types/
```

## Design Conventions

- CSS Modules only (no Tailwind)
- `'use client'` on all components using hooks/zustand
- Dot-path updates: `update('server.port', 4096)`
- CSS variables for theming in `globals.css`