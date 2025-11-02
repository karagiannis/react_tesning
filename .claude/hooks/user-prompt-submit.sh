#!/bin/bash
# Claude Code Hook: Auto-approve safe commands
# This hook runs before my response to auto-approve certain commands

# Get the command from stdin (the Bash tool call)
COMMAND=$(cat)

# Auto-approve safe read-only commands
if [[ "$COMMAND" =~ ^(ls|cat|head|tail|grep|find|wc|pwd|echo|tree|stat|file|du|df)[[:space:]] ]] || \
   [[ "$COMMAND" =~ ^git[[:space:]]+(status|log|show|diff|grep|branch)[[:space:]] ]] || \
   [[ "$COMMAND" =~ ^python3?[[:space:]]+-m[[:space:]]+pytest ]] || \
   [[ "$COMMAND" =~ ^\./venv/bin/pytest ]] || \
   [[ "$COMMAND" =~ ^ps[[:space:]]aux ]] || \
   [[ "$COMMAND" =~ ^systemctl[[:space:]]+status ]] || \
   [[ "$COMMAND" =~ ^which[[:space:]] ]] || \
   [[ "$COMMAND" =~ ^basename[[:space:]] ]] || \
   [[ "$COMMAND" =~ ^dirname[[:space:]] ]]; then
    # Auto-approve these commands
    echo "APPROVE"
    exit 0
fi

# Auto-approve npm/pip install (common dev tasks)
if [[ "$COMMAND" =~ ^npm[[:space:]]+install ]] || \
   [[ "$COMMAND" =~ ^pip[[:space:]]+install ]] || \
   [[ "$COMMAND" =~ ^python3[[:space:]]+-m[[:space:]]+pip[[:space:]]+install ]]; then
    echo "APPROVE"
    exit 0
fi

# Auto-approve safe Python operations
if [[ "$COMMAND" =~ ^python3?[[:space:]]+-m[[:space:]]+venv ]] || \
   [[ "$COMMAND" =~ ^\./venv/bin/pip[[:space:]]+install ]]; then
    echo "APPROVE"
    exit 0
fi

# BLOCK dangerous commands (require manual approval)
if [[ "$COMMAND" =~ ^(rm|rmdir|del|chmod|chown|kill|curl|wget|eval)[[:space:]] ]] || \
   [[ "$COMMAND" =~ (sudo|su[[:space:]]) ]] || \
   [[ "$COMMAND" =~ [;|&][[:space:]]*(rm|curl|wget) ]]; then
    # Require manual approval for these
    echo "DENY"
    exit 0
fi

# For everything else, let Claude Code decide (default behavior)
exit 0
