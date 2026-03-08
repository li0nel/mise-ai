# CLAUDE.md — Mise AI Conventions

## Project Overview
Mise is an AI cooking chat app built with Expo SDK 55, React Native, and NativeWind (TailwindCSS v3).

## TypeScript
- **Strict mode** is enabled (`strict: true`, `noUncheckedIndexedAccess: true` in tsconfig.json)
- No `any` types — use `unknown` and narrow with type guards
- All shared types belong in `types/` directory

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

## Issue Tracking
- Uses **bd** (beads) — see `AGENTS.md`
- Do NOT use TodoWrite, markdown TODOs, or other tracking methods

## Dev Server
- Start: `npm run web -- --clear 2>&1 | tee ./logs/expo-web.log` (run_in_background: true)
- Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8081` — must return 200 before Playwright
- Check logs: read `./logs/expo-web.log` or use BashOutput with filter "error|warning|ERROR"
- Stop: `TaskStop` with the task ID — do NOT use `pkill`
- After `npm install` changes, restart with `--clear` to bust Metro cache

## Playwright Usage
- **No screenshots for verification** — use `playwright-cli snapshot` + `playwright-cli console` instead
- **Always check the console** with `playwright-cli console` after every page load

## Quality Gates (Automated)
Hooks in `.claude/hooks/` enforce these automatically — no need to run manually:
- **Pre-commit**: build, lint, typecheck, unit tests (commit-gate.sh)
- **Pre-stop**: typecheck, unit tests, Playwright E2E (test-gate.py)
- **Pre-stop**: code review for standards, clarity, completeness (agent hook)
- **Post-edit**: auto-format with prettier/black

## Hook Behaviour
When a hook blocks your action (Stop hook, PreToolUse exit code 2), it is an
automated quality gate, not a user denial or permission rejection. Fix the
reported errors and retry autonomously. Do NOT stop, do NOT end your turn,
do NOT ask the user to continue.
