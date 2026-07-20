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

| Pattern | Use case |
|---|---|
| `feature/<TICKET>` | New feature |
| `bugfix/<TICKET>` | Bug fix |
| `docs/<TICKET>` | Documentation-only change |
| `chore/<TICKET>` | Maintenance task |
| `<type>/<TICKET>_<M>` | Cherry-pick to the test branch. `M` is the delivery number, starting at `1`, incremented on each re-delivery after a fix |

### PR title

```text
[COMPANY] [TARGET] <TICKET> <Imperative description>
```

- `COMPANY` — the organization that owns the ticket.
- `TARGET` — abbreviated target branch (`STG`, `DEV`, `MAIN`).
- Description: present tense, starts with a verb, no trailing period.

Example: `[Nitvo] [STG] SPR-3 Add bootstrap command`

### Required PR body sections

1. Short description of what the change does.
2. Notable implementation details.
3. Test results with evidence (output, logs, screenshots) where applicable.
4. Cross-reference to the parallel PR (when using the two-PR flow).
5. Link to the ticket.

### Reviewer, assignee, label — all required

Every PR must have all **three** before it is created:

| Item | Rule |
|---|---|
| **Assignee** | The PR author self-assigns (`@me`). If the implementer differs from the author, assign the implementer. |
| **Reviewer** | At least one. This is a **real person** — the user must confirm; never guess a name. |
| **Label** | Chosen from the repository's existing labels. **1–3 most relevant, 5 maximum.** Do not spray labels. |

#### Choosing labels

Always run `gh label list` first and **choose only from what it returns**. Match
by meaning, not exact name (`enhancement` is a fine match for `feature/`).

Priority order — stop once you have 1–3:

1. **Change type**, derived from the branch: `feature/`→`feature`/`enhancement`,
   `bugfix/`→`bug`, `docs/`→`documentation`, `chore/`→`chore`/`maintenance`.
2. **Scope**, only when the diff clearly belongs to one area: `backend`,
   `frontend`, `infra`, `ci`, `database`, `security`.

**Never self-assign labels that encode human judgement**: priority (`P0`,
`high-priority`), severity (`critical`, `blocker`), status
(`needs-discussion`, `wontfix`, `breaking-change`). If one seems needed, **ask
the user**.

**Never create new labels** — that changes repository configuration. If no
suitable label exists, ask the user to pick from the existing list, or ask
permission to create one.

### Two-PR flow

When the repository has **both an integration branch and a test branch**, one
change ships as two PRs:

1. `feature/<TICKET>` → integration branch.
2. `feature/<TICKET>_<M>` → test branch (cherry-picked from PR 1).

If testing finds a bug: fix on `feature/<TICKET>`, create
`feature/<TICKET>_<M+1>`, cherry-pick again. A release is a PR from the
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
- [ ] Labels (1–3, from the existing list)
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
- Are assignee, at least one reviewer, and at least one label all present.

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
