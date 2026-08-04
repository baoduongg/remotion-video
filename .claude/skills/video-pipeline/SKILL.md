---
name: video-pipeline
description: "Đi từ ý tưởng thô đến video Remotion hoàn chỉnh, render xong, đã QC — điều phối toàn bộ chuỗi bước: kịch bản (fact-check), scaffold code, giọng đọc + SFX, vòng QA hình ảnh, render, QC, sửa theo feedback. Luôn dùng skill này khi user nói: 'làm video mới', 'bắt đầu video về chủ đề...', 'từ ý tưởng ra video', 'video-pipeline', hoặc gọi lệnh /video-pipeline — kể cả khi họ chỉ đưa 1 câu chủ đề chưa có kịch bản."
compatibility: "Cần: edge-tts (pip install edge-tts), ffmpeg/ffprobe, skill video-qc đã cài (/watch). Dùng chung với các skill: remotion-best-practices, remotion-create, remotion-markup, frontend-design, superpowers:brainstorming."
---

# Video Pipeline — ý tưởng đến video hoàn chỉnh

Điều phối skill, KHÔNG tự viết code/kịch bản thay cho các skill chuyên trách. Vai trò của skill này: đúng thứ tự, đúng bước, không bỏ sót, không nhảy cóc — chi tiết từng bước xem `WORKFLOW.md` ở root repo.

**Luật cứng: không nhảy sang bước sau khi bước trước có mục ❌ chưa xử lý.** Đặc biệt Bước 1 (fact-check) và Bước 5 (QA hình ảnh) — bỏ qua 2 bước này là nguyên nhân chính gây phải làm lại từ đầu ở dự án trước.

## Bước 0 — Xác định input

Hỏi (nếu chưa rõ): chủ đề/ý tưởng, định dạng đích (Horizontal 16:9 / Vertical 9:16 / cả hai), độ dài mong muốn, có phong cách tham chiếu cụ thể không (vd "kiểu OverSimplified").

## Bước 0.5 — Tạo project mới (video mới = folder mới, sibling của các video trước)

Thư mục cha (`remotion-video/`) đã có sẵn `WORKFLOW.md`, `scripts/generate-voiceover.py`, và 2 skill dùng chung `video-pipeline` + `qc-video` (trong `.claude/skills/` và `.agents/skills/`) — đó là bộ template để nhân bản, KHÔNG viết lại từ đầu mỗi video.

Từ thư mục cha:
```bash
npx create-video@latest --yes --blank <ten-video-moi>
cd <ten-video-moi>
npx skills add remotion-dev/skills -g -y   # cài remotion-best-practices, remotion-create, remotion-markup, v.v. dùng ở Bước 2

mkdir -p .claude/skills .agents/skills scripts
cp ../WORKFLOW.md .
cp ../scripts/generate-voiceover.py scripts/
cp -r ../.claude/skills/video-pipeline ../.claude/skills/qc-video .claude/skills/
cp -r ../.agents/skills/video-pipeline ../.agents/skills/qc-video .agents/skills/
```

`qc-video` cần thêm `/watch` (claude-video skill) cài toàn cục — one-time setup, không cần lặp lại mỗi project (xem `compatibility` trong `qc-video/SKILL.md`).

Xong bước này mới sang Bước 1, làm việc bên trong `<ten-video-moi>/`.

## Bước 1 — Kịch bản + fact-check (bắt buộc trước khi code)

1. Viết kịch bản ra `<ten-video>-script.md`: chia scene, có visual/audio/SFX/lời dẫn/hội thoại, đánh dấu rõ nếu có "twist" cần giữ nguyên khi refactor sau.
2. Nếu nội dung có claim kiểm chứng được (sự kiện, tên riêng, mốc thời gian, số liệu) → `web_search` đối chiếu NGAY, trước khi viết code. Không lùi việc này tới bước QC.
3. Chỉ qua Bước 2 khi kịch bản không còn claim sai đã biết.

## Bước 2 — Scaffold code

Gọi `remotion-best-practices` làm router (nó tự dẫn tới `remotion-create` + `remotion-markup` phù hợp dạng video). Nếu cần định hướng thẩm mỹ rõ (màu, layout, không muốn bị "AI-slop") → gọi thêm `frontend-design`.

- Cài package thiếu qua `npx remotion add <pkg>` trước khi dùng API của nó (transitions, google-fonts, sfx, media...).
- Theme dùng chung (màu/font) gom vào 1 file, tránh rải rác nhiều scene.

## Bước 3 — Giọng đọc (voice)

1. Gom toàn bộ lời thoại/lời dẫn thành 1 file JSON: `[{"id": "vo_01", "text": "...", "voice": "vi-VN-NamMinhNeural"}, ...]`.
2. Chạy: `python3 scripts/generate-voiceover.py <file>.json --fps 30`
   → sinh `public/audio/vo/<id>.mp3` + `public/audio/vo/manifest.json` chứa `durationSec`/`durationInFrames` đo thật bằng ffprobe.
3. Dùng số frame trong `manifest.json` để set `durationInFrames`/offset của từng `<Sequence>` — **không đoán chừng duration**.

Không dùng ElevenLabs/msedge-tts (npm) trừ khi user yêu cầu rõ — `edge-tts` CLI qua pip là đường ngắn nhất đã kiểm chứng.

## Bước 4 — SFX

1. Tra `remotion.dev/docs/sfx` nếu chưa quen API `@remotion/sfx`.
2. File free sfx đã có sẵn trong `public/audio/sfx/` (whoosh, skedaddle, triggered, record-scratch, wilhelm-scream, bruh) — ưu tiên tái dùng trước khi tải mới.
3. Trim/fade bằng `ffmpeg -af "afade=t=out:st=..:d=.."` nếu file dài hơn khoảnh khắc cần nhấn.
4. Đặt SFX vào đúng frame dựa theo `manifest.json` ở Bước 3, không áng chừng.

## Bước 5 — Vòng QA hình ảnh (lặp lại trong lúc code animation)

Vòng lặp chính, ưu tiên trước khi mở browser:
1. `npx remotion still <CompId> /tmp/check.png --frame=<n>` ở vài mốc (đầu/giữa/cuối scene, giữa 2 transition).
2. Đọc ảnh bằng Read tool, so với kỳ vọng.
3. Sau mỗi batch sửa: `npx tsc --noEmit && npx eslint src` trước khi still lại.

Chỉ mở Chrome DevTools MCP khi cần debug tương tác thật (click/hover/đo toạ độ) hoặc nghi cache stale (still không đổi dù đã sửa code — thử xoá `node_modules/.cache` trước khi nghi code sai).

## Bước 6 — Render

1. Check sync audio/SFX bằng đoạn ngắn trước: `npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`.
2. Render full: `npx remotion render <CompId> out/<Ten>.mp4` (cả bản Horizontal/Vertical nếu cần).
3. Dọn file `/tmp` tạm sau khi xong.

## Bước 7 — QC

Gọi skill `video-qc` (`/watch out/<file>.mp4`) — skill đó đã tự bao gồm fact-check lịch sử qua web search, không cần lặp lại thủ công.

## Bước 8 — Áp dụng feedback (nếu QC ra ⚠️/❌)

1. Feedback nhiều mảng (animation + layout + âm thanh + style cùng lúc) → gọi `superpowers:brainstorming` trước khi sửa hàng loạt, chốt hướng thay vì vá lan man.
2. Feedback mơ hồ / nhiều hướng xử lý → hỏi lại user bằng AskUserQuestion thay vì tự đoán.
3. Sửa xong → quay lại Bước 5 (QA hình ảnh) rồi Bước 6–7, lặp tới khi QC pass.

## Quick reference

| Việc | Lệnh |
|---|---|
| Sinh voice + duration thật | `python3 scripts/generate-voiceover.py <script>.json --fps 30` |
| Check 1 frame | `npx remotion still <CompId> out.png --frame=<n>` |
| Check type/lint | `npx tsc --noEmit && npx eslint src` |
| Render đoạn ngắn (check sync) | `npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>` |
| Render full | `npx remotion render <CompId> out/<Ten>.mp4` |
| QC | gọi skill `video-qc` / `/watch out/<Ten>.mp4` |

## Common mistakes (đã xảy ra ở dự án trước, đừng lặp lại)

- Code xong animation rồi mới fact-check kịch bản → phải sửa lại nội dung + animation đã dựng. Fact-check phải ở Bước 1.
- Đoán duration audio thay vì đo bằng ffprobe → lệch timing Sequence, phải dò lại bằng render nhiều đoạn.
- Thử ElevenLabs/msedge-tts (npm) trước khi thử edge-tts CLI → tốn thời gian debug package không cần thiết.
- Mở Chrome DevTools MCP ngay từ đầu để debug layout → chậm hơn nhiều so với `remotion still` + đọc ảnh.
