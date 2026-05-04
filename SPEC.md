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
- Sidebar width: 240px (collapsed: 64px)

### Motion Philosophy
- **Navigation**: instant color transitions (150ms ease), smooth collapse/expand (250ms ease-out)
- **Cards/panels**: subtle scale on hover (1.01), smooth shadow transitions
- **Modals**: fade + scale from 0.95 (200ms ease-out)
- **Inputs**: focus ring animation (150ms)
- **Success feedback**: brief pulse on accent gradient

### Visual Assets
- **Icons**: Lucide React (consistent 20px stroke-width-1.5)
- **Decorative**: Subtle gradient orbs in background (CSS radial gradients, low opacity)
- **Empty states**: Minimal line illustrations (SVG)

---

## 3. Layout & Structure

### App Shell
```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────────────────┐   │
│  │          │  │  Header: Section title + Actions       │   │
│  │ Sidebar  │  ├─────────────────────────────────────────┤   │
│  │          │  │                                         │   │
│  │ - Logo   │  │  Content Area                           │   │
│  │ - Nav    │  │  (Form fields, cards, config preview)   │   │
│  │   items  │  │                                         │   │
│  │          │  │                                         │   │
│  │          │  │                                         │   │
│  │ ───────  │  │                                         │   │
│  │ Import   │  │                                         │   │
│  │ Export   │  │                                         │   │
│  └──────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Sections (icons + labels)
1. **General** — model, provider, autoupdate, snapshot, share
2. **Server** — port, hostname, CORS, mDNS
3. **Agents** — custom agent configurations
4. **Permissions** — tool permissions, granular rules
5. **Tools** — enable/disable built-in tools
6. **MCP Servers** — local and remote MCP configurations
7. **Models** — provider model options and variants
8. **Formatter** — code formatter configurations
9. **Commands** — custom commands
10. **Advanced** — compaction, watcher, plugins, instructions

### Content Area Pattern
- Section header with description
- Card-based grouping for related settings
- Collapsible subsections within cards
- Inline validation with error states
- "Config Preview" toggle button (bottom-right floating)

### Responsive Strategy
- **Desktop (>1024px)**: Full sidebar + content
- **Tablet (768-1024px)**: Collapsible sidebar overlay
- **Mobile (<768px)**: Bottom tab bar, full-width content

---

## 4. Features & Interactions

### Core Features

#### Config State Management
- All form state stored in React context/Zustand
- Real-time validation against JSON Schema
- Undo/redo stack for changes (Ctrl+Z / Ctrl+Shift+Z)

#### Import Config
- Click "Import" in sidebar footer
- File picker for `.json`, `.jsonc` files
- Parse and validate, show errors if invalid
- Merge with existing state (ask to replace or append)

#### Export Config
- Click "Export" in sidebar footer
- Generate JSONC with comments (for `$schema` and key sections)
- Download as `opencode.jsonc`
- Copy to clipboard option

#### Config Preview Panel
- Floating button bottom-right "Preview"
- Slide-out panel showing live JSONC output
- Syntax highlighted
- Copy button

### Interaction Details

#### Navigation
- Click sidebar item → instant content switch, URL updates
- Active item has accent left border + bg highlight
- Hover: subtle bg change (150ms)

#### Form Inputs
- **Text/Number**: Standard input with label, placeholder, helper text
- **Toggle**: Custom switch with accent color when on
- **Select**: Custom dropdown with search for long lists (models, etc.)
- **Array fields**: Add/remove buttons, drag to reorder (for MCP servers, agents)
- **Object fields**: Expandable accordion

#### Validation
- Real-time JSON Schema validation
- Inline error messages below fields
- Section shows warning badge if has errors

#### Empty States
- First load: welcome message with quick-start suggestions
- Empty arrays: "No items yet" with add button

### Edge Cases
- **Invalid JSON on import**: Show parse error, don't overwrite state
- **Unknown config keys**: Preserve and display in "Unknown Keys" section
- **Very long values**: Truncate in preview, full value in input

---

## 5. Component Inventory

### Layout Components

#### `Sidebar`
- **Default**: 240px width, bg-secondary, border-right
- **Collapsed**: 64px width, icons only, tooltips on hover
- **Nav items**: Icon + label, 44px height, rounded left corners

#### `Header`
- Section title (h1), description (muted)
- Right side: action buttons (context-specific)

#### `ContentArea`
- Max-width 900px, centered
- Generous padding (48px top, 32px sides)

### Form Components

#### `Input`
- **Default**: bg-tertiary border, text-primary
- **Focus**: border-accent-primary, subtle glow
- **Error**: border-error, error message below
- **Disabled**: opacity 0.5, cursor not-allowed

#### `Toggle`
- **Off**: bg-tertiary, border-subtle
- **On**: bg-accent-primary, white checkmark
- **Transition**: 200ms ease

#### `Select`
- Custom dropdown (not native)
- Search input at top for long lists
- Keyboard navigation

#### `Card`
- bg-secondary, border-subtle, rounded-lg (12px)
- Header with title + optional actions
- Content padding 24px

#### `Accordion`
- Click header → expand/collapse content
- Smooth height animation (250ms)
- Chevron rotation on open

#### `ArrayField`
- List of items with add/remove
- Each item is a mini-card
- Drag handle for reorder

### Feedback Components

#### `Toast`
- Bottom-right position
- Success/error/info variants
- Auto-dismiss after 4s
- Slide-in animation

#### `Modal`
- Centered, backdrop blur
- Close on backdrop click or Escape
- Scale-in animation

#### `Tooltip`
- Dark bg, light text
- 8px padding, small radius
- Appears on hover after 500ms delay

### Utility Components

#### `Badge`
- Small pill for status indicators
- Variants: success, warning, error, info, neutral

#### `IconButton`
- 36px square, rounded-md
- Hover: bg-tertiary
- Active: scale 0.95

#### `JsonPreview`
- Syntax highlighted JSONC
- Line numbers
- Copy button

---

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: CSS Modules + CSS Variables (no Tailwind per spec)
- **State**: Zustand for global config state
- **Icons**: Lucide React
- **Fonts**: Inter + JetBrains Mono via next/font

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
│   └── advanced/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ContentArea.tsx
│   ├── ui/
│   │   ├── Input.tsx
│   │   ├── Toggle.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Accordion.tsx
│   │   ├── ArrayField.tsx
│   │   └── ...
│   └── config/             # Config section-specific components
├── store/
│   └── configStore.ts     # Zustand store
├── lib/
│   ├── schema.ts           # JSON Schema for validation
│   ├── generate-jsonc.ts   # JSONC generation
│   └── import-config.ts    # Import logic
└── styles/
    ├── globals.css
    └── variables.css
```

### Config Schema
Full OpenCode config schema from `https://opencode.ai/config.json`:
- `$schema`, `model`, `provider`, `small_model`
- `server`, `shell`, `tools`, `agent`, `default_agent`, `share`
- `command`, `formatter`, `permission`, `compaction`, `watcher`
- `mcp`, `plugin`, `instructions`
- `disabled_providers`, `enabled_providers`, `experimental`
- `autoupdate`, `snapshot`

### State Shape
```typescript
interface ConfigState {
  config: OpenCodeConfig;
  errors: Record<string, string>;
  isDirty: boolean;

  // Actions
  updateField: (path: string, value: unknown) => void;
  importConfig: (json: string) => void;
  exportConfig: () => string;
  resetConfig: () => void;
}
```

### JSONC Generation
- Use `JSON.stringify` with circular reference handling
- Add comments for section headers
- Preserve `$schema` at top
- Format with 2-space indentation

---

## 7. Config Sections Detail

### General
- Model selection (text input with model suggestions)
- Small model selection
- Provider options (timeout, etc.)
- Autoupdate toggle + "notify" option
- Snapshot toggle
- Share mode (manual/auto/disabled)

### Server
- Port number
- Hostname
- mDNS enable + domain
- CORS origins (array)

### Agents
- List of custom agents
- Each agent: name, description, model, prompt, mode, permissions, temperature, max_steps

### Permissions
- Global permission mode (allow/ask/deny)
- Per-tool granular rules
- External directory rules

### Tools
- Toggle for each built-in tool (bash, edit, write, read, grep, glob, lsp, apply_patch, skill, todowrite, webfetch, websearch, question)

### MCP Servers
- List of MCP configs
- Each: name, type (local/remote), command/url, headers, environment, enabled

### Models
- Provider-specific model options
- Variants configuration

### Formatters
- List of formatters
- Each: command, environment, extensions, disabled

### Commands
- List of custom commands
- Each: name, template, description, agent, model

### Advanced
- Compaction (auto, prune, reserved)
- Watcher ignore patterns
- Plugin list
- Instructions files list
- Disabled/enabled providers