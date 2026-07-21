---
name: pr-convention
description: Branch naming and pull request standard for every project — branch format, PR title, required description sections, two-PR flow, reviewer/assignee/label. Detects ticket prefix, target branch and organization from the repo itself; asks when it cannot. Use whenever creating or preparing a pull request, naming a branch, running `gh pr create`, reviewing a PR title, or when the user says "create a PR", "raise a PR", "open a pull request", "tạo PR", "mở pull request", "đặt tên nhánh".
---

# Branch & Pull Request Standard

The standard lives **in this skill**, so it works on any project, including
repositories with no `CONTRIBUTING.md`. If the repository **does** have a
`CONTRIBUTING.md` or PR template, **that file wins** — read it and follow it.

---

## 1. Default standard

### Branches

Short-lived branches cut from the integration branch. `<TICKET>` is the ticket
id (for example `SPR-42`).

The prefix is the **Conventional Commits type** of the change — the same word
used in the commit. The `type:` label often uses a different word; see the
mapping table below.

| Pattern | Use case |
|---|---|
| `<type>/<TICKET>` | `feat/`, `fix/`, `docs/`, `refactor/`, `perf/`, `test/`, `ci/`, `build/`, `chore/` |
| `<type>/<TICKET>_<M>` | Cherry-pick to the test branch. `M` is the delivery number, starting at `1`, incremented on each re-delivery after a fix |

Example: `build/SPR-8`, then `build/SPR-8_1` for the cherry-pick.

### PR title

```text
[COMPANY] [TARGET] <TICKET> <Imperative description>
```

- `COMPANY` — the organization that owns the ticket.
- `TARGET` — abbreviated target branch (`STG`, `DEV`, `MAIN`).
- Description: present tense, starts with a verb, no trailing period.
- **Sentence case** — capitalise the first word only: `Configure npm publishing`.
  This differs from commit subjects, which are entirely lowercase.

Example: `[Nitvo] [STG] SPR-3 Add bootstrap command`

### PR body

If the repository has a `.github/PULL_REQUEST_TEMPLATE.md`, fill that in and
skip this section. Otherwise use this structure, keeping every heading:

```markdown
## Description

State what changed and why. Keep it short.

## Type of change

- [x] `build` - Build system or dependency change

## Changes

- `path/to/file` - what changed and why it was needed

## Testing

- [x] `npm test` - 16/16 pass
- [x] `npm run build` - emits `dist/`

## Checklist

- [ ] Tests added or updated
- [ ] Documentation updated for user-facing changes
- [ ] PR title follows the required format

## Notes

Implementation notes, compatibility notes, or follow-up work.

## Related PRs

| PR | Branch | Description |
|----|--------|-------------|
| #15 | `build/SPR-8` -> `staging` | This PR |
| #16 | `build/SPR-8_1` -> `develop` | Cherry-pick |

## Linked issue

[SPR-8](https://jira.example.com/browse/SPR-8)
```

Rules for filling it in:

- **Type of change** — tick exactly one, the same type as the branch prefix and
  the commit. Append `!` for a breaking change. Note the `type:` label may use a
  different word (`feat` -> `type: feature`).
- **Changes** — list at file level, say what changed and why, not just the path.
- **Testing** — paste real command output as evidence. Long output goes in a
  `<details><summary>` block. Use `N/A` only when the change has no runtime
  effect, such as documentation. **Never tick a check that was not run.**
- **Related PRs** — required for the two-PR flow; cross-reference both PRs of
  the same ticket. Drop the section when there is only one PR.
- **Linked issue** — the ticket URL. Detect the tracker base URL from earlier
  PRs; if it cannot be detected, **ask the user**. Never invent one.
- Drop `Notes` when there is nothing to say. Keep every other heading.

### Reviewer, assignee, label — all required

Every PR must have all **three** before it is created:

| Item | Rule |
|---|---|
| **Assignee** | The PR author self-assigns (`@me`). If the implementer differs from the author, assign the implementer. |
| **Reviewer** | At least one. This is a **real person** — the user must confirm; never guess a name. |
| **Label** | Exactly **three**, one from each of `target:`, `type:`, `area:`. Nothing else. |

#### Choosing labels

Run `gh label list` first and **choose only from what it returns**.

When the repository uses namespaced labels, apply exactly one from each of these
three namespaces — no more, no less:

| Namespace | Derived from | Example |
|---|---|---|
| `target:` | The base branch | `target: staging`, `target: develop`, `target: main` |
| `type:` | The change type — **see the mapping table below; the label is often not the same word as the commit type** | `type: feature`, `type: bug`, `type: build` |
| `area:` | The part of the codebase the diff touches | `area: ci`, `area: docs`, `area: skills`, `area: tooling` |

#### Commit type to `type:` label

The label vocabulary and the Conventional Commits vocabulary are **not the same
words**. Never assume `feat` maps to `type: feat` — it does not exist. Map like
this, then confirm the label actually exists in `gh label list`:

| Commit type | Branch prefix | `type:` label |
|---|---|---|
| `feat` | `feat/` | `type: feature` |
| `fix` | `fix/` | `type: bug` |
| `perf` | `perf/` | `type: performance` |
| `docs` | `docs/` | `type: docs` |
| `refactor` | `refactor/` | `type: refactor` |
| `test` | `test/` | `type: test` |
| `build` | `build/` | `type: build` |
| `ci` | `ci/` | `type: ci` |
| `chore` | `chore/` | `type: chore` |

Some repositories carry labels with no Conventional Commits equivalent —
`type: dependencies`, `type: security`, `type: enhancement`, `type: style`.
**Prefer the more specific label when it fits**: a dependency bump commits as
`chore` or `build` but is better labelled `type: dependencies`; a security fix
commits as `fix` but is better labelled `type: security`.

If no label matches, pick the closest by meaning. If nothing is close, **ask the
user** — do not create a label.

#### Namespaces to never touch

A repository may carry many more namespaces — `priority:`, `severity:`,
`status:`, `size:`, `impact:`, `changelog:`, `quality:`. **Never self-assign
any of them.** They encode human triage judgement. If one seems needed, **ask
the user**.

When the repository has no namespaced labels, fall back to the closest plain
labels by meaning (`enhancement` for a feature), still **1–3 maximum**.

**Never create new labels** — that changes repository configuration. If no
suitable label exists, ask the user to pick from the existing list, or ask
permission to create one.

### Two-PR flow

When the repository has **both an integration branch and a test branch**, one
change ships as two PRs:

1. `<type>/<TICKET>` → integration branch.
2. `<type>/<TICKET>_<M>` → test branch (cherry-picked from PR 1).

If testing finds a bug: fix on `<type>/<TICKET>`, create
`<type>/<TICKET>_<M+1>`, cherry-pick again. A release is a PR from the
integration branch to the production branch.

If the repository has only one main branch → **a single PR**; skip the
cherry-pick entirely.

### Review & merge

- At least one approval before merge.
- Squash merge is the default for integration and test branches.
- **On squash, do not reuse the PR title as the commit message.** The PR title
  carries the `[COMPANY] [TARGET]` prefix and is therefore not a valid
  Conventional Commit. Write a separate commit message using the
  `commit-convention` skill.

---

## 2. Detect project-specific values

Never ask for anything that can be derived. Detection order:

| Value | How to detect |
|---|---|
| Ticket prefix | `git branch -r` and `git log --oneline -50`, look for `[A-Z]{2,}-\d+` |
| Target branch | `git branch -r` — check for `staging`, `develop`, `main`/`master` |
| `COMPANY` | Organization in the remote: `git remote get-url origin` → `github.com/<org>/…` |
| `TARGET` | Derived from the target branch: `staging`→`STG`, `develop`→`DEV`, `main`→`MAIN` |
| Number of PRs | Integration + test branches present → 2 PRs; only `main` → 1 PR |
| Available labels | `gh label list` — choose only from this list |
| Suggested reviewer | `CODEOWNERS` (root, `.github/`, `docs/`); otherwise `gh pr list --state merged --limit 20 --json reviews` to see who usually reviews |
| Assignee | `gh api user --jq .login` → defaults to `@me` |

---

## 3. Ask when detection is not conclusive

**Run this check before every PR.** Walk the whole checklist; if any item cannot
be detected, conflicts, or **can only be guessed rather than confirmed** → **ask
the user**. Do not guess, do not borrow values from another project, do not
silently skip.

Checklist for every PR:

- [ ] Ticket prefix and number
- [ ] Branch name matches the pattern
- [ ] Target branch
- [ ] `COMPANY` and `TARGET` in the title
- [ ] Number of PRs to create (1 or 2)
- [ ] Assignee
- [ ] Reviewer
- [ ] Labels — one each of `target:`, `type:`, `area:`
- [ ] Test results — actually run, or explicitly not run

How to ask:

- Batch **all** questions into **one** round, each with a proposed answer so the
  user only has to confirm. Never drip-feed questions one at a time.
- State what was detected and why it is not certain.

Never fabricate, always ask:

- **Ticket number** — do not infer it from a branch name that does not follow
  the pattern.
- **Test results** — report only what actually ran; if nothing ran, say so.
- **Reviewer** — requesting review notifies a real person. Proposing a name from
  `CODEOWNERS` or review history is fine, but the user must confirm before it is
  assigned.

---

## 4. Pre-flight checks

- Does the current branch name match the pattern → if not, report it and propose
  a correct name.
- Is the target branch correct.
- Has the branch been pushed to the remote.
- Is the change scoped to one concern → if it mixes several, say so.
- Are assignee, at least one reviewer, and all three labels present.

---

## 5. Confirm before creating

Creating a PR is an outward action. **Print the title, body, and
reviewer/assignee/label for the user and wait for approval** before running:

```bash
gh pr create \
  --base <target-branch> \
  --title "[COMPANY] [TARGET] <TICKET> <description>" \
  --body-file <file> \
  --assignee @me \
  --reviewer <user1>[,<user2>] \
  --label <label>
```

---

## Prohibited

- Fabricating ticket numbers, Jira ids, test results, or evidence.
- Emoji, marketing language, or AI-style prose in the title or body.
- Running `gh pr create` before the user approves.
- Renaming a branch or force-pushing without asking.
