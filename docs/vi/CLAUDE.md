# Working agreements

> **Bản dịch để đọc hiểu. KHÔNG được cài.**
> Bản chạy thật: [`CLAUDE.md`](../../CLAUDE.md).
> Sửa bản tiếng Anh trước, rồi cập nhật file này trong cùng commit.

Trả lời bằng tiếng Việt, kể cả khi câu hỏi bằng tiếng Anh.
*(Sở thích cá nhân. Đồng nghiệp nên sửa hoặc bỏ dòng này.)*

## Diction, áp cho MỌI thứ viết ra

Code, comment, tài liệu, commit, PR, error message, log, chuỗi UI. Commit và PR chỉ là một phần.

Cấm 5 nhóm từ:

| Nhóm | Ví dụ |
|---|---|
| Khoe | awesome, amazing, powerful, magic, elegant, seamless, robust, blazing, comprehensive |
| Tự chấm điểm | clean, simple, nice, better, improved, optimal, smart |
| Từ đệm | just, simply, easily, very, quite, highly, significantly, greatly |
| Nói về chính mình | this commit, this PR, this function, we now |
| Chuyển ý rỗng | additionally, furthermore, moreover, it is worth noting |

- Tuyên bố về hiệu năng hay độ ổn định phải kèm **con số**, không đo được thì bỏ.
- Câu ngắn, kết bằng dấu chấm. Không dùng gạch ngang dài hay dấu chấm phẩy để
  nối mệnh đề.
- Chỉ dùng dấu ASCII: ba dấu chấm thay ký tự ellipsis, gạch nối thay gạch ngang.
- Mũi tên chỉ dùng trong bảng, list, output CLI. Trong văn xuôi thì dùng từ.
- Không viết `not only X but Y`. Nói thẳng điều muốn nói.
- Không emoji hình vẽ, dấu chấm than, câu hỏi tu từ trong code hay tài liệu.
  Ký hiệu trạng thái CLI (`✓` `✗` `→`) thì được. Chúng mang thông tin chứ
  không phải trang trí.
- **Comment**: nói VÌ SAO, không kể lại điều code đã nói. Không comment hiển nhiên.
- **Error và log**: nêu cái gì hỏng và làm gì tiếp. Không "Oops", không mơ hồ.
- **Tài liệu**: câu khẳng định, không quảng cáo.

Chi tiết cho commit và PR nằm trong skill `commit-convention` / `pr-convention`.

## Matt Pocock engineering skills (`~/.claude/skills`)

Với việc kỹ thuật, dùng skill phù hợp thay vì tự làm tay:

- Điều tra lỗi hoặc suy giảm hiệu năng → `diagnosing-bugs`
- Làm tính năng hoặc sửa lỗi test-first → `tdd`
- Triển khai theo spec → `implement`, `to-spec`
- Review thay đổi (nhánh, PR, WIP) → `code-review`
- Nghiên cứu tài liệu hoặc API → `research`
- Thiết kế module, cải thiện kiến trúc → `codebase-design`, `improve-codebase-architecture`
- Mô hình hoá domain và thuật ngữ → `domain-modeling`
- Chia việc thành ticket, phân loại → `to-tickets`, `triage`
- Stress-test một kế hoạch trước khi làm → `grilling`

Chạy `/setup-matt-pocock-skills` MỘT lần cho mỗi repo trước khi dùng nhóm engineering.

## Frontend and design skills (`design-taste-frontend`)

Khi làm giao diện, dùng skill phù hợp thay vì viết UI generic:

- Landing page, portfolio, trang mới không được trông như hàng mẫu → `design-taste-frontend`
- Đã chốt hướng thiết kế, chỉ còn thực thi → `high-end-visual-design`
- Một phong cách cụ thể → `minimalist-ui`, `industrial-brutalist-ui`
- Làm lại giao diện web hoặc app hiện có → `redesign-existing-projects`
- Nhận diện thương hiệu, logo, palette → `brandkit`
- Sinh mockup để dựng theo → `imagegen-frontend-web`, `imagegen-frontend-mobile`
- Dựng code web bám sát ảnh thiết kế → `image-to-code`

## Chrome DevTools MCP (`chrome-devtools`)

Đã cài global, mở cửa sổ Chrome thật. Khi cần soi hoặc gỡ lỗi trang đang chạy,
dùng MCP này thay vì đoán:

- Request lỗi, payload, header, status code → network
- Console log và lỗi JS runtime → console
- Hiệu năng tải trang, Core Web Vitals → performance trace
- DOM snapshot, bóp CPU hoặc mạng → khi cần

## Ponytail (code-trimming plugin)

Mặc định `lite` (đặt ở `~/.config/ponytail/config.json`). Chỉ nhắc, không tự
cắt. Chuyển sang `/ponytail ultra` khi dọn codebase cũ; chạy `/ponytail-review`
trước khi commit.
