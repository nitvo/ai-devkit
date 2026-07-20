# ai-devkit

Bootstrap **một lệnh** để mọi máy trong team về **cùng một** bộ công cụ Claude Code.
Chạy được trên **Windows / Linux / macOS**.

## Bộ chuẩn (mọi máy sẽ giống hệt)

**Skill = 2 nguồn:**

| Nguồn | Nội dung | Ví dụ lệnh |
|---|---|---|
| `Leonxlnx/taste-skill` | Thiết kế giao diện chống "AI-slop" | `/design-taste-frontend` |
| `mattpocock/skills` | Engineering: TDD, review, chẩn lỗi… | `/tdd`, `/code-review`, `/diagnosing-bugs` |

**Cộng thêm:**

| Thành phần | Là gì | Gọi bằng |
|---|---|---|
| Plugin **ponytail** | Ép viết code tối giản | `/ponytail-review`, `/ponytail-audit` |
| MCP **chrome-devtools** | Mở Chrome thật soi network/console/performance | tự dùng khi gỡ lỗi web |
| **CLAUDE.md** | Hướng dẫn chung | tự áp mỗi phiên |
| Ponytail mặc định | `lite` | đổi bằng `/ponytail ultra` |

## Yêu cầu mỗi máy

**Node.js ≥ 22**, **Claude Code** (CLI `claude`), **Google Chrome**, **git**.

## Cách chạy

```bash
git clone git@github.com:nitvo/ai-devkit.git
cd ai-devkit
node setup.mjs
```

Trên **Windows**: dùng PowerShell / Git Bash, lệnh y hệt `node setup.mjs`.

### Các chế độ

| Lệnh | Ý nghĩa |
|---|---|
| `node setup.mjs` | **Đồng bộ** — dọn skill cũ (có sao lưu) rồi cài lại đúng 2 bộ chuẩn → mọi máy giống hệt |
| `node setup.mjs --keep-extras` | Chỉ **thêm**, KHÔNG dọn — giữ nguyên skill sẵn có của máy |
| `node setup.mjs --dry-run` | Chỉ **in ra sẽ làm gì**, không thay đổi gì |

## "Dọn sạch" có mất dữ liệu không? → KHÔNG

Chế độ đồng bộ **dời** (không xoá) thư mục skill cũ sang bản sao lưu:

- `~/.claude/skills` → `~/.claude/skills.backup-<thời gian>`
- `~/.agents/skills` → `~/.agents/skills.backup-<thời gian>`

Rồi cài lại 2 bộ chuẩn từ nguồn (bản mới nhất). Hoàn tác được bằng cách đổi tên
thư mục `.backup-…` trở lại. Yên tâm rồi thì xoá hẳn bản backup.

> Vì sao "dọn rồi cài lại" thay vì "xoá theo danh sách"? Repo skill có thể thêm
> skill mới theo thời gian (vd `mattpocock/skills` đang có 41 skill). Cài lại từ
> nguồn đảm bảo mọi máy luôn khớp **bản mới nhất**, không lệ thuộc danh sách cứng.

## Ghi chú đa OS

- **Symlink**: cài skill bằng `--copy` (chép file thật) để tránh lỗi symlink trên Windows.
- **Đường dẫn ponytail config** tự đúng theo OS (`~/.config/ponytail` hoặc `%APPDATA%\ponytail`).
- **CLAUDE.md**: nếu máy đã có bản cá nhân, script KHÔNG đè — để bản chung ra
  `~/.claude/CLAUDE.shared.md` cho bạn tự gộp.
- Dòng *"Luôn trả lời bằng tiếng Việt"* trong `CLAUDE.md` là sở thích cá nhân — chỉnh/bỏ tuỳ team.

## Kiểm tra sau khi cài

```bash
claude plugin list      # ponytail@ponytail (enabled)
claude mcp list         # chrome-devtools ✔ Connected
# mở phiên mới → gõ /tdd và /design-taste-frontend
```

## Skill: bản cài vs bản đọc

| Thư mục | Ngôn ngữ | Vai trò |
|---|---|---|
| `skills/*/SKILL.md` | **Tiếng Anh** | Bản **được cài** lên máy (`setup.mjs` chỉ chép `skills/`) |
| `docs/vi/*.md` | Tiếng Việt | Chỉ để **đọc hiểu**, không được cài |

Sửa skill thì **sửa bản tiếng Anh** (đó mới là bản chạy), rồi cập nhật bản
tiếng Việt trong cùng commit để hai bên không trôi lệch.

> Dòng `description` trong frontmatter vẫn **giữ cụm kích hoạt tiếng Việt**
> (`tạo PR`, `commit giúp tôi`…) — đây là yêu cầu chức năng, không phải sở
> thích: bỏ đi thì skill không tự nổ khi bạn nhắn bằng tiếng Việt.

## Git hook chặn commit sai chuẩn

`setup.mjs` cài `hooks/commit-msg` vào `~/.claude/git-hooks/` và đặt
`git config --global core.hooksPath` → áp cho **mọi repo trên máy**.

Chặn khi: sai chuẩn Conventional Commits, type không hợp lệ, hoặc tiêu đề > 50 ký tự.
Bỏ qua: `Merge*`, `Revert*`, `fixup!`, `squash!`.

```
✗ Commit bị chặn — sai chuẩn Conventional Commits.
  Nhận được : update stuff
  Cần dạng  : <type>[(scope)]: <mô tả>
```

**Lưu ý:**
- Repo dùng **Husky không bị ảnh hưởng** — Husky đặt `core.hooksPath` ở scope local, local thắng global.
- Repo dùng `.git/hooks/commit-msg` thuần **sẽ bị bỏ qua** (đây là đánh đổi của `core.hooksPath` global).
- Máy đã có `core.hooksPath` riêng: setup **không ghi đè**, chỉ cảnh báo.
- Bỏ qua 1 lần: `git commit --no-verify`. Gỡ hẳn: `git config --global --unset core.hooksPath`.

## Troubleshooting

**Thấy banner đỏ `■ Failed to install … → PromptScript: PromptScript does not support
global skill installation`?** → **KHÔNG phải lỗi.** Đó chỉ là 1 agent tên PromptScript
không hỗ trợ cài global. Claude Code vẫn cài đủ (xem dòng `✓ (copied) → ~/.claude/skills/…`
ngay phía trên, và tổng kết `✗ Lỗi: 0`). Bản mới đã thêm `--agent claude-code` nên
không còn banner này.

## Gỡ cài

```bash
claude plugin uninstall ponytail@ponytail
claude mcp remove chrome-devtools -s user
npx -y skills remove --global --all
```
