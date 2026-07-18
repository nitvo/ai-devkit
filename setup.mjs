#!/usr/bin/env node
// Bootstrap chung cho team — đồng bộ MỌI máy về CÙNG một bộ công cụ Claude Code.
// Chạy được trên Windows / Linux / macOS.
//
//   node setup.mjs               # đồng bộ (dọn sạch skill cũ rồi cài lại 2 bộ chuẩn)
//   node setup.mjs --keep-extras # KHÔNG dọn — chỉ thêm, giữ skill sẵn có
//   node setup.mjs --dry-run     # chỉ in ra sẽ làm gì, không thay đổi gì
//
// Bộ skill chuẩn = 2 nguồn:
//   • Leonxlnx/taste-skill   (thiết kế giao diện)
//   • mattpocock/skills      (engineering: tdd, code-review, diagnosing-bugs…)
//
// "Dọn sạch" KHÔNG xoá vĩnh viễn — nó DỜI thư mục skill cũ sang bản .backup-<thời gian>
// nên bạn hoàn tác được. Idempotent: chạy lại nhiều lần vẫn an toàn.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, writeFileSync, renameSync } from "node:fs";
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
    if (tolerate) { skip.push(label); process.stdout.write(`  (bỏ qua — có thể đã cài sẵn)\n`); }
    else { fail.push(label); process.stdout.write(`  ✗ lỗi: ${e.message}\n`); }
  }
}
function backupDir(dir) {
  if (!existsSync(dir)) return null;
  const bak = `${dir}.backup-${stamp}`;
  process.stdout.write(`\n▶ Sao lưu (dời) ${dir}\n  → ${bak}\n`);
  if (DRY) { skip.push(`backup ${dir} (dry-run)`); return bak; }
  try { renameSync(dir, bak); ok.push(`Sao lưu ${dir}`); return bak; }
  catch (e) { fail.push(`Backup ${dir}`); process.stdout.write(`  ✗ ${e.message}\n`); return null; }
}

// ── 0. Kiểm tra điều kiện ────────────────────────────────────────────────
if (Number(process.versions.node.split(".")[0]) < 22) {
  console.error(`\n✗ Cần Node.js >= 22 (đang dùng ${process.versions.node}). Cài Node mới rồi chạy lại.`);
  process.exit(1);
}
try { execSync("claude --version", { stdio: "ignore", shell: true }); }
catch { console.error("\n✗ Không tìm thấy Claude Code CLI (`claude`). Cài Claude Code rồi chạy lại."); process.exit(1); }
console.log(`\n✅ Node ${process.versions.node}, Claude Code CLI OK.`);
console.log(DRY ? "🔍 DRY-RUN — không thay đổi gì thật." : (PRUNE ? "🧹 Chế độ ĐỒNG BỘ (dọn sạch skill cũ + cài lại)." : "➕ Chế độ chỉ-thêm (giữ skill sẵn có)."));

// ── 1. Đồng bộ skill: dọn sạch (có backup) rồi cài lại 2 bộ chuẩn ─────────
if (PRUNE) {
  backupDir(join(HOME, ".claude", "skills"));   // nơi Claude Code đọc skill
  backupDir(join(HOME, ".agents", "skills"));   // nơi `skills` CLI để file gốc
}
// --agent claude-code: chỉ cài cho Claude Code (tránh banner "Failed" từ các agent
// khác như PromptScript, và không rải file sang ~/.junie, ~/.cursor…)
run("Cài bộ skill THIẾT KẾ (Leonxlnx/taste-skill)",
    "npx -y skills add Leonxlnx/taste-skill --global --copy --agent claude-code -y");
run("Cài bộ skill ENGINEERING (mattpocock/skills)",
    "npx -y skills add mattpocock/skills --global --copy --agent claude-code -y");

// ── 2. Plugin ponytail (dọn code) ────────────────────────────────────────
run("Thêm marketplace ponytail",
    "claude plugin marketplace add DietrichGebert/ponytail", { tolerate: true });
run("Cài plugin ponytail",
    "claude plugin install ponytail@ponytail", { tolerate: true });

// ── 3. MCP chrome-devtools ───────────────────────────────────────────────
run("Gỡ chrome-devtools cũ (nếu có)",
    "claude mcp remove chrome-devtools -s user", { tolerate: true });
run("Thêm MCP chrome-devtools",
    "claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest --isolated=true");

// ── 4. Ponytail mặc định = lite ──────────────────────────────────────────
const ponyDir = IS_WIN
  ? join(process.env.APPDATA || join(HOME, "AppData", "Roaming"), "ponytail")
  : join(HOME, ".config", "ponytail");
if (DRY) { console.log(`\n▶ (dry-run) Sẽ ghi lite → ${join(ponyDir, "config.json")}`); skip.push("ponytail lite (dry-run)"); }
else try {
  mkdirSync(ponyDir, { recursive: true });
  writeFileSync(join(ponyDir, "config.json"), JSON.stringify({ defaultMode: "lite" }, null, 2) + "\n");
  ok.push("Ponytail defaultMode = lite");
  console.log(`\n▶ Ponytail lite → ${join(ponyDir, "config.json")}`);
} catch (e) { fail.push("Ponytail config"); console.log(`  ✗ ${e.message}`); }

// ── 5. CLAUDE.md dùng chung (không đè bản cá nhân) ───────────────────────
const claudeDir = join(HOME, ".claude");
const target = join(claudeDir, "CLAUDE.md");
const srcMd = join(HERE, "CLAUDE.md");
if (DRY) { console.log(`\n▶ (dry-run) Sẽ cài CLAUDE.md (giữ bản cá nhân nếu có)`); skip.push("CLAUDE.md (dry-run)"); }
else try {
  mkdirSync(claudeDir, { recursive: true });
  if (existsSync(target)) {
    const shared = join(claudeDir, "CLAUDE.shared.md");
    copyFileSync(srcMd, shared);
    console.log(`\n▶ Đã có CLAUDE.md cá nhân — KHÔNG đè. Bản chung: ${shared} (tự gộp).`);
    skip.push("CLAUDE.md (đã có — lưu ra CLAUDE.shared.md)");
  } else { copyFileSync(srcMd, target); ok.push("Cài CLAUDE.md dùng chung"); console.log(`\n▶ Đã cài ${target}`); }
} catch (e) { fail.push("CLAUDE.md"); console.log(`  ✗ ${e.message}`); }

// ── Tổng kết ─────────────────────────────────────────────────────────────
console.log("\n────────────────────────────────────────");
console.log(`✅ Xong: ${ok.length}   ⏭  Bỏ qua: ${skip.length}   ✗ Lỗi: ${fail.length}`);
if (ok.length)   console.log("\nĐã làm:\n  - " + ok.join("\n  - "));
if (skip.length) console.log("\nBỏ qua:\n  - " + skip.join("\n  - "));
if (fail.length) console.log("\n⚠ Lỗi (xem log trên):\n  - " + fail.join("\n  - "));
if (PRUNE && !DRY) console.log("\nℹ️  Skill cũ đã được DỜI sang thư mục *.backup-… (không mất). Xoá hẳn khi đã yên tâm.");
console.log("\n👉 Mở phiên Claude Code MỚI để có hiệu lực. Kiểm tra: `claude plugin list`, `claude mcp list`, gõ /tdd và /design-taste-frontend");
process.exit(fail.length ? 1 : 0);
