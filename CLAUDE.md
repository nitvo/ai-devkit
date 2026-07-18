# Hướng dẫn chung

Luôn trả lời bằng tiếng Việt, kể cả khi tôi hỏi bằng tiếng Anh.

## Bộ skill Matt Pocock (`~/.claude/skills`)

Với việc kỹ thuật, CHỦ ĐỘNG dùng skill phù hợp thay vì tự làm tay:

- Điều tra / sửa lỗi, hiệu năng → `diagnosing-bugs`
- Làm tính năng hoặc sửa lỗi test-first → `tdd`
- Triển khai theo yêu cầu / spec → `implement`, `to-spec`
- Review thay đổi (nhánh, PR, WIP) → `code-review`
- Nghiên cứu tài liệu / API → `research`
- Thiết kế module, cải thiện kiến trúc → `codebase-design`, `improve-codebase-architecture`
- Mô hình hoá domain, thuật ngữ → `domain-modeling`
- Chia việc thành ticket, phân loại → `to-tickets`, `triage`
- Stress-test một kế hoạch trước khi làm → `grilling`

Chạy `/setup-matt-pocock-skills` MỘT lần cho mỗi repo trước khi dùng nhóm engineering.

## Bộ skill FE / thiết kế (design-taste-frontend)

Khi làm giao diện người dùng, CHỦ ĐỘNG dùng skill phù hợp thay vì viết UI generic:

- Landing page / portfolio / trang mới, muốn đẹp không "AI-slop" → `design-taste-frontend`
- Đã chốt hướng thiết kế, chỉ cần thực thi → `high-end-visual-design`
- Phong cách cụ thể → `minimalist-ui`, `industrial-brutalist-ui`
- Nâng cấp / làm lại giao diện web/app hiện có → `redesign-existing-projects`
- Nhận diện thương hiệu, logo, palette → `brandkit`
- Sinh ảnh mockup để dựng theo → `imagegen-frontend-web`, `imagegen-frontend-mobile`
- Dựng code web bám sát ảnh thiết kế → `image-to-code`

## Chrome DevTools MCP (`chrome-devtools`)

Đã cài global (mở Chrome thật để quan sát). Khi cần soi/gỡ lỗi trang web thật, CHỦ ĐỘNG dùng MCP này thay vì đoán:

- Kiểm tra request lỗi, xem payload/header/status → network
- Xem console log, lỗi JS runtime → console
- Đo hiệu năng tải trang, Core Web Vitals → performance trace
- Chụp DOM snapshot, emulate CPU/mạng chậm khi cần

## Ponytail (plugin dọn code)

Mặc định `lite` (đã đặt ở `~/.config/ponytail/config.json`) — chỉ nhắc, không tự cắt. Khi dọn codebase cũ nhiều rác thì chủ động `/ponytail ultra`; soi trước commit dùng `/ponytail-review`.
