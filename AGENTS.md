# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
```

## Issue Tracking with bd (beads)

**IMPORTANT**: Use **bd** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Create issues
```bash
bd create --title="Summary" --description="Context and what to do" --type=task|bug|feature --priority=2
```

### Issue types
- `bug` — Something broken
- `feature` — New functionality
- `task` — Work item (tests, docs, refactoring)
- `epic` — Large feature with subtasks
- `chore` — Maintenance

### Priorities (0=critical → 4=backlog)
- `0` — Critical (broken builds, data loss)
- `1` — High (major features, important bugs)
- `2` — Medium (default)
- `3` — Low (polish)
- `4` — Backlog

### Agent workflow
1. `bd ready` — find unblocked issues
2. `bd update <id> --status in_progress` — claim it
3. Implement, test, document
4. `bd close <id>` — mark complete
5. `git add && git commit`

### Rules
- ✅ Use bd for ALL task tracking
- ✅ Use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT duplicate tracking systems

## Session Completion

Before ending a session:
1. File issues for remaining work
2. Run quality gates (lint, typecheck, test)
3. Close finished issues
4. Commit all changes
