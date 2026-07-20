---
name: pr-convention
description: Chuẩn tạo nhánh và Pull Request cho mọi dự án — format nhánh, PR title, nội dung mô tả, luồng 2 PR. Tự dò tiền tố ticket / nhánh đích / tên tổ chức từ chính repo, thiếu thì hỏi. Use whenever creating or preparing a pull request, naming a branch, running `gh pr create`, reviewing a PR title, or when the user says "tạo PR", "mở pull request", "create a PR", "raise a PR", "đặt tên nhánh".
---

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

---

## 3. Hỏi khi không suy ra được

Dò không ra, hoặc kết quả mâu thuẫn → **hỏi user**, không suy đoán, không mượn
giá trị của dự án khác.

Cách hỏi:

- Gộp **tất cả** câu hỏi vào **một lượt**, kèm phương án đề xuất để user chỉ cần
  xác nhận. Không hỏi lắt nhắt.
- Nêu rõ đã dò được gì và vì sao chưa chắc.

Luôn phải hỏi, không bao giờ tự bịa:

- **Số ticket** — không suy ra từ tên nhánh nếu nhánh chưa đặt đúng chuẩn.
- **Kết quả test** — chỉ ghi những gì thực sự đã chạy; chưa chạy thì ghi rõ chưa chạy.

---

## 4. Kiểm tra trước khi tạo

- Tên nhánh hiện tại khớp mẫu chưa → chưa khớp thì báo và đề xuất tên đúng.
- Nhánh đích đúng chưa.
- Nhánh đã push lên remote chưa.
- Thay đổi có gọn trong một mối quan tâm không → lẫn nhiều việc thì nói rõ.

---

## 5. Duyệt trước khi tạo

Tạo PR là hành động ra ngoài. **In title + body cho user xem và chờ đồng ý** rồi
mới chạy `gh pr create`.

---

## Cấm

- Bịa số ticket, mã Jira, kết quả test, bằng chứng.
- Emoji, ngôn ngữ marketing, văn phong AI trong title/body.
- Tự chạy `gh pr create` khi user chưa duyệt.
- Tự đổi tên nhánh hoặc force-push mà không hỏi.
