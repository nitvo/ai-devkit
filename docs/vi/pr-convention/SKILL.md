---
name: pr-convention
description: Chuẩn tạo nhánh và Pull Request cho mọi dự án — format nhánh, PR title, nội dung mô tả, luồng 2 PR. Tự dò tiền tố ticket / nhánh đích / tên tổ chức từ chính repo, thiếu thì hỏi. Use whenever creating or preparing a pull request, naming a branch, running `gh pr create`, reviewing a PR title, or when the user says "tạo PR", "mở pull request", "create a PR", "raise a PR", "đặt tên nhánh".
---

> **Bản dịch để đọc hiểu — KHÔNG được cài.**
> Bản chạy thật: [`skills/pr-convention/SKILL.md`](../../../skills/pr-convention/SKILL.md).
> Sửa bản tiếng Anh trước, rồi cập nhật file này trong cùng commit.

# Chuẩn nhánh & Pull Request

Chuẩn nằm **trong skill này**, dùng cho mọi dự án kể cả repo không có
`CONTRIBUTING.md`. Nếu repo **có** `CONTRIBUTING.md` hoặc PR template thì **file
đó thắng** — đọc và theo nó.

---

## 1. Chuẩn mặc định

### Nhánh

Nhánh ngắn hạn, cắt từ nhánh tích hợp. `<TICKET>` là mã ticket (ví dụ `SPR-42`).

Tiền tố nhánh chính là **type của Conventional Commits** — cùng chữ với commit.
Label `type:` thường dùng chữ khác; xem bảng ánh xạ bên dưới.

| Mẫu | Dùng cho |
|---|---|
| `<type>/<TICKET>` | `feat/`, `fix/`, `docs/`, `refactor/`, `perf/`, `test/`, `ci/`, `build/`, `chore/` |
| `<type>/<TICKET>_<M>` | Bản cherry-pick sang nhánh test. `M` = lần giao, bắt đầu từ `1`, tăng mỗi lần giao lại sau khi sửa |

Ví dụ: `build/SPR-8`, rồi `build/SPR-8_1` cho bản cherry-pick.

### PR title

```text
[COMPANY] [TARGET] <TICKET> <Mô tả mệnh lệnh>
```

- `COMPANY` — tổ chức sở hữu ticket.
- `TARGET` — viết tắt nhánh đích (`STG`, `DEV`, `MAIN`).
- Mô tả: thì hiện tại, bắt đầu bằng động từ, không dấu chấm cuối.
- **Viết hoa chữ đầu** (sentence case): `Configure npm publishing`. Khác với
  commit subject — cái đó viết thường hoàn toàn.

Ví dụ: `[Nitvo] [STG] SPR-3 Add bootstrap command`

### Nội dung PR

Repo có `.github/PULL_REQUEST_TEMPLATE.md` thì điền theo file đó, bỏ qua mục này.
Không có thì dùng cấu trúc sau, giữ nguyên mọi heading:

```markdown
## Description

Nêu thay đổi gì và vì sao. Ngắn gọn.

## Type of change

- [x] `build` - Build system or dependency change

## Changes

- `path/to/file` - đổi gì và vì sao cần

## Testing

- [x] `npm test` - 16/16 pass
- [x] `npm run build` - emits `dist/`

## Checklist

- [ ] Tests added or updated
- [ ] Documentation updated for user-facing changes
- [ ] PR title follows the required format

## Notes

Ghi chú triển khai, tương thích, hoặc việc cần làm tiếp.

## Related PRs

| PR | Branch | Description |
|----|--------|-------------|
| #15 | `build/SPR-8` -> `staging` | This PR |
| #16 | `build/SPR-8_1` -> `develop` | Cherry-pick |

## Linked issue

[SPR-8](https://jira.example.com/browse/SPR-8)
```

Quy tắc khi điền:

- **Type of change** — tick đúng MỘT cái, trùng với tiền tố nhánh và commit.
  Breaking change thì thêm `!`. Lưu ý label `type:` có thể khác chữ
  (`feat` -> `type: feature`).
- **Changes** — liệt kê theo file, nói đổi gì và vì sao, không chỉ ghi đường dẫn.
- **Testing** — dán output lệnh thật làm bằng chứng. Output dài bỏ vào khối
  `<details><summary>`. Chỉ dùng `N/A` khi thay đổi không ảnh hưởng runtime (vd
  tài liệu). **Tuyệt đối không tick việc chưa chạy.**
- **Related PRs** — bắt buộc với luồng 2 PR, cross-reference cả hai PR cùng
  ticket. Chỉ có 1 PR thì bỏ mục này.
- **Linked issue** — URL ticket. Dò base URL của tracker từ các PR trước; dò
  không ra thì **hỏi user**. Không bao giờ tự bịa.
- Không có gì để ghi thì bỏ mục `Notes`. Các heading còn lại giữ nguyên.

### Reviewer, assignee, label — bắt buộc

Mọi PR phải có đủ **3** thứ trước khi tạo:

| Mục | Quy tắc |
|---|---|
| **Assignee** | Người tạo PR tự nhận (`@me`). Nếu người làm khác người tạo thì gán người làm. |
| **Reviewer** | Tối thiểu 1. Là **người thật** → phải được user xác nhận, tuyệt đối không đoán tên. |
| **Label** | Đúng **3 cái**, mỗi cái một nhóm: `target:`, `type:`, `area:`. Không thêm gì khác. |

#### Chọn label

Chạy `gh label list` trước, **chỉ chọn trong danh sách trả về**.

Repo dùng label có namespace thì gán đúng một cái từ mỗi nhóm sau — không hơn không kém:

| Nhóm | Suy từ | Ví dụ |
|---|---|---|
| `target:` | Nhánh đích | `target: staging`, `target: develop`, `target: main` |
| `type:` | Loại thay đổi — **xem bảng ánh xạ bên dưới; label thường KHÔNG trùng chữ với commit type** | `type: feature`, `type: bug`, `type: build` |
| `area:` | Vùng code bị đụng | `area: ci`, `area: docs`, `area: skills`, `area: tooling` |

#### Ánh xạ commit type → label `type:`

Từ vựng của label và của Conventional Commits **không giống nhau**. Đừng bao giờ
tưởng `feat` ứng với `type: feat` — label đó không tồn tại. Ánh xạ như sau, rồi
kiểm lại label có thật trong `gh label list`:

| Commit type | Tiền tố nhánh | Label `type:` |
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

Một số repo có label không có type tương ứng — `type: dependencies`,
`type: security`, `type: enhancement`, `type: style`. **Ưu tiên label cụ thể hơn
khi nó hợp**: nâng dependency thì commit là `chore`/`build` nhưng label đúng hơn
là `type: dependencies`; vá bảo mật commit là `fix` nhưng label đúng hơn là
`type: security`.

Không label nào khớp thì chọn cái sát nghĩa nhất. Không có gì gần thì **hỏi
user** — không tự tạo label.

#### Nhóm tuyệt đối không đụng

Repo có thể còn nhiều nhóm khác — `priority:`, `severity:`, `status:`, `size:`,
`impact:`, `changelog:`, `quality:`. **Tuyệt đối không tự gán** mấy nhóm này, vì
chúng là phán đoán triage của con người. Thấy cần thì **hỏi user**.

Repo không dùng namespace thì chọn label thường sát nghĩa nhất, vẫn **tối đa 1–3**.

**Không tự tạo label mới** — tạo label là thay đổi cấu hình repo. Không có label
phù hợp → hỏi user chọn trong danh sách hiện có, hoặc xin phép tạo.

### Luồng 2 PR

Khi repo có **cả nhánh tích hợp và nhánh test**, một thay đổi đi bằng 2 PR:

1. `<type>/<TICKET>` → nhánh tích hợp.
2. `<type>/<TICKET>_<M>` → nhánh test (cherry-pick từ PR 1).

Test phát hiện lỗi: sửa trên `<type>/<TICKET>`, tạo `<type>/<TICKET>_<M+1>`,
cherry-pick lại. Phát hành = PR từ nhánh tích hợp lên nhánh production.

Repo chỉ có một nhánh chính → **chỉ 1 PR**, bỏ qua toàn bộ phần cherry-pick.

### Review & merge

- Tối thiểu 1 approval trước khi merge.
- Squash merge là mặc định cho nhánh tích hợp và nhánh test.
- **Khi squash: không lấy PR title làm commit message.** PR title có tiền tố
  `[COMPANY] [TARGET]` nên không đúng Conventional Commits. Soạn commit message
  riêng theo skill `commit-convention`.

---

## 2. Tự dò biến của dự án

Không hỏi những gì suy ra được. Dò theo thứ tự:

| Biến | Cách dò |
|---|---|
| Tiền tố ticket | `git branch -r` và `git log --oneline -50`, tìm mẫu `[A-Z]{2,}-\d+` |
| Nhánh đích | `git branch -r` — xem có `staging`, `develop`, `main`/`master` không |
| `COMPANY` | Org trong remote: `git remote get-url origin` → `github.com/<org>/…` |
| `TARGET` | Suy từ nhánh đích: `staging`→`STG`, `develop`→`DEV`, `main`→`MAIN` |
| Số PR | Có đủ nhánh tích hợp + test → 2 PR; chỉ `main` → 1 PR |
| Label có sẵn | `gh label list` — chỉ chọn trong danh sách này |
| Reviewer gợi ý | `CODEOWNERS` (gốc, `.github/`, `docs/`); nếu không có thì `gh pr list --state merged --limit 20 --json reviews` xem ai hay review |
| Assignee | `gh api user --jq .login` → mặc định `@me` |

---

## 3. Hỏi khi không suy ra được

**Rà bắt buộc trước MỖI lần tạo PR.** Đi hết checklist dưới; bất kỳ mục nào dò
không ra, mâu thuẫn, hoặc **chỉ đoán được chứ không chắc** → **hỏi user**. Không
suy đoán, không mượn giá trị của dự án khác, không im lặng bỏ qua.

Checklist mỗi lần tạo PR:

- [ ] Tiền tố + số ticket
- [ ] Tên nhánh đúng mẫu
- [ ] Nhánh đích
- [ ] `COMPANY` và `TARGET` trong title
- [ ] Số PR cần tạo (1 hay 2)
- [ ] Assignee
- [ ] Reviewer
- [ ] Label — mỗi nhóm một cái: `target:`, `type:`, `area:`
- [ ] Kết quả test có thật hay chưa chạy

Cách hỏi:

- Gộp **tất cả** câu hỏi vào **một lượt**, kèm phương án đề xuất để user chỉ cần
  xác nhận. Không hỏi lắt nhắt.
- Nêu rõ đã dò được gì và vì sao chưa chắc.

Luôn phải hỏi, không bao giờ tự bịa:

- **Số ticket** — không suy ra từ tên nhánh nếu nhánh chưa đặt đúng chuẩn.
- **Kết quả test** — chỉ ghi những gì thực sự đã chạy; chưa chạy thì ghi rõ chưa chạy.
- **Reviewer** — gán review là gửi thông báo cho người thật. Được phép *đề xuất*
  từ CODEOWNERS hoặc lịch sử review, nhưng phải user xác nhận mới gán.

---

## 4. Kiểm tra trước khi tạo

- Tên nhánh hiện tại khớp mẫu chưa → chưa khớp thì báo và đề xuất tên đúng.
- Nhánh đích đúng chưa.
- Nhánh đã push lên remote chưa.
- Thay đổi có gọn trong một mối quan tâm không → lẫn nhiều việc thì nói rõ.
- **Đã có đủ assignee, ít nhất 1 reviewer, và đủ 3 label chưa.**

---

## 5. Duyệt trước khi tạo

Tạo PR là hành động ra ngoài. **In title + body + reviewer/assignee/label cho user
xem và chờ đồng ý** rồi mới chạy:

```bash
gh pr create \
  --base <nhánh-đích> \
  --title "[COMPANY] [TARGET] <TICKET> <mô tả>" \
  --body-file <file> \
  --assignee @me \
  --reviewer <user1>[,<user2>] \
  --label <label>
```

---

## Cấm

- Bịa số ticket, mã Jira, kết quả test, bằng chứng.
- Emoji, ngôn ngữ marketing, văn phong AI trong title/body.
- Tự chạy `gh pr create` khi user chưa duyệt.
- Tự đổi tên nhánh hoặc force-push mà không hỏi.
