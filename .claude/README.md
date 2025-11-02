# Claude Code Configuration

This directory contains configuration for Claude Code (Extensions-Claude).

## Hooks

### user-prompt-submit.sh
Automatically approves safe commands to speed up development workflow.

**Auto-approved commands:**
- Read-only: `ls`, `cat`, `grep`, `find`, `head`, `tail`, etc.
- Git read: `git status`, `git log`, `git diff`, etc.
- Testing: `pytest`, `python -m pytest`
- Package install: `npm install`, `pip install`

**Requires manual approval:**
- Destructive: `rm`, `chmod`, `kill`, etc.
- Network: `curl`, `wget`
- Privilege escalation: `sudo`, `su`

## Slash Commands

Available commands (type `/` to see them):

- `/test` - Run all tests
- `/sie-test` - Run SIE parser tests only
- `/test-coverage` - Run tests with coverage report
- `/check-vba` - Compare Python output with VBA exports
- `/status` - Show project status summary

## Adding New Commands

Create a new file in `commands/` directory:

```markdown
# /mycommand - Description

Command description and instructions for Claude.

\```bash
# Commands to run
\```
```

## Documentation

For more info: https://docs.claude.com/en/docs/claude-code
