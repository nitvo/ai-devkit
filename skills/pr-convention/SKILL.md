---
name: pr-convention
description: Tạo Pull Request đúng chuẩn RIÊNG của từng repo — đọc CONTRIBUTING.md (hoặc PR đã merge) để lấy quy ước đặt tên nhánh, format PR title và các mục bắt buộc trong mô tả. Use whenever creating or preparing a pull request, running `gh pr create`, reviewing a PR title, or when the user says "tạo PR", "mở pull request", "create a PR", "raise a PR", "đặt tên nhánh".
---

# Pull Request theo chuẩn của repo

Mỗi repo có chuẩn riêng. **KHÔNG áp một format cố định.** Luôn đọc chuẩn của repo
hiện tại rồi làm theo. Chuẩn của repo luôn thắng quy tắc chung.

## 1. Tìm nguồn chuẩn — theo thứ tự ưu tiên

1. `CONTRIBUTING.md` (gốc repo, hoặc `.github/CONTRIBUTING.md`)
2. `.github/PULL_REQUEST_TEMPLATE.md` / `.github/pull_request_template.md`
3. `docs/` — file về workflow, branching, contributing
4. PR đã merge gần đây:
   `gh pr list --state merged --limit 20 --json title,baseRefName,headRefName`
5. Tên nhánh đang tồn tại: `git branch -r`

Dừng ở nguồn đầu tiên đủ thông tin.

**Nếu tài liệu (1–3) mâu thuẫn với thực tế (4–5)** — ví dụ doc mô tả nhánh
`staging` nhưng remote chỉ có `main` — thì **nêu rõ khác biệt và hỏi user**,
không tự chọn bên nào.

## 2. Trích các thông tin sau

- Mẫu đặt tên nhánh (kèm tiền tố ticket nếu có).
- Nhánh đích.
- Format PR title.
- Các mục bắt buộc trong body.
- Quy tắc merge (squash / merge commit) và số approval.
- Có cần **nhiều PR** cho một thay đổi không (ví dụ một PR vào `staging`, một PR
  cherry-pick vào `develop`) — nếu có thì tạo đủ, đúng thứ tự, và cross-reference
  lẫn nhau.

## 3. Chốt đủ thông tin — thiếu thì HỎI

Bám sát đúng các mục CONTRIBUTING.md đã nêu. Với **mỗi** mục dưới đây phải rút ra
được **một câu trả lời duy nhất**. Nếu thiếu, mơ hồ, hoặc file **tự mâu thuẫn** →
**hỏi user đúng mục đó**, không suy đoán, không im lặng chọn một bên.

| Cần chốt | Phải hỏi khi |
|---|---|
| Mẫu tên nhánh + tiền tố ticket | Tiền tố có vẻ là của dự án khác, hoặc không nêu |
| Nhánh đích | Doc nhắc một nhánh mà **không định nghĩa** vai trò, hoặc nhánh đó không tồn tại trên remote |
| Format PR title + giá trị từng thẻ | **Quy tắc ghi một đằng, ví dụ ghi một nẻo** |
| Mục bắt buộc trong body | Liệt kê chung chung, không rõ mục nào bắt buộc |
| Số PR phải tạo | Luồng nhiều nhánh mô tả không đủ rõ |
| Tracker của ticket | Doc nhắc **nhiều hơn một** tracker |

Quy tắc hỏi:

- Gộp **tất cả** câu hỏi vào **một lượt**, kèm phương án đề xuất để user chỉ cần
  xác nhận — không hỏi lắt nhắt từng câu.
- Trích nguyên văn dòng gây mơ hồ (kèm số dòng) để user biết đang hỏi về chỗ nào.
- Khi quy tắc và ví dụ mâu thuẫn: **không tự chọn cái nào**, hỏi cái nào đúng.

## 4. Kiểm tra trước khi tạo

- Tên nhánh hiện tại có khớp mẫu không → không khớp thì báo và đề xuất tên đúng.
- Nhánh đích có đúng theo chuẩn không.
- Nhánh đã push lên remote chưa.
- Thay đổi có gọn trong một mối quan tâm không → nếu lẫn nhiều việc, nói rõ.

## 5. Sinh PR

- Title đúng format đã trích được, không thêm bớt.
- Body đủ các mục bắt buộc.
- Nếu chuẩn yêu cầu link ticket → **hỏi user số ticket**, tuyệt đối không bịa.
- Nếu chuẩn yêu cầu kết quả test → chỉ ghi những gì **thực sự đã chạy**; chưa
  chạy thì ghi rõ là chưa chạy.

## 6. Duyệt trước khi tạo

Tạo PR là hành động ra ngoài. **In title + body ra cho user xem và chờ đồng ý**
rồi mới chạy `gh pr create`.

## Khi repo chưa có chuẩn nào

Không có `CONTRIBUTING.md`, không có template, không có PR mẫu → hỏi user 3 điều:
nhánh đích, format title, mục bắt buộc trong body. **Không mượn chuẩn của repo khác.**

## Cấm

- Bịa số ticket / Jira ID.
- Bịa kết quả test hoặc bằng chứng.
- Emoji, ngôn ngữ marketing, văn phong AI.
- Tự chạy `gh pr create` khi user chưa duyệt.
- Tự đổi tên nhánh hoặc force-push mà không hỏi.
