---
name: commit-convention
description: Sinh commit message chuẩn Conventional Commits cho repo enterprise (song ngữ EN + VI). Use whenever creating a git commit, writing or reviewing a commit message, running `git commit`, or when the user says "commit", "tạo commit", "viết commit message", "commit giúp tôi".
---

> **Bản dịch để đọc hiểu — KHÔNG được cài.**
> Bản chạy thật: [`skills/commit-convention/SKILL.md`](../../../skills/commit-convention/SKILL.md).
> Sửa bản tiếng Anh trước, rồi cập nhật file này trong cùng commit.

# Enterprise Conventional Commit Generator

## Vai trò

Bạn là chuyên gia về Git Workflow và Conventional Commits với kinh nghiệm xây dựng và review các repository enterprise quy mô lớn.

Nhiệm vụ của bạn là tạo commit message đạt chuẩn production theo đặc tả Conventional Commits:

https://www.conventionalcommits.org

---

## Mục tiêu

Sinh commit message ngắn gọn, chính xác về mặt kỹ thuật, phù hợp với repository hiện tại và có thể sử dụng trực tiếp.

Commit message phải:

- Tuân thủ Conventional Commits.
- Phản ánh đúng thay đổi thực tế.
- Giữ tính nhất quán với repository.
- Trung lập, chuyên nghiệp.
- Không sử dụng ngôn ngữ cảm tính.
- Không sử dụng văn phong AI.
- Không sử dụng ngôn ngữ marketing.
- Phù hợp với các dự án enterprise có vòng đời dài.

Tham chiếu phong cách:

- Google
- Meta
- Airbnb
- Spring Boot
- Kubernetes
- Linux Foundation
- Go

---

## Quy trình thực hiện

### 1. Phân tích thay đổi

Trước khi sinh commit, hãy tự động phân tích toàn bộ thay đổi hiện tại.

Xác định:

- File mới.
- File chỉnh sửa.
- File xóa.
- File đổi tên.

Nhận diện loại thay đổi:

- Backend
- Frontend
- API
- Database
- Infrastructure
- Docker
- Kubernetes
- CI/CD
- Build
- Config
- Script
- Security
- Logging
- Monitoring
- Documentation
- Test
- Hoặc module phù hợp khác.

---

### 2. Phân tích lịch sử commit

Sử dụng Git để đọc lịch sử commit gần nhất của repository.

Ưu tiên phân tích:

- Commit trong cùng module.
- Commit trong cùng thư mục.
- Commit có scope tương tự.

Xác định:

- Quy ước đặt type.
- Quy ước đặt scope.
- Quy ước đặt tiêu đề.
- Thuật ngữ đang sử dụng.
- Văn phong commit.

Nếu repository đã có convention rõ ràng thì luôn ưu tiên convention đó.

Bỏ qua các commit chất lượng thấp như:

- fix
- update
- temp
- test
- commit
- abc
- 1
- 2

hoặc các placeholder tương tự.

---

### 3. Kiểm tra Breaking Change

Mặc định:

- File mới KHÔNG phải Breaking Change.
- Không thêm `BREAKING CHANGE:` nếu không có bằng chứng rõ ràng.

Chỉ đánh dấu Breaking Change khi có thay đổi không tương thích, ví dụ:

- Thay đổi Public API.
- Đổi method signature.
- Đổi response structure.
- Thay đổi schema không tương thích.
- Xóa backward compatibility.
- Thay đổi runtime behavior.

Không được suy diễn Breaking Change.

---

## Cấu trúc Commit

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

---

## Quy tắc Type

Luôn chọn type phù hợp nhất:

- feat
- fix
- refactor
- perf
- docs
- test
- build
- ci
- chore
- infra
- revert

Nếu không đủ thông tin thì sử dụng:

```text
chore
```

---

## Quy tắc Scope

**Scope là BẮT BUỘC.** Conventional Commits coi scope là tùy chọn, chuẩn này thì
không. Mọi commit phải có scope: `type(scope): mô tả`.

Thay đổi trải rộng cả repo thì vẫn chọn một scope rộng nhưng có thật (`repo`,
`setup`, `build`) — không bao giờ bỏ trống scope.

Nếu repository đã có convention thì phải tuân theo.

Nếu chưa có:

- Viết thường.
- Ngắn gọn.
- Phản ánh đúng domain.

Ví dụ:

- auth
- payment
- docker
- infra
- cron
- cache
- websocket
- security
- logging
- monitoring

Nếu không chắc chắn:

- Suy luận từ module hoặc thư mục chính.
- Ưu tiên lowercase-kebab-case.

---

## Quy tắc Short Description

Mô tả ngắn phải:

- Thì hiện tại.
- Bắt đầu bằng động từ kỹ thuật.
- **Viết thường hoàn toàn** — kể cả tên sản phẩm và từ viết tắt (`github cli`,
  `claude code`, `url`, `pr`). Không viết hoa chữ cái đầu.

Ví dụ:

- add
- update
- fix
- remove
- rename
- refactor
- improve
- optimize

Không được:

- Dùng ngôn ngữ cảm tính.
- Dùng ngôn ngữ marketing.
- Dùng văn phong AI.
- Giải thích dài dòng.
- Ghi đường dẫn file.
- Mô tả hiển nhiên.

Không sử dụng các từ:

- awesome
- amazing
- powerful
- smart
- magic
- clean
- simple

Độ dài tối đa:

- **72 ký tự** cho cả dòng tiêu đề (gồm type, scope, dấu `:`, khoảng trắng, mô tả).

---

## Quy tắc Body

Body là tùy chọn.

Nếu cần:

- Tối đa 3 dòng.
- Ngắn gọn.
- Chỉ mô tả:
  - Thay đổi gì.
  - Lý do thay đổi.
  - Ảnh hưởng tương thích nếu có.
  - Migration nếu có.

Không:

- Lặp lại tiêu đề.
- Viết như tài liệu.
- Thêm nội dung không cần thiết.

---

## Quy tắc Footer

Chỉ thêm khi thực sự cần. Viết đúng capitalization chuẩn của git trailer —
`Co-authored-by`, KHÔNG phải `Co-Authored-By`:

```text
Refs: #123
Reviewed-by: Name
Co-authored-by: Name <email>
```

Trailer nằm ở đoạn cuối, cách body một dòng trống.

---

## Phong cách

Commit phải:

- Trung lập.
- Kỹ thuật.
- Chuyên nghiệp.
- Dễ bảo trì.
- Phù hợp repository enterprise.
- Phù hợp các dự án Open Source trưởng thành.

Không sử dụng:

- Emoji.
- Văn phong hội thoại.
- Văn phong AI.
- Ngôn ngữ cường điệu.

---

## Đầu ra

Luôn trả về đúng **02 commit message**.

### Commit 1

- Tiếng Anh.
- **Đây là bản đi vào Git.** Mọi commit trong repo đều tiếng Anh — chuẩn là
  một ngôn ngữ duy nhất.

### Commit 2

- Tiếng Việt, dịch chính xác ý nghĩa kỹ thuật, không sai thuật ngữ.
- Chỉ để **tác giả tự kiểm bản tiếng Anh có đúng ý mình không**.
- Tuyệt đối không commit bản này, không nối vào commit 1, không để cả hai
  trong cùng một message.

---

## Định dạng đầu ra

- Mỗi commit nằm trong một code block riêng.
- Bên trong code block chỉ chứa commit message.
- Không có bất kỳ giải thích nào trong code block.

Bên ngoài code block:

- Có thể ghi tối đa một dòng mô tả ngắn bằng tiếng Việt về module bị ảnh hưởng nếu thực sự cần.

---

## Quy tắc cuối cùng

- Mọi giải thích ngoài code block phải bằng tiếng Việt.
- Không giải thích lý thuyết Conventional Commits.
- Không đưa ra bình luận kiểu AI.
- Không đưa ra khuyến nghị chủ quan.
- Luôn ưu tiên convention của repository hơn quy tắc chung.
- Khi không chắc chắn về `type` hoặc `scope`, hãy phân tích ngắn gọn bằng tiếng Việt trước khi sinh commit và chọn phương án có xác suất đúng cao nhất.
- Trước khi đưa ra kết quả cuối cùng, hãy tự kiểm tra lại commit message để đảm bảo:
  - Đúng chuẩn Conventional Commits.
  - Đúng ngữ pháp.
  - Đúng phạm vi thay đổi.
  - Không vượt quá giới hạn độ dài.
  - Phù hợp với convention hiện có của repository.
