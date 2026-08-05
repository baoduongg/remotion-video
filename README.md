# remotion-video

Repo cha chứa nhiều project video [Remotion](https://remotion.dev) độc lập. Mỗi thư mục con là 1 project riêng (own `package.json`, `src/`, `out/`) — không phải submodule, chỉ là thư mục thường trong cùng repo git.

## Projects

| Thư mục | Nội dung | Output |
|---|---|---|
| `tran-midway/` | Video documentary "Tran Midway" | `out/Tran-Midway.mp4` |
| `tsmc-monopoly/` | Video giải thích thế độc quyền TSMC | `out/TSMCVideo.mp4` |
| `why-greenwich-meridian/` | Video giải thích kinh tuyến gốc Greenwich (VN + EN) | `out/why-greenwich-meridian*.mp4` |
| `test-remotion/` | Video essay thử nghiệm | `out/essay-video.mp4` |
| `test-remotion-2/` | "War of the Bucket" (bản ngang + dọc) | `out/WarOfTheBucket*.mp4` |

## Cách làm 1 video mới

Xem [WORKFLOW.md](./WORKFLOW.md) — quy trình đầy đủ đúc kết từ các project trên: ý tưởng & kịch bản (fact-check trước khi dựng) → scaffold code → giọng đọc/SFX → vòng QA hình ảnh (`remotion still`) → render → QC (`/watch`) → áp dụng feedback.

Hoặc gọi thẳng skill `video-pipeline` / `vox-video-engine` (xem `.agents/skills/`) — skill tự tạo project mới trong 1 thư mục con và chạy toàn bộ chuỗi bước trên.

## `scripts/`

Script Python dùng chung giữa các project (không phụ thuộc project cụ thể nào):

- `generate-voiceover.py` — sinh giọng đọc hàng loạt qua `edge-tts`, đo duration thật bằng `ffprobe`, xuất `manifest.json` cho timing Sequence.
- `write-animation-spec.py`, `write-prompts.py` — hỗ trợ soạn spec animation / prompt ảnh.
