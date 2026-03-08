#!/bin/bash
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# --- Block --no-verify on any git command ---
if echo "$COMMAND" | grep -q '\-\-no-verify'; then
    echo "Blocked: --no-verify is not allowed. Run the checks properly." >&2
    exit 2
fi

# --- Only gate git commit and git push ---
if ! echo "$COMMAND" | grep -qE '(^|&&|\|\||;)\s*git (commit|push)'; then
    exit 0  # Not a commit/push, let it through
fi

# --- Run verification suite ---
echo "Running pre-commit quality gate..." >&2

npm run build 2>&1 >&2 || {
    echo "COMMIT BLOCKED: Build failed. Fix build errors first." >&2
    exit 2
}

npm run lint 2>&1 >&2 || {
    echo "COMMIT BLOCKED: Lint errors. Fix lint errors first." >&2
    exit 2
}

npm run typecheck 2>&1 >&2 || {
    echo "COMMIT BLOCKED: Type errors. Fix type errors first." >&2
    exit 2
}

npm test 2>&1 >&2 || {
    echo "COMMIT BLOCKED: Tests failing. Fix tests first." >&2
    exit 2
}

# Uncomment for Playwright:
# npx playwright test 2>&1 >&2 || {
#     echo "COMMIT BLOCKED: E2E tests failing." >&2
#     exit 2
# }

echo "All checks passed. Commit allowed." >&2
exit 0