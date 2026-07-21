#!/usr/bin/env node
// Shared team bootstrap. Brings every machine to the same Claude Code toolset.
// Runs on Windows, Linux and macOS.
//
//   node setup.mjs               # sync (clear old skills, reinstall both bundles)
//   node setup.mjs --keep-extras # do not clear, only add, keep existing skills
//   node setup.mjs --dry-run     # print what would happen, change nothing
//
// The standard skill set comes from two sources:
//   * Leonxlnx/taste-skill   (interface design)
//   * mattpocock/skills      (engineering: tdd, code-review, diagnosing-bugs)
//
// Clearing never deletes. It moves the old skill directory to .backup-<timestamp>
// so the change is reversible. Idempotent: running it again is safe.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, writeFileSync, renameSync, readdirSync, cpSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const IS_WIN = process.platform === "win32";
const ARGV = process.argv.slice(2);
const DRY = ARGV.includes("--dry-run");
const PRUNE = !ARGV.includes("--keep-extras");
const HOME = homedir();
const ok = [], skip = [], fail = [];
const stamp = new Date().toISOString().replace(/[:.]/g, "-");

function run(label, cmd, { tolerate = false } = {}) {
  process.stdout.write(`\n▶ ${label}\n  $ ${cmd}\n`);
  if (DRY) { skip.push(`${label} (dry-run)`); return; }
  try { execSync(cmd, { stdio: "inherit", shell: true }); ok.push(label); }
  catch (e) {
    if (tolerate) { skip.push(label); process.stdout.write(`  (skipped, probably already installed)\n`); }
    else { fail.push(label); process.stdout.write(`  ✗ error: ${e.message}\n`); }
  }
}
function backupDir(dir) {
  if (!existsSync(dir)) return null;
  const bak = `${dir}.backup-${stamp}`;
  process.stdout.write(`\n▶ Backing up (moving) ${dir}\n  -> ${bak}\n`);
  if (DRY) { skip.push(`backup ${dir} (dry-run)`); return bak; }
  try { renameSync(dir, bak); ok.push(`Backed up ${dir}`); return bak; }
  catch (e) { fail.push(`Backup ${dir}`); process.stdout.write(`  ✗ ${e.message}\n`); return null; }
}

// ── 0. Preconditions ─────────────────────────────────────────────────────
if (Number(process.versions.node.split(".")[0]) < 22) {
  console.error(`\n✗ Node.js >= 22 required (found ${process.versions.node}). Upgrade and rerun.`);
  process.exit(1);
}
try { execSync("claude --version", { stdio: "ignore", shell: true }); }
catch { console.error("\n✗ Claude Code CLI (`claude`) not found. Install it and rerun."); process.exit(1); }
console.log(`\n✓ Node ${process.versions.node}, Claude Code CLI found.`);
console.log(DRY ? "DRY-RUN. Nothing will change." : (PRUNE ? "SYNC mode (clear old skills, reinstall)." : "ADD-ONLY mode (keep existing skills)."));

// ── 0b. GitHub CLI (gh). pr-convention needs it to read labels and open PRs ──
const hasCmd = (c) => { try { execSync(`${c} --version`, { stdio: "ignore", shell: true }); return true; } catch { return false; } };
if (hasCmd("gh")) {
  skip.push("gh CLI (already present)");
} else if (DRY) {
  console.log("\n▶ (dry-run) Would install GitHub CLI (gh)");
  skip.push("gh CLI (dry-run)");
} else {
  // Only package managers that do not need sudo. Linux is left to the user.
  const pm = IS_WIN
    ? { need: "winget", cmd: "winget install --id GitHub.cli -e --silent --accept-package-agreements --accept-source-agreements" }
    : process.platform === "darwin"
      ? { need: "brew", cmd: "brew install gh" }
      : null;
  if (pm && hasCmd(pm.need)) {
    run("Install GitHub CLI (gh)", pm.cmd, { tolerate: true });
  } else {
    console.log("\n▶ ⚠ gh CLI missing and cannot be installed here. Install it, then rerun:");
    console.log("    macOS  : brew install gh");
    console.log("    Windows: winget install --id GitHub.cli");
    console.log("    Linux  : https://github.com/cli/cli/blob/trunk/docs/install_linux.md");
    skip.push("gh CLI (install it manually)");
  }
}
// Signing in is interactive and personal. Remind, never run it.
if (!DRY && hasCmd("gh")) {
  try { execSync("gh auth status", { stdio: "ignore", shell: true }); }
  catch { console.log("\n▶ ⚠ gh is not signed in. Run: gh auth login"); }
}

// ── 1. Sync skills: back up, clear, then reinstall both bundles ───────────
if (PRUNE) {
  backupDir(join(HOME, ".claude", "skills"));   // where Claude Code reads skills
  backupDir(join(HOME, ".agents", "skills"));   // where the `skills` CLI keeps originals
}
// --agent claude-code installs for Claude Code alone. It avoids the "Failed"
// banner from agents such as PromptScript and keeps files out of ~/.junie and ~/.cursor.
run("Install the DESIGN skills (Leonxlnx/taste-skill)",
    "npx -y skills add Leonxlnx/taste-skill --global --copy --agent claude-code -y");
run("Install the ENGINEERING skills (mattpocock/skills)",
    "npx -y skills add mattpocock/skills --global --copy --agent claude-code -y");

// ── 1b. This repository's own skills (the skills/ directory) ─────────────
// Runs AFTER both bundles so the clearing step cannot remove them.
const teamSkills = join(HERE, "skills");
if (existsSync(teamSkills)) {
  const names = readdirSync(teamSkills);
  if (DRY) { console.log(`\n▶ (dry-run) Would copy ${names.length} repo skills: ${names.join(", ")}`); skip.push("Repo skills (dry-run)"); }
  else try {
    const dest = join(HOME, ".claude", "skills");
    mkdirSync(dest, { recursive: true });
    for (const n of names) cpSync(join(teamSkills, n), join(dest, n), { recursive: true });
    ok.push(`Copied ${names.length} repo skills (${names.join(", ")})`);
    console.log(`\n▶ Repo skills -> ${dest}: ${names.join(", ")}`);
  } catch (e) { fail.push("Repo skills"); console.log(`  ✗ ${e.message}`); }
}

// ── 1c. Git hook rejecting bad commits, global through core.hooksPath ────
const hookSrc = join(HERE, "hooks");
if (existsSync(hookSrc)) {
  const hookDest = join(HOME, ".claude", "git-hooks");
  let current = "";
  try { current = execSync("git config --global core.hooksPath", { shell: true }).toString().trim(); } catch { /* not set */ }
  if (current && current !== hookDest) {
    console.log(`\n▶ ⚠ core.hooksPath already points at ${current}\n  Not overwriting. Point it at ${hookDest} to use the ai-devkit hook.`);
    skip.push(`Git hook (core.hooksPath is set to ${current})`);
  } else if (DRY) {
    console.log(`\n▶ (dry-run) Would install the hook to ${hookDest} and set core.hooksPath`);
    skip.push("Git hook (dry-run)");
  } else try {
    mkdirSync(hookDest, { recursive: true });
    for (const h of readdirSync(hookSrc)) {
      const dst = join(hookDest, h);
      copyFileSync(join(hookSrc, h), dst);
      chmodSync(dst, 0o755);
    }
    execSync(`git config --global core.hooksPath "${hookDest}"`, { stdio: "ignore", shell: true });
    ok.push("Git hook rejecting bad commits");
    console.log(`\n▶ Git hook -> ${hookDest} (core.hooksPath set)`);
  } catch (e) { fail.push("Git hook"); console.log(`  ✗ ${e.message}`); }
}

// ── 2. The ponytail plugin (code trimming) ───────────────────────────────
run("Add the ponytail marketplace",
    "claude plugin marketplace add DietrichGebert/ponytail", { tolerate: true });
run("Install the ponytail plugin",
    "claude plugin install ponytail@ponytail", { tolerate: true });

// ── 3. MCP chrome-devtools ───────────────────────────────────────────────
run("Remove any existing chrome-devtools entry",
    "claude mcp remove chrome-devtools -s user", { tolerate: true });
run("Add the chrome-devtools MCP",
    "claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest --isolated=true");

// ── 4. Ponytail defaults to lite ─────────────────────────────────────────
const ponyDir = IS_WIN
  ? join(process.env.APPDATA || join(HOME, "AppData", "Roaming"), "ponytail")
  : join(HOME, ".config", "ponytail");
if (DRY) { console.log(`\n▶ (dry-run) Would write lite to ${join(ponyDir, "config.json")}`); skip.push("ponytail lite (dry-run)"); }
else try {
  mkdirSync(ponyDir, { recursive: true });
  writeFileSync(join(ponyDir, "config.json"), JSON.stringify({ defaultMode: "lite" }, null, 2) + "\n");
  ok.push("Ponytail defaultMode = lite");
  console.log(`\n▶ Ponytail lite -> ${join(ponyDir, "config.json")}`);
} catch (e) { fail.push("Ponytail config"); console.log(`  ✗ ${e.message}`); }

// ── 5. Shared CLAUDE.md, never overwriting a personal one ────────────────
const claudeDir = join(HOME, ".claude");
const target = join(claudeDir, "CLAUDE.md");
const srcMd = join(HERE, "CLAUDE.md");
if (DRY) { console.log(`\n▶ (dry-run) Would install CLAUDE.md, keeping any personal copy`); skip.push("CLAUDE.md (dry-run)"); }
else try {
  mkdirSync(claudeDir, { recursive: true });
  if (existsSync(target)) {
    const shared = join(claudeDir, "CLAUDE.shared.md");
    copyFileSync(srcMd, shared);
    console.log(`\n▶ A personal CLAUDE.md exists, so it was kept. Shared copy: ${shared}`);
    skip.push("CLAUDE.md (kept, shared copy written)");
  } else { copyFileSync(srcMd, target); ok.push("Installed the shared CLAUDE.md"); console.log(`\n▶ Installed ${target}`); }
} catch (e) { fail.push("CLAUDE.md"); console.log(`  ✗ ${e.message}`); }

// ── Summary ──────────────────────────────────────────────────────────────
console.log("\n────────────────────────────────────────");
console.log(`✓ Done: ${ok.length}   ⏭  Skipped: ${skip.length}   ✗ Failed: ${fail.length}`);
if (ok.length)   console.log("\nCompleted:\n  - " + ok.join("\n  - "));
if (skip.length) console.log("\nSkipped:\n  - " + skip.join("\n  - "));
if (fail.length) console.log("\n⚠ Failed (see the log above):\n  - " + fail.join("\n  - "));
if (PRUNE && !DRY) console.log("\nNote: old skills were MOVED to *.backup-* directories. Delete them once satisfied.");
console.log("\nOpen a NEW Claude Code session to apply this. Check with `claude plugin list`, `claude mcp list`, then type /tdd and /design-taste-frontend");
process.exit(fail.length ? 1 : 0);
