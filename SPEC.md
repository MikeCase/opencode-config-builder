# OpenCode Config Builder - SPEC.md

## 1. Concept & Vision

A visual configuration editor for OpenCode AI coding agent. The app provides an intuitive sidebar-driven interface to configure all OpenCode settings — from models and agents to MCP servers and permissions — then export as a production-ready `opencode.jsonc` file.

**Feel**: Deep space command center. Rich dark backgrounds with subtle blue-purple gradients. Crisp typography. Smooth micro-interactions. Professional but not sterile — the kind of tool a developer would leave open alongside their editor.

---

## 2. Design Language

### Aesthetic Direction
"Cosmic terminal" — deep navy/indigo backgrounds with purple accent highlights. Inspired by modern code editors (Zed, VS Code dark+) but with more color warmth. Glass-morphism accents on cards.

### Color Palette
```css
--bg-primary: #0d0f1a;        /* Deep space navy - main background */
--bg-secondary: #13162b;      /* Slightly lighter navy - cards/panels */
--bg-tertiary: #1a1e3a;       /* Hover states, active items */
--bg-elevated: #1f2347;       /* Modals, dropdowns */

--border-subtle: #2a2f54;     /* Subtle borders */
--border-active: #4f56a3;     /* Active/focused borders */

--accent-primary: #6366f1;    /* Indigo - primary actions */
--accent-secondary: #8b5cf6;   /* Violet - secondary highlights */
--accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);

--text-primary: #f1f5f9;      /* White-ish for headings */
--text-secondary: #94a3b8;     /* Muted for labels */
--text-tertiary: #64748b;      /* Disabled/hint text */

--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography
- **Headings**: `Inter` (weight 600-700) — clean, modern, excellent at small sizes
- **Body/UI**: `Inter` (weight 400-500)
- **Code/Config preview**: `JetBrains Mono` — ligatures, great for JSON
- **Fallback**: `system-ui, -apple-system, sans-serif`

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: 6px (small), 8px (medium), 12px (large), 16px (cards)
- Sidebar width: 260px

### Motion Philosophy
- **Navigation**: instant color transitions (150ms ease), smooth collapse/expand (250ms ease-out)
- **Cards/panels**: subtle scale on hover (1.01), smooth shadow transitions
- **Inputs**: focus ring animation (150ms)
- **Sidebar nav items**: hover glow effect, active state with accent border

### Visual Assets
- **Icons**: Lucide React (consistent 20px stroke-width-1.5)
- **Decorative**: Subtle gradient orbs in background (CSS radial gradients, low opacity)
- **Badges**: NEW badge for Oh My OpenAgent nav item

---

## 3. Layout & Structure

### App Shell
```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────────────────┐   │
│  │          │  │  Header: Logo + Import/Export/Reset      │   │
│  │ Sidebar  │  ├─────────────────────────────────────────┤   │
│  │          │  │                                         │   │
│  │ - Logo   │  │  Content Area                           │   │
│  │ - Nav    │  │  (Form fields, cards, config preview)   │   │
│  │   items  │  │                                         │   │
│  │          │  │                                         │   │
│  │ [NEW]    │  │                                         │   │
│  │ OhMy     │  │                                         │   │
│  └──────────┘  └─────────────────────────────────────────┘   │
│                                                     ┌──────┐ │
│                                                     │JSON  │ │
│                                                     │Prev  │ │
│                                                     └──────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Sections
1. **Core** - General, Server
2. **Extensions** - Agents, Permissions, Tools, MCP Servers
3. **Config** - Models, Formatters, Commands
4. **Advanced** - Advanced (compaction, watcher, plugins, instructions)
5. **Plugins** - Oh My OpenAgent (shown only when `oh-my-openagent` or `oh-my-opencode` in plugins list)

**Sidebar Features:**
- Active state with accent left border and glow
- Section labels (uppercase, letter-spaced)
- NEW badge on Oh My OpenAgent item
- Hover glow effects

### Header Actions
- **Import** - Load `.json` or `.jsonc` config file (merges with existing state)
- **Export** - Download config as `config.jsonc` (excludes `oh_my_openagent`)
- **Reset** - Reset all config to defaults (with confirmation)

### Floating Preview
- Fixed position bottom-right corner
- Shows live JSONC output
- Updates as config changes

---

## 4. Features & Interactions

### Core Features

#### Config State Management
- Zustand store with `persist` middleware
- localStorage key: `opencode-config`
- Dot-path updates: `update('server.port', 4096)`
- All form state stored globally

#### Import Config
- Click "Import" in header
- File picker for `.json`, `.jsonc` files
- Parse and validate with error message if invalid
- Merge with existing state (updates existing keys)

#### Export Config
- Click "Export" in header
- Generate JSON with 2-space indentation
- `oh_my_openagent` excluded (separate export)
- Download as `config.jsonc`

#### Oh My OpenAgent Import/Export
- Only visible when plugin detected in config
- Separate buttons on the Oh My OpenAgent page
- Separate file: `oh-my-openagent.jsonc`

#### Reset Config
- Click "Reset" in header
- Confirmation prompt
- Resets to hardcoded defaults (keeps localStorage empty)

### Interaction Details

#### Navigation
- Click sidebar item → instant content switch, URL updates
- Active item has accent left border + bg highlight + glow
- Hover: subtle bg change + glow (150ms)

#### Form Inputs
- **Text/Number**: Standard input with label, placeholder, helper text
- **Toggle**: Custom switch with accent color when on, stopPropagation prevents accordion collapse
- **Select**: Custom dropdown with options prop, supports children for manual options
- **ArrayField**: Add/remove items, safe handling of non-array values

#### Expandable Cards
- Click `+`/`−` toggle in card header to expand/collapse
- Inner form elements have stopPropagation to prevent closing
- Toggle, Input, Select, ArrayField, Button all prevent event bubbling

#### Validation
- No real-time schema validation (import shows alert on failure)
- Config loaded via parseJsonc which strips comments and handles trailing commas

### Edge Cases
- **Invalid JSON on import**: Show alert, don't overwrite state
- **Non-array values in ArrayField**: Converts to empty array safely
- **Toggle clicks in expanded cards**: Don't collapse card

---

## 5. Component Inventory

### Layout Components

#### `Sidebar`
- 260px width, bg-secondary, border-right
- Section labels: uppercase, letter-spaced, tertiary color
- Nav items: icon + label, hover glow, active accent border
- NEW badge for Oh My OpenAgent
- Uses `usePathname()` for active state

#### `Header`
- Logo left, action buttons right
- Import, Export, Reset buttons
- Uses generateJsonc with excludeKeys for export

#### `ContentArea`
- Main content wrapper with scroll
- Uses globals.css `.content` class

### Form Components

#### `Input`
- Label above, input field, optional description
- Hover: border-color transition
- Focus: dual-layer glow
- CSS Modules styling

#### `Toggle`
- Label left, switch right
- Checked: accent-primary background with glow
- stopPropagation on wrapper div prevents accordion collapse

#### `Select`
- Label above, custom dropdown
- Hover: border-color transition
- Focus: dual-layer glow
- Supports both `options` prop and `children` for manual options

#### `Card`
- bg-secondary, border-subtle, rounded-xl (16px)
- Hover: border-active + subtle shadow glow
- Optional title with border-bottom header

#### `ArrayField`
- Label above, list of inputs
- Add button with dashed border + hover glow
- Remove button (X) on each item
- Safe array handling

#### `Button`
- Variants: primary, secondary, ghost, danger
- Hover effects matching theme
- stopPropagation on click

### Feedback Components

#### Floating Preview
- Fixed bottom-right
- Shows JSONC output from generateJsonc
- Monospace font, pre-wrap

---

## 6. Technical Approach

### Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: CSS Modules + CSS Variables (no Tailwind)
- **State**: Zustand with `persist` middleware (localStorage)
- **Icons**: Lucide React
- **Fonts**: Inter via next/font

### Architecture
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, providers
│   ├── page.tsx            # Redirect to /general
│   ├── general/page.tsx
│   ├── server/page.tsx
│   ├── agents/page.tsx
│   ├── permissions/page.tsx
│   ├── tools/page.tsx
│   ├── mcp/page.tsx
│   ├── models/page.tsx
│   ├── formatters/page.tsx
│   ├── commands/page.tsx
│   ├── advanced/page.tsx
│   └── oh-my-openagent/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ContentArea.tsx
│   └── ui/
│       ├── Input.tsx
│       ├── Toggle.tsx
│       ├── Select.tsx
│       ├── Card.tsx
│       ├── ArrayField.tsx
│       ├── Button.tsx
│       └── Accordion.tsx
├── store/
│   └── configStore.ts     # Zustand store with persist
├── lib/
│   ├── schema.ts           # JSON Schema for validation (placeholder)
│   ├── generate-jsonc.ts   # JSON generation with excludeKeys
│   └── import-config.ts    # Import logic (parseJsonc)
└── styles/
    └── globals.css         # CSS variables, theme
```

### Config Schema
Full OpenCode config schema:
- `$schema`, `model`, `provider`, `small_model`
- `server`, `shell`, `tools`, `agent`, `default_agent`, `share`
- `command`, `formatter`, `permission`, `compaction`, `watcher`
- `mcp`, `plugin`, `instructions`
- `disabled_providers`, `enabled_providers`, `experimental`
- `autoupdate`, `snapshot`

Oh My OpenAgent config stored separately at `oh_my_openagent`.

### State Shape
```typescript
type Store = {
  config: OpenCodeConfig
  setConfig: (c: OpenCodeConfig) => void
  update: (path: string, value: any) => void
  reset: () => void
}
```

### JSONC Generation
- Use `JSON.stringify` with 2-space indentation
- `generateJsonc(cfg, excludeKeys)` - excludeKeys for omitting `oh_my_openagent`

### JSONC Import
- `parseJsonc(text)` - strips comments, handles trailing commas, returns null on failure
- `removeComments()` - strips `//` and `/* */` comments

### Docker Self-Hosting
```bash
docker-compose up -d
```
- Dockerfile with multi-stage build
- `output: 'standalone'` in next.config.js

---

## 7. Config Sections Detail

### General
- $schema
- Model, Small Model
- Autoupdate toggle
- Snapshot toggle
- Share mode (manual/auto/disabled)
- Shell

### Server
- Port number
- Hostname
- mDNS enable + domain
- CORS origins (array)

### Agents
- List of custom agents with expandable cards
- Model, Disabled, Mode, Color, Tools, Variant, Temperature, Top_p, Max Tokens, Reasoning Effort

### Permissions
- Per-tool permission rules with expandable cards
- Add/remove permission entries

### Tools
- Toggle for each built-in tool (bash, edit, write, read, grep, glob, etc.)

### MCP Servers
- List of MCP configs with expandable cards
- Name, Type, Command/URL, Enabled toggle
- Add/remove server entries

### Models
- Provider configurations

### Formatters
- List of formatters with expandable cards
- Command, Environment, Extensions, Disabled toggle

### Commands
- List of custom commands with expandable cards
- Template, Description, Agent, Model

### Advanced
- Compaction (auto, prune, reserved)
- Watcher ignore patterns
- Plugin list (ArrayField)
- Instructions files
- Disabled/enabled providers

### Oh My OpenAgent (conditional)
Only shown when `oh-my-openagent` or `oh-my-opencode` in plugins list.
Separate Import/Export via page buttons (not header).

Sections:
- **Agents** - Record of agent configs with model, disabled, mode, color, tools, variant, temperature, etc.
- **Categories** - Built-in categories: visual-engineering, ultrabrain, deep, artistry, quick, unspecified-low, unspecified-high, writing
- **Background Task** - defaultConcurrency, staleTimeoutMs, providerConcurrency, modelConcurrency
- **Sisyphus Agent** - disabled, default_builder_enabled, planner_enabled, replace_plan
- **Sisyphus Tasks** - enabled, storage_path, claude_code_compat
- **Skills** - sources (path, recursive, glob), enable, disable
- **Hooks** - disabled_hooks list
- **Commands** - disabled_commands list
- **Browser Automation** - provider (playwright/agent-browser)
- **Tmux** - enabled, layout, main_pane_size, main_pane_min_width, agent_pane_min_width
- **Git Master** - commit_footer, include_co_authored_by
- **Comment Checker** - custom_prompt
- **Notification** - force_enable
- **Disabled MCPs** - list
- **LSP** - server configs with command, extensions, priority, env, initialization, disabled
- **Runtime Fallback** - boolean or object with retry_on_errors, max_fallback_attempts, cooldown_seconds, timeout_seconds, notify_on_fallback
- **Model Capabilities** - enabled, auto_refresh_on_start, refresh_timeout_ms, source_url
- **Experimental** - key-value record
- **Hashline Edit** - enabled, debounce_ms