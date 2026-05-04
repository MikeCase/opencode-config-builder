# OpenCode Config Builder

**Generated:** 2026-05-03
**Stack:** Next.js 16 (App Router) + React 19 + Zustand + CSS Modules + TypeScript

## OVERVIEW
Visual config editor for OpenCode AI coding agent. Export `opencode.jsonc` for all OpenCode settings.

## STRUCTURE
```
src/
├── app/                    # 10 route pages (general, server, agents, mcp, etc.)
├── components/
│   ├── layout/            # Sidebar, Header, ContentArea
│   └── ui/               # Input, Toggle, Select, Card, ArrayField, Button
├── lib/                   # generate-jsonc, import-config, schema
├── store/                 # Zustand configStore
├── styles/               # globals.css (CSS variables)
└── types/                # CSS module declarations
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| State management | `src/store/configStore.ts` |
| Config pages | `src/app/[section]/page.tsx` |
| UI components | `src/components/ui/` |
| Global styles | `src/styles/globals.css` |
| JSONC export | `src/lib/generate-jsonc.ts` |

## CONVENTIONS
- CSS Modules per component (`.module.css` files)
- `'use client'` directive on all components using hooks/zustand
- Zustand store uses dot-path updates: `update('server.port', 4096)`
- CSS variables for theming (defined in `globals.css`)

## ANTI-PATTERNS
- No Tailwind (CSS Modules only)
- No component libraries (custom UI only)
- No `any` types in store (use proper OpenCodeConfig type)

## COMMANDS
```bash
npm run dev    # Start dev server
npm run build  # Production build
```

## MCP SERVERS AVAILABLE

### chrome-devtools
Browser automation. Navigate, fill forms, click, screenshot, evaluate JS, network inspection.
**Key tools:** `navigate_page`, `take_snapshot`, `click`, `fill`, `fill_form`, `take_screenshot`, `evaluate_script`

### websearch
Web search via Exa. Find current info, news, facts.
**Key tools:** `web_search_exa` with natural language queries

### context7
Library documentation lookup. Get up-to-date docs and code examples.
**Key tools:** `context7_resolve-library-id`, `context7_query-docs`

### grep_app
GitHub code search. Find real-world implementation patterns.
**Key tools:** `grep_app_searchGitHub` - search by code patterns, language, repo

### graymatter
Persistent memory/knowledge graph. Store and recall facts across sessions.

## MCP Tool Reference

Five tools are registered by `graymatter mcp serve` (see [`cmd/graymatter/internal/mcp/server.go`](../cmd/graymatter/internal/mcp/server.go)). **Parameter names are not uniform** — check the table before calling.

| Tool | Required params | Optional params | Returns |
|------|----------------|-----------------|---------|
| `memory_search` | `agent_id` (string), `query` (string) | `top_k` (int, default `8`) | Newline-separated fact texts (deduped) |
| `memory_add` | `agent_id` (string), `text` (string) | — | Confirmation string |
| `checkpoint_save` | `agent_id` (string) | `state` (JSON-encoded string) | Checkpoint ID + RFC3339 timestamp |
| `checkpoint_resume` | `agent_id` (string) | — | JSON: `{id, created_at, state}` (latest checkpoint) or empty if none |
| `memory_reflect` | `action` (`add`\|`update`\|`forget`\|`link`), **`agent`** (string), `text` (string) | `target` (string — old fact text for `update`/`forget`; target node ID for `link`) | Confirmation string |

> ⚠️ **`memory_reflect` uses `agent`, not `agent_id`.** The other four tools use `agent_id`. If your client builds tool calls programmatically, branch on tool name.

### Return-shape examples

```jsonc
// memory_search
"User prefers TypeScript with strict mode\nProject uses pnpm, not npm\nAuth tokens live in HttpOnly cookies"

// checkpoint_resume (no checkpoint yet)
""

// checkpoint_resume (latest)
{
  "id": "ckpt_01HW...",
  "created_at": "2026-04-28T13:42:11Z",
  "state": "{\"task\":\"db migration\",\"step\":3}"
}
```

---

## When to Use Memory

### ALWAYS store

- **User preferences** — coding style, communication preferences, tool choices
- **Project conventions** — "this repo uses tabs not spaces", "never use X library"
- **Architecture decisions** — "chose PostgreSQL over MySQL because…"
- **Bug fixes & workarounds** — "fixed by upgrading to v2.3, don't downgrade"
- **Recurring patterns** — "user always asks for TypeScript examples first"
- **Environment quirks** — "needs `NODE_OPTIONS=--max-old-space-size=4096`"
- **Stakeholder info** — "CTO prefers detailed explanations, CEO wants summaries"

### NEVER store

- **Conversation logs** — raw back-and-forth without conclusions
- **Duplicate information** — already in README, AGENTS.md, or code comments
- **Speculative thoughts** — "maybe we should try X" (store after the decision)
- **Secrets or credentials** — use proper secret management
- **Large outputs** — store the insight, not the 500-line stack trace

(Transient session state goes in a checkpoint, not a memory — see Anti-Pattern §5.)

### Decision Framework

```
About to store something?
├── Is it a conclusion / fact / preference?     → YES, store it
├── Is it raw conversation without insight?     → NO, extract insight first
├── Is it already documented in code/README?    → NO, reference docs instead
├── Will this still matter in 10 sessions?      → YES, store it
├── Is it temporary debugging state?            → NO, use checkpoint
└── Is it a secret / credential?                → NO, never store in memory
```
---

## Memory Operations

### `memory_add` — store a clean fact

Use when you have a single, atomic, well-formed fact.

**Good:**
```jsonc
{ "tool": "memory_add", "args": {
    "agent_id": "frontend-agent",
    "text":     "User prefers Tailwind CSS over styled-components"
}}

{ "tool": "memory_add", "args": {
    "agent_id": "backend-agent",
    "text":     "API rate limit: 100 req/min — exceeded returns 429 with Retry-After header"
}}
```

**Bad:**
```jsonc
// Too vague
{ "agent_id": "agent", "text": "user likes things" }

// Conversation log
{ "agent_id": "agent", "text": "User: Can you help? Agent: Sure, what do you need?" }

// Duplicate (already in README)
{ "agent_id": "agent", "text": "Project uses React" }
```

### `memory_search` — retrieve relevant context

Always search before acting on ambiguous requests. Phrase the query as the *task you're trying to do*, not as keywords.

**Good queries:**
```jsonc
{ "agent_id": "frontend-agent",
  "query":    "how should I style this component",
  "top_k":    5 }

{ "agent_id": "backend-agent",
  "query":    "authentication middleware patterns for this project",
  "top_k":    8 }
```
---

## Memory Hygiene

### Fact-quality checklist

Before storing, verify the fact:

- [ ] **Atomic** — one idea per fact, not a paragraph
- [ ] **Timeless** — still true in 3 months
- [ ] **Actionable** — helps future-you make better decisions
- [ ] **Specific** — "prefers tabs", not "has preferences"
- [ ] **Self-contained** — readable without conversation context

### Decay & consolidation

Facts decay. A fact you never recall will eventually be pruned.

**Mechanics** (defaults from [`config.go`](../config.go)):
- Initial weight = `1.0`
- Exponential decay based on time since last access
- Half-life = `30 days` (`DecayHalfLife = 720h`)
- Pruned when weight `< 0.01`
- Recall resets the decay clock for that fact
- Consolidation triggers when an agent has ≥ `ConsolidateThreshold` (default `20`) facts; runs async unless `AsyncConsolidate = false`; up to `MaxAsyncConsolidations` (default `2`) goroutines concurrently

**Implications:**
```jsonc
// Anti-pattern: store once, never reference → pruned in ~60 days
{ "tool": "memory_add", "args": { "agent_id": "agent", "text": "Critical security policy: …" }}
// Then never search for it.

// Better: keep important facts warm by including them in routine context-gathering.

// Best: pin truly permanent rules to the shared namespace (see "Shared memory" below).
```

### Cleanup schedule

Every 10–20 sessions, sweep:

```bash
# 1. List everything for an agent
graymatter recall <agent_id> "*" --all

# 2. Identify low-quality entries (vague, outdated, duplicate)
# 3. Clean up via memory_reflect (forget / update)
```

---

## Shared Memory (`__shared__`)

GrayMatter reserves the agent ID `__shared__` (the constant `SharedAgentID` in [`pkg/memory/store.go:40`](../pkg/memory/store.go)) for facts every agent in this workspace should see — project conventions, team rules, security policies.

There is **no magic routing** at the MCP layer. To write or read shared memory, just pass `__shared__` as the `agent_id` parameter exactly like any other agent ID:

```jsonc
// Write a project-wide rule
{ "tool": "memory_add", "args": {
    "agent_id": "__shared__",
    "text":     "Project convention: all timestamps stored as UTC ISO-8601 strings"
}}

// Read it
{ "tool": "memory_search", "args": {
    "agent_id": "__shared__",
    "query":    "timestamp conventions",
    "top_k":    5
}}
```

**Per-agent + shared in one shot**: issue two calls (one with the agent's own ID, one with `__shared__`) and merge the results. The Go library exposes a `RecallAll(agentID, query)` helper that does this for you ([`graymatter.go`](../graymatter.go)) — there is no MCP equivalent.

**Shared-memory best practices:**
- Store **project-wide** conventions, not agent-specific preferences
- Prefix shared facts with intent: `"Project convention: …"`, `"Team rule: …"`, `"Security policy: …"`
- Keep it small and high-signal (≲ 50 facts)
- The CLI `--shared` flag on `graymatter remember` / `graymatter recall` writes/reads this namespace directly

---

## Session Continuity Patterns

### Pattern 1: memory-first boot

```jsonc
// 1. Was I interrupted?
{ "tool": "checkpoint_resume", "args": { "agent_id": "my-agent" } }

// 2. Pull relevant memories for the current task
{ "tool": "memory_search", "args": {
    "agent_id": "my-agent",
    "query":    "<current task description>",
    "top_k":    8
}}

// 3. Pull shared context
{ "tool": "memory_search", "args": {
    "agent_id": "__shared__",
    "query":    "<current task description>",
    "top_k":    5
}}

// 4. Concatenate into the system prompt and proceed.
```

### Pattern 2: continuous learning

After significant interactions, extract atomic conclusions and `memory_add` them. Don't store the conversation; store what you *learned*.

### Pattern 3: multi-agent coordination

```jsonc
// Agent-A discovers a convention
{ "tool": "memory_add", "args": { "agent_id": "agent-a",
    "text": "Use async/await, not callbacks" }}

// Promote it to shared so Agent-B sees it on their next recall
{ "tool": "memory_add", "args": { "agent_id": "__shared__",
    "text": "Project convention: use async/await, not callbacks" }}

// Agent-B picks it up via shared search
{ "tool": "memory_search", "args": {
    "agent_id": "__shared__",
    "query":    "async patterns" }}
```
