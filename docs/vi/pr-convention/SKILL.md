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

| Mẫu | Dùng cho |
|---|---|
| `feature/<TICKET>` | Tính năng mới |
| `bugfix/<TICKET>` | Sửa lỗi |
| `docs/<TICKET>` | Chỉ thay đổi tài liệu |
| `chore/<TICKET>` | Bảo trì |
| `<loại>/<TICKET>_<M>` | Bản cherry-pick sang nhánh test. `M` = lần giao, bắt đầu từ `1`, tăng mỗi lần giao lại sau khi sửa |

### PR title

```text
[COMPANY] [TARGET] <TICKET> <Mô tả mệnh lệnh>
```

- `COMPANY` — tổ chức sở hữu ticket.
- `TARGET` — viết tắt nhánh đích (`STG`, `DEV`, `MAIN`).
- Mô tả: thì hiện tại, bắt đầu bằng động từ, không dấu chấm cuối.

Ví dụ: `[Nitvo] [STG] SPR-3 Add bootstrap command`

### Nội dung PR — các mục bắt buộc

1. Mô tả ngắn thay đổi làm gì.
2. Các điểm triển khai đáng lưu ý.
3. Kết quả test kèm bằng chứng (output, log, ảnh) nếu có.
4. Cross-reference tới PR song song (nếu luồng 2 PR).
5. Link ticket.

### Reviewer, assignee, label — bắt buộc

Mọi PR phải có đủ **3** thứ trước khi tạo:

| Mục | Quy tắc |
|---|---|
| **Assignee** | Người tạo PR tự nhận (`@me`). Nếu người làm khác người tạo thì gán người làm. |
| **Reviewer** | Tối thiểu 1. Là **người thật** → phải được user xác nhận, tuyệt đối không đoán tên. |
| **Label** | Tự chọn từ label sẵn có của repo. **1–3 cái sát nhất, tối đa 5.** Không gán tràn lan. |

#### Chọn label

Luôn chạy `gh label list` trước, **chỉ chọn trong danh sách trả về** — khớp theo
ý nghĩa, không cần trùng tên tuyệt đối (`enhancement` khớp cho `feature/`).

Thứ tự ưu tiên, dừng khi đủ 1–3 cái:

1. **Loại thay đổi** — suy từ nhánh: `feature/`→`feature`/`enhancement`,
   `bugfix/`→`bug`, `docs/`→`documentation`, `chore/`→`chore`/`maintenance`.
2. **Phạm vi** — chỉ khi diff rõ ràng thuộc một vùng: `backend`, `frontend`,
   `infra`, `ci`, `database`, `security`…

**Tuyệt đối không tự gán** các label là phán đoán của con người:
ưu tiên (`P0`, `high-priority`), mức độ (`critical`, `blocker`), trạng thái
(`needs-discussion`, `wontfix`, `breaking-change`). Thấy cần → **hỏi user**.

**Không tự tạo label mới** — tạo label là thay đổi cấu hình repo. Không có label
phù hợp → hỏi user chọn trong danh sách hiện có, hoặc xin phép tạo.

### Luồng 2 PR

Khi repo có **cả nhánh tích hợp và nhánh test**, một thay đổi đi bằng 2 PR:

1. `feature/<TICKET>` → nhánh tích hợp.
2. `feature/<TICKET>_<M>` → nhánh test (cherry-pick từ PR 1).

Test phát hiện lỗi: sửa trên `feature/<TICKET>`, tạo `feature/<TICKET>_<M+1>`,
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
- [ ] Label (1–3, trong danh sách sẵn có)
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
- **Đã có đủ assignee, ít nhất 1 reviewer, ít nhất 1 label chưa.**

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
