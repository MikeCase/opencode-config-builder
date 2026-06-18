# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.2.2] - 2026-06-17

### Added

- JSON syntax highlighting in Live Preview (keys, strings, numbers, booleans)
- Cmd+S / Ctrl+S keyboard shortcut to export config
- Toast notifications for export, copy, and reset actions
- Contextual empty-state icons across MCP, Agents, Formatters, Commands, Models pages
- 24-hour cooldown on What's New modal after dismissal

### Changed

- Reduced gradient usage — accent gradient reserved for primary buttons
- Improved card contrast with new `--bg-card` design token
- Description text bumped to 13px for readability
- Floating preview width reduced to 380px for better content balance
- Snapshot toggle rephrased (no undo/redo UI exists)

### Fixed

- Copy button "Copied!" state now has correct CSS variable references
- What's New modal now shows per-version-changes correctly with timestamp
- Several minor CSS variable and layout inconsistencies

### Accessibility

- Global `:focus-visible` outlines for keyboard navigation
- Accordion headers now have `role="button"`, `tabIndex`, `aria-expanded`
- Keyboard support (Enter/Space) for accordion toggles

## [0.2.1] - 2026-06-15

### Added

- Live Preview: Copy button to copy generated config to clipboard
- Doc links: ⓘ icon next to every config field label linking to OpenCode docs

## [0.1.0] - 2026-06-12

### Added

- Visual configuration editor for OpenCode with 10 config sections
- Live JSONC preview panel with syntax highlighting
- Import/Export configuration as JSONC files
- Oh My OpenAgent plugin support with separate config file
- Mobile responsive design with hamburger menu and slide-in sidebar drawer
- Collapsible preview on mobile (starts hidden, tap `</>` icon to show)
- What's New popup shown once per version (persisted to localStorage)
- Dark theme with blue/purple accent gradient
- Zustand state management with localStorage persistence