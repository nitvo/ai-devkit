# Security policy

## Reporting a vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/nitvo/ai-devkit/security/advisories/new).
Do not open a public issue for a security problem.

Include what you found, how to reproduce it, and the impact you expect. Expect
an acknowledgement within seven days.

## Scope

This project installs skills, a plugin and an MCP server from third-party
sources, then writes a git hook and configuration into your home directory.
Reports about the following are in scope:

- `setup.mjs` writing outside the paths listed in the README.
- `hooks/commit-msg` executing anything from the commit message it inspects.
- The workflow in `.github/workflows/` exposing repository secrets.
- Any instruction inside `skills/` that would lead an agent to exfiltrate data
  or run a destructive command.

## Out of scope

Vulnerabilities in the upstream projects this repository installs belong to
those projects:

- [`Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill)
- [`mattpocock/skills`](https://github.com/mattpocock/skills)
- [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail)
- [`ChromeDevTools/chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)

Report those upstream. Tell us as well if the exposure comes from how this
repository installs them.

## What this project does to your machine

Running `node setup.mjs` in sync mode:

- Moves `~/.claude/skills` and `~/.agents/skills` to timestamped backups, then
  reinstalls both skill bundles from their sources.
- Writes `hooks/commit-msg` to `~/.claude/git-hooks/` and sets
  `core.hooksPath` globally, which applies to every repository on the machine.
- Installs the ponytail plugin and the chrome-devtools MCP server.
- Writes `~/.config/ponytail/config.json`.
- Writes `~/.claude/CLAUDE.md` only when no personal copy exists.

Run `node setup.mjs --dry-run` first to see the exact list without changing
anything.
