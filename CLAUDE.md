# Working agreements

Reply in Vietnamese, even when the question is asked in English.
*(Personal preference — teammates should change or remove this line.)*

## Diction — applies to everything written

Code, comments, documentation, commits, PRs, error messages, logs, UI strings.
Not only commits and PRs.

Five banned word classes:

| Class | Examples |
|---|---|
| Praise | awesome, amazing, powerful, magic, elegant, seamless, robust, blazing, comprehensive |
| Self-assessment | clean, simple, nice, better, improved, optimal, smart |
| Filler | just, simply, easily, very, quite, highly, significantly, greatly |
| Self-reference | this commit, this PR, this function, we now |
| Empty transitions | additionally, furthermore, moreover, it is worth noting |

- A performance or reliability claim carries a **number**, or it is dropped.
- No pictograph emoji, exclamation marks, or rhetorical questions in code or
  documentation. CLI status glyphs (`✓` `✗` `→`) are fine — they carry
  information rather than decoration.
- **Comments**: say WHY, not what the code already says. No obvious comments.
- **Errors and logs**: name what failed and what to do next. No "Oops", nothing vague.
- **Documentation**: statements of fact, not sales copy.

Commit and PR specifics live in the `commit-convention` / `pr-convention` skills.

## Matt Pocock engineering skills (`~/.claude/skills`)

For engineering work, reach for the matching skill instead of doing it by hand:

- Investigating a bug or a performance regression → `diagnosing-bugs`
- Building a feature or fixing a bug test-first → `tdd`
- Implementing against a spec → `implement`, `to-spec`
- Reviewing changes (branch, PR, WIP) → `code-review`
- Researching documentation or an API → `research`
- Designing a module, improving architecture → `codebase-design`, `improve-codebase-architecture`
- Modelling a domain or its terminology → `domain-modeling`
- Splitting work into tickets, triaging → `to-tickets`, `triage`
- Stress-testing a plan before building → `grilling`

Run `/setup-matt-pocock-skills` once per repository before using the engineering group.

## Frontend and design skills (`design-taste-frontend`)

When building a user interface, reach for the matching skill instead of writing
generic UI:

- Landing page, portfolio, or a new page that must not look templated → `design-taste-frontend`
- Direction already settled, only execution left → `high-end-visual-design`
- A specific style → `minimalist-ui`, `industrial-brutalist-ui`
- Reworking an existing web or app interface → `redesign-existing-projects`
- Brand identity, logo, palette → `brandkit`
- Generating mockups to build from → `imagegen-frontend-web`, `imagegen-frontend-mobile`
- Building web code that matches a design image → `image-to-code`

## Chrome DevTools MCP (`chrome-devtools`)

Installed globally; opens a real Chrome window. When inspecting or debugging a
live page, use this MCP instead of guessing:

- Failing requests, payloads, headers, status codes → network
- Console output and JS runtime errors → console
- Page load performance, Core Web Vitals → performance trace
- DOM snapshots, throttled CPU or network → as needed

## Ponytail (code-trimming plugin)

Defaults to `lite` (set in `~/.config/ponytail/config.json`) — it suggests, it
does not cut on its own. Switch to `/ponytail ultra` when clearing out an old
codebase; run `/ponytail-review` before committing.
