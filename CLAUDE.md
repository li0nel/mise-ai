# CLAUDE.md — Mise AI Conventions

## Project Overview
Mise is an AI cooking chat app built with Expo SDK 55, React Native, and NativeWind (TailwindCSS v3).

## TypeScript
- **Strict mode** is enabled (`strict: true`, `noUncheckedIndexedAccess: true` in tsconfig.json)
- No `any` types — use `unknown` and narrow with type guards
- All shared types belong in `types/` directory
- Run `npm run typecheck` to check for errors

## Styling
- **NativeWind only** — use the `className` prop for all styling
- Never use `StyleSheet.create` or inline `style` props
- Tailwind config is in `tailwind.config.js`

## Widget Model
The Gemini backend returns `{ blocks: [{ type: string, data: object }] }`. Each block type maps 1:1 to a React Native component. Widget button taps inject a plain-text chat message — no direct state mutations from the widget layer.

## File Structure
```
app/          expo-router screens and layouts
components/   shared React Native components
constants/    Colors, config values
types/        shared TypeScript types
```

## Available Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `expo start` | Expo dev server |
| `npm run ios` | `expo start --ios` | iOS simulator |
| `npm run android` | `expo start --android` | Android emulator |
| `npm run web` | `expo start --web` | Web bundle |
| `npm run lint` | `eslint . --ext .ts,.tsx` | Lint TypeScript files |
| `npm run typecheck` | `tsc --noEmit` | Type check |
| `npm run test` | `jest` | Unit tests |

## Testing Patterns
- Unit tests live next to their source files as `*.test.ts` or `*.test.tsx`
- Use `jest-expo` preset

## Issue Tracking
- Uses **bd** (beads) — see `AGENTS.md`
- Do NOT use TodoWrite, markdown TODOs, or other tracking methods

## Dev Server

### Starting
Run `npm run web` with run_in_background: true. Also tee to log:
`npm run web 2>&1 | tee ./logs/expo-web.log` (run_in_background: true)

### Checking
- Use BashOutput with filter "error|warning|ERROR" to check for issues
- Or read `./logs/expo-web.log` directly (subagents should use this)

### Before Playwright Tests
Always verify the server is responding: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8081`
If not 200, restart the server.

### Restarting
KillBash the existing shell, then re-run with run_in_background: true.

## Playwright Usage
- **No screenshots for verification** — use `playwright-cli snapshot` (accessibility tree) + `playwright-cli console` instead. Screenshots are expensive in tokens and only warranted when visual layout needs inspection.
- **Always check the console** with `playwright-cli console` after every page load.

## Background Task Management
- When a dev server (or any long-running process) was started via `run_in_background`, stop it using `TaskStop` with its task ID — do NOT use `pkill`. The task ID is returned at launch time.

## Dev Server
- Start: `npm run web -- --clear 2>&1 | tee ./logs/expo-web.log` (run_in_background: true) — use `--clear` to bust Metro cache when deps change
- Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8081` must return 200 before Playwright tests
- Stop: `TaskStop` the task ID

## Definition of Done (MANDATORY)
**No work is considered complete until ALL of these pass. Never skip any step.**

1. `npm run typecheck` — zero errors
2. Start the dev server (`npm run web -- --clear`) and verify Metro bundles without errors in the server logs
3. Open every changed/new page in Playwright (`playwright-cli open`, `playwright-cli goto`)
4. Run `playwright-cli console` on every page — **zero errors** required (VERBOSE and INFO are ok)
5. Verify the page content with `playwright-cli snapshot` — confirm it renders what the bead/task requires
6. If anything fails in steps 2-5, fix it and re-verify before committing
7. Only after all checks pass: commit, push

**Subagents implementing beads must also follow this.** QA agents must run the dev server and check with Playwright — `expo export` alone is NOT sufficient.

## Design Fidelity (MANDATORY)
- The HTML mocks in `mocks/` are the **single source of truth** for all UI
- **Never invent, substitute, or approximate** icons, colors, spacing, or layout — reproduce the mock exactly
- If the mock uses an SVG icon, use that exact SVG (install `react-native-svg` if needed) — do NOT replace with emoji or Unicode characters
- If a design element cannot be implemented exactly (e.g., missing dependency), flag it and ask — do NOT silently substitute
- Only deviate from the mocks when the user explicitly asks for a change

## React / Dependency Notes
- `react`, `react-dom`, and related packages must be pinned to exact same version
- After `npm install` changes, restart Metro with `--clear` to avoid stale bundle cache
