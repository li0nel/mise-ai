#!/usr/bin/env python3
import json
import sys
import subprocess
import time

def log(msg):
    print(f"[test-gate] {msg}", file=sys.stderr)

t0 = time.monotonic()
input_data = json.load(sys.stdin)

# CRITICAL: Prevent infinite loops.
# When stop_hook_active is True, Claude is already in a forced
# continuation state from a previous block. Let it stop to
# avoid an infinite retry loop.
if input_data.get('stop_hook_active', False):
    log("stop_hook_active=True, skipping to avoid loop")
    sys.exit(0)

# Early exit: skip checks if no code files were modified.
CODE_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.json', '.css'}

try:
    import os
    diff = subprocess.run(
        ['git', 'diff', '--name-only', 'HEAD'],
        capture_output=True, timeout=10
    )
    untracked = subprocess.run(
        ['git', 'ls-files', '--others', '--exclude-standard'],
        capture_output=True, timeout=10
    )
    all_files = (
        diff.stdout.decode('utf-8', errors='replace').strip().splitlines()
        + untracked.stdout.decode('utf-8', errors='replace').strip().splitlines()
    )
    has_code_changes = any(
        os.path.splitext(f)[1] in CODE_EXTENSIONS
        for f in all_files if f
    )
    if not has_code_changes:
        log("no code changes detected, skipping checks")
        sys.exit(0)  # No code files changed, nothing to verify
    log(f"{len([f for f in all_files if f])} changed files detected")
except Exception as e:
    log(f"git check failed ({e}), running checks anyway")
    pass  # If git check fails, fall through to run checks anyway

# Define your verification checks.
# Each tuple is (command, human-readable error label).
# Adjust these to match your project.
checks = [
    (['npm', 'run', 'typecheck'],  "Type errors"),
    (['npm', 'test'],              "Unit test failures"),
    (['npx', 'playwright', 'test', '--config=tests/playwright.config.ts'], "E2E test failures"),
]

for cmd, error_msg in checks:
    cmd_str = ' '.join(cmd)
    log(f"running: {cmd_str}")
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=240,
            cwd=None  # inherits CLAUDE_PROJECT_DIR
        )
        if result.returncode != 0:
            log(f"FAILED: {error_msg} (exit {result.returncode})")
            # Grab last 500 chars of output for context
            stderr = result.stderr.decode('utf-8', errors='replace')[-500:]
            stdout = result.stdout.decode('utf-8', errors='replace')[-500:]
            detail = stderr or stdout
            print(json.dumps({
                "decision": "block",
                "reason": f"{error_msg}. Fix before completing.\n\n{detail}"
            }))
            sys.exit(0)
        else:
            log(f"passed: {cmd_str}")
    except subprocess.TimeoutExpired:
        log(f"TIMEOUT: {cmd_str} (240s)")
        print(json.dumps({
            "decision": "block",
            "reason": f"{error_msg}: command timed out after 240s."
        }))
        sys.exit(0)
    except FileNotFoundError:
        log(f"skipped: {cmd_str} (command not found)")

elapsed = time.monotonic() - t0
log(f"all checks passed in {elapsed:.0f}s")
sys.exit(0)