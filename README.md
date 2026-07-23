# ai-devkit

One command that brings every machine on a team to the same Claude Code toolset.
Runs on **Windows, Linux and macOS**.

## What every machine gets

**Skills come from two sources:**

| Source | Contents | Example command |
|---|---|---|
| `Leonxlnx/taste-skill` | Interface design that avoids templated output | `/design-taste-frontend` |
| `mattpocock/skills` | Engineering: TDD, review, diagnosis | `/tdd`, `/code-review`, `/diagnosing-bugs` |

**Plus:**

| Component | What it is | Invoked by |
|---|---|---|
| **ponytail** plugin | Pushes toward minimal code | `/ponytail-review`, `/ponytail-audit` |
| **chrome-devtools** MCP | Opens real Chrome for network, console and performance | used automatically when debugging the web |
| **CLAUDE.md** | Shared working agreements | applied every session |
| ponytail default | `lite` | change with `/ponytail ultra` |

## Requirements

**Node.js 22 or newer**, **Claude Code** (the `claude` CLI), **Google Chrome**, **git**.

**GitHub CLI (`gh`)** is needed by the `pr-convention` skill to read labels and
open pull requests. `setup.mjs` installs it through `brew` on macOS or `winget`
on Windows. On Linux it prints instructions instead, to avoid touching `sudo`.

> After installation, run `gh auth login` yourself. Signing in is interactive and
> personal, so the script never does it for you.

## Running it

```bash
git clone <repository-url>
cd ai-devkit
node setup.mjs
```

On **Windows**, use PowerShell or Git Bash with the same command.

### Modes

| Command | Meaning |
|---|---|
| `node setup.mjs` | **Sync**: back up old skills, reinstall both bundles, so every machine matches |
| `node setup.mjs --keep-extras` | **Add only**, keeping whatever skills the machine already has |
| `node setup.mjs --dry-run` | Print what would happen, change nothing |

## Does syncing lose data?

No. Sync **moves** the old skill directories rather than deleting them:

- `~/.claude/skills` becomes `~/.claude/skills.backup-<timestamp>`
- `~/.agents/skills` becomes `~/.agents/skills.backup-<timestamp>`

Both bundles are then reinstalled from source at their latest version. Renaming a
`.backup-*` directory restores the previous state. Delete the backups once you
are satisfied.

> Why reinstall rather than remove a fixed list? Skill repositories grow over
> time, so a hardcoded list goes stale. Reinstalling from source keeps every
> machine on the current version.

## Cross-platform notes

- **Symlinks**: skills install with `--copy`, writing real files, because
  symlinks are unreliable on Windows.
- **Ponytail config path** follows the platform, either `~/.config/ponytail` or
  `%APPDATA%\ponytail`.
- **CLAUDE.md** is always overwritten, because the shared file is the standard
  and a rerun must bring the machine back to it. Any existing file is copied to
  `~/.claude/CLAUDE.md.backup-<timestamp>` first, so personal notes are
  recoverable. Keep such notes in a separate file rather than in `CLAUDE.md`.

## Verifying the install

```bash
claude plugin list      # ponytail@ponytail (enabled)
claude mcp list         # chrome-devtools connected
# open a new session, then type /tdd and /design-taste-frontend
```

## Commit hook

`setup.mjs` installs `hooks/commit-msg` into `~/.claude/git-hooks/` and points
`git config --global core.hooksPath` at it, covering every repository on the
machine.

It rejects a commit when the subject is not a valid Conventional Commit, uses an
unknown type, omits the scope, contains uppercase, or exceeds 72 characters.
Merge, revert, fixup and squash commits are skipped.

```
✗ Commit rejected: not a valid Conventional Commit.
  Received : update stuff
  Expected : <type>(<scope>): <description>   (scope REQUIRED)
```

**Notes:**

- Repositories using **Husky are unaffected**. Husky sets `core.hooksPath`
  locally, and local configuration wins over global.
- A plain `.git/hooks/commit-msg` **is bypassed**. That is the trade-off of a
  global `core.hooksPath`.
- If the machine already sets `core.hooksPath`, setup **leaves it alone** and
  warns.
- Skip once with `git commit --no-verify`. Remove entirely with
  `git config --global --unset core.hooksPath`.

## Enforcement in CI

The local hook can be skipped with `--no-verify` and does not run for commits
made through the web UI. `.github/workflows/commit-lint.yml` is the last line of
defence and runs three jobs:

| Job | Purpose |
|---|---|
| `self-test` | Runs `hooks/test-commit-msg.sh`, 17 cases, so a broken hook cannot land |
| `diction` | Rejects em dashes, clause-joining semicolons and other AI writing tells |
| `commits` | Validates every commit in a pull request using `hooks/commit-msg` itself |

Reusing the hook as the single source of truth means the local rules and the CI
rules cannot drift apart.

To adopt this elsewhere, copy `hooks/` and `.github/workflows/commit-lint.yml`,
then enable branch protection requiring these checks before merge.

## Troubleshooting

**A red banner reading `Failed to install ... PromptScript: PromptScript does not
support global skill installation`** is not an error. PromptScript is one agent
among many and does not support global installs. Claude Code still receives
everything, as the `(copied)` lines just above show. Current versions pass
`--agent claude-code`, so the banner no longer appears.

## Uninstalling

```bash
claude plugin uninstall ponytail@ponytail
claude mcp remove chrome-devtools -s user
npx -y skills remove --global --all
```

## License

Apache-2.0. See [LICENSE](LICENSE).
